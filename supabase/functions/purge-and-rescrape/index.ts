// Admin one-off: purge all rows in `provider_tests` for a given provider, then
// re-trigger that provider's scraper so the improved parser repopulates
// categories/biomarkers from scratch. Use when in-place normalisation isn't
// enough (e.g. provider source has been restructured).

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getErrorMessage } from "../_shared/errors.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCRAPER_MAP: Record<string, string> = {
  "medichecks": "medichecks-firecrawl",
  "goodbody-clinic": "goodbody-scraper",
  "randox": "randox-scraper",
  "lola-health": "lola-health-scraper",
  "thriva": "thriva-scraper",
  "london-medical-laboratory": "scrape-london-lab",
  "medical-diagnosis": "medical-diagnosis-scraper",
  "clinilabs": "clinilabs-scraper",
  "london-health-company": "london-health-scraper",
};

interface Body {
  providerId?: string;
  confirm?: boolean;
}

declare const EdgeRuntime: { waitUntil: (p: Promise<unknown>) => void } | undefined;
const waitUntil = (p: Promise<unknown>): void => {
  try {
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime?.waitUntil) {
      EdgeRuntime.waitUntil(p);
      return;
    }
  } catch { /* noop */ }
  p.catch((err) => console.error("[purge-and-rescrape] bg error:", getErrorMessage(err)));
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const authHeader = req.headers.get("Authorization") ?? "";

  // Auth: service role or admin JWT
  const isServiceRole = serviceKey && authHeader === `Bearer ${serviceKey}`;
  if (!isServiceRole) {
    if (!authHeader || !supabaseUrl || !anonKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await userClient.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  const body: Body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  if (!body.providerId || !SCRAPER_MAP[body.providerId]) {
    return new Response(JSON.stringify({ error: "Invalid or missing providerId" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!body.confirm) {
    return new Response(JSON.stringify({ error: "Missing confirm=true" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const providerId = body.providerId;
  const scraperFn = SCRAPER_MAP[providerId];
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // 1. Count before purge for visibility
    const { count: before } = await supabase
      .from("provider_tests")
      .select("*", { count: "exact", head: true })
      .eq("provider_id", providerId);

    // 2. Hard delete all provider_tests for this provider
    const { error: delErr } = await supabase
      .from("provider_tests")
      .delete()
      .eq("provider_id", providerId);
    if (delErr) throw delErr;

    console.log(`[purge-and-rescrape] purged ${before ?? 0} rows for ${providerId}`);

    // 3. Reset scraping_jobs row so dashboard reflects fresh state
    await supabase.from("scraping_jobs").upsert({
      provider_id: providerId,
      status: "running",
      last_scraped: new Date().toISOString(),
      error_message: null,
    }, { onConflict: "provider_id" });

    // 4. Fire-and-forget the scraper with service-role auth
    waitUntil((async () => {
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/${scraperFn}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({ replace: true }),
        });
        const text = await res.text();
        console.log(`[purge-and-rescrape] ${providerId} scraper -> ${res.status}: ${text.slice(0, 500)}`);
        if (!res.ok) {
          await supabase.from("scraping_jobs").upsert({
            provider_id: providerId,
            status: "failed",
            error_message: `Re-scrape after purge failed: HTTP ${res.status}`,
          }, { onConflict: "provider_id" });
        }
      } catch (err) {
        console.error(`[purge-and-rescrape] ${providerId} scraper crashed:`, getErrorMessage(err));
        await supabase.from("scraping_jobs").upsert({
          provider_id: providerId,
          status: "failed",
          error_message: `Re-scrape after purge crashed: ${getErrorMessage(err)}`.slice(0, 1000),
        }, { onConflict: "provider_id" });
      }
    })());

    return new Response(
      JSON.stringify({
        success: true,
        providerId,
        purgedRows: before ?? 0,
        scraperDispatched: scraperFn,
        message: `Purged ${before ?? 0} rows for ${providerId}. Re-scrape running in background.`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 202 },
    );
  } catch (err) {
    console.error("[purge-and-rescrape] error:", getErrorMessage(err));
    return new Response(
      JSON.stringify({ error: getErrorMessage(err) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
