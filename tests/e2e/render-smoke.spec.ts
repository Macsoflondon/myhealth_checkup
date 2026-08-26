import { test, expect, type ConsoleMessage, type Page } from "@playwright/test";

/**
 * Render smoke tests: every listed route must mount without a React render
 * crash (dispatcher null, hook-order, hydration failure) or an uncaught error.
 * These guard against regressions like the react-helmet-async dependency
 * re-optimisation race that nulled the React dispatcher mid-render.
 */
const ROUTES = [
  "/",
  "/compare",
  "/compare/results",
  "/compare/goals",
  "/compare/symptoms",
  "/providers/compare",
  "/cancer-screening-compare",
] as const;

/** Console/runtime messages that indicate a broken React render tree. */
const FATAL_PATTERNS = [
  /resolveDispatcher/i,
  /Invalid hook call/i,
  /Rendered (more|fewer) hooks/i,
  /Cannot read propert(y|ies) of (null|undefined)/i,
  /null is not an object/i,
  /undefined is not an object/i,
  /Minified React error/i,
  /Hydration failed/i,
  /Text content does not match/i,
  /Element type is invalid/i,
];

const isFatal = (text: string) => FATAL_PATTERNS.some((p) => p.test(text));

function collectErrors(page: Page) {
  const fatal: string[] = [];
  page.on("pageerror", (error) => {
    fatal.push(`pageerror: ${error.message}`);
  });
  page.on("console", (message: ConsoleMessage) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (isFatal(text)) fatal.push(`console: ${text}`);
  });
  return fatal;
}

for (const path of ROUTES) {
  test(`renders ${path} without a React render crash`, async ({ page }) => {
    const fatal = collectErrors(page);

    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `HTTP status for ${path}`).toBeLessThan(400);

    // Let hydration and lazy route chunks settle.
    await page.waitForLoadState("networkidle").catch(() => {});
    await page.waitForTimeout(500);

    // A crashed tree leaves an empty root, so assert real content mounted.
    const bodyText = (await page.locator("body").innerText()).trim();
    expect(bodyText.length, `rendered text length for ${path}`).toBeGreaterThan(50);
    await expect(page.locator("header, main, h1").first()).toBeVisible();

    expect(fatal, `fatal render errors on ${path}`).toEqual([]);
  });
}

test("client-side navigation between comparison routes stays stable", async ({ page }) => {
  const fatal = collectErrors(page);

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle").catch(() => {});

  for (const path of ["/compare", "/compare/goals", "/compare/symptoms", "/"]) {
    await page.evaluate((target) => {
      window.history.pushState({}, "", target);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, path);
    await page.waitForTimeout(600);
    const bodyText = (await page.locator("body").innerText()).trim();
    expect(bodyText.length, `rendered text length after navigating to ${path}`).toBeGreaterThan(50);
  }

  expect(fatal, "fatal render errors during client-side navigation").toEqual([]);
});
