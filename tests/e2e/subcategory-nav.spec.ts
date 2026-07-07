import { test, expect, Page } from "@playwright/test";

/**
 * End-to-end: open a category dropdown (desktop hover or mobile drawer),
 * click a subcategory, and assert title / canonical / og:url / BreadcrumbList
 * all self-reference the sub route.
 */

type Fixture = {
  parentLabel: string;
  parentPath: string;
  subLabel: string;
  subSlug: string;
};

const FIXTURES: Fixture[] = [
  { parentLabel: "Women's Health", parentPath: "/womens-health", subLabel: "Menopause Tests", subSlug: "menopause" },
  { parentLabel: "General Wellness", parentPath: "/wellness", subLabel: "Heart Health Tests", subSlug: "heart-health" },
  { parentLabel: "At Home", parentPath: "/at-home-tests", subLabel: "Women's Home Tests", subSlug: "womens" },
];

const SITE = "https://myhealthcheckup.co.uk";

async function assertSubcategorySEO(page: Page, fx: Fixture) {
  await page.waitForURL(new RegExp(`\\${fx.parentPath}\\?subcategory=${fx.subSlug}`));

  // Wait until Helmet has applied the subcategory-specific canonical (not just
  // the base one). This is the reliable settle signal for per-route head tags.
  await page.waitForFunction(
    (expected) => {
      const el = document.querySelector('link[rel="canonical"][data-rh="true"]') as HTMLLinkElement | null;
      return !!el && el.href === expected;
    },
    `${SITE}${fx.parentPath}?subcategory=${fx.subSlug}`,
    { timeout: 10_000 },
  );

  await expect(page).toHaveTitle(new RegExp(fx.subLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  const canonical = await page
    .locator('link[rel="canonical"][data-rh="true"]')
    .first()
    .getAttribute("href");
  expect(canonical).toBe(`${SITE}${fx.parentPath}?subcategory=${fx.subSlug}`);

  const ogUrl = await page
    .locator('meta[property="og:url"][data-rh="true"]')
    .first()
    .getAttribute("content");
  expect(ogUrl).toBe(canonical);

  // Visible breadcrumb reflects the subcategory.
  const breadcrumb = page.getByTestId("site-breadcrumb");
  await expect(breadcrumb).toContainText(fx.subLabel);

  // BreadcrumbList JSON-LD ends with the sub label.
  const jsonLdBlocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const crumbs = jsonLdBlocks
    .map((raw) => {
      try { return JSON.parse(raw); } catch { return null; }
    })
    .filter(Boolean)
    .flatMap((d) => (Array.isArray(d) ? d : [d]))
    .map((d) => d?.breadcrumb ?? d)
    .find((d) => d?.["@type"] === "BreadcrumbList");

  expect(crumbs, "BreadcrumbList JSON-LD missing").toBeTruthy();
  const items = crumbs.itemListElement as Array<{ name: string; item?: string }>;
  expect(items.length).toBeGreaterThanOrEqual(2);
  expect(items[items.length - 1].name).toBe(fx.subLabel);
  // Every non-final crumb should carry a linked item URL.
  for (const it of items.slice(0, -1)) {
    expect(it.item, `crumb '${it.name}' missing item URL`).toBeTruthy();
  }
}

test.describe("Subcategory navigation", () => {
  for (const fx of FIXTURES) {
    test(`desktop dropdown → ${fx.parentLabel} → ${fx.subLabel}`, async ({ page, isMobile }) => {
      test.skip(isMobile, "desktop-only flow");
      await page.goto("/");
      // Open the parent pill dropdown (hover triggers portal panel).
      const pill = page.getByRole("link", { name: fx.parentLabel, exact: true }).first();
      await pill.hover();
      const subLink = page.getByRole("link", { name: fx.subLabel, exact: true }).first();
      await subLink.waitFor({ state: "visible", timeout: 5_000 });
      await subLink.click();
      await assertSubcategorySEO(page, fx);
    });

    test(`mobile drawer → ${fx.parentLabel} → ${fx.subLabel}`, async ({ page, isMobile }) => {
      test.skip(!isMobile, "mobile-only flow");
      await page.goto("/");
      // Open mobile drawer. Match common labels for the hamburger trigger.
      const hamburger = page.getByRole("button", { name: /menu|open menu|navigation/i }).first();
      await hamburger.click();
      // Expand the parent row, then tap the sub link.
      const subLink = page.getByRole("link", { name: fx.subLabel, exact: true }).first();
      if (!(await subLink.isVisible().catch(() => false))) {
        const expander = page
          .getByRole("button", { name: new RegExp(`${fx.parentLabel}.*(expand|subcategor)`, "i") })
          .first();
        if (await expander.count()) await expander.click();
      }
      await subLink.waitFor({ state: "visible", timeout: 5_000 });
      await subLink.click();
      await assertSubcategorySEO(page, fx);
    });
  }
});
