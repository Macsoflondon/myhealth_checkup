import { test, expect } from "@playwright/test";

/**
 * Pre-launch smoke: every critical route must render without a runtime error
 * and ship an indexable <title>. If any of these fail, the deploy is broken.
 */
const ROUTES = [
  "/",
  "/compare",
  "/compare/symptoms",
  "/compare/goals",
  "/find-clinic",
  "/biomarkers",
  "/faqs",
  "/about",
  "/contact",
  "/how-it-works",
  "/how-we-rank",
  "/about/medical-review",
  "/privacy-policy",
  "/terms-conditions",
  "/cookie-policy",
];

for (const path of ROUTES) {
  test(`renders ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `HTTP status for ${path}`).toBeLessThan(400);

    // Wait for hydration so Helmet has populated <title>.
    await page.waitForLoadState("networkidle").catch(() => {});

    const title = await page.title();
    expect(title.length, `title length for ${path}`).toBeGreaterThan(10);
    expect(title.toLowerCase()).not.toContain("lovable");

    const h1Count = await page.locator("h1").count();
    expect(h1Count, `h1 count for ${path}`).toBeGreaterThanOrEqual(1);

    expect(errors, `runtime errors on ${path}`).toEqual([]);
  });
}
