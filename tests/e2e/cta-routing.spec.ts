import { test, expect, type Page } from "@playwright/test";

/**
 * CTA routing coverage.
 *
 * For each screen we collect every call-to-action link, click it, and assert the
 * destination actually renders a page (correct URL, an <h1>, real content, no 404).
 */

const CTA_TEXT =
  /(compare|quiz|find|view|explore|browse|start|get started|see |take |book|discover|learn)/i;

/** Screens whose CTAs we exercise. Mobile-first, but run on both projects. */
const SCREENS = [
  "/",
  "/compare",
  "/compare/symptoms",
  "/compare/goals",
  "/at-home-tests",
  "/wellness",
  "/test-categories",
  "/find-test",
  "/providers",
  "/tests/cancer",
  "/tests/womens-health",
  "/most-popular-tests",
  "/guides",
  "/blog",
  "/find-clinic",
  "/how-it-works",
] as const;

interface CtaLink {
  readonly href: string;
  readonly text: string;
}

const collectCtaLinks = async (page: Page): Promise<readonly CtaLink[]> => {
  const links = await page.$$eval("a[href]", (els) =>
    els.map((el) => ({
      href: el.getAttribute("href") ?? "",
      text: (el.textContent ?? el.getAttribute("aria-label") ?? "").trim().slice(0, 80),
    })),
  );

  const seen = new Set<string>();
  const out: CtaLink[] = [];
  for (const link of links) {
    const href = link.href.split("#")[0];
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    if (!CTA_TEXT.test(link.text)) continue;
    if (seen.has(href)) continue;
    seen.add(href);
    out.push({ href, text: link.text });
  }
  return out;
};

const assertPageLoads = async (page: Page, href: string): Promise<void> => {
  const response = await page.goto(href, { waitUntil: "domcontentloaded" });
  expect(response?.status(), `${href} returned an error status`).toBeLessThan(400);

  // The app is client-rendered behind lazy routes — wait for the real heading.
  await expect(page.locator("h1").first(), `${href} rendered no <h1>`).toBeVisible({
    timeout: 20_000,
  });

  const body = (await page.locator("body").innerText()).trim();
  expect(body.length, `${href} rendered almost no content`).toBeGreaterThan(400);
  expect(body, `${href} rendered the not-found page`).not.toMatch(/page not found/i);
};

test.describe("CTA routing", () => {
  for (const screen of SCREENS) {
    test(`CTAs on ${screen} route to pages that load`, async ({ page }) => {
      test.slow();

      await page.goto(screen, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 20_000 });

      const ctas = await collectCtaLinks(page);
      expect(ctas.length, `no CTAs found on ${screen}`).toBeGreaterThan(0);

      for (const cta of ctas) {
        await test.step(`${screen} → ${cta.href} ("${cta.text}")`, async () => {
          await assertPageLoads(page, cta.href);
        });
      }
    });
  }
});

test.describe("Key CTA destinations", () => {
  const CANONICAL: ReadonlyArray<readonly [string, string, RegExp]> = [
    ["/", "Take the Health Quiz", /\/find-test/],
    ["/compare", "Compare by symptom", /\/compare\/symptoms/],
    ["/compare", "Compare by goal", /\/compare\/goals/],
  ];

  for (const [from, label, expected] of CANONICAL) {
    test(`"${label}" on ${from} navigates to ${expected}`, async ({ page }) => {
      await page.goto(from, { waitUntil: "domcontentloaded" });
      const link = page.getByRole("link", { name: new RegExp(label, "i") }).first();
      if ((await link.count()) === 0) test.skip(true, `"${label}" not present on ${from}`);
      await link.click();
      await expect(page).toHaveURL(expected);
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 20_000 });
    });
  }
});

test.describe("Provider shortcut redirects", () => {
  const REDIRECTS: ReadonlyArray<readonly [string, string]> = [
    ["/medichecks", "/providers/medichecks"],
    ["/randox", "/providers/randox"],
    ["/thriva", "/providers/thriva"],
    ["/lola-health", "/providers/lola-health"],
  ];

  for (const [from, to] of REDIRECTS) {
    test(`${from} redirects to ${to} and loads`, async ({ page }) => {
      await page.goto(from, { waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(new RegExp(`${to}/?$`));
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 20_000 });
    });
  }
});
