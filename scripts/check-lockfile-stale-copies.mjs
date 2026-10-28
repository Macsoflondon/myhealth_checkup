#!/usr/bin/env node
/**
 * Fails when package-lock.json keeps a nested copy of a package that npm no
 * longer needs.
 *
 * Why this exists: Lovable keeps bun.lock as its source of truth and patches
 * package-lock.json entry by entry. A nested copy such as
 * node_modules/@modelcontextprotocol/sdk/node_modules/zod survives those
 * patches even after the hoisted copy moves on. `npm install` keeps any locked
 * entry that still satisfies its range, so nothing ever refreshes it. The
 * stale copy then carries old vulnerabilities into production (deploy runs
 * `npm ci` on this file) and the dependency scan fails on every push.
 *
 * A nested copy is stale when the copy its parent would otherwise resolve to
 * (the nearest one up the tree) is newer and still satisfies the parent's
 * declared range. Fix: `npm dedupe`, or delete the listed entries from
 * package-lock.json and run `npm install --package-lock-only --ignore-scripts`.
 *
 * semver: resolved from NPM_SEMVER (npm's bundled copy, set by CI) so this
 * check adds no project dependency, with the project's own copy as fallback.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const semver = require(process.env.NPM_SEMVER || "semver");

const lockPath = process.argv[2] || "package-lock.json";
const lock = JSON.parse(readFileSync(lockPath, "utf8"));
const packages = lock.packages ?? {};
// npm applies package.json "overrides" before ranges, so an override replaces the declared range.
const overrides =
  JSON.parse(readFileSync("package.json", "utf8")).overrides ?? {};

const SEP = "/node_modules/";

const declaredRange = (parent, name) =>
  parent?.dependencies?.[name] ??
  parent?.optionalDependencies?.[name] ??
  parent?.peerDependencies?.[name];

/** Nearest copy of `name` that `parentPath` would resolve to without its own nested copy. */
const nearestAncestorCopy = (parentPath, name) => {
  let dir = parentPath;
  while (true) {
    const cut = dir.lastIndexOf(SEP);
    if (cut === -1)
      return packages[`node_modules/${name}`] ? `node_modules/${name}` : null;
    dir = dir.slice(0, cut);
    const candidate = `${dir}${SEP}${name}`;
    if (packages[candidate]) return candidate;
  }
};

const stale = [];

for (const [path, entry] of Object.entries(packages)) {
  const cut = path.lastIndexOf(SEP);
  if (cut === -1 || entry.link || !entry.version) continue;

  const parentPath = path.slice(0, cut);
  const name = path.slice(cut + SEP.length);
  const parent = packages[parentPath];

  let range = declaredRange(parent, name);
  const forced = overrides[name];
  if (typeof forced === "string" && !forced.startsWith("$")) range = forced;
  if (!range || !semver.validRange(range)) continue;

  const fallbackPath = nearestAncestorCopy(parentPath, name);
  const fallback = fallbackPath && packages[fallbackPath];
  if (!fallback?.version || fallback.link) continue;

  if (
    semver.gt(fallback.version, entry.version) &&
    semver.satisfies(fallback.version, range, { includePrerelease: true })
  ) {
    stale.push({
      path,
      version: entry.version,
      range,
      fallbackPath,
      fallbackVersion: fallback.version,
    });
  }
}

if (stale.length === 0) {
  console.log(`No stale nested copies in ${lockPath}.`);
  process.exit(0);
}

console.error(`Stale nested copies in ${lockPath}:`);
for (const s of stale) {
  console.error(
    `  ${s.path}@${s.version} (parent wants ${s.range}; ${s.fallbackPath}@${s.fallbackVersion} already satisfies it)`,
  );
}
console.error(
  "\nRemove them with `npm dedupe`, or delete these entries from package-lock.json and run\n" +
    "`npm install --package-lock-only --ignore-scripts --legacy-peer-deps`.",
);
process.exit(1);
