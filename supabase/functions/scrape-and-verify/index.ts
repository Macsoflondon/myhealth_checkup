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
// Retry-After delay (capped); a repeated 429 stays inconclusive.
//
// Invocation: manual / ad-hoc POST with the service-role bearer.
// Optional `?provider=<provider_id>` scopes the run to one provider.
// pg_cron url-verification-daily calls this function at 05:15 UTC daily.
import {
  createClient,
  type SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { productRedirectIssue } from "../_shared/scrape/product-url.ts";
import {
  shopifyStore,
  readShopifyCatalogue,
  catalogueOutcome,
  type ShopifyCatalogue,
} from "./shopify-catalogue.ts";
import { getErrorMessage, internalErrorResponse } from "../_shared/errors.ts";
import {
  CHECK_START_BUDGET_MS,
  oldestFirst,
  finalRunDetails,
  runBudgetedPool,
} from "./run-budget.ts";

declare const EdgeRuntime: { waitUntil: (task: Promise<unknown>) => void };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TIMEOUT_MS = 8000;
const PROVIDER_CONCURRENCY = 3;
const STAGGER_START_MS = 150;
const STAGGER_MAX_MS = 4000;
const RETRY_AFTER_CAP_MS = 5000;
const RATE_LIMIT_FALLBACK_WAIT_MS = 2000;

interface ProviderPoolConfig {
  concurrency?: number;
  /** Initial stagger between request starts for this provider (ms). */
  staggerStartMs?: number;
}

// Per-provider pool tuning. Most providers use the defaults, but some
// hosts are stricter (e.g. lola-health needs single concurrency and a
// slower initial stagger to avoid tripping the limit reactively).
const PROVIDER_CONFIG: Record<string, ProviderPoolConfig> = {
  "lola-health": { concurrency: 1, staggerStartMs: 1500 },
};

interface TestRow {
  id: string;
  provider_id: string;
  test_name: string | null;
  url: string | null;
  url_verified_at: string | null;
}

interface CheckResult {
  ok: boolean;
  httpStatus?: number;
  issue?: string;
  /** True if this request saw a 429 (even if the single retry recovered). */
  hit429?: boolean;
  /** True if the provider was still rate limiting after the 429 retry —
   *  the URL state is unknown, NOT broken. */
  rateLimited?: boolean;
  inconclusive?: boolean;
}

// Providers (medichecks, clinilabs) reject bare/Deno requests as bot traffic.
// Reuse the same UA the provider scrapers already send.
const REQUEST_HEADERS: Record<string, string> = {
  "User-Agent":
    "myhealthcheckup-comparison-bot/1.0 (+https://myhealthcheckup.co.uk)",
  Accept: "text/html,*/*",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function retryAfterMs(headers: Headers): number {
  const raw = headers.get("Retry-After");
  if (!raw) return RATE_LIMIT_FALLBACK_WAIT_MS;
  const seconds = Number(raw);
  if (!Number.isFinite(seconds) || seconds < 0)
    return RATE_LIMIT_FALLBACK_WAIT_MS;
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
    let hit429 = false;
    if (res.status === 429) {
      hit429 = true;
      const waitMs = retryAfterMs(res.headers);
      await sleep(waitMs);
      res = await fetch(url, {
        method: "GET",
        headers: { ...REQUEST_HEADERS, Range: "bytes=0-0" },
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    }
    if (res.status === 429) {
      // Still rate limited after the retry: the URL state is unknown, not
      // broken. Flag it so callers skip alerts and leave url_verified as-is.
      return {
        ok: false,
        httpStatus: 429,
        issue: "HTTP 429",
        hit429,
        rateLimited: true,
      };
    }
    if (!res.ok)
      return {
        ok: false,
        httpStatus: res.status,
        issue: `HTTP ${res.status}`,
        hit429,
      };
    const redirectIssue = productRedirectIssue(url, res.url);
    if (redirectIssue)
      return {
        ok: false,
        httpStatus: res.status,
        issue: redirectIssue,
        hit429,
      };
    return { ok: true, httpStatus: res.status, hit429 };
  } catch (e) {
    return { ok: false, issue: getErrorMessage(e) };
  }
}

async function fetchCataloguePage(url: string) {
  let response = await fetch(url, {
    headers: REQUEST_HEADERS,
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const hit429 = response.status === 429;
  if (hit429) {
    await sleep(retryAfterMs(response.headers));
    response = await fetch(url, {
      headers: REQUEST_HEADERS,
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  }
  return { response, hit429 };
}

export async function runVerification(
  supabase: SupabaseClient,
  runId: string,
  providerFilter: string | null,
  deadline: number,
) {
  const rows: TestRow[] = [];
  const summary: Record<
    string,
    {
      total: number;
      ok: number;
      broken: number;
      rateLimited: number;
      inconclusive: number;
      notReached: number;
      method: string;
      catalogueComplete?: boolean;
    }
  > = {};
  const counts = {
    checked: 0,
    ok: 0,
    broken: 0,
    rateLimited: 0,
    inconclusive: 0,
  };
  const catalogues = new Map<string, Promise<ShopifyCatalogue>>();
  const errors: string[] = [];
  let failed = false;
  try {
    // Stable oldest-first paging; no verification writes begin until discovery finishes.
    const pageSize = 1000;
    for (let from = 0; ; from += pageSize) {
      if (Date.now() >= deadline) {
        failed = true;
        break;
      }
      let q = supabase
        .from("provider_tests")
        .select("id, provider_id, test_name, url, url_verified_at")
        .eq("is_active", true)
        .not("url", "is", null)
        .order("url_verified_at", { ascending: true, nullsFirst: true })
        .order("id", { ascending: true })
        .range(from, from + pageSize - 1);
      if (providerFilter) q = q.eq("provider_id", providerFilter);
      const { data, error } = await q.abortSignal(
        AbortSignal.timeout(TIMEOUT_MS),
      );
      if (error) throw new Error("Catalogue discovery failed");
      rows.push(...((data ?? []) as TestRow[]));
      if (!data || data.length < pageSize) break;
    }

    async function processRow(
      row: TestRow,
      catalogue?: ShopifyCatalogue,
    ): Promise<{ hit429: boolean }> {
      if (!row.url) return { hit429: false };
      const store = shopifyStore(row.provider_id, row.url);
      const outcome =
        store && catalogue ? catalogueOutcome(row.url, store, catalogue) : null;
      const result: CheckResult = outcome
        ? {
            ok: outcome === "ok",
            inconclusive: outcome === "inconclusive",
            rateLimited:
              outcome === "inconclusive" && catalogue?.rateLimited === true,
            issue:
              outcome === "broken"
                ? "handle absent from complete Shopify catalogue"
                : "incomplete Shopify catalogue",
          }
        : await checkUrl(row.url);
      const provider = summary[row.provider_id];
      if (!provider) return { hit429: false };
      provider.total++;
      provider.notReached--;
      counts.checked++;
      if (result.rateLimited) {
        // Inconclusive: no alert and neither verification field changes.
        provider.rateLimited++;
        counts.rateLimited++;
        return { hit429: result.hit429 ?? false };
      }
      if (result.inconclusive) {
        provider.inconclusive++;
        counts.inconclusive++;
        return { hit429: false };
      }
      if (result.ok) {
        provider.ok++;
        counts.ok++;
      } else {
        provider.broken++;
        counts.broken++;
        const { error } = await supabase
          .from("scraper_alerts")
          .insert({
            provider_id: row.provider_id,
            alert_type: "broken_url",
            severity: "warning",
            message: `URL check failed (${result.issue ?? "unknown error"}) for ${row.test_name ?? row.id}`,
          })
          .abortSignal(AbortSignal.timeout(TIMEOUT_MS));
        if (error) {
          failed = true;
          errors.push("Broken-link alert write failed");
        }
      }
      const { error } = await supabase
        .from("provider_tests")
        .update({
          url_verified: result.ok,
          url_verified_at: new Date().toISOString(),
        })
        .eq("id", row.id)
        .abortSignal(AbortSignal.timeout(TIMEOUT_MS));
      if (error) {
        failed = true;
        errors.push("URL verification write failed");
      }
      return { hit429: result.hit429 ?? false };
    }

    // Keep independent provider pools and their existing concurrency/adaptive staggering.
    const byProvider = new Map<string, TestRow[]>();
    for (const row of oldestFirst(rows)) {
      const group = byProvider.get(row.provider_id);
      if (group) group.push(row);
      else byProvider.set(row.provider_id, [row]);
    }
    const settled = await Promise.allSettled(
      Array.from(byProvider.entries(), async ([providerId, providerRows]) => {
        const config = PROVIDER_CONFIG[providerId] ?? {};
        const store = providerRows
          .map((row) => shopifyStore(providerId, row.url))
          .find((value) => value !== null);
        const hasHttpRows = providerRows.some(
          (row) => !shopifyStore(providerId, row.url),
        );
        summary[providerId] = {
          total: 0,
          ok: 0,
          broken: 0,
          rateLimited: 0,
          inconclusive: 0,
          notReached: providerRows.length,
          method: store
            ? hasHttpRows
              ? "mixed"
              : "shopify_catalogue"
            : "http",
        };
        let catalogue: ShopifyCatalogue | undefined;
        if (store) {
          let pending = catalogues.get(store);
          if (!pending) {
            pending = readShopifyCatalogue(store, {
              deadline,
              staggerStartMs: config.staggerStartMs ?? STAGGER_START_MS,
              staggerMaxMs: STAGGER_MAX_MS,
              now: Date.now,
              sleep,
              fetchPage: fetchCataloguePage,
            });
            catalogues.set(store, pending);
          }
          catalogue = await pending;
          summary[providerId].catalogueComplete = catalogue.complete;
        }
        return runBudgetedPool(providerRows, {
          concurrency: config.concurrency ?? PROVIDER_CONCURRENCY,
          staggerStartMs: config.staggerStartMs ?? STAGGER_START_MS,
          staggerMaxMs: STAGGER_MAX_MS,
          deadline,
          process: (row) => processRow(row, catalogue),
          now: Date.now,
          sleep,
        });
      }),
    );
    if (settled.some((result) => result.status === "rejected")) {
      failed = true;
      errors.push("Provider pool failed");
    }
  } catch {
    failed = true;
    errors.push("Verification run failed before all links were reached");
  } finally {
    const details = finalRunDetails(rows.length, counts, failed);
    const { error } = await supabase
      .from("scrape_run_log")
      .update({
        completed_at: new Date().toISOString(),
        status: details.status,
        providers_run: Object.keys(summary).length,
        verification_failures: counts.broken,
        details: {
          ...details,
          total: rows.length,
          summary,
          errors: errors.slice(0, 20),
          budget_ms: CHECK_START_BUDGET_MS,
        },
      })
      .eq("id", runId)
      .abortSignal(AbortSignal.timeout(TIMEOUT_MS));
    if (error) console.error("[scrape-and-verify] run log finalisation failed");
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey)
    return new Response("service unavailable", { status: 503 });
  if (req.headers.get("Authorization") !== `Bearer ${serviceKey}`) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders },
    );
  }
  if (typeof EdgeRuntime === "undefined")
    return new Response("background runtime unavailable", { status: 503 });
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
  const deadline = Date.now() + CHECK_START_BUDGET_MS;
  const providerFilter = new URL(req.url).searchParams.get("provider");
  try {
    const { data: runRow, error } = await supabase
      .from("scrape_run_log")
      .insert({
        status: "running",
        trigger_source: "url-verification",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .abortSignal(AbortSignal.timeout(TIMEOUT_MS))
      .single();
    const runId: unknown = runRow?.id;
    if (error || typeof runId !== "string")
      throw new Error("Unable to start verification run");
    EdgeRuntime.waitUntil(
      runVerification(supabase, runId, providerFilter, deadline).catch(() => {
        console.error(
          "[scrape-and-verify] background run log finalisation failed",
        );
      }),
    );
    return Response.json(
      { run_id: runId, status: "accepted" },
      { status: 202, headers: corsHeaders },
    );
  } catch (error) {
    return internalErrorResponse("scrape-and-verify start", error, corsHeaders);
  }
});
