/**
 * apify-ingest — Apify webhook receiver.
 *
 * On ACTOR.RUN.SUCCEEDED it reads the run's dataset and applies the rows to
 * `provider_tests` using the provider-scoped, exact-match writer shared with
 * `sync-apify-data`. Ambiguous or unmatched rows are never written.
 * On failure it records a `scraper_alerts` row.
 *
 * Called by Apify, so it is not JWT-protected: authorisation is a shared
 * secret supplied on the webhook URL.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";
import { getErrorMessage } from "../_shared/errors.ts";
import { applyProviderRows, type ProviderDatasetRow } from "../_shared/scrape/applyProviderRows.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PROVIDER_ID_RE = /^[a-z0-9][a-z0-9-]{1,63}$/;
const APIFY_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const expectedSecret = Deno.env.get("SCRAPER_CRON_SECRET") || serviceKey;
  const presented = new URL(req.url).searchParams.get("secret")
    ?? req.headers.get("x-cron-secret")
    ?? "";
  if (!expectedSecret || !timingSafeEqual(presented, expectedSecret)) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);

  try {
    const body = await req.json().catch(() => ({}));
    const eventType: string = String(body.eventType ?? "");
    const providerId: string = String(body.providerId ?? "");
    const datasetId: string = String(body.datasetId ?? "");
    const scrapeRunId: string | null = body.scrapeRunId ? String(body.scrapeRunId) : null;
    const apifyRunId: string = String(body.runId ?? "");

    if (!PROVIDER_ID_RE.test(providerId)) return json({ error: "Invalid providerId" }, 400);

    if (eventType !== "ACTOR.RUN.SUCCEEDED") {
      const message = `Apify run ${apifyRunId || "unknown"} ended with ${eventType || "an unknown event"}`;
      console.error(`[apify-ingest] ${message}`);
      await supabase.from("scraper_alerts").insert({
        provider_id: providerId,
        alert_type: "scrape_failed",
        severity: "critical",
        message: message.slice(0, 1000),
      });
      if (scrapeRunId) {
        await supabase.from("scrape_runs").update({
          status: "error",
          finished_at: new Date().toISOString(),
          errors: [{ message }],
        }).eq("id", scrapeRunId);
      }
      return json({ success: false, handled: true, event: eventType });
    }

    if (!APIFY_ID_RE.test(datasetId)) return json({ error: "Invalid datasetId" }, 400);

    const apifyToken = Deno.env.get("APIFY_API_TOKEN");
    if (!apifyToken) return json({ error: "APIFY_API_TOKEN is not configured" }, 500);

    const res = await fetch(
      `https://api.apify.com/v2/datasets/${encodeURIComponent(datasetId)}/items?clean=true&format=json`,
      { headers: { Authorization: `Bearer ${apifyToken}` } },
    );
    if (!res.ok) {
      const errorBody = await res.text();
      const message = `Apify dataset read failed [${res.status}]: ${errorBody.slice(0, 400)}`;
      console.error(`[apify-ingest] ${message}`);
      await supabase.from("scraper_alerts").insert({
        provider_id: providerId,
        alert_type: "scrape_failed",
        severity: "critical",
        message: message.slice(0, 1000),
      });
      if (scrapeRunId) {
        await supabase.from("scrape_runs").update({
          status: "error",
          finished_at: new Date().toISOString(),
          errors: [{ message }],
        }).eq("id", scrapeRunId);
      }
      return json({ success: false, error: message }, 502);
    }

    const items = (await res.json()) as ProviderDatasetRow[];
    if (!Array.isArray(items)) return json({ error: "Dataset did not return an array" }, 502);

    const result = await applyProviderRows(supabase, providerId, items);

    console.log(
      `[apify-ingest] ${providerId}: ${items.length} items, ${result.updated} updated, ` +
        `${result.skipped_ambiguous} ambiguous, ${result.skipped_unmatched} unmatched`,
    );

    if (scrapeRunId) {
      await supabase.from("scrape_runs").update({
        status: result.errors.length > 0 ? "partial" : "success",
        finished_at: new Date().toISOString(),
        tests_seen: items.length,
        tests_updated: result.updated,
        errors: result.errors.slice(0, 20),
        metadata: {
          actor: "apify~cheerio-scraper",
          apify_run_id: apifyRunId,
          apify_dataset_id: datasetId,
          matched: result.matched,
          skipped_ambiguous: result.skipped_ambiguous,
          skipped_unmatched: result.skipped_unmatched,
        },
      }).eq("id", scrapeRunId);
    }

    await supabase.from("scraping_jobs").upsert({
      provider_id: providerId,
      status: "completed",
      error_message: null,
      last_scraped: new Date().toISOString(),
      last_test_count: result.updated,
    }, { onConflict: "provider_id" });

    return json({
      success: true,
      provider_id: providerId,
      items: items.length,
      matched: result.matched,
      updated: result.updated,
      skipped_ambiguous: result.skipped_ambiguous,
      skipped_unmatched: result.skipped_unmatched,
      unmatched: result.unmatched.slice(0, 50),
    });
  } catch (err) {
    const message = getErrorMessage(err);
    console.error("[apify-ingest] fatal:", message);
    return json({ success: false, error: message }, 500);
  }
});
