// ============= Full file contents =============

// scrape-and-verify
// URL verification only. Performs a live HTTP check of every active
// provider_tests.url and persists the outcome to url_verified /
// url_verified_at, raising a `broken_url` scraper alert on failure.
//
// It does NOT trigger scrapers or promotion — run-all-scrapers and
// promote-provider-tests are scheduled separately every 6 hours.
//
// Concurrency is per-provider (per hostname in practice): each provider's
// rows run through their own small worker pool, so a single provider's
// domain never receives more than PROVIDER_CONCURRENCY simultaneous
// requests, and request starts within a pool are staggered to stay under
// provider rate limits. On HTTP 429 a row is retried once after the
// Retry-After delay (capped) before being marked broken.
//
// Invocation: manual / ad-hoc POST with the service-role bearer.
// Optional `?provider=<provider_id>` scopes the run to one provider.
// No pg_cron schedule currently calls this function.
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TIMEOUT_MS = 8000;
const PROVIDER_CONCURRENCY = 3;
const STAGGER_START_MS = 150;
const STAGGER_MAX_MS = 4000;
const RETRY_AFTER_CAP_MS = 5000;
const RATE_LIMIT_FALLBACK_WAIT_MS = 2000;

interface TestRow {
  id: string;
  provider_id: string;
  test_name: string | null;
  url: string | null;
}

interface CheckResult {
  ok: boolean;
  httpStatus?: number;
  issue?: string;
  /** True if this request saw a 429 (even if the single retry recovered). */
  hit429?: boolean;
}

// Providers (medichecks, clinilabs) reject bare/Deno requests as bot traffic.
// Reuse the same UA the provider scrapers already send.
const REQUEST_HEADERS: Record<string, string> = {
  "User-Agent": "myhealthcheckup-comparison-bot/1.0 (+https://myhealthcheckup.co.uk)",
  Accept: "text/html,*/*",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function retryAfterMs(headers: Headers): number {
  const raw = headers.get("Retry-After");
  if (!raw) return RATE_LIMIT_FALLBACK_WAIT_MS;
  const seconds = Number(raw);
  if (!Number.isFinite(seconds) || seconds < 0) return RATE_LIMIT_FALLBACK_WAIT_MS;
  return Math.min(seconds * 1000, RETRY_AFTER_CAP_MS);
}

async function checkUrl(url: string): Promise<CheckResult> {
  try {
    let res = await fetch(url, {
      method: "HEAD",
      headers: REQUEST_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // Many hosts reject or mishandle HEAD behind bot filtering — retry with a
    // ranged GET on any non-2xx except genuine 404/410, which are real signal.
    if (!res.ok && res.status !== 404 && res.status !== 410) {
      res = await fetch(url, {
        method: "GET",
        headers: { ...REQUEST_HEADERS, Range: "bytes=0-0" },
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    }
    // Provider rate limiting: retry exactly once after the Retry-After delay.
    if (res.status === 429) {
      const waitMs = retryAfterMs(res.headers);
      await sleep(waitMs);
      res = await fetch(url, {
        method: "GET",
        headers: { ...REQUEST_HEADERS, Range: "bytes=0-0" },
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    }
    if (!res.ok) return { ok: false, httpStatus: res.status, issue: `HTTP ${res.status}` };
    return { ok: true, httpStatus: res.status };
  } catch (e) {
    return { ok: false, issue: (e as Error).message };
  }
}


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Auth: service-role bearer only.
  const authHeader = req.headers.get("Authorization") ?? "";
  if (authHeader !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const reqUrl = new URL(req.url);
  const providerFilter = reqUrl.searchParams.get("provider");

  const started = new Date().toISOString();
  const { data: runRow } = await supabase
    .from("scrape_run_log")
    .insert({ status: "running", trigger_source: "url-verification", started_at: started })
    .select("id")
    .single();
  const runId = runRow?.id as string | undefined;

  // Page through every active row with a URL.
  const rows: TestRow[] = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    let q = supabase
      .from("provider_tests")
      .select("id, provider_id, test_name, url")
      .eq("is_active", true)
      .not("url", "is", null)
      .order("id", { ascending: true })
      .range(from, from + pageSize - 1);
    if (providerFilter) q = q.eq("provider_id", providerFilter);

    const { data, error } = await q;
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    rows.push(...((data ?? []) as TestRow[]));
    if (!data || data.length < pageSize) break;
  }

  const summary: Record<string, { total: number; ok: number; broken: number }> = {};
  const verifiedAt = new Date().toISOString();

  async function processRow(row: TestRow): Promise<boolean> {
    const result = await checkUrl(row.url as string);

    summary[row.provider_id] ??= { total: 0, ok: 0, broken: 0 };
    summary[row.provider_id].total++;

    let ok: boolean;
    if (result.ok) {
      ok = true;
      summary[row.provider_id].ok++;
    } else {
      ok = false;
      summary[row.provider_id].broken++;
      await supabase.from("scraper_alerts").insert({
        provider_id: row.provider_id,
        alert_type: "broken_url",
        severity: "warning",
        message: `URL check failed (${result.issue ?? "unknown error"}) for ${row.test_name ?? row.id}`,
      });
    }

    await supabase
      .from("provider_tests")
      .update({ url_verified: result.ok, url_verified_at: verifiedAt })
      .eq("id", row.id);
    return ok;
  }

  // Group rows by provider, then run each provider's rows through its own
  // worker pool. Providers run in parallel with each other, but a single
  // provider's domain never sees more than PROVIDER_CONCURRENCY requests at
  // once, with a short stagger between request starts within the pool.
  const byProvider = new Map<string, TestRow[]>();
  for (const row of rows) {
    const group = byProvider.get(row.provider_id);
    if (group) group.push(row);
    else byProvider.set(row.provider_id, [row]);
  }

  let okCount = 0;
  let brokenCount = 0;

  async function runProviderPool(providerRows: TestRow[]) {
    let cursor = 0;
    let lastStart = 0;
    async function worker() {
      while (cursor < providerRows.length) {
        const row = providerRows[cursor++];
        // Stagger successive request starts within this provider's pool.
        const wait = STAGGER_MS - (Date.now() - lastStart);
        if (wait > 0) await sleep(wait);
        lastStart = Date.now();
        if (await processRow(row)) okCount++;
        else brokenCount++;
      }
    }
    await Promise.all(Array.from({ length: PROVIDER_CONCURRENCY }, worker));
  }

  await Promise.all(Array.from(byProvider.values(), runProviderPool));

  if (runId) {
    await supabase
      .from("scrape_run_log")
      .update({
        completed_at: new Date().toISOString(),
        status: "completed",
        providers_run: Object.keys(summary).length,
        verification_failures: brokenCount,
        details: { checked: rows.length, ok: okCount, broken: brokenCount, summary },
      })
      .eq("id", runId);
  }

  return new Response(
    JSON.stringify({ run_id: runId, checked: rows.length, ok: okCount, broken: brokenCount, summary }, null, 2),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
