#!/usr/bin/env node
/**
 * RLS / GRANTS lint for Supabase migrations.
 *
 * Enforces, for every `CREATE TABLE public.<name>` in a migration file:
 *   1) a matching `GRANT ... ON public.<name>` in the same file
 *   2) a matching `ALTER TABLE public.<name> ENABLE ROW LEVEL SECURITY`
 *
 * Only applies to migrations on/after CUTOFF — historical files are baselined.
 * Bump CUTOFF whenever you want to re-baseline after a sweep.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const CUTOFF = "20260630"; // YYYYMMDD — only files with prefix >= this are enforced
const DIR = "supabase/migrations";

// Already-applied historical migrations restored verbatim from production's
// migration log on 2026-09-28. They were previously non-executing placeholders,
// so this lint never saw them. Their tables rely on Supabase default privileges,
// and the partitions created by the 2026-06-30 bootstrap did not enable RLS at the
// time. Production's exact privileges and RLS flags for every one of these tables
// are applied by 20260927190000_reconcile_out_of_band_production_state.sql.
// Grandfathered by exact file (or file and table) so the rule still applies to
// everything new.
const BASELINE_FILES = new Set([
  "20260630110630_enterprise_operational_intelligence_platform.sql",
]);
const BASELINE = new Set([
  "20260829113438_biomarker_canonical_phase1_add_columns.sql:biomarker_hub",
  "20260829113822_biomarker_canonical_phase4_taxonomy.sql:biomarker_category_map",
  "20260829234959_provider_test_biomarkers_link_table.sql:provider_test_biomarkers",
  "20260831120014_provider_tests_biomarkers_list_junk_guard.sql:known_scrape_junk_labels",
]);

const files = readdirSync(DIR)
  .filter((f) => f.endsWith(".sql"))
  .filter((f) => f.slice(0, 8) >= CUTOFF);

const violations = [];

for (const file of files) {
  if (BASELINE_FILES.has(file)) continue;
  const sql = readFileSync(join(DIR, file), "utf8");
  const stripped = sql.replace(/--[^\n]*\n/g, "\n");
  const tableRegex =
    /create\s+table\s+(?:if\s+not\s+exists\s+)?public\.([a-z_][a-z0-9_]*)/gi;
  let m;
  while ((m = tableRegex.exec(stripped)) !== null) {
    const tbl = m[1];
    const grantRe = new RegExp(
      `grant\\s+[^;]+\\son\\s+(?:table\\s+)?public\\.${tbl}\\b`,
      "i",
    );
    const rlsRe = new RegExp(
      `alter\\s+table\\s+(?:if\\s+exists\\s+)?public\\.${tbl}\\s+enable\\s+row\\s+level\\s+security`,
      "i",
    );
    if (!grantRe.test(stripped) && !BASELINE.has(`${file}:${tbl}`)) {
      violations.push(`${file}: public.${tbl} — missing GRANT statement`);
    }
    if (!rlsRe.test(stripped)) {
      violations.push(
        `${file}: public.${tbl} — missing ENABLE ROW LEVEL SECURITY`,
      );
    }
  }
}

if (violations.length) {
  console.error("✗ RLS/GRANTS lint failed:\n");
  for (const v of violations) console.error("  " + v);
  console.error(
    `\nEvery new public table must ship GRANTs + RLS in the same migration.`,
  );
  process.exit(1);
}
console.log(
  `✓ RLS/GRANTS lint: ${files.length} migration(s) checked, no violations.`,
);
