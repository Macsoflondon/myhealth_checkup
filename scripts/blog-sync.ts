/**
 * Daily provider blog aggregation, run from GitHub Actions because
 * Shopify-hosted provider blogs return HTTP 429 to Supabase edge servers.
 * Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.
 */
import { runBlogAggregation } from "../src/lib/blog/aggregator.server";
import { BLOG_SOURCES } from "../src/lib/blog/sources";

const main = async (): Promise<void> => {
  const result = await runBlogAggregation();
  const failed: string[] = [];

  for (const source of BLOG_SOURCES) {
    const run = result.providers.find((p) => p.providerId === source.providerId);
    const found = run?.found ?? 0;
    const error = run ? (run.error ?? "") : "not run";
    console.log(`${source.providerId}\tfound=${found}\terror=${error || "none"}`);
    if (found === 0 || error) failed.push(source.providerId);
  }

  console.log(`totalUpserted=${result.totalUpserted}`);
  console.log(`backfilled=${result.backfilled}`);

  if (failed.length > 0) {
    console.error(`Failed providers: ${failed.join(", ")}`);
    process.exitCode = 1;
  }
};

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
