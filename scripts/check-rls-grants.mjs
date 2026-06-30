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

const files = readdirSync(DIR)
  .filter((f) => f.endsWith(".sql"))
  .filter((f) => f.slice(0, 8) >= CUTOFF);

const violations = [];

for (const file of files) {
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
    if (!grantRe.test(stripped)) {
      violations.push(`${file}: public.${tbl} — missing GRANT statement`);
    }
    if (!rlsRe.test(stripped)) {
      violations.push(`${file}: public.${tbl} — missing ENABLE ROW LEVEL SECURITY`);
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
console.log(`✓ RLS/GRANTS lint: ${files.length} migration(s) checked, no violations.`);
