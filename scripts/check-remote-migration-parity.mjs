#!/usr/bin/env node
/**
 * Remote migration parity check.
 *
 * Compares the 14-digit version prefixes of the files in supabase/migrations/
 * with the versions recorded in supabase_migrations.schema_migrations.
 *
 * Requires SUPABASE_DB_URL and psql on PATH. Exits non-zero — loudly — when the
 * variable is absent, so a missing secret can never be mistaken for a pass.
 * Read-only: it issues a single SELECT and writes nothing.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import {
  compareMigrationSets,
  formatParityReport,
  parseExclusionRegistry,
} from "./lib/migration-parity-core.mjs";

const dbUrl = process.env["SUPABASE_DB_URL"];
if (!dbUrl) {
  console.error(
    "✗ SUPABASE_DB_URL is not set. The remote parity check cannot run.\n" +
      "  Set the repository secret SUPABASE_DB_URL, or run the local-only check\n" +
      "  with `node scripts/check-migration-parity.mjs`.",
  );
  process.exit(1);
}

const EXCLUSIONS = "supabase/migrations/.excluded-versions";
const excludedVersions = existsSync(EXCLUSIONS)
  ? parseExclusionRegistry(readFileSync(EXCLUSIONS, "utf8"))
  : [];

const repoVersions = readdirSync("supabase/migrations")
  .filter((f) => f.endsWith(".sql"))
  .map((f) => f.slice(0, 14));

const raw = execFileSync(
  "psql",
  [
    dbUrl,
    "-At",
    "-c",
    "SELECT version FROM supabase_migrations.schema_migrations ORDER BY version;",
  ],
  { encoding: "utf8" },
);

const remoteVersions = raw.split("\n");

const result = compareMigrationSets(remoteVersions, repoVersions, {
  excludedVersions,
});
console.log(
  `Remote versions: ${new Set(remoteVersions.filter(Boolean)).size} · ` +
    `Repo files: ${repoVersions.length} · ` +
    `Excluded by policy: ${excludedVersions.length}`,
);
console.log(formatParityReport(result));

if (!result.ok) {
  console.error(
    "\n::error::Migration history drift detected. See docs/MIGRATION_RECONCILIATION.md.",
  );
  process.exit(1);
}
