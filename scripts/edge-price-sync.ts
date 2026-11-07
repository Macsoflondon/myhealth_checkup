/** Six-hourly EDGE catalogue refresh. GitHub Actions avoids provider edge throttling. */
import { createClient } from "@supabase/supabase-js";
import {
  edgeLinks,
  parseEdgeProduct,
  EDGE_ORIGIN,
} from "../src/lib/edge-source";
import {
  upsertProviderTests,
  type ProviderTestRow,
} from "../supabase/functions/_shared/provider-upsert";

const providerId = "sports-blood-tests";
const fetchPage = async (url: string): Promise<string> => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(30000),
    headers: { "User-Agent": "myhealthcheckup-sync/1.0" },
  });
  if (!response.ok) throw new Error(`EDGE source HTTP ${response.status}`);
  return response.text();
};

async function main(): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing server catalogue credentials");
  const client = createClient(url, key, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (
          key.startsWith("sb_") &&
          headers.get("Authorization") === `Bearer ${key}`
        )
          headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
  const startedAt = new Date().toISOString();
  const dry = process.argv.includes("--dry");
  const { data: existing, error } = await client
    .from("provider_tests")
    .select("provider_test_id,url,is_active,test_name")
    .eq("provider_id", providerId);
  if (error) throw new Error("Cannot read EDGE catalogue");
  if (!existing?.length)
    throw new Error(
      "EDGE onboarding must be applied by Claude before refresh activation",
    );
  const results: ProviderTestRow[] = [];
  const errors: string[] = [];
  let testsNew = 0,
    testsDeactivated = 0,
    testsUpdated = 0;
  try {
    const urls = edgeLinks(
      await fetchPage(`${EDGE_ORIGIN}/blood-tests/`),
      "blood-tests",
    );
    if (!urls.length)
      throw new Error(
        "Empty EDGE product discovery; keeping last good catalogue",
      );
    for (const sourceUrl of urls) {
      const product = parseEdgeProduct(await fetchPage(sourceUrl), sourceUrl);
      const stored = existing.find(
        (row) => row.url?.replace(/\/$/, "") === sourceUrl.replace(/\/$/, ""),
      );
      const slug = new URL(sourceUrl).pathname
        .split("/")
        .filter(Boolean)
        .at(-1);
      if (!slug) throw new Error("Missing stable product slug");
      if (!stored) testsNew++;
      const now = new Date().toISOString();
      results.push({
        provider_id: providerId,
        provider_test_id: stored?.provider_test_id ?? `${providerId}-${slug}`,
        test_name: product.name,
        price: product.price,
        base_price: product.price,
        url: sourceUrl,
        scrape_source_url: sourceUrl,
        scraped_at: now,
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
        // Collection/TEC/accreditation fields are intentionally preserved, not inferred.
        ...(!stored ? { data_status: "partial" } : {}),
      });
    }
    if (dry) {
      process.stdout.write(
        JSON.stringify(
          {
            dry: true,
            tests: results.map((row) => ({
              name: row.test_name,
              price: row.price,
              url: row.url,
            })),
          },
          null,
          2,
        ) + "\n",
      );
      return;
    }
    const applied = await upsertProviderTests(
      client,
      providerId,
      results,
      `${providerId}-`,
    );
    errors.push(...applied.errors);
    testsUpdated = applied.upsertedCount - testsNew;
    // Only a fully fetched and successfully written catalogue can remove old listings.
    if (!errors.length) {
      const sourceIds = new Set(results.map((row) => row.provider_test_id));
      const missing = existing.filter(
        (row) =>
          row.is_active &&
          row.provider_test_id &&
          !sourceIds.has(row.provider_test_id),
      );
      for (const row of missing) {
        if (!row.url) continue;
        // A missing index link alone is not proof of removal. Confirm at source.
        const response = await fetch(row.url, {
          signal: AbortSignal.timeout(30000),
        });
        if (![404, 410].includes(response.status)) continue;
        const { error: deactivateError } = await client
          .from("provider_tests")
          .update({ is_active: false })
          .eq("provider_id", providerId)
          .eq("provider_test_id", row.provider_test_id);
        if (deactivateError)
          errors.push("Could not deactivate removed EDGE test");
        else testsDeactivated++;
      }
    }
  } catch (error: unknown) {
    errors.push(error instanceof Error ? error.message : "EDGE refresh failed");
  }
  if (!dry) {
    const { error: logError } = await client.from("scrape_runs").insert({
      provider_id: providerId,
      scraper_function: "edge-price-sync",
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      status: errors.length ? "error" : "success",
      tests_seen: results.length,
      tests_new: errors.length ? 0 : testsNew,
      tests_updated: Math.max(0, testsUpdated),
      tests_deactivated: testsDeactivated,
      errors: errors.map((message) => ({ message })),
    });
    if (logError) throw new Error("EDGE scrape run could not be recorded");
  }
  if (errors.length) throw new Error(errors.join("; "));
  process.stdout.write(
    `EDGE: ${results.length} source-priced tests refreshed\n`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "EDGE refresh failed");
  process.exitCode = 1;
});
