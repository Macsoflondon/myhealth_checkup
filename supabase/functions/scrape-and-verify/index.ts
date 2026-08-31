// scrape-and-verify
// URL verification only. Performs a live HTTP check of every active
// provider_tests.url and persists the outcome to url_verified /
// url_verified_at, raising a `broken_url` scraper alert on failure.
//
// It does NOT trigger scrapers or promotion — run-all-scrapers and
// promote-provider-tests are scheduled separately every 6 hours.
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
const CONCURRENCY = 12;

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
}

async function checkUrl(url: string): Promise<CheckResult> {
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    // Some hosts reject HEAD — fall back to a ranged GET.
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
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
  let okCount = 0;
  let brokenCount = 0;
  const verifiedAt = new Date().toISOString();

  let cursor = 0;
  async function worker() {
    while (cursor < rows.length) {
      const row = rows[cursor++];
      const result = await checkUrl(row.url as string);

      summary[row.provider_id] ??= { total: 0, ok: 0, broken: 0 };
      summary[row.provider_id].total++;

      if (result.ok) {
        okCount++;
        summary[row.provider_id].ok++;
      } else {
        brokenCount++;
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
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

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
