## Goal

Make every `/compare?category=...` page (and the no-category default) use the same header treatment used on `/womens-health` — title + 3 benefit tiles + tricolour gradient divider on the navy band. Nothing below the header changes.

## Scope

Touched: `src/pages/CompareTests.tsx` only (plus one tiny new file for per-category benefits). The comparison table, filters, recommended row, provider comparison section etc. are untouched.

## Changes

1. **New file `src/data/compareCategoryBenefits.ts`**
   - Exports a map `slug → { title, benefits: [3 × {icon, title, description}] }`.
   - Seeded for every slug that currently routes to `/compare?category=...`: `womens-health`, `mens-health`, `hormones`, `thyroid`, `general-health`, `fertility`, `heart-health`, `diabetes`, `vitamins`, `cancer-screening`, plus the sub-category slugs `menopause`, `female-fertility`, `female-hormones`, `pcos`, `male-hormones`, `male-fertility`, `testosterone`, `prostate`, `amh`.
   - Reuses copy/icons from `categoryContent.ts` where present; concise bespoke 3-tile sets for the sub-categories (e.g. Menopause → Hormone Clarity / Symptom Insight / Confident Decisions).
   - `title` defaults to `"<Display Name> Blood Tests"` (e.g. "Menopause Blood Tests").
   - A `getCompareHeader(slug)` helper returns the entry or a sensible fallback derived from `getCategoryDisplayName` + 3 generic benefits (Trusted Providers / Transparent Pricing / Fast Results) for slugs not explicitly mapped or the all-tests view.

2. **`src/pages/CompareTests.tsx`**
   - Remove the existing header block (lines 187–254): the `Compare X Blood Tests` heading, paragraph, three stat cards (Tests available / Providers / Lowest price), and the search input.
   - Render `<CategoryStandardHero pillLabel={header.title} benefits={header.benefits} />` in its place, where `header = getCompareHeader(effectiveCategory)`.
   - Drop now-unused imports (`FlaskConical`, `Building2`, `PoundSterling`, `Search`, `X` for the header) and the search input — search lives in the filters row further down and is not affected.
   - If the in-hero search input is the only `filters.searchQuery` UI on this page, keep state intact (still used by the results filter) and add a `<CategoryFilters>`-style search above the cards only if removing breaks search — verify during implementation; otherwise leave search to existing filters row.

3. **No other files touched.** Comparison table, recommended row, ProviderComparisonSection, footer all untouched.

## Visual result

Each compare page top band will read, e.g. for `/compare?category=menopause`:

```text
                Menopause Blood Tests
        [icon]            [icon]            [icon]
     Hormone Clarity   Symptom Insight   Confident Decisions
     short copy        short copy        short copy
        ───── turquoise→pink→turquoise divider ─────
```

…identical structure across menopause, thyroid, womens-health, mens-health, every sub-category, and the all-tests default.

## Verification

Playwright: load `/compare?category=menopause`, `/compare?category=thyroid`, `/compare?category=female-fertility`, `/compare` and screenshot the top band to confirm uniform layout and that the comparison table below is unchanged.
