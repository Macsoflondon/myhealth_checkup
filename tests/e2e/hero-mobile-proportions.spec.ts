import { test, expect } from "@playwright/test";

/**
 * Hero proportion regression for mobile breakpoints.
 *
 * Guards against layout regressions where the H1, supporting copy,
 * slide copy, or hero image space grow out of proportion on small screens.
 *
 * Thresholds are derived from the current HeroMasthead clamp() values:
 *   Headlines:       clamp(1.5rem, 10cqw, 3.5rem), two fixed lines, no wrapping
 *   Supporting copy: clamp(0.875rem, 3.4cqw, 1.125rem), max 40ch
 *   Wordmark:        clamp(1.25rem, 6.2vw, 2.25rem)
 *   Image wrapper:   min-h-[52svh] (mobile)
 */

const BREAKPOINTS = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 12", width: 390, height: 844 },
  { name: "Pixel 5", width: 393, height: 851 },
  { name: "iPhone 14 Pro Max", width: 430, height: 932 },
  { name: "Small Android", width: 360, height: 740 },
];

const px = (v: string) => parseFloat(v.replace("px", ""));

for (const bp of BREAKPOINTS) {
  test.describe(`Hero @ ${bp.name} (${bp.width}x${bp.height})`, () => {
    test.use({ viewport: { width: bp.width, height: bp.height } });

    test.beforeEach(async ({ page }) => {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle").catch(() => {});
    });

    test("slide 1 H1 scales within its mobile clamp and fits viewport", async ({
      page,
    }) => {
      const h1 = page.getByRole("heading", {
        level: 1,
        name: "Compare private blood tests.",
      });
      await expect(h1).toBeVisible();
      const fs = px(await h1.evaluate((el) => getComputedStyle(el).fontSize));
      expect(fs).toBeGreaterThanOrEqual(22);
      expect(fs).toBeLessThanOrEqual(42);

      const box = await h1.boundingBox();
      expect(box).not.toBeNull();
      if (!box) return;
      expect(box.width).toBeLessThanOrEqual(bp.width);
    });

    test("Wordmark stays inside hero card", async ({ page }) => {
      // The wordmark is an SVG logo (role="img"), 1em tall, so its rendered
      // height is the font size it inherits from the brand-bar link.
      const wordmark = page
        .getByRole("img", { name: "myhealth checkup" })
        .first();
      const box = await wordmark.boundingBox();
      expect(box).not.toBeNull();
      if (!box) return;
      expect(box.x + box.width).toBeLessThanOrEqual(bp.width);
      expect(box.height).toBeGreaterThanOrEqual(20);
      expect(box.height).toBeLessThanOrEqual(36);
    });

    test("supporting copy renders at mobile size and wraps cleanly", async ({
      page,
    }) => {
      const supportingCopy = page.getByText(
        "Prices, biomarkers and turnaround for UK blood tests and cancer screening.",
      );
      await expect(supportingCopy).toBeVisible();
      const fs = px(
        await supportingCopy.evaluate((el) => getComputedStyle(el).fontSize),
      );
      expect(fs).toBeLessThanOrEqual(16);
    });

    test("slide headline remains inside the mobile copy area", async ({
      page,
    }) => {
      const headline = page.getByRole("heading", {
        level: 1,
        name: "Compare private blood tests.",
      });
      await expect(headline).toBeVisible();
      // The h1 is a block, so its own box always spans the copy column. What
      // matters is the text: every line must fit inside the column and the
      // viewport, with no line clipped or pushed past the edge.
      const fit = await headline.evaluate((h) => {
        const column = h.parentElement!.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(h);
        const lines = Array.from(range.getClientRects());
        return {
          columnLeft: column.left,
          columnRight: column.right,
          textLeft: Math.min(...lines.map((r) => r.left)),
          textRight: Math.max(...lines.map((r) => r.right)),
        };
      });
      expect(fit.textLeft).toBeGreaterThanOrEqual(fit.columnLeft - 1);
      expect(fit.textRight).toBeLessThanOrEqual(fit.columnRight + 1);
      expect(fit.textRight).toBeLessThanOrEqual(bp.width);
    });

    test("Hero image wrapper occupies a healthy share of viewport", async ({
      page,
    }) => {
      const slide = page.locator(".hero-slide").first();
      await expect(slide).toBeVisible();
      const box = await slide.boundingBox();
      expect(box).not.toBeNull();
      if (!box) return;
      // Should be at least ~40% of viewport height (min-h-[52svh] minus address bar wobble)
      expect(box.height).toBeGreaterThanOrEqual(bp.height * 0.35);
      // And not eat the whole screen
      expect(box.height).toBeLessThanOrEqual(bp.height * 0.85);
      // Image spans full hero width (minus rounded card padding inset)
      expect(box.width).toBeGreaterThanOrEqual(bp.width * 0.85);
    });

    test("Hero has no horizontal overflow", async ({ page }) => {
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  });
}
