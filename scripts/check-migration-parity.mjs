#!/usr/bin/env node
/**
 * Migration parity check.
 *
 * Every file in supabase/migrations/ must have a matching row in
 * supabase_migrations.schema_migrations (by 14-digit version prefix), and
 * vice-versa. Divergence means either:
 *   - someone applied a migration to prod without committing the file
 *     (create a marker in supabase/migrations/ — see docs/MIGRATION_HISTORY.md)
 *   - or a repo file was never pushed (run it via the migration tool)
 *
 * Requires SUPABASE_DB_URL for the psql call in CI, or falls back to the
 * anon REST endpoint if psql isn't available. In the sandbox this is invoked
 * via the supabase read tool; here we just enforce the local filesystem shape
 * and leave the remote check to CI (`.github/workflows/migration-parity.yml`).
 */
import { readdirSync } from "node:fs";

const DIR = "supabase/migrations";
const files = readdirSync(DIR).filter((f) => f.endsWith(".sql"));

const bad = files.filter((f) => !/^\d{14}_/.test(f));
if (bad.length) {
  console.error("✗ Migration filenames must start with YYYYMMDDHHMMSS_:");
  for (const f of bad) console.error("  " + f);
  process.exit(1);
}

const versions = files.map((f) => f.slice(0, 14));
const dupes = versions.filter((v, i) => versions.indexOf(v) !== i);
if (dupes.length) {
  console.error("✗ Duplicate migration versions:", [...new Set(dupes)]);
  process.exit(1);
}

console.log(`✓ Migration parity (local): ${files.length} files, all well-formed, no duplicates.`);
console.log(`  Remote parity is enforced by the CI workflow migration-parity.yml.`);
