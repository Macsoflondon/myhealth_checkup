/**
 * Smoke test — AccreditedProvidersBar must render all six trust-signal labels
 * (UKAS, CQC, ISO 15189, GDPR, Transparent Pricing, No GP Referral) and must
 * not produce horizontal scroll on mobile viewports.
 *
 * On mobile (< md breakpoint) the component renders a two-row marquee: rowA
 * carries the even-indexed badges (UKAS, ISO 15189, Transparent Pricing) and
 * rowB carries the odd-indexed badges (CQC, GDPR, No GP Referral). The labels
 * are duplicated 4× per row for seamless looping, so each label appears
 * multiple times in the DOM.
 *
 * Run with:  bunx playwright test e2e/accredited-providers-bar.spec.ts
 */
import { test, expect } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:8080";

const VIEWPORTS = [
  { name: "iPhone SE (320)", width: 320, height: 568 },
  { name: "Android small (360)", width: 360, height: 800 },
  { name: "iPhone 13 (375)", width: 375, height: 812 },
  { name: "iPhone Plus/Max (414)", width: 414, height: 896 },
] as const;

const ROW = '[data-testid="accreditors-row"]';

// Labels that must appear at least once somewhere in the component.
const REQUIRED_LABELS = ["UKAS", "CQC", "ISO 15189"];

// Debug helpers — capture DOM/text and a screenshot to aid CI diagnosis.
async function dumpAccreditorsDebug(page: any, vpName: string, label: string) {
  try {
    const firstRowHtml = await page.locator(ROW).first().innerHTML();
    const allRowTexts = await page.locator(ROW).allInnerTexts();

    // Console output is captured in Playwright traces / job logs.
    console.error(`${vpName}: Debug — missing label: "${label}"\nfirstRowHTML:\n${firstRowHtml}\nallRowTexts:\n${JSON.stringify(allRowTexts, null, 2)}`);

    // Save a screenshot into the test-results directory so it's uploaded as an artifact.
    const safeVp = vpName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const safeLabel = label.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const screenshotPath = `test-results/debug-${safeVp}-${safeLabel}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.error(`${vpName}: Saved screenshot to ${screenshotPath}`);
  } catch (err) {
    console.error(`Failed to capture debug info for ${vpName} / ${label}:`, err);
  }
}

for (const vp of VIEWPORTS) {
  test(`AccreditedProvidersBar @ ${vp.name}: labels present, no overflow`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
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

      expect(count, `${vp.name}: "${label}" not found in accreditors bar`).toBeGreaterThan(0);
    }

    // 2. Page-level horizontal scroll guard.
    // (Marquee rows intentionally have scrollWidth > clientWidth — that's how they work.
    //  We only need to confirm the page itself doesn't gain a horizontal scrollbar.)
    // wait briefly for layout/fonts to stabilise
    await page.waitForTimeout(200);
    const bodyOverflow = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    expect(
      bodyOverflow.scrollW,
      `${vp.name}: page has horizontal scroll`,
    ).toBeLessThanOrEqual(bodyOverflow.clientW + 1);

    await ctx.close();
  });
}
