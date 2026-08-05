import { test, expect } from "@playwright/test";

/**
 * End-to-end: open a test's detail modal (ProviderTestDetailModal, rendered by
 * the homepage provider showcase), add the test to compare from inside the
 * modal, and assert the user lands on /compare/results with that test visible.
 */

test.beforeEach(async ({ page }) => {
  // Start from a clean compare selection so assertions are unambiguous.
  await page.addInitScript(() => window.localStorage.removeItem("mhc:compare"));
});

test("adding a test from the detail modal lands on /compare/results with the item visible", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // The showcase is lazily mounted below the fold.
  const detailsTrigger = page
    .getByRole("button", { name: /^View details for /i })
    .first();
  await detailsTrigger.scrollIntoViewIfNeeded();
  await expect(detailsTrigger).toBeVisible({ timeout: 30_000 });

  const label = (await detailsTrigger.getAttribute("aria-label")) ?? "";
  const testName = label.replace(/^View details for /i, "").trim();
  expect(testName.length).toBeGreaterThan(0);

  await detailsTrigger.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(testName);

  await dialog.getByRole("button", { name: /compare this test/i }).click();

  await page.waitForURL(/\/compare\/results/);

  // The comparison table must render the selected test, not the empty state.
  await expect(page.getByText(/no tests selected yet/i)).toHaveCount(0);
  await expect(page.getByText(testName, { exact: false }).first()).toBeVisible({
    timeout: 15_000,
  });

  // The store backs persistence across pages — verify it holds exactly this test.
  const stored = await page.evaluate(
    () =>
      JSON.parse(window.localStorage.getItem("mhc:compare") ?? "[]") as Array<{
        name: string;
      }>,
  );
  expect(stored).toHaveLength(1);
  expect(stored[0].name).toContain(testName.slice(0, 12));
});
