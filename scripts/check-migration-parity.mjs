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
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { parseExclusionRegistry } from "./lib/migration-parity-core.mjs";

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

const EXCLUSIONS = `${DIR}/.excluded-versions`;
const excluded = existsSync(EXCLUSIONS)
  ? parseExclusionRegistry(readFileSync(EXCLUSIONS, "utf8"))
  : [];

const malformedExclusions = excluded.filter((v) => !/^\d{14}$/.test(v));
if (malformedExclusions.length) {
  console.error("✗ Malformed entries in .excluded-versions:", malformedExclusions);
  process.exit(1);
}

const versionSet = new Set(versions);
const conflicting = excluded.filter((v) => versionSet.has(v));
if (conflicting.length) {
  console.error(
    "✗ Versions are both excluded by policy and committed as files:",
    conflicting,
  );
  process.exit(1);
}

// Reconciliation markers must be non-executing by construction: every
// non-blank line is a comment. A marker that grows real SQL would replay
// historical DDL against production the next time migrations are applied.
const markers = files.filter((f) => f.endsWith("_reconciliation_marker.sql"));
const executable = markers.filter((f) =>
  readFileSync(`${DIR}/${f}`, "utf8")
    .split("\n")
    .some((line) => line.trim() && !line.trim().startsWith("--")),
);
if (executable.length) {
  console.error("✗ Reconciliation markers must contain comments only:", executable);
  process.exit(1);
}

console.log(`✓ Migration parity (local): ${files.length} files, all well-formed, no duplicates.`);
console.log(`  ${markers.length} non-executing reconciliation markers, all comment-only.`);
console.log(`  ${excluded.length} applied versions excluded by policy, none committed as files.`);
console.log(`  Remote parity is enforced by the CI workflow migration-parity.yml.`);
