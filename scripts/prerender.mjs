/**
 * Prerender static routes by snapshotting the running app with Playwright.
 *
 * Usage:
 *   1. bun run build               # produces dist/
 *   2. bun run preview &           # serve dist/ on http://localhost:4173
 *   3. bun run prerender           # snapshots ~80 routes into dist/
 *
 * Or, against a deployed preview URL:
 *   PRERENDER_BASE_URL=https://preview.myhealthcheckup.co.uk bun run prerender
 *
 * Output: writes dist/<route>/index.html for each route.
 * The Cloudflare Pages middleware (functions/_middleware.ts) reads these
 * snapshots and serves them to bot user agents only.
 */

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { STATIC_ROUTES } from "./prerender-routes.mjs";

const BASE_URL = process.env.PRERENDER_BASE_URL ?? "http://localhost:4173";
const DIST = path.resolve(process.cwd(), "dist");
const CONCURRENCY = Number(process.env.PRERENDER_CONCURRENCY ?? 4);
const TIMEOUT_MS = 30_000;

if (!existsSync(DIST)) {
  console.error(`✘ dist/ not found. Run \`bun run build\` first.`);
  process.exit(1);
}

console.log(`▶ Prerendering ${STATIC_ROUTES.length} routes from ${BASE_URL}`);
console.log(`  Concurrency: ${CONCURRENCY}, output: ${DIST}`);

const browser = await chromium.launch();
const context = await browser.newContext({
  // Mark these requests so the app can opt out of analytics / heavy effects
  // if it wants to (we don't currently — keep this for future use).
  userAgent: "Mozilla/5.0 (compatible; MHC-Prerenderer/1.0; +https://www.myhealthcheckup.co.uk)",
});

let succeeded = 0;
let failed = 0;
const failures = [];

async function snapshot(route) {
  const page = await context.newPage();
  try {
    const url = `${BASE_URL}${route}`;
    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: TIMEOUT_MS,
    });

    if (!response || response.status() >= 400) {
      throw new Error(`HTTP ${response?.status() ?? "no response"}`);
    }

    // Wait briefly for Helmet to flush and for the React tree to settle.
    await page.waitForFunction(
      () => document.querySelector("#root")?.children.length > 0,
      { timeout: 10_000 }
    );

    // Pull the rendered HTML *after* React + Helmet have run.
    const html = await page.content();

    // Write to dist/<route>/index.html (root → dist/index.html).
    const outPath =
      route === "/"
        ? path.join(DIST, "index.html")
        : path.join(DIST, route.replace(/^\//, ""), "index.html");

    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");

    succeeded++;
    process.stdout.write(`  ✔ ${route}\n`);
  } catch (err) {
    failed++;
    failures.push({ route, error: err.message });
    process.stdout.write(`  ✘ ${route} — ${err.message}\n`);
  } finally {
    await page.close();
  }
}

// Simple worker pool
const queue = [...STATIC_ROUTES];
const workers = Array.from({ length: CONCURRENCY }, async () => {
  while (queue.length) {
    const route = queue.shift();
    if (route) await snapshot(route);
  }
});

await Promise.all(workers);
await browser.close();

console.log(`\n▶ Done: ${succeeded} succeeded, ${failed} failed`);
if (failures.length) {
  console.log(`\nFailed routes:`);
  for (const f of failures) console.log(`  - ${f.route}: ${f.error}`);
  process.exit(1);
}
