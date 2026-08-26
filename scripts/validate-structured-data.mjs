/**
 * Build-time structured data validation.
 *
 * Renders the JSON-LD that provider and test detail routes emit (via the
 * shared metadata helpers) for a live sample of Supabase rows, and fails the
 * build when a node is broken, duplicated, or points at the wrong path.
 *
 * Run:  npx tsx scripts/validate-structured-data.mjs
 */

import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const SITE = "https://myhealthcheckup.co.uk";
const SAMPLE_SIZE = Number(process.env["SEO_VALIDATION_SAMPLE"] ?? 40);
const SUPABASE_URL =
  process.env["VITE_SUPABASE_URL"] ?? "https://clvuioagsgfadynuvodj.supabase.co";
const SUPABASE_KEY =
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_KEY"] ?? "";

const headMod = await import(pathToFileURL(resolve("src/lib/seo/route-head.ts")).href);
const sdMod = await import(pathToFileURL(resolve("src/lib/seo/structured-data.ts")).href);
const { buildProviderHead, buildTestHead } = headMod;
const { validateJsonLd } = sdMod;

const failures = [];

const checkHead = (label, head, expectedUrl) => {
  const canonical = (head.links ?? []).filter((l) => l.rel === "canonical");
  if (canonical.length !== 1) {
    failures.push(`${label}: expected exactly one canonical, found ${canonical.length}`);
  } else if (canonical[0].href !== expectedUrl) {
    failures.push(`${label}: canonical ${canonical[0].href} !== ${expectedUrl}`);
  }

  const ogUrl = head.meta.filter((m) => m.property === "og:url");
  if (ogUrl.length !== 1 || ogUrl[0].content !== expectedUrl) {
    failures.push(`${label}: og:url must be exactly one tag pointing at ${expectedUrl}`);
  }

  const scripts = head.scripts ?? [];
  if (scripts.length === 0) failures.push(`${label}: no JSON-LD emitted`);

  const types = [];
  for (const script of scripts) {
    let node;
    try {
      node = JSON.parse(script.children);
    } catch {
      failures.push(`${label}: JSON-LD is not parseable JSON`);
      continue;
    }
    types.push(node["@type"]);
    const issues = validateJsonLd(node, node.url ? { expectedUrl } : {});
    for (const issue of issues) failures.push(`${label}: ${issue.node} ${issue.message}`);
  }
  const dupes = types.filter((t, i) => types.indexOf(t) !== i);
  if (dupes.length) failures.push(`${label}: duplicate JSON-LD @type ${[...new Set(dupes)].join(", ")}`);
};

async function loadSample() {
  if (!SUPABASE_KEY) {
    console.warn("structured data: no Supabase key — validating synthetic fixtures only");
    return [];
  }
  const url =
    `${SUPABASE_URL}/rest/v1/unified_provider_tests` +
    `?select=id,provider_id,provider_name,test_name,price,biomarker_count` +
    `&order=updated_at.desc&limit=${SAMPLE_SIZE}`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) {
    console.warn(`structured data: sample fetch failed (${res.status})`);
    return [];
  }
  return res.json();
}

const rows = await loadSample();

const fixtures = [
  { id: "fixture-test", provider_id: "medichecks", provider_name: "Medichecks", test_name: "Vitamin D Test", price: 39, biomarker_count: 1 },
];

const providers = new Map();

for (const row of [...rows, ...fixtures]) {
  if (!row.provider_id || !row.id) continue;
  providers.set(row.provider_id, row.provider_name ?? row.provider_id);
  const url = `${SITE}/provider/${row.provider_id}/tests/${row.id}`;
  checkHead(
    `test ${row.provider_id}/${row.id}`,
    buildTestHead({
      providerId: row.provider_id,
      providerName: row.provider_name ?? row.provider_id,
      testId: row.id,
      testName: row.test_name ?? "Test details",
      priceGbp: typeof row.price === "number" ? row.price : null,
      biomarkerCount: typeof row.biomarker_count === "number" ? row.biomarker_count : null,
    }),
    url,
  );
}

for (const [providerId, providerName] of providers.entries()) {
  checkHead(
    `provider ${providerId}`,
    buildProviderHead({ providerId, providerName }),
    `${SITE}/provider/${providerId}`,
  );
}

console.log(`Validated ${rows.length + fixtures.length} test pages and ${providers.size} provider pages`);

if (failures.length) {
  console.log(`\n✘ ${failures.length} structured data failure(s):`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}

console.log("✔ Structured data validation passed");
