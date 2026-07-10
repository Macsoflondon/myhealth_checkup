// scrape-and-verify
// Invoked twice daily by pg_cron. Runs all scrapers, then promotes scraped rows
// into tests_master + mapping, then samples URLs for verification.
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Auth: cron-only. Require the service-role bearer.
  const authHeader = req.headers.get("Authorization") ?? "";
  if (authHeader !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const started = new Date().toISOString();
  const { data: runRow } = await supabase
    .from("scrape_run_log")
    .insert({ status: "running", trigger_source: "cron", started_at: started })
    .select("id")
    .single();
  const runId = runRow?.id as string | undefined;

  const callEdge = async (name: string, body: unknown = {}) => {
    const res = await fetch(`${url}/functions/v1/${name}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return { status: res.status, body: await res.text() };
  };

  const scrapers = await callEdge("run-all-scrapers");
  const promote = await callEdge("promote-provider-tests", {});

  // URL verification: sample 5 random scraped rows per provider
  const { data: providers } = await supabase
    .from("provider_tests")
    .select("provider_id")
    .eq("is_active", true);
  const uniqueProviders = [...new Set((providers || []).map((p) => p.provider_id))];

  let verifyFailures = 0;
  for (const pid of uniqueProviders) {
    const { data: samples } = await supabase
      .from("provider_tests")
      .select("id,url,test_name")
      .eq("provider_id", pid)
      .eq("is_active", true)
      .not("url", "is", null)
      .limit(5);
    for (const s of samples || []) {
      try {
        const r = await fetch(s.url as string, { method: "HEAD", redirect: "follow" });
        if (!r.ok && r.status !== 405) {
          verifyFailures++;
          await supabase.from("scraper_alerts").insert({
            provider_id: pid,
            alert_type: "broken_url",
            severity: "warning",
            message: `URL HEAD ${r.status} for ${s.test_name}`,
          });
        }
      } catch {
        verifyFailures++;
      }
    }
  }

  const promoteJson = (() => {
    try { return JSON.parse(promote.body); } catch { return {}; }
  })();

  if (runId) {
    await supabase
      .from("scrape_run_log")
      .update({
        completed_at: new Date().toISOString(),
        status: scrapers.status < 300 ? "completed" : "failed",
        providers_run: uniqueProviders.length,
        tests_promoted: promoteJson.master_created ?? 0,
        mappings_upserted: promoteJson.mappings_upserted ?? 0,
        verification_failures: verifyFailures,
        details: { scrapers: { status: scrapers.status }, promote: promoteJson },
      })
      .eq("id", runId);
  }

  return new Response(
    JSON.stringify({ success: true, run_id: runId, verify_failures: verifyFailures, promote: promoteJson }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
