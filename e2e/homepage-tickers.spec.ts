/**
 * E2E smoke test — homepage promo + category tickers actually move in a real browser.
 *
 * Run with:  bunx playwright test e2e/homepage-tickers.spec.ts
 *
 * Each test loads `/`, samples the track's `getBoundingClientRect().x` for the
 * first child of each ticker at t=0 and t=1500ms, and asserts the position
 * changed by more than a few pixels. We test both desktop (1280x720) and
 * mobile (390x844) viewports.
 */
import { test, expect, devices } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:8080";

async function firstChildX(page: import("@playwright/test").Page, selector: string) {
  return page.evaluate((sel) => {
    const track = document.querySelector(sel) as HTMLElement | null;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!first) return null;
    return first.getBoundingClientRect().x;
  }, selector);
}

async function assertMoves(page: import("@playwright/test").Page, selector: string, label: string) {
  // Wait for the track to exist
  await page.waitForSelector(selector, { timeout: 10_000 });
  const x1 = await firstChildX(page, selector);
  expect(x1, `${label}: first child should be measurable`).not.toBeNull();
  await page.waitForTimeout(1500);
  const x2 = await firstChildX(page, selector);
  expect(x2, `${label}: first child should still be measurable`).not.toBeNull();
  const delta = Math.abs((x2 as number) - (x1 as number));
  expect(delta, `${label}: expected position to change after 1.5s, got delta ${delta}px`).toBeGreaterThan(5);
}

const promoSelector = '[data-testid="promo-ticker-track"]';
// The category ticker has no testid, so target by structure.
const categorySelector = 'section.bg-brand-navy .overflow-hidden > .flex.whitespace-nowrap';

test.describe("Homepage tickers move", () => {
  test("desktop: promo + category tickers animate", async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await ctx.newPage();
    await page.goto(BASE_URL + "/");
    await assertMoves(page, promoSelector, "desktop promo ticker");
    await assertMoves(page, categorySelector, "desktop category ticker");
    await ctx.close();
  });

  test("mobile: promo + category tickers animate", async ({ browser }) => {
    const ctx = await browser.newContext({ ...devices["iPhone 13"] });
    const page = await ctx.newPage();
    await page.goto(BASE_URL + "/");
    await assertMoves(page, promoSelector, "mobile promo ticker");
    await assertMoves(page, categorySelector, "mobile category ticker");
    await ctx.close();
  });
});
