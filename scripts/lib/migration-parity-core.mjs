/**
 * Pure comparison logic for migration parity.
 *
 * Kept dependency-free and side-effect-free so it can be unit tested in CI
 * against fixtures, without touching the production database.
 */

/** Number of seconds of tolerated Lovable/Supabase CLI timestamp skew. */
export const SKEW_TOLERANCE_SECONDS = 1;

/**
 * @param {string} version 14-digit YYYYMMDDHHMMSS version string
 * @returns {boolean}
 */
export const isWellFormedVersion = (version) => /^\d{14}$/.test(version);

/**
 * Normalise a list of versions: trim, drop blanks, de-duplicate, sort.
 * @param {readonly string[]} versions
 * @returns {string[]}
 */
export const normaliseVersions = (versions) =>
  [...new Set(versions.map((v) => String(v).trim()).filter(Boolean))].sort();

/**
 * Compare the set of migration versions applied remotely with the set of
 * versions committed to the repository.
 *
 * The only tolerated difference is the known trailing "+1s" skew documented in
 * docs/MIGRATION_HISTORY.md: the newest remote version being exactly
 * SKEW_TOLERANCE_SECONDS ahead of the newest repo version, with no other
 * difference. That case is reported explicitly rather than silently ignored.
 *
 * @param {readonly string[]} remoteVersions
 * @param {readonly string[]} repoVersions
 * @returns {{
 *   ok: boolean,
 *   missingLocal: string[],
 *   missingRemote: string[],
 *   skewTolerated: null | { remote: string, repo: string },
 *   malformed: string[],
 * }}
 */
export const compareMigrationSets = (
  remoteVersions,
  repoVersions,
  options = {},
) => {
  const remote = normaliseVersions(remoteVersions);
  const repo = normaliseVersions(repoVersions);
  const excluded = new Set(normaliseVersions(options.excludedVersions ?? []));

  const malformed = [...remote, ...repo].filter((v) => !isWellFormedVersion(v));

  const repoSet = new Set(repo);
  const remoteSet = new Set(remote);

  // An excluded version is applied-but-deliberately-uncommitted routine
  // catalogue DML (see docs/MIGRATION_RECONCILIATION.md). It is reported, never
  // silently dropped, and it must never masquerade as a committed file.
  const excludedApplied = remote.filter(
    (v) => excluded.has(v) && !repoSet.has(v),
  );
  const excludedButCommitted = repo.filter((v) => excluded.has(v));

  const missingLocal = remote.filter(
    (v) => !repoSet.has(v) && !excluded.has(v),
  );
  const missingRemote = repo.filter((v) => !remoteSet.has(v));

  let skewTolerated = null;

  if (
    malformed.length === 0 &&
    missingLocal.length === 1 &&
    missingRemote.length === 1
  ) {
    const [r] = missingLocal;
    const [l] = missingRemote;
    const isTrailing = r === remote[remote.length - 1];
    const delta = Number(r) - Number(l);
    if (isTrailing && delta === SKEW_TOLERANCE_SECONDS) {
      skewTolerated = { remote: r, repo: l };
    }
  }

  const ok =
    malformed.length === 0 &&
    excludedButCommitted.length === 0 &&
    (skewTolerated !== null ||
      (missingLocal.length === 0 && missingRemote.length === 0));

  return {
    ok,
    missingLocal,
    missingRemote,
    skewTolerated,
    malformed,
    excludedApplied,
    excludedButCommitted,
  };
};

/**
 * Parse the exclusion registry (supabase/migrations/.excluded-versions).
 * Lines are "<version> <md5>"; blank lines and # comments are ignored.
 * @param {string} contents
 * @returns {string[]}
 */
export const parseExclusionRegistry = (contents) =>
  contents
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/)[0]);

/**
 * Human-readable report for CI logs.
 * @param {ReturnType<typeof compareMigrationSets>} result
 * @returns {string}
 */
export const formatParityReport = (result) => {
  const lines = [];
  if (result.malformed.length) {
    lines.push(`✗ Malformed migration versions: ${result.malformed.join(", ")}`);
  }
  if (result.excludedApplied?.length) {
    lines.push(
      `· ${result.excludedApplied.length} applied version(s) excluded by policy ` +
        "(routine catalogue DML — docs/MIGRATION_RECONCILIATION.md).",
    );
  }
  if (result.excludedButCommitted?.length) {
    lines.push(
      "✗ Versions are both excluded by policy AND committed as files — resolve one or the other:",
    );
    lines.push(...result.excludedButCommitted.map((v) => `    ${v}`));
  }
  if (result.skewTolerated) {
    lines.push(
      `✓ Migration sets align, tolerating the documented +${SKEW_TOLERANCE_SECONDS}s CLI skew ` +
        `(repo=${result.skewTolerated.repo}, remote=${result.skewTolerated.remote}).`,
    );
  }
  if (result.missingLocal.length && !result.skewTolerated) {
    lines.push("✗ Applied remotely with no committed migration file:");
    lines.push(...result.missingLocal.map((v) => `    ${v}`));
  }
  if (result.missingRemote.length && !result.skewTolerated) {
    lines.push("✗ Committed to the repository but never applied remotely:");
    lines.push(...result.missingRemote.map((v) => `    ${v}`));
  }
  if (result.ok && !result.skewTolerated) {
    lines.push("✓ Repo and remote migration sets are reconciled.");
  }
  return lines.join("\n");
};
