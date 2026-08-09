/**
 * Smoke test — AccreditedProvidersBar must render all required trust-signal labels
 * (UKAS, CQC, ISO 15189) and must not produce horizontal scroll on mobile viewports.
 *
 * The component renders a static grid of badge pills (data-testid="accreditors-static-row").
 *
 * Run with:  bunx playwright test tests/e2e/accredited-providers-bar.spec.ts
 */
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:8080";

const VIEWPORTS = [
  { name: "iPhone SE (320)", width: 320, height: 568 },
  { name: "Android small (360)", width: 360, height: 800 },
  { name: "iPhone 13 (375)", width: 375, height: 812 },
  { name: "iPhone Plus/Max (414)", width: 414, height: 896 },
] as const;

const ROW = '[data-testid="accreditors-static-row"]';

// Labels that must appear at least once somewhere in the component.
const REQUIRED_LABELS = ["UKAS", "CQC", "ISO 15189"];

// Debug helpers — capture DOM/text and a screenshot to aid CI diagnosis.
async function dumpAccreditorsDebug(page: any, vpName: string, label: string) {
  try {
    const firstRowHtml = await page.locator(ROW).first().innerHTML();
    const allRowTexts = await page.locator(ROW).allInnerTexts();

    // Console output is captured in Playwright traces / job logs.
    console.error(
      `${vpName}: Debug — missing label: "${label}"\nfirstRowHTML:\n${firstRowHtml}\nallRowTexts:\n${JSON.stringify(allRowTexts, null, 2)}`,
    );

    // Save a screenshot into the test-results directory so it's uploaded as an artifact.
    const safeVp = vpName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const safeLabel = label.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const screenshotPath = `test-results/debug-${safeVp}-${safeLabel}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.error(`${vpName}: Saved screenshot to ${screenshotPath}`);
  } catch (err) {
    console.error(
      `Failed to capture debug info for ${vpName} / ${label}:`,
      err,
    );
  }
}

for (const vp of VIEWPORTS) {
  test(`AccreditedProvidersBar @ ${vp.name}: labels present, no overflow`, async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await ctx.newPage();
    await page.goto(BASE_URL + "/");
    await page.waitForSelector(ROW, { timeout: 10_000 });

    // 1. Each required label appears at least once in the marquee rows.
    for (const label of REQUIRED_LABELS) {
      // Use text-based locator rather than a presentational class to be more robust.
      const count = await page.locator(`${ROW} >> text=${label}`).count();

      if (count === 0) {
        await dumpAccreditorsDebug(page, vp.name, label);
      }

      expect(
        count,
        `${vp.name}: "${label}" not found in accreditors bar`,
      ).toBeGreaterThan(0);
    }

    // 2. Horizontal overflow guard.
    //
    // The DOM is queryable before the dev server's injected stylesheet applies, and an
    // unstyled frame reports the hero image at its intrinsic 1920px plus the browser's
    // default 8px body margin — 1928px at every viewport. Wait for Tailwind's preflight
    // (which zeroes that margin) before measuring anything.
    await page.waitForFunction(
      () => getComputedStyle(document.body).marginLeft === "0px",
      undefined,
      { timeout: 10_000 },
    );
    await page.evaluate(() => document.fonts.ready);

    // html/body carry `overflow-x: clip`, so documentElement.scrollWidth can never exceed
    // clientWidth on a styled page — asserting on it would pass no matter how far content
    // spills. Instead, look for elements extending past the viewport that are NOT inside a
    // clipping ancestor. Ticker tracks are legitimately wider than their container and sit
    // inside `overflow-hidden`, so they're excluded; content that genuinely spills is not.
    // Poll so late-loading imagery gets a chance to settle.
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const vw = document.documentElement.clientWidth;
            // Stop before <body>: the page-level clip is what hides the overflow we're
            // looking for, so it must not count as intentional clipping.
            const clippingValues = ["hidden", "clip", "auto", "scroll"];
            const isClipped = (el: Element) => {
              let p = el.parentElement;
              while (p && p !== document.body) {
                if (clippingValues.includes(getComputedStyle(p).overflowX))
                  return true;
                p = p.parentElement;
              }
              return false;
            };
            return Array.from(document.querySelectorAll("body *")).filter(
              (el) => {
                const r = el.getBoundingClientRect();
                if (r.width === 0 || r.height === 0) return false;
                if (r.right <= vw + 1 && r.left >= -1) return false;
                return !isClipped(el);
              },
            ).length;
          }),
        {
          message: `${vp.name}: elements spill outside the viewport`,
          timeout: 10_000,
        },
      )
      .toBe(0);

    await ctx.close();
  });
}
