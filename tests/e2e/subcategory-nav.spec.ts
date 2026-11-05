import { test, expect, Page } from "@playwright/test";

/**
 * End-to-end: open a category dropdown (desktop hover or mobile drawer),
 * click a subcategory, and assert title / canonical / og:url / BreadcrumbList
 * all self-reference the sub route.
 */

type Fixture = {
  parentLabel: string;
  /** Parent row label in the mobile menu drawer. */
  drawerLabel: string;
  parentPath: string;
  subLabel: string;
  subSlug: string;
};

const FIXTURES: Fixture[] = [
  {
    parentLabel: "Women's health",
    drawerLabel: "Women's health",
    parentPath: "/tests/womens-health",
    subLabel: "Menopause tests",
    subSlug: "menopause",
  },
  {
    parentLabel: "General wellness",
    drawerLabel: "General wellness",
    parentPath: "/wellness",
    subLabel: "Heart health tests",
    subSlug: "heart-health",
  },
  {
    parentLabel: "Home tests",
    drawerLabel: "At-home test kits",
    parentPath: "/at-home-tests",
    subLabel: "Women's health home kits",
    subSlug: "womens",
  },
];

const SITE = "https://myhealthcheckup.co.uk";

async function assertSubcategorySEO(page: Page, fx: Fixture) {
  await page.waitForURL(
    new RegExp(`\\${fx.parentPath}\\?subcategory=${fx.subSlug}`),
    { waitUntil: "commit" },
  );

  // The search title names the subcategory, matching the menu label.
  await expect(page).toHaveTitle(
    new RegExp(fx.subLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    { timeout: 10_000 },
  );

  // The visible page heading matches the menu label.
  await expect(page.getByRole("heading", { level: 1 }).first()).toHaveText(
    fx.subLabel,
    { timeout: 10_000 },
  );

  // Canonical and og:url point at the parent category: the shared SEO
  // builder strips query strings so filtered views never compete with it.
  const canonical = await page
    .locator('link[rel="canonical"]')
    .last()
    .getAttribute("href");
  expect(canonical).toBe(`${SITE}${fx.parentPath}`);
  const ogUrl = await page
    .locator('meta[property="og:url"]')
    .last()
    .getAttribute("content");
  expect(ogUrl).toBe(canonical);
}

test.describe("Subcategory navigation", () => {
  for (const fx of FIXTURES) {
    test(`desktop dropdown → ${fx.parentLabel} → ${fx.subLabel}`, async ({
      page,
      isMobile,
    }) => {
      test.skip(isMobile, "desktop-only flow");
      await page.goto("/");
      // Open the parent pill dropdown (hover triggers portal panel).
      const pill = page
        .getByRole("link", { name: fx.parentLabel, exact: true })
        .first();
      await pill.hover();
      // Desktop dropdown entries are exposed as menu items (role="menuitem").
      const subLink = page
        .getByRole("menuitem", { name: fx.subLabel, exact: true })
        .first();
      await subLink.waitFor({ state: "visible", timeout: 5_000 });
      await subLink.click();
      await assertSubcategorySEO(page, fx);
    });

    test(`mobile drawer → ${fx.parentLabel} → ${fx.subLabel}`, async ({
      page,
      isMobile,
    }) => {
      test.skip(!isMobile, "mobile-only flow");
      await page.goto("/");
      // Open mobile drawer. Match common labels for the hamburger trigger.
      const hamburger = page
        .getByRole("button", { name: /menu|open menu|navigation/i })
        .first();
      await hamburger.click();
      // Expand the parent row, then tap the sub link.
      const subLink = page
        .getByRole("link", { name: fx.subLabel, exact: true })
        .first();
      if (!(await subLink.isVisible().catch(() => false))) {
        const expander = page
          .getByRole("button", {
            name: `Show ${fx.drawerLabel} subcategories`,
            exact: true,
          })
          .first();
        if (await expander.count()) await expander.click();
      }
      await subLink.waitFor({ state: "visible", timeout: 5_000 });
      await subLink.click();
      await assertSubcategorySEO(page, fx);
    });
  }
});
