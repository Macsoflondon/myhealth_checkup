import { test, expect } from "@playwright/test";

/**
 * Hero video loading order, checked in a real browser.
 *
 * The ~2.9 MB loop must not enter the DOM (and so must not start downloading)
 * until after the window "load" event. The photo paints first and stays the
 * LCP element; the video stays transparent until it fires "playing".
 */

declare global {
  interface Window {
    __heroTimeline?: { loadAt?: number; videoAt?: number };
  }
}

// Records when "load" fires and when a <video> first enters the DOM, from the
// very start of the document, before any app script runs.
const recordTimeline = () => {
  const t: { loadAt?: number; videoAt?: number } = {};
  window.__heroTimeline = t;
  window.addEventListener("load", () => {
    t.loadAt ??= performance.now();
  });
  new MutationObserver(() => {
    if (t.videoAt === undefined && document.querySelector("video")) {
      t.videoAt = performance.now();
    }
  }).observe(document, { childList: true, subtree: true });
};

// The floating menu trigger is portalled in only after hydration, so its
// presence means React effects (including the video gate) are running.
const waitForHydration = (page: import("@playwright/test").Page) =>
  page
    .getByTestId("sticky-menu-trigger")
    .waitFor({ state: "attached", timeout: 60_000 });

// A 1x1 transparent PNG.
const PIXEL = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

test.describe("Hero video", () => {
  // The dev server compiles on first request, so allow for a slow first load.
  test.setTimeout(120_000);

  // Images under /__l5e/ are served only by Lovable hosting, so a local dev
  // server answers 404 and the stale-asset guard reloads the page mid-test.
  // Locally, stand in a pixel for those images; video files are left alone.
  test.beforeEach(async ({ page, baseURL }) => {
    const host = new URL(baseURL ?? "http://localhost").hostname;
    if (host !== "localhost" && host !== "127.0.0.1") return;
    await page.route("**/__l5e/**", (route) =>
      route.request().resourceType() === "image"
        ? route.fulfill({ status: 200, contentType: "image/png", body: PIXEL })
        : route.fallback(),
    );
  });

  test("server HTML has no video element", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toContain('data-testid="hero-slide-1"');
    expect(html).not.toMatch(/<video\b/);
  });

  test("video is absent before window load and present after", async ({
    page,
  }) => {
    await page.addInitScript(recordTimeline);
    // Hold one image so "load" cannot fire until we release it, which gives
    // hydration time to run first.
    let release!: () => void;
    const held = new Promise<void>((r) => (release = r));
    let heldOne = false;
    await page.route("**/*", async (route) => {
      const req = route.request();
      if (
        !heldOne &&
        req.resourceType() === "image" &&
        !req.url().includes("hero-video-still")
      ) {
        heldOne = true;
        await held;
      }
      await route.fallback();
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(
      page.locator('[data-testid="hero-slide-1"] img'),
    ).toBeVisible();
    // Hydrate and let effects run while "load" is still held.
    await waitForHydration(page);
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => document.readyState)).not.toBe("complete");
    await expect(page.locator("video")).toHaveCount(0);

    release();
    await page.waitForLoadState("load");
    await expect(page.getByTestId("hero-video")).toHaveCount(1, {
      timeout: 15_000,
    });

    const t = await page.evaluate(() => window.__heroTimeline);
    expect(t?.loadAt).toBeDefined();
    expect(t?.videoAt).toBeDefined();
    expect(t!.videoAt!).toBeGreaterThan(t!.loadAt!);
  });

  test("video stays invisible until it plays and the photo is the LCP element", async ({
    page,
  }) => {
    // Block the video files so it can never reach "playing".
    await page.route("**/*", (route) =>
      route.request().resourceType() === "media"
        ? route.abort()
        : route.fallback(),
    );
    await page.addInitScript(() => {
      const w = window as Window & { __lcp?: string };
      new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1) as
          (PerformanceEntry & { element?: Element | null }) | undefined;
        w.__lcp = last?.element?.tagName ?? w.__lcp;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    });
    await page.goto("/", { waitUntil: "load" });
    await waitForHydration(page);
    const video = page.getByTestId("hero-video");
    await expect(video).toHaveCount(1, { timeout: 15_000 });
    await expect(video).toHaveCSS("opacity", "0");
    await expect(
      page.locator('[data-testid="hero-slide-1"] img'),
    ).toBeVisible();

    const lcp = await page.evaluate(
      () => (window as Window & { __lcp?: string }).__lcp,
    );
    expect(lcp).toBe("IMG");
  });

  test("reduced motion keeps the photo and never mounts the video", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "load" });
    await waitForHydration(page);
    await page.waitForTimeout(4500);
    await expect(page.locator("video")).toHaveCount(0);
    await expect(
      page.locator('[data-testid="hero-slide-1"] img'),
    ).toBeVisible();
  });

  test("Save-Data keeps the photo and never mounts the video", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: { saveData: true, effectiveType: "4g" },
      });
    });
    await page.goto("/", { waitUntil: "load" });
    await waitForHydration(page);
    await page.waitForTimeout(4500);
    await expect(page.locator("video")).toHaveCount(0);
  });
});
