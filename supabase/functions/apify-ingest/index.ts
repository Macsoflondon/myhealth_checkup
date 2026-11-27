/**
 * apify-ingest — Apify webhook receiver.
 *
 * On ACTOR.RUN.SUCCEEDED it reads the run's dataset and applies the rows to
 * `provider_tests` using the provider-scoped, exact-match writer shared with
 * `sync-apify-data`. Ambiguous or unmatched rows are never written.
 * On failure it records a `scraper_alerts` row.
 *
 * Called by Apify, so it is not JWT-protected: authorisation is a shared
 * secret in the x-apify-ingest-secret header only, compared in constant time
 * against Vault through public.apify_ingest_secret() (503 when Vault has no
 * value, 401 on a mismatch). Since 27/11/2026 there is no ?secret=, no
 * x-cron-secret and no SCRAPER_CRON_SECRET or service-role-key fallback.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";
import { internalErrorResponse } from "../_shared/errors.ts";
import { checkApifyIngestSecret } from "../_shared/apify-ingest-secret.ts";
import {
  applyProviderRows,
  type ProviderDatasetRow,
} from "../_shared/scrape/applyProviderRows.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PROVIDER_ID_RE = /^[a-z0-9][a-z0-9-]{1,63}$/;
const APIFY_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

if (import.meta.main)
  serve(async (req) => {
    if (req.method === "OPTIONS")
      return new Response(null, { headers: corsHeaders });

    const json = (body: unknown, status = 200) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);

    const auth = await checkApifyIngestSecret(req, supabase);
    if (!auth.ok) {
      if (auth.status === 503)
        console.error(
          "[apify-ingest] apify_ingest_secret is empty or unreadable",
        );
      return json(
        { error: auth.status === 503 ? "Not configured" : "Unauthorized" },
        auth.status,
      );
    }

    try {
      const body = await req.json().catch(() => ({}));
      const eventType: string = String(body.eventType ?? "");
      const providerId: string = String(body.providerId ?? "");
      const datasetId: string = String(body.datasetId ?? "");
      const scrapeRunId: string | null = body.scrapeRunId
        ? String(body.scrapeRunId)
        : null;
      const apifyRunId: string = String(body.runId ?? "");

      if (!PROVIDER_ID_RE.test(providerId))
        return json({ error: "Invalid providerId" }, 400);

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
          await supabase
            .from("scrape_runs")
            .update({
              status: "error",
              finished_at: new Date().toISOString(),
              errors: [{ message }],
            })
            .eq("id", scrapeRunId);
        }
        return json({ success: false, handled: true, event: eventType });
      }

      if (!APIFY_ID_RE.test(datasetId))
        return json({ error: "Invalid datasetId" }, 400);

      const apifyToken = Deno.env.get("APIFY_API_TOKEN");
      if (!apifyToken)
        return json({ error: "APIFY_API_TOKEN is not configured" }, 500);

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
          await supabase
            .from("scrape_runs")
            .update({
              status: "error",
              finished_at: new Date().toISOString(),
              errors: [{ message }],
            })
            .eq("id", scrapeRunId);
        }
        return json({ success: false, error: message }, 502);
      }

      const items = (await res.json()) as ProviderDatasetRow[];
      if (!Array.isArray(items))
        return json({ error: "Dataset did not return an array" }, 502);

      const result = await applyProviderRows(supabase, providerId, items);

      console.log(
        `[apify-ingest] ${providerId}: ${items.length} items, ${result.updated} updated, ` +
          `${result.skipped_ambiguous} ambiguous, ${result.skipped_unmatched} unmatched`,
      );

      if (scrapeRunId) {
        await supabase
          .from("scrape_runs")
          .update({
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
          })
          .eq("id", scrapeRunId);
      }

      await supabase.from("scraping_jobs").upsert(
        {
          provider_id: providerId,
          status: "completed",
          error_message: null,
          last_scraped: new Date().toISOString(),
          last_test_count: result.updated,
        },
        { onConflict: "provider_id" },
      );

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
      return internalErrorResponse("apify-ingest", err, corsHeaders, {
        body: { success: false },
      });
    }
  });
