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

test.setTimeout(90_000);

test("adding a test from the detail modal lands on /compare/results with the item visible", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // The showcase is lazily mounted once it scrolls into view.
  const detailsTrigger = page
    .getByRole("button", { name: /^View details for /i })
    .first();

  for (let i = 0; i < 20 && (await detailsTrigger.count()) === 0; i++) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(500);
  }

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

test("a /compare/results deep link rehydrates the selection in a fresh session", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const detailsTrigger = page
    .getByRole("button", { name: /^View details for /i })
    .first();
  for (let i = 0; i < 20 && (await detailsTrigger.count()) === 0; i++) {
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(500);
  }
  await detailsTrigger.click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /compare this test/i })
    .click();
  await page.waitForURL(/\/compare\/results\?ids=/);

  const shareUrl = page.url();

  // Fresh session: no compareStore in localStorage, only the URL.
  await page.context().clearCookies();
  await page.goto("about:blank");
  await page.goto(shareUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.removeItem("mhc:compare"));
  await page.reload({ waitUntil: "domcontentloaded" });

  await expect(page.getByText(/no tests selected yet/i)).toHaveCount(0);
  const stored = await page.evaluate(async () => {
    for (let i = 0; i < 40; i++) {
      const raw = window.localStorage.getItem("mhc:compare");
      if (raw && raw !== "[]") return JSON.parse(raw) as Array<{ id: string }>;
      await new Promise((r) => setTimeout(r, 500));
    }
    return [];
  });
  expect(stored).toHaveLength(1);
  expect(shareUrl).toContain(stored[0].id);
});
