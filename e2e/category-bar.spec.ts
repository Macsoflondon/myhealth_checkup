/**
 * Playwright e2e for the Browse-by-Category bar.
 * Run via: bunx playwright test e2e/category-bar.spec.ts
 *
 * Expects the Vite dev server to be running on http://localhost:8080.
 */
import { test, expect, Page } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:8080";

const EXPECTED = [
  { name: "Most Popular Tests", path: "/popular-tests" },
  { name: "General Wellness", path: "/wellness" },
  { name: "Women's Health", path: "/womens-health" },
  { name: "Men's Health", path: "/mens-health" },
  { name: "Sports-Fitness Health", path: "/sports-performance" },
  { name: "Fertility - Prenatal", path: "/fertility-tests" },
  { name: "Cancer Screening", path: "/tests/cancer" },
  { name: "At Home", path: "/at-home-tests" },
];

async function readDesktopPills(page: Page) {
  return page.$$eval('[data-testid="category-pill"]', (els) =>
    els.map((el) => ({
      name: el.getAttribute("data-category") ?? "",
      href: (el as HTMLAnchorElement).getAttribute("href") ?? "",
    }))
  );
}

async function readMobilePills(page: Page) {
  return page.$$eval('[data-testid="mobile-category-pill"]', (els) =>
    els.map((el) => ({
      name: el.getAttribute("data-category") ?? "",
      href: (el as HTMLAnchorElement).getAttribute("href") ?? "",
    }))
  );
}

test.describe("category bar @ desktop", () => {
  test.use({ viewport: { width: 1280, height: 1800 } });

  test("slug parity, sticky glide and routing", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('[data-testid="browse-by-category-bar"]');

    // 1. Slug parity with primaryNavigationItems
    const pills = await readDesktopPills(page);
    expect(pills).toEqual(EXPECTED.map((e) => ({ name: e.name, href: e.path })));

    // 2. No overlap between last pill and right cluster
    const overlap = await page.evaluate(() => {
      const pills = document.querySelectorAll('[data-testid="category-pill"]');
      const cluster = document.querySelector('[data-testid="category-bar-right-cluster"]');
      if (!pills.length || !cluster) return null;
      const last = pills[pills.length - 1].getBoundingClientRect();
      const c = cluster.getBoundingClientRect();
      return { lastRight: last.right, clusterLeft: c.left };
    });
    expect(overlap).not.toBeNull();
    // The scroll strip clips overflow, so last pill should never visually
    // intrude into the right cluster.
    expect(overlap!.lastRight).toBeLessThanOrEqual(overlap!.clusterLeft + 1);

    // 3. Scroll: sticky pin
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.waitForTimeout(400);
    const stuckTop = await page.evaluate(
      () =>
        document
          .querySelector('[data-testid="browse-by-category-bar"]')!
          .getBoundingClientRect().top
    );
    expect(Math.abs(stuckTop)).toBeLessThanOrEqual(2);

    // 4. Flicker check — sample top across frames while scrolling back
    const samples: number[] = await page.evaluate(
      () =>
        new Promise<number[]>((resolve) => {
          const out: number[] = [];
          const el = document.querySelector(
            '[data-testid="browse-by-category-bar"]'
          ) as HTMLElement;
          let frame = 0;
          const step = () => {
            window.scrollTo(0, Math.max(0, 1400 - frame * 80));
            out.push(el.getBoundingClientRect().top);
            frame++;
            if (frame < 20) requestAnimationFrame(step);
            else resolve(out);
          };
          requestAnimationFrame(step);
        })
    );
    // Adjacent-frame delta should never spike — true flicker would jump >50px.
    const deltas = samples.slice(1).map((v, i) => Math.abs(v - samples[i]));
    expect(Math.max(...deltas)).toBeLessThan(120);

    // 5. Routing — visit each pill and assert URL
    for (const { name, path } of EXPECTED) {
      await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(`[data-category="${name}"]`);
      await Promise.all([
        page.waitForURL(`**${path}`, { timeout: 10_000 }),
        page.click(`[data-category="${name}"]`),
      ]);
      expect(new URL(page.url()).pathname).toBe(path);
    }
  });
});

test.describe("category bar @ mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hamburger exposes categories and routes correctly", async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('[data-testid="browse-by-category-bar"]');

    // On mobile the desktop pill strip is hidden.
    await expect(page.locator('[data-testid="category-pill-strip"]')).toBeHidden();

    // Hamburger is visible.
    const hamburger = page.locator('[data-testid="category-hamburger"]');
    await expect(hamburger).toBeVisible();

    // Open the sheet.
    await hamburger.click();
    await page.waitForSelector('[data-testid="mobile-category-sheet"]');

    // Sheet contains the expected category links.
    const pills = await readMobilePills(page);
    expect(pills).toEqual(EXPECTED.map((e) => ({ name: e.name, href: e.path })));

    // Routing from the sheet works.
    for (const { name, path } of EXPECTED) {
      await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
      await hamburger.click();
      await page.waitForSelector(`[data-testid="mobile-category-pill"][data-category="${name}"]`);
      await Promise.all([
        page.waitForURL(`**${path}`, { timeout: 10_000 }),
        page.click(`[data-testid="mobile-category-pill"][data-category="${name}"]`),
      ]);
      expect(new URL(page.url()).pathname).toBe(path);
    }

    // Sticky pin still works on mobile.
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => window.scrollTo(0, 1400));
    await page.waitForTimeout(400);
    const stuckTop = await page.evaluate(
      () =>
        document
          .querySelector('[data-testid="browse-by-category-bar"]')!
          .getBoundingClientRect().top
    );
    expect(Math.abs(stuckTop)).toBeLessThanOrEqual(2);
  });
});
