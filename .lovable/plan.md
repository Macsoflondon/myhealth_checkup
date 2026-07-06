## Problem

`/at-home-tests` looks different from all other toolbar category pages (Most Popular, General Wellness, Women's Health, etc.) because it was built on a bespoke layout:

- It uses `MainLayout`, which injects the `AccreditedProvidersBar` ("UKAS-Accredited Labs / CQC-Regulated Clinics / ISO 15189 / GDPR / Transparent Pricing / No GP Referral") strip at the top. None of the other category pages use `MainLayout`, so none of them show that strip.
- It renders its own inline header, search input, category dropdown, results count, grid, and "Load more" button using `UniversalTestCard` directly — instead of the shared `CategoryPageLayout` + `CategoryStandardHero` + `CategoryPageBottom` composition every other toolbar page uses.
- Result: different hero, different filter bar (dropdown instead of pill filters), different card component, different bottom section, plus the extra accreditation strip.

## Fix

Rewrite `src/pages/AtHomeTestsPage.tsx` to follow the exact `MostPopularTestsPage` pattern, so `/at-home-tests` is visually identical in structure to every other toolbar category page.

Specifically:

1. **Drop `MainLayout`** — use `Header` + `Footer` directly (via `CategoryPageLayout`), which removes the `AccreditedProvidersBar` strip at the top.
2. **Use `CategoryPageLayout`** with the same props shape as `MostPopularTestsPage`:
   - `pillLabel="At Home"`, `headline="At Home Health Tests"`, subtitle kept from current copy.
   - `filters` derived from the at-home categories (`['All', ...uniqueTags]`).
   - `tests` mapped from `useAtHomeTests` results into `CategoryTestItem[]` (same mapping used in `MostPopularTestsPage`: cleanName, provider branding, rating, price, turnaround, biomarkers, tag, collection, url).
   - `trustStats`, `benefits`, `breadcrumbs` matching the shared category-page shape (At Home themed: e.g. Delivered to your door / UKAS accredited labs / Fast results online).
3. **Reuse the shared `StatusShell` pattern** (loading skeleton / error / empty) exactly as `MostPopularTestsPage` does, so loading/error/empty states also match.
4. **Remove the inline trust strip** (Package / Home / Shield / Clock line under the H1) — the standard hero already carries trust content via `trustStats` and `benefits`.
5. Keep the data source (`useAtHomeTests`, `useAtHomeCategories`) unchanged so the filtering behaviour (at-home only) is preserved; only presentation changes.
6. SEO tags (`<Helmet>` title/description/canonical/keywords) preserved.

No changes to routes, data hooks, or other pages.

### Files touched

- `src/pages/AtHomeTestsPage.tsx` — rewritten to mirror `MostPopularTestsPage` using `CategoryPageLayout`.