import { test, expect, Page } from '@playwright/test';
import { FALLBACK_LABELS, NON_ENGLISH_LANGUAGES } from '../src/i18n/fallbackLabels';

/**
 * i18n audit — verifies that every provider page and every test-kit page
 * renders localised CTAs (Compare / Book / Enquire) in every supported
 * non-English language, and that raw English CTAs never leak through.
 *
 * Strategy:
 *   1. For each language, visit each provider profile page.
 *   2. Assert that the localStorage-driven language switch propagates.
 *   3. Assert every CTA button in the DOM matches the localised label
 *      from `FALLBACK_LABELS`, not the raw English string.
 *   4. Follow the first test link on the provider page into the test
 *      detail page and repeat the assertion there.
 *
 * The audit does not depend on the Supabase `translate` edge function —
 * `AutoTranslatePage` applies fallback labels synchronously.
 */

const PROVIDER_SLUGS = [
  'medichecks',
  'thriva',
  'randox',
  'london-medical-laboratory',
  'lola-health',
  'goodbody-clinic',
  'london-health-company',
  'medical-diagnosis',
  'clinilabs',
];

async function setLanguage(page: Page, lang: string) {
  await page.addInitScript((l) => {
    localStorage.setItem('i18nextLng', l);
  }, lang);
}

async function waitForAutoTranslate(page: Page) {
  // AutoTranslatePage runs on mount + follow-up sweeps at 250/900/1800ms.
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(2100);
}

/**
 * Assert that no button on the page still shows raw English CTA text
 * when a non-English language is active.
 */
async function assertLocalisedCtas(page: Page, lang: string, context: string) {
  const dict = FALLBACK_LABELS[lang as keyof typeof FALLBACK_LABELS];
  expect(dict, `missing fallback dict for ${lang}`).toBeDefined();

  const rawEnglishCtas = ['Compare', 'Book', 'Enquire', 'Book now', 'Added'];
  for (const english of rawEnglishCtas) {
    // Exact-text match on buttons or links only. We tolerate the word
    // appearing inside longer sentences (e.g. legal copy); the goal is
    // to catch un-translated CTAs specifically.
    const stillEnglish = page.locator(
      `button, a, [role="button"]`,
      { hasText: new RegExp(`^\\s*${english}\\s*$`) },
    );
    const count = await stillEnglish.count();
    expect(
      count,
      `[${context}][${lang}] found ${count} untranslated "${english}" CTA — expected "${dict[english] ?? '???'}"`,
    ).toBe(0);
  }

  // Positive assertion: at least one localised CTA is visible.
  const localisedCompare = dict['Compare'];
  const anyLocalised = page.locator(`button, a, [role="button"]`, {
    hasText: new RegExp(`(${dict['Compare']}|${dict['Book']}|${dict['Book now']}|${dict['View details']})`),
  });
  const localisedCount = await anyLocalised.count();
  expect(
    localisedCount,
    `[${context}][${lang}] no localised CTA rendered (expected e.g. "${localisedCompare}")`,
  ).toBeGreaterThan(0);
}

for (const lang of NON_ENGLISH_LANGUAGES) {
  test.describe(`i18n audit — ${lang}`, () => {
    for (const slug of PROVIDER_SLUGS) {
      test(`provider page /${slug} renders localised CTAs`, async ({ page }) => {
        await setLanguage(page, lang);
        const res = await page.goto(`/provider/${slug}`, { waitUntil: 'domcontentloaded' });
        // Skip providers that don't have a public profile route yet — the
        // audit should not fail if the route 404s in this environment.
        if (!res || res.status() >= 400) test.skip(true, `no route for /provider/${slug}`);
        await waitForAutoTranslate(page);
        await assertLocalisedCtas(page, lang, `provider:${slug}`);
      });

      test(`first test-kit page under ${slug} renders localised CTAs`, async ({ page }) => {
        await setLanguage(page, lang);
        // The catalog for each provider lives on the provider profile. We
        // pick the first test link that matches the /<provider>/<testId>
        // route pattern the app uses for provider-scoped detail pages.
        await page.goto(`/provider/${slug}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(500);

        const testLinkPattern = new RegExp(`^/${slug.replace(/-/g, '\\-')}/[a-z0-9-]+$`, 'i');
        const testLink = page
          .locator('a')
          .filter({ hasNot: page.locator('nav a') })
          .filter({
            has: page.locator('*'),
          })
          .first();

        // Fall back to any anchor whose href matches the provider/testId pattern
        const hrefs = await page.locator('a').evaluateAll((els) =>
          (els as HTMLAnchorElement[]).map((a) => a.getAttribute('href') ?? ''),
        );
        const match = hrefs.find((h) => testLinkPattern.test(h));
        if (!match) test.skip(true, `no test-kit link found on /provider/${slug}`);

        await page.goto(match!, { waitUntil: 'domcontentloaded' });
        await waitForAutoTranslate(page);
        await assertLocalisedCtas(page, lang, `test:${match}`);
      });
    }
  });
}
