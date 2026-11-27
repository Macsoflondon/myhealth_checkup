// mhc-edge-sync: six-hourly refresh of EDGE (sports-blood-tests) prices.
//
// 2026-11-27 (platform screening): replaces the GitHub workflow
// edge-price-sync.yml, which failed on every run from 22:10 UTC on 7 Nov 2026
// with "EDGE source HTTP 403" because sportsbloodtests.co.uk refuses GitHub's
// runner addresses. Supabase edge functions are accepted. The logic follows
// scripts/edge-price-sync.ts: discover products from /blood-tests/, parse each
// page with the shared EDGE parser (a Deno copy of src/lib/edge-source.ts),
// upsert through _shared/provider-upsert.ts, and deactivate a listing only
// when the whole catalogue was read and written and its own page answers 404
// or 410. Each run is logged to scrape_runs as "mhc-edge-sync".
//
// Auth: the x-mhc-sync-secret header, checked by _shared/mhc-auth.ts against
// Vault mhc_sync_secret. Called by pg_cron job mhc-edge and by the admin
// manual price sync. Deployed through the Supabase deploy tool, because
// Lovable does not create new edge functions in this project. A reference
// copy lives in docs/edge-functions-outside-repo/mhc-edge-sync/.
import { createClient } from "npm:@supabase/supabase-js@2";
import { checkMhcSyncSecret } from "../_shared/mhc-auth.ts";
import { getErrorMessage } from "../_shared/errors.ts";
import {
  upsertProviderTests,
  type ProviderTestRow,
  type SupabaseLike,
} from "../_shared/provider-upsert.ts";
import {
  EDGE_ORIGIN,
  edgeLinks,
  parseEdgeProduct,
} from "../_shared/scrape/edge-source.ts";

const PROVIDER_ID = "sports-blood-tests";
const USER_AGENT =
  "Mozilla/5.0 (compatible; myhealthcheckup-sync/1.0; +https://myhealthcheckup.co.uk)";
const PAGE_PAUSE_MS = 250;
const RUN_BUDGET_MS = 100_000;

