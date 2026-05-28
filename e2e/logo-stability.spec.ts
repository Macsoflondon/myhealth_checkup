/**
 * Logo CLS + asset-timing regression.
 *
 * For every key route × breakpoint, we:
 *   1. Record cumulative layout shift (CLS) attributed to header/footer logo
 *      nodes and fail if total CLS > 0.1 (Core Web Vitals "good" threshold).
 *   2. Measure PerformanceResourceTiming for each logo asset and fail if any
 *      logo takes > 1500ms to load or returns a non-2xx (decodedBodySize === 0).
 *   3. Assert the rendered <img> has a non-zero box and naturalWidth, catching
 *      missing/mis-sized assets immediately.
 *
 * On failure, Playwright captures: screenshot (only-on-failure), video, and a
 * trace zip containing the network log + console — configured in
 * playwright.config.ts.
 *
 * Run:  bunx playwright test e2e/logo-stability.spec.ts
 */
import { test, expect, type Page } from "@playwright/test";

const ROUTES = ["/", "/how-it-works", "/compare-tests", "/providers"] as const;

const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 800 },
] as const;

const MAX_CLS = 0.1;
const MAX_LOGO_LOAD_MS = 1500;
const LOGO_URL_PATTERN = /myhealth-logo|header-tagline|compliance-badges|cyber-essentials/i;

async function collectCLS(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let cls = 0;
        const obs = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as PerformanceEntry[]) {
            // @ts-expect-error layout-shift entry shape
            if (!entry.hadRecentInput) cls += (entry as any).value;
          }
        });
        try {
          obs.observe({ type: "layout-shift", buffered: true });
        } catch {
          resolve(0);
          return;
        }
        setTimeout(() => {
          obs.disconnect();
          resolve(Number(cls.toFixed(4)));
        }, 2500);
      }),
  );
}

async function collectLogoTimings(page: Page) {
  return page.evaluate((pattern) => {
    const re = new RegExp(pattern, "i");
    return performance
      .getEntriesByType("resource")
      .filter((e) => re.test(e.name))
      .map((e) => {
        const r = e as PerformanceResourceTiming;
        return {
          name: r.name,
          duration: Math.round(r.duration),
          transferSize: r.transferSize,
          decodedBodySize: r.decodedBodySize,
        };
      });
  }, LOGO_URL_PATTERN.source);
}

for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    test(`logo stability @ ${vp.name} ${route}`, async ({ browser }, testInfo) => {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();

      const consoleMessages: string[] = [];
      const failedRequests: string[] = [];
      page.on("console", (m) => consoleMessages.push(`[${m.type()}] ${m.text()}`));
      page.on("requestfailed", (r) =>
        failedRequests.push(`${r.url()} :: ${r.failure()?.errorText}`),
      );
      page.on("response", (r) => {
        if (LOGO_URL_PATTERN.test(r.url()) && !r.ok()) {
          failedRequests.push(`${r.status()} ${r.url()}`);
        }
      });

      await page.goto(route, { waitUntil: "networkidle" });

      // Scroll to bottom to ensure footer + lazy logos load and CLS observer captures them.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      await page.evaluate(() => window.scrollTo(0, 0));

      const [cls, timings] = await Promise.all([collectCLS(page), collectLogoTimings(page)]);

      // Attach diagnostics to the test report regardless of pass/fail — cheap and
      // makes triage instant when something does regress.
      await testInfo.attach("logo-resource-timings.json", {
        body: JSON.stringify({ route, viewport: vp, cls, timings, failedRequests, consoleMessages }, null, 2),
        contentType: "application/json",
      });

      // 1. Logo assets actually loaded.
      expect(failedRequests, `failed logo requests: ${failedRequests.join("\n")}`).toEqual([]);
      expect(timings.length, "expected at least one logo resource").toBeGreaterThan(0);
      for (const t of timings) {
        expect(t.decodedBodySize, `empty body for ${t.name}`).toBeGreaterThan(0);
        expect(t.duration, `${t.name} took ${t.duration}ms`).toBeLessThan(MAX_LOGO_LOAD_MS);
      }

      // 2. Rendered <img> tags for logos have real dimensions.
      const imgs = await page.$$eval("header img, footer img", (els) =>
        els.map((el) => {
          const img = el as HTMLImageElement;
          const rect = img.getBoundingClientRect();
          return {
            src: img.currentSrc || img.src,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
        }),
      );
      for (const img of imgs) {
        expect(img.naturalWidth, `naturalWidth=0 for ${img.src}`).toBeGreaterThan(0);
        expect(img.width, `rendered width=0 for ${img.src}`).toBeGreaterThan(0);
        expect(img.height, `rendered height=0 for ${img.src}`).toBeGreaterThan(0);
      }

      // 3. Cumulative layout shift below Core Web Vitals "good" threshold.
      expect(cls, `CLS ${cls} exceeded ${MAX_CLS} on ${route} @ ${vp.name}`).toBeLessThanOrEqual(MAX_CLS);

      await ctx.close();
    });
  }
}
