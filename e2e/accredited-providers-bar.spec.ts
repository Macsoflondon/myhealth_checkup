/**
 * Visual regression — AccreditedProvidersBar must keep UKAS / CQC / ISO 15189
 * on a single row across the common iPhone widths. No horizontal scroll, all
 * three labels share the same y-coordinate (one visual row).
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

for (const vp of VIEWPORTS) {
  test(`AccreditedProvidersBar @ ${vp.name}: single row, no overflow`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.goto(BASE_URL + "/");
    await page.waitForSelector(ROW, { timeout: 10_000 });

    // 1. All three labels on the same visual row.
    const tops = await page.$$eval(
      `${ROW} .font-bold`,
      (els) =>
        els
          .filter((el) => /UKAS|CQC|ISO 15189/.test(el.textContent ?? ""))
          .map((el) => Math.round(el.getBoundingClientRect().top)),
    );
    expect(tops, `${vp.name}: expected 3 accreditor labels`).toHaveLength(3);
    expect(new Set(tops).size, `${vp.name}: labels should share one y, got ${tops.join(",")}`).toBe(1);

    // 2. No horizontal overflow on the row.
    const overflow = await page.$eval(ROW, (el) => ({
      scrollW: el.scrollWidth,
      clientW: el.clientWidth,
    }));
    expect(
      overflow.scrollW,
      `${vp.name}: row overflows (${overflow.scrollW} > ${overflow.clientW})`,
    ).toBeLessThanOrEqual(overflow.clientW + 1);

    // 3. Page-level horizontal scroll guard.
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
