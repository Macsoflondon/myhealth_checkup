## Plan

Two deliverables: a one-shot verification sweep across every subcategory route on desktop and mobile, and a repeatable end-to-end test file.

### 1. Verification sweep (Playwright, ad-hoc, this turn only)

Script at `/tmp/browser/verify-subcategories/run.py` that:

- Reads the source-of-truth from `src/components/header/NavigationItems.tsx` at runtime by scanning it for every `path: "/parent?subcategory=slug"` entry (30-ish routes).
- For each route, on `viewport 1280×900` and `390×844`:
  1. `page.goto("http://localhost:8080" + path, wait_until="networkidle")`
  2. Assert `document.title` contains the sub's label (from `dropdownItems.name`).
  3. Assert `<link rel="canonical">` href ends with `?subcategory=<slug>`.
  4. Assert `<meta property="og:url">` and `og:title` self-reference the same route.
  5. Assert the visible breadcrumb contains: linked `Home` → linked parent → active sub (non-linked).
  6. Parse every `<script type="application/ld+json">`, find the `BreadcrumbList`, assert its `itemListElement` names match the visible breadcrumb in order and its final item's URL matches the canonical.
- Emit a table: `route × viewport × pass/fail × failure reason`. Screenshot the first failure per route to `/tmp/browser/verify-subcategories/screenshots/`.
- Report the pass/fail summary in chat.

If failures surface, they're reported as-is — this turn does not fix them (that would be a separate scope).

### 2. Committed E2E test

New file `tests/e2e/subcategory-nav.spec.ts`, runnable with `bunx playwright test tests/e2e`. Adds `@playwright/test` to `devDependencies` and a `playwright.config.ts` at project root scoped to `tests/e2e/**` with `baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:8080"`, `webServer` disabled (assumes dev server already running, matches sandbox reality). Projects for `chromium-desktop` (1280×900) and `chromium-mobile` (Pixel 5 device descriptor).

Test cases (parameterised over a small fixture list of `{parent, subLabel, subSlug, expectedInTitle}`):

- **Desktop dropdown flow**
  1. `goto("/")`, hover the parent pill (`[data-testid="category-pill"][data-category="Women's Health"]`).
  2. Assert the portal panel is visible (`role="menu"` with `aria-label="Women's Health subcategories"`) and its `menuitem` includes the sub label.
  3. Click the sub item.
  4. `waitForURL("**/womens-health?subcategory=menopause")`.
  5. Assert `page.title()` contains `Menopause Tests`.
  6. Assert `link[rel=canonical]` href ends with `?subcategory=menopause`.
  7. Assert breadcrumb DOM: `Home` (anchor) → parent label (anchor to `/womens-health`) → `Menopause Tests` (non-anchor, `aria-current="page"`).
  8. Assert one `<script type="application/ld+json">` has `@type: "BreadcrumbList"` with 3 items ending in the sub.

- **Mobile drawer flow** (Pixel 5 project)
  1. `goto("/")`, tap the hamburger.
  2. Tap the chevron on the "Women's Health" row.
  3. Tap "Menopause Tests" in the expanded list.
  4. Same URL / title / canonical / breadcrumb / JSON-LD asserts as above.

Fixture covers 3 representative parents (`womens-health/menopause`, `wellness/heart-health`, `at-home-tests/womens`) to keep runtime under ~20s.

### Notes / non-scope

- No product code changes. If the sweep flags a broken canonical or JSON-LD row, that's reported for a follow-up patch, not fixed here.
- No changes to `NavigationItems.tsx`, `DbCategoryPage`, `CategoryPageLayout`, or `AtHomeTestsPage`.
- The E2E file is co-located under `tests/e2e/` so it doesn't get picked up by Vitest (`vitest.config` restricts to `src/**/*.{test,spec}`).