type ExistingRow = {
  provider_test_id: string | null;
  url: string | null;
  is_active: boolean;
  test_name: string;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const productPath = (url: string): string | null => {
  try {
    const u = new URL(url);
    return u.origin === EDGE_ORIGIN &&
      /^\/blood-tests\/[^/]+\/[^/]+\/?$/.test(u.pathname)
      ? u.pathname.replace(/\/$/, "")
      : null;
  } catch {
    return null;
  }
};

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) return json({ error: "Not configured" }, 503);
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const auth = await checkMhcSyncSecret(req, supabase, "mhc-edge-sync");
  if (!auth.ok) {
    return auth.reason === "not_configured"
      ? json({ error: "Not configured" }, 503)
      : json({ error: "Unauthorized" }, 401);
  }
  if (url.searchParams.get("provider") !== PROVIDER_ID) {
    return json({ error: "Unknown provider" }, 400);
  }
  const dry = url.searchParams.get("dry") === "1";

  const started = Date.now();
  const startedAt = new Date(started).toISOString();
  const errors: string[] = [];
  const rows: ProviderTestRow[] = [];
  let testsNew = 0;
  let testsUpdated = 0;
  let testsDeactivated = 0;

  const fetchPage = async (pageUrl: string): Promise<string> => {
    if (Date.now() - started > RUN_BUDGET_MS) {
      throw new Error("EDGE run time budget exceeded");
    }
    await sleep(PAGE_PAUSE_MS);
    const res = await fetch(pageUrl, {
      signal: AbortSignal.timeout(20_000),
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    });
    if (!res.ok) {
      await res.body?.cancel();
      throw new Error(`EDGE source HTTP ${res.status}`);
    }
    return res.text();
  };

  try {
    const { data: existing, error } = await supabase
      .from("provider_tests")
      .select("provider_test_id,url,is_active,test_name")
      .eq("provider_id", PROVIDER_ID);
    if (error) throw new Error("Cannot read EDGE catalogue");
    const stored = (existing ?? []) as ExistingRow[];
    if (!stored.length) throw new Error("EDGE catalogue is empty; refresh not activated");

    const urls = edgeLinks(await fetchPage(`${EDGE_ORIGIN}/blood-tests/`), "blood-tests");
    if (!urls.length || urls.length > 100) {
      throw new Error("Invalid EDGE product discovery; keeping last good catalogue");
    }
    for (const sourceUrl of urls) {
      const product = parseEdgeProduct(await fetchPage(sourceUrl), sourceUrl);
      const match = stored.find(
        (row) => row.url && productPath(row.url) === productPath(sourceUrl),
      );
      const slug = new URL(sourceUrl).pathname.split("/").filter(Boolean).at(-1);
      if (!slug) throw new Error("Missing stable EDGE product slug");
      if (!match) testsNew++;
      rows.push({
        provider_id: PROVIDER_ID,
        provider_test_id: match?.provider_test_id ?? `${PROVIDER_ID}-${slug}`,
        test_name: product.name,
        price: product.price,
        base_price: product.price,
        url: sourceUrl,
        scrape_source_url: sourceUrl,
        scraped_at: new Date().toISOString(),
        is_active: true,
        price_not_stated: false,
        ...(product.description
          ? {
              description: product.description,
              description_scraped: product.description,
              description_source: "scraped_verbatim",
            }
          : {}),
        ...(product.markers.length
          ? { biomarkers_list: product.markers, biomarkers_not_stated: false }
          : {}),
        ...(product.biomarkerCount !== null
          ? { biomarker_count: product.biomarkerCount }
          : {}),
        canonical_category: sourceUrl.includes("/hormones/")
          ? "hormones"
          : "sports-performance",
        // Collection, cost and accreditation fields are kept, not inferred.
        ...(!match ? { data_status: "partial" } : {}),
      });
    }

    if (dry) {
      return json({
        dry: true,
        tests: rows.map((r) => ({ name: r.test_name, price: r.price, url: r.url })),
      });
    }

    const applied = await upsertProviderTests(
      supabase as unknown as SupabaseLike,
      PROVIDER_ID,
      rows,
      `${PROVIDER_ID}-`,
    );
    errors.push(...applied.errors);
    testsUpdated = Math.max(0, applied.upsertedCount - testsNew);

    // Only a fully read and written catalogue may remove a listing, and only
    // when its own page confirms removal. A missing index link is not proof.
    if (!errors.length) {
      const sourceIds = new Set(rows.map((r) => r.provider_test_id));
      for (const row of stored) {
        if (!row.is_active || !row.provider_test_id || sourceIds.has(row.provider_test_id)) continue;
        if (!row.url || !productPath(row.url)) continue;
        await sleep(PAGE_PAUSE_MS);
        const res = await fetch(row.url, {
          signal: AbortSignal.timeout(20_000),
          headers: { "User-Agent": USER_AGENT },
        });
        await res.body?.cancel();
        if (![404, 410].includes(res.status)) continue;
        const { error: deactivateError } = await supabase
          .from("provider_tests")
          .update({ is_active: false })
          .eq("provider_id", PROVIDER_ID)
          .eq("provider_test_id", row.provider_test_id);
        if (deactivateError) errors.push("Could not deactivate removed EDGE test");
        else testsDeactivated++;
      }
    }
  } catch (e) {
    errors.push(getErrorMessage(e).slice(0, 300));
  }

  if (dry) return json({ dry: true, errors }, errors.length ? 502 : 200);

  const { error: logError } = await supabase.from("scrape_runs").insert({
    provider_id: PROVIDER_ID,
    scraper_function: "mhc-edge-sync",
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    status: errors.length ? "error" : "success",
    tests_seen: rows.length,
    tests_new: errors.length ? 0 : testsNew,
    tests_updated: testsUpdated,
    tests_deactivated: testsDeactivated,
    errors: errors.map((message) => ({ message })),
  });
  if (logError) console.error("[mhc-edge-sync] run log failed", logError.message);

  return json(
    {
      ok: errors.length === 0,
      provider: PROVIDER_ID,
      tests_seen: rows.length,
      tests_new: errors.length ? 0 : testsNew,
      tests_updated: testsUpdated,
      tests_deactivated: testsDeactivated,
      errors,
    },
    errors.length ? 502 : 200,
  );
});
