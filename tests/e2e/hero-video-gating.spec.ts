import { test, expect, type Page } from "@playwright/test";

/**
 * The hero loop is a desktop-only enhancement. Phones (below md), reduced-
 * motion visitors and Save-Data visitors get the still photo only: no <video>
 * element and no video request at all.
 */

const HERO_STILL = 'img[fetchpriority="high"], picture img';

function trackVideoRequests(page: Page): string[] {
  const urls: string[] = [];
  page.on("request", (r) => {
    if (/\.(mp4|webm)(\?|$)/i.test(r.url())) urls.push(r.url());
  });
  return urls;
}

async function settle(page: Page) {
  // The video mounts after window load + idle; wait for load and one idle tick.
  await page.waitForFunction(() => document.readyState === "complete");
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const w = window as Window & {
          requestIdleCallback?: (
            cb: () => void,
            o?: { timeout: number },
          ) => number;
        };
        if (w.requestIdleCallback)
          w.requestIdleCallback(() => resolve(), { timeout: 3500 });
        else setTimeout(resolve, 1600);
      }),
  );
}

test.describe("Hero video gating", () => {
  for (const width of [360, 390, 767]) {
    test(`phone width ${width}px renders the still only`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      const videos = trackVideoRequests(page);
      await page.goto("/");
      await expect(page.locator(HERO_STILL).first()).toBeVisible();
      await settle(page);
      await expect(page.locator("video")).toHaveCount(0);
      expect(videos).toEqual([]);
    });
  }

  test("reduced motion at desktop width renders the still only", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 900 });
    const videos = trackVideoRequests(page);
    await page.goto("/");
    await settle(page);
    await expect(page.locator("video")).toHaveCount(0);
    expect(videos).toEqual([]);
  });

  test("Save-Data at desktop width renders the still only", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        get: () => ({ saveData: true, effectiveType: "4g" }),
      });
    });
    await page.setViewportSize({ width: 1280, height: 900 });
    const videos = trackVideoRequests(page);
    await page.goto("/");
    await settle(page);
    await expect(page.locator("video")).toHaveCount(0);
    expect(videos).toEqual([]);
  });

  test("desktop keeps the video loop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await expect(page.locator("video")).toHaveCount(1, { timeout: 15000 });
  });
});
