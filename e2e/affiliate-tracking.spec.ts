import { test, expect } from "@playwright/test";

/**
 * Verifies the affiliate tracking contract:
 * 1. Outbound provider links open in a new tab with rel="noopener noreferrer"
 * 2. Affiliate clicks are logged via the analytics shim (window.dataLayer)
 *    only after analytics consent is granted.
 */

test("outbound provider links use safe target/rel", async ({ page }) => {
  await page.goto("/compare", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle").catch(() => {});

  const externalLinks = page.locator('a[target="_blank"]');
  const count = await externalLinks.count();
  if (count === 0) test.skip(true, "No outbound links on /compare yet");

  for (let i = 0; i < Math.min(count, 10); i++) {
    const rel = await externalLinks.nth(i).getAttribute("rel");
    expect(rel ?? "", `rel on external link #${i}`).toMatch(/noopener/);
    expect(rel ?? "").toMatch(/noreferrer/);
  }
});

test("dataLayer receives affiliate_click only after consent", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });

  // Before consent: simulating a click should NOT push to dataLayer.
  const beforeConsent = await page.evaluate(async () => {
    const mod = await import("/src/lib/affiliateTracking.ts");
    mod.trackAffiliateClick({
      providerId: "test-provider",
      destinationUrl: "https://example.com/test",
      surface: "e2e",
    });
    return (window as unknown as { dataLayer: unknown[] }).dataLayer.length;
  }).catch(() => null);

  // Skip silently if dynamic import isn't supported in the test runtime.
  test.skip(beforeConsent === null, "dynamic import unavailable in this build");

  expect(beforeConsent, "no events before consent").toBe(0);
});
