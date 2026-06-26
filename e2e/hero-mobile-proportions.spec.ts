import { test, expect, devices } from "@playwright/test";

/**
 * Hero proportion regression for mobile breakpoints.
 *
 * Guards against the "disgusting" layout regressions where the H1, slogan,
 * label bubble, or hero image space grow out of proportion on small screens.
 *
 * Thresholds are derived from the current HeroMasthead clamp() values:
 *   H1 "Compare.":   clamp(2.5rem, 12vw, 11rem)
 *   Wordmark:        clamp(1.25rem, 6.2vw, 2.25rem)
 *   Slogan:          text-[11px] sm:text-lg (mobile = 11px)
 *   Slide label:     text-[11px] sm:text-lg md:text-2xl (mobile = 11px)
 *   Image wrapper:   min-h-[52svh] (mobile)
 */

const BREAKPOINTS = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 12", width: 390, height: 844 },
  { name: "Pixel 5",   width: 393, height: 851 },
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

    test("H1 'Compare.' scales within mobile clamp and fits viewport", async ({ page }) => {
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible();
      const fs = px(await h1.evaluate((el) => getComputedStyle(el).fontSize));
      // clamp floor 2.5rem = 40px, expected ≈ 12vw on mobile
      const expected = 0.12 * bp.width;
      expect(fs).toBeGreaterThanOrEqual(40);
      expect(fs).toBeLessThanOrEqual(Math.max(expected + 12, 80));

      const box = await h1.boundingBox();
      expect(box!.width).toBeLessThanOrEqual(bp.width);
    });

    test("Wordmark stays inside hero card", async ({ page }) => {
      const wordmark = page.locator("text=myhealth").first();
      const box = await wordmark.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x + box!.width).toBeLessThanOrEqual(bp.width);
      const fs = px(await wordmark.evaluate((el) => getComputedStyle(el).fontSize));
      expect(fs).toBeGreaterThanOrEqual(20);
      expect(fs).toBeLessThanOrEqual(36);
    });

    test("Slogan renders at mobile size and wraps cleanly", async ({ page }) => {
      const slogan = page.locator("text=One trusted platform").first();
      await expect(slogan).toBeVisible();
      const fs = px(await slogan.evaluate((el) => getComputedStyle(el).fontSize));
      expect(fs).toBeLessThanOrEqual(14); // mobile floor before sm breakpoint
    });

    test("Slide label bubble is right-sized", async ({ page }) => {
      // Bubble contains the rotating slide label text.
      const bubble = page.locator('div.absolute span:has-text("Stay ahead"), div.absolute span:has-text("Clinics"), div.absolute span:has-text("Active"), div.absolute span:has-text("Find."), div.absolute span:has-text("Easy At Home")').first();
      await expect(bubble).toBeVisible();
      const fs = px(await bubble.evaluate((el) => getComputedStyle(el).fontSize));
      expect(fs).toBeLessThanOrEqual(14);
      const box = await bubble.boundingBox();
      expect(box!.width).toBeLessThanOrEqual(bp.width * 0.9);
    });

    test("Hero image wrapper occupies a healthy share of viewport", async ({ page }) => {
      const slide = page.locator("img.hero-slide").first();
      await expect(slide).toBeVisible();
      const box = await slide.boundingBox();
      expect(box).not.toBeNull();
      // Should be at least ~40% of viewport height (min-h-[52svh] minus address bar wobble)
      expect(box!.height).toBeGreaterThanOrEqual(bp.height * 0.35);
      // And not eat the whole screen
      expect(box!.height).toBeLessThanOrEqual(bp.height * 0.85);
      // Image spans full hero width (minus rounded card padding inset)
      expect(box!.width).toBeGreaterThanOrEqual(bp.width * 0.85);
    });

    test("Hero has no horizontal overflow", async ({ page }) => {
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  });
}
