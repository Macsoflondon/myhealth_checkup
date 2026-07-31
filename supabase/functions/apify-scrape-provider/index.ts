/**
 * apify-scrape-provider — dispatch a provider catalogue crawl to Apify.
 *
 * Large catalogues (Medichecks, Medical Diagnosis, Clinilabs) cannot be
 * scraped inside a 150 s edge function. This function loads the provider's
 * crawl config, starts an `apify/cheerio-scraper` run, registers webhooks
 * pointing at `apify-ingest`, and returns immediately with the run id.
 * It deliberately does NOT poll — waiting would reintroduce the timeout.
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";
import { getErrorMessage } from "../_shared/errors.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ACTOR_ID = "apify~cheerio-scraper";
const PROVIDER_ID_RE = /^[a-z0-9][a-z0-9-]{1,63}$/;
const DEFAULT_MAX_PAGES = 300;
const DEFAULT_MAX_CONCURRENCY = 4;

interface ApifyProviderConfig {
  provider_id: string;
  start_urls: { url: string }[];
  page_function: string;
  link_selector: string | null;
  globs: string[];
  max_pages_per_crawl: number | null;
  max_concurrency: number | null;
  enabled: boolean;
}

function isAuthorised(req: Request): boolean {
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const cronSecret = Deno.env.get("SCRAPER_CRON_SECRET") ?? "";
  const auth = req.headers.get("authorization") ?? "";
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  if (serviceKey && bearer === serviceKey) return true;
  const cronHeader = req.headers.get("x-cron-secret") ?? "";
  return Boolean(cronSecret) && cronHeader === cronSecret;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (!isAuthorised(req)) return json({ error: "Unauthorized" }, 401);

  const apifyToken = Deno.env.get("APIFY_API_TOKEN");
  if (!apifyToken) {
    // Fail loudly — a silent no-op would look like a healthy scrape.
    return json({ error: "APIFY_API_TOKEN is not configured" }, 500);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    const body = await req.json().catch(() => ({}));
    const providerId: string = String(body.provider_id ?? body.providerId ?? "");
    if (!PROVIDER_ID_RE.test(providerId)) return json({ error: "Invalid or missing provider_id" }, 400);

    const { data: config, error: configError } = await supabase
      .from("apify_provider_configs")
      .select("*")
      .eq("provider_id", providerId)
      .maybeSingle<ApifyProviderConfig>();

    if (configError) return json({ error: `Config lookup failed: ${configError.message}` }, 500);
    if (!config) return json({ error: `No Apify config for provider ${providerId}` }, 404);
    if (!config.enabled) return json({ error: `Apify config for ${providerId} is disabled` }, 409);

    const startUrls = Array.isArray(config.start_urls) ? config.start_urls : [];
    if (startUrls.length === 0) return json({ error: `No start_urls configured for ${providerId}` }, 400);

    // Record the run up-front so an abandoned crawl is visible, not invisible.
    const { data: runRow, error: runError } = await supabase
      .from("scrape_runs")
      .insert({
        provider_id: providerId,
        scraper_function: "apify-scrape-provider",
        status: "running",
        metadata: { actor: ACTOR_ID, dispatched_at: new Date().toISOString() },
      })
      .select("id")
      .single();
    if (runError) return json({ error: `Could not open scrape run: ${runError.message}` }, 500);
    const scrapeRunId: string = runRow.id;

    const ingestSecret = Deno.env.get("SCRAPER_CRON_SECRET") ?? serviceKey;
    const webhookUrl =
      `${supabaseUrl}/functions/v1/apify-ingest?secret=${encodeURIComponent(ingestSecret)}`;

    const payloadTemplate = JSON.stringify({
      eventType: "{{eventType}}",
      runId: "{{resource.id}}",
      datasetId: "{{resource.defaultDatasetId}}",
      status: "{{resource.status}}",
      providerId,
      scrapeRunId,
    });

    const input = {
      startUrls,
      globs: (Array.isArray(config.globs) ? config.globs : []).map((glob: string) => ({ glob })),
      linkSelector: config.link_selector ?? "a[href]",
      pageFunction: config.page_function,
      // Cost control: never unlimited, modest concurrency, Apify proxy, robots respected.
      maxPagesPerCrawl: config.max_pages_per_crawl && config.max_pages_per_crawl > 0
        ? config.max_pages_per_crawl
        : DEFAULT_MAX_PAGES,
      maxConcurrency: config.max_concurrency && config.max_concurrency > 0
        ? config.max_concurrency
        : DEFAULT_MAX_CONCURRENCY,
      respectRobotsTxtFile: true,
      proxyConfiguration: { useApifyProxy: true },
      maxRequestRetries: 2,
      ignoreSslErrors: false,
    };

    const webhooks = [
      {
        eventTypes: ["ACTOR.RUN.SUCCEEDED", "ACTOR.RUN.FAILED", "ACTOR.RUN.TIMED_OUT", "ACTOR.RUN.ABORTED"],
        requestUrl: webhookUrl,
        payloadTemplate,
      },
    ];
    const webhooksParam = btoa(JSON.stringify(webhooks));

    const startRes = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?webhooks=${encodeURIComponent(webhooksParam)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apifyToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      },
    );

    if (!startRes.ok) {
      const errorBody = await startRes.text();
      const message = `Apify run start failed [${startRes.status}]: ${errorBody.slice(0, 500)}`;
      console.error(`[apify-scrape-provider] ${message}`);
      await supabase.from("scrape_runs").update({
        status: "error",
        finished_at: new Date().toISOString(),
        errors: [{ message }],
      }).eq("id", scrapeRunId);
      await supabase.from("scraper_alerts").insert({
        provider_id: providerId,
        alert_type: "scrape_failed",
        severity: "critical",
        message: message.slice(0, 1000),
      });
      return json({ success: false, error: message }, 502);
    }

    const started = await startRes.json();
    const apifyRunId: string = started?.data?.id ?? "";
    const datasetId: string = started?.data?.defaultDatasetId ?? "";

    await supabase.from("scrape_runs").update({
      metadata: {
        actor: ACTOR_ID,
        apify_run_id: apifyRunId,
        apify_dataset_id: datasetId,
        dispatched_at: new Date().toISOString(),
      },
    }).eq("id", scrapeRunId);

    console.log(`[apify-scrape-provider] ${providerId} dispatched run ${apifyRunId}`);

    return json({
      success: true,
      dispatched: true,
      provider_id: providerId,
      run_id: apifyRunId,
      dataset_id: datasetId,
      scrape_run_id: scrapeRunId,
    });
  } catch (err) {
    const message = getErrorMessage(err);
    console.error("[apify-scrape-provider] fatal:", message);
    return json({ success: false, error: message }, 500);
  }
});
