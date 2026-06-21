#!/usr/bin/env node
/**
 * Sticky Category Bar route audit.
 *
 * 1. Extracts every static <Route path="..."> from src/routes/*.tsx (+ src/App.tsx).
 * 2. Visits each route on the local dev server (default http://localhost:8080).
 * 3. Verifies <nav aria-label="Sticky category navigation"> renders.
 * 4. Prints a pass/fail table and writes JSON + Markdown reports to
 *    /tmp/browser/sticky-audit/.
 *
 * Usage:
 *   node scripts/audit-sticky-bar.mjs                 # full audit
 *   node scripts/audit-sticky-bar.mjs --base=http://localhost:8080
 *   node scripts/audit-sticky-bar.mjs --only=/wellness,/contact
 *   node scripts/audit-sticky-bar.mjs --list          # just print discovered routes
 *
 * Requires Playwright (already installed in the sandbox).
 */
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const BASE = args.base || "http://localhost:8080";
const ONLY = args.only ? String(args.only).split(",").map((s) => s.trim()) : null;
const OUT_DIR = "/tmp/browser/sticky-audit";
const SELECTOR = 'nav[aria-label="Sticky category navigation"]';
const HOMEPAGE_PATHS = new Set(["/"]); // hero-gated; expected to be absent on load

const ROUTE_FILES = [
  "src/App.tsx",
  ...readdirSync("src/routes")
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => join("src/routes", f)),
];

const ROUTE_RE = /<Route\s+path=["']([^"']+)["']/g;
const discovered = new Set();
for (const file of ROUTE_FILES) {
  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const m of src.matchAll(ROUTE_RE)) {
    const p = m[1];
    if (p.includes("*")) continue; // catch-all
    if (p.includes(":")) continue; // parameterised — skip, no sample data here
    discovered.add(p.startsWith("/") ? p : `/${p}`);
  }
}

const routes = [...discovered].sort();
if (args.list) {
  console.log(routes.join("\n"));
  process.exit(0);
}

const targets = ONLY ? routes.filter((r) => ONLY.includes(r)) : routes;
if (!targets.length) {
  console.error("No routes to audit.");
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });
console.log(`Auditing ${targets.length} route(s) against ${BASE}\n`);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 1800 } });
const page = await ctx.newPage();

const results = [];
for (const path of targets) {
  const url = `${BASE}${path}`;
  let status = "pass";
  let note = "";
  let httpStatus = 0;
  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    httpStatus = resp?.status() ?? 0;
    // Give React a tick to mount the layout.
    await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
    const present = await page.locator(SELECTOR).first().count();
    if (HOMEPAGE_PATHS.has(path)) {
      status = present ? "warn" : "pass";
      note = present ? "bar visible before hero scroll" : "hero-gated (expected)";
    } else {
      status = present ? "pass" : "fail";
      if (!present) note = "StickyCategoryBar missing";
    }
  } catch (e) {
    status = "error";
    note = e.message.split("\n")[0];
  }
  results.push({ path, status, httpStatus, note });
  const icon = { pass: "✓", fail: "✗", warn: "!", error: "·" }[status];
  console.log(`${icon} ${path.padEnd(48)} ${status.toUpperCase().padEnd(6)} ${note}`);
}

await browser.close();

const failed = results.filter((r) => r.status === "fail" || r.status === "error");
const summary = {
  base: BASE,
  total: results.length,
  pass: results.filter((r) => r.status === "pass").length,
  fail: results.filter((r) => r.status === "fail").length,
  warn: results.filter((r) => r.status === "warn").length,
  error: results.filter((r) => r.status === "error").length,
  results,
};

writeFileSync(`${OUT_DIR}/report.json`, JSON.stringify(summary, null, 2));
const md = [
  `# Sticky Category Bar Audit`,
  `Base: ${BASE}`,
  ``,
  `**${summary.pass}** pass · **${summary.fail}** fail · **${summary.warn}** warn · **${summary.error}** error (of ${summary.total})`,
  ``,
  `| Status | Route | Note |`,
  `| --- | --- | --- |`,
  ...results.map((r) => `| ${r.status} | \`${r.path}\` | ${r.note || ""} |`),
].join("\n");
writeFileSync(`${OUT_DIR}/report.md`, md);

console.log(`\nReports: ${OUT_DIR}/report.json  ${OUT_DIR}/report.md`);
process.exit(failed.length ? 1 : 0);
