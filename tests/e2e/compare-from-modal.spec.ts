import { test, expect } from "@playwright/test";

/**
 * End-to-end: open a provider test card's detail modal, add the test to the
 * compare list from inside the modal, and assert the user lands on
 * /compare/results with that test rendered in the comparison table.
 */

const CATALOGUE_PATH = "/providers/medichecks";

test.beforeEach(async ({ page }) => {
  // Start from a clean compare selection so assertions are unambiguous.
  await page.addInitScript(() => window.localStorage.removeItem("mhc:compare"));
});

test("adding a test from the detail modal lands on /compare/results with the item visible", async ({
  page,
}) => {
  await page.goto(CATALOGUE_PATH, { waitUntil: "domcontentloaded" });

  // Cards render asynchronously from Supabase; wait for the first one.
  const firstCompareButton = page
    .getByRole("button", { name: /add to compare/i })
    .first();
  await expect(firstCompareButton).toBeVisible({ timeout: 30_000 });

  // Open the detail modal by clicking the card itself (not its action buttons).
  const card = firstCompareButton.locator(
    "xpath=ancestor::*[.//button][last()]",
  );
  const testName = (await card.getByRole("heading").first().innerText()).trim();
  await card.getByRole("heading").first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(testName, { timeout: 10_000 });

  await dialog.getByRole("button", { name: /compare this test/i }).click();

  await page.waitForURL(/\/compare\/results/);

  // The selected test must be visible in the comparison table, and the empty
  // state must not be shown.
  await expect(page.getByText(/no tests selected yet/i)).toHaveCount(0);
  await expect(page.getByText(testName, { exact: false }).first()).toBeVisible({
    timeout: 15_000,
  });

  // The store is the source of truth for persistence across pages.
  const stored = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("mhc:compare") ?? "[]"),
  );
  expect(stored).toHaveLength(1);
  expect(String(stored[0].name)).toContain(testName.slice(0, 12));
});
