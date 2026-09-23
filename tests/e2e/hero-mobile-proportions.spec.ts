import { test, expect } from "@playwright/test";

/**
 * Hero proportion regression for mobile breakpoints.
 *
 * Guards against layout regressions where the H1, supporting copy,
 * slide copy, or hero image space grow out of proportion on small screens.
 *
 * Thresholds are derived from the current HeroMasthead clamp() values:
 *   H1:              clamp(1.4rem, 7.1cqw, 3.25rem)
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
        name: "Compare private blood tests and cancer screening.",
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
      const wordmark = page.locator("text=myhealth").first();
      const box = await wordmark.boundingBox();
      expect(box).not.toBeNull();
      if (!box) return;
      expect(box.x + box.width).toBeLessThanOrEqual(bp.width);
      const fs = px(
        await wordmark.evaluate((el) => getComputedStyle(el).fontSize),
      );
      expect(fs).toBeGreaterThanOrEqual(20);
      expect(fs).toBeLessThanOrEqual(36);
    });

    test("supporting copy renders at mobile size and wraps cleanly", async ({
      page,
    }) => {
      const supportingCopy = page.getByText(
        "Prices, biomarkers and turnaround times from UKAS-accredited laboratories, side by side.",
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
        name: "Compare private blood tests and cancer screening.",
      });
      await expect(headline).toBeVisible();
      const box = await headline.boundingBox();
      expect(box).not.toBeNull();
      if (!box) return;
      expect(box!.width).toBeLessThanOrEqual(bp.width * 0.9);
    });

    test("Hero image wrapper occupies a healthy share of viewport", async ({
      page,
    }) => {
      const slide = page.locator("img.hero-slide").first();
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
