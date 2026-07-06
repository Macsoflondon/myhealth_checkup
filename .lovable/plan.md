# Standardise /test-categories to the canonical category layout

Replace the bespoke TestCategoriesPage with the same shell every other category page uses (`CategoryPageLayout`), rendering the full aggregated test catalogue with category-based filter pills.

## What changes

**1. New hook: `src/hooks/queries/useAllTests.ts`**

Mirror `useCategoryTests` but without the `canonical_category` filter. Same select, same active/image/url guards, same ordering (`is_popular` → `popularity_rank` → `price`). Returns `CategoryTestItem[]` using the same mapping function extracted into a shared helper `src/hooks/queries/mapProviderTest.ts` so both `useCategoryTests` and `useAllTests` map rows identically.

The mapper adds a `tag` field derived from `canonical_category` (title-cased display label from a small map: `womens-health → Women's Health`, `mens-health → Men's Health`, `heart → Heart Health`, etc.) so the existing `CategoryFilters` pill bar can filter on it without any layout changes.

**2. Rewritten `src/pages/TestCategoriesPage.tsx`**

Delete the custom hero/grid/orbs (~480 lines). Replace with the same shape as `MostPopularTestsPage`:

- `usePopularTestsFromDatabase` → `useAllTests()`
- Loading / error / empty states reuse the same `StatusShell`, `LoadingSkeleton`, `ErrorState`, `EmptyState` patterns (extract them to `src/components/category/CategoryStatusStates.tsx` so both pages share them instead of duplicating).
- Pass the full test list into `CategoryPageLayout` with filters derived from distinct `tag` values.

Props for the page:
- `pillLabel`: `"All Test Categories"`
- `headline`: `"Browse Tests by Category"`
- `subtitle`: `"Every clinically validated test from our trusted UK providers, filterable by category."`
- `searchPlaceholder`: `"Search by test name, biomarker, or category…"`
- `trustStats`: `50,000+ Tests Compared`, `4.8★ Average Rating`, `9+ Trusted Providers`
- `benefitsTitle`: `"Why Compare Through myhealth checkup?"`
- `benefits`: three standard trust benefits (UKAS labs, transparent pricing, editorial independence)
- `breadcrumbs`: Home → Test Categories
- `canonicalUrl`: unchanged (`https://myhealthcheckup.co.uk/test-categories`)

**3. Retired code**

`wellnessCategories` category-index data and the local `getCategoryTag` / `tagColors` maps are no longer imported by this page. They stay in the repo (still used by the homepage `TestCategories` section).

## Technical notes

- No schema changes. Reads through `provider_tests` (write path unchanged elsewhere).
- The tag map keeps `canonical_category` slugs as source of truth; display names are for UI only.
- `CategoryFilters` already handles the pill selection state, so the filter behaviour becomes identical to Most Popular Tests.
- Preserves SEO title/description shape and canonical URL; adjusts copy to match the standardised tone.

## Out of scope

- No change to `CategoryPageLayout`, `CategoryStandardHero`, or `CategoryPageBottom` — those stay as the single source of truth.
- No change to homepage `TestCategories` section (still uses category tiles).
- No route change; `/test-categories` continues to resolve to this page.
