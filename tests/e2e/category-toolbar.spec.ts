import { expect, test, type Locator, type Page } from "@playwright/test";

const CENTRE_TOLERANCE_PX = 2;
const PIN_TOLERANCE_PX = 2;

interface ToolbarGeometry {
  centre: number;
  dockWidth: number;
  left: number;
  right: number;
  top: number;
  viewportCentre: number;
  viewportWidth: number;
}

async function toolbarGeometry(toolbar: Locator): Promise<ToolbarGeometry> {
  return toolbar.evaluate((element) => {
    const dock = element.querySelector<HTMLElement>(
      '[data-testid="category-toolbar-dock"]',
    );
    if (!dock) throw new Error("Category toolbar dock was not rendered");

    const rect = dock.getBoundingClientRect();
    return {
      centre: rect.left + rect.width / 2,
      dockWidth: rect.width,
      left: rect.left,
      right: rect.right,
      top: element.getBoundingClientRect().top,
      viewportCentre: window.innerWidth / 2,
      viewportWidth: window.innerWidth,
    };
  });
}

function expectCentred(geometry: ToolbarGeometry): void {
  expect(Math.abs(geometry.centre - geometry.viewportCentre)).toBeLessThanOrEqual(
    CENTRE_TOLERANCE_PX,
  );
  expect(geometry.left).toBeGreaterThan(0);
  expect(geometry.right).toBeLessThan(geometry.viewportWidth);
  expect(geometry.dockWidth).toBeLessThan(geometry.viewportWidth);
}

async function expectNoPageOverflow(page: Page): Promise<void> {
  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
}

async function verifyCentredAndPinned(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: "domcontentloaded" });

  const toolbar = page
    .locator('[data-testid="browse-by-category-bar"]:visible')
    .first();
  await expect(toolbar).toBeVisible();

  const initial = await toolbarGeometry(toolbar);
  expectCentred(initial);
  await expectNoPageOverflow(page);

  await page.evaluate(() =>
    window.scrollTo(0, Math.max(900, document.body.scrollHeight / 2)),
  );
  await expect(toolbar).toHaveAttribute("data-pinned", "true");

  const pinned = await toolbarGeometry(toolbar);
  expectCentred(pinned);
  expect(Math.abs(pinned.top)).toBeLessThanOrEqual(PIN_TOLERANCE_PX);
  expect(Math.abs(pinned.centre - initial.centre)).toBeLessThanOrEqual(
    CENTRE_TOLERANCE_PX,
  );
  await expectNoPageOverflow(page);
}

test.describe("desktop category toolbar geometry", () => {
  test("homepage toolbar remains centred and pinned while scrolling", async ({
    page,
  }) => {
    await verifyCentredAndPinned(page, "/");
  });

  test(
    "category-page toolbar remains centred and pinned while scrolling",
    async ({ page }) => {
      await verifyCentredAndPinned(page, "/tests/cancer");
    },
  );
});