

## Bring Most Popular Tests + Wellness in line with the standard category pages

Two pages are out of step with the rest of the category system. Both will be migrated to the same layout used by Fertility, Heart Health, Hormones, Thyroid, etc.

### Problem

| Page | What's wrong |
|---|---|
| `/popular-tests` | Uses bespoke `MostPopularTests` component. White hero, no pill, no filters, no compare drawer, no dark theme — nothing matches the rest of the category system. |
| `/wellness` | Has its own hand-rolled pink pill with inline styles (tiny: `padding: 6px 18px`, `fontSize: 11`). Did not pick up the 4× enlargement applied to `CategoryStandardHero`. |

### Fix

**1. WellnessPage — use the shared pill component**

Replace the hand-rolled pill block (lines ~239-281 in `WellnessPage.tsx`) with the standard `CategoryStandardHero` so it inherits the 4× sizing and stays in sync with every other page going forward. Pass `pillLabel="General Wellness"` and the existing three benefits (Early Detection / Optimise Performance / Peace of Mind).

The rest of WellnessPage (filter pills, custom card grid, hover effects) stays as-is — only the pill+benefits header block changes.

**2. MostPopularTestsPage — migrate to `CategoryPageLayout`**

Rebuild `MostPopularTestsPage.tsx` to use `CategoryPageLayout` exactly like `FertilityTestsPage.tsx`. This gives it:
- Standard 4× pill: `MOST POPULAR`
- Three benefit tiles (Trusted by Thousands / Comprehensive Insights / Accredited Labs)
- Tricolour gradient divider
- Dark navy filter section with sort, search, and result count
- `UnifiedTestCard` grid (replaces the bespoke white cards)
- Compare drawer support
- Standard `CategoryPageBottom`

Because `CategoryPageLayout` expects a static `tests: CategoryTestItem[]`, I'll create a thin wrapper component (`MostPopularTestsCategoryView`) that:
- Calls `usePopularTestsFromDatabase(24)` 
- Maps each `PopularTest` → `CategoryTestItem` (price → priceNum, test_name → title, category → tag, etc.)
- Derives the available `filters` array dynamically from the unique categories returned (e.g. `["All", "General Health", "Heart Health", "Hormones", ...]`)
- Renders `<CategoryPageLayout>` with that data
- Shows a loading skeleton while the query is pending and an error state on failure

Delete the old `MostPopularTests.tsx` component (no longer used).

### Files

- **Edit** `src/pages/WellnessPage.tsx` — swap inline pill block for `<CategoryStandardHero pillLabel="General Wellness" benefits={...} />`. Remove now-redundant inline styles, ambient glow orbs, and tricolour divider (all provided by `CategoryStandardHero`). Keep the heading "Browse Tests by Category", the filter pills, and the cards grid.
- **Rewrite** `src/pages/MostPopularTestsPage.tsx` — use `CategoryPageLayout` with a data-fetching wrapper that maps DB rows to `CategoryTestItem`.
- **Delete** `src/components/tests/MostPopularTests.tsx` — superseded.

### Result

After this change:
- The "GENERAL WELLNESS" pill on `/wellness` is identical in size, font, padding, dot, and glow to every other category page.
- `/popular-tests` looks and behaves exactly like `/fertility-tests`, `/heart-health`, `/hormones`, etc. — same hero, same filters, same cards, same compare flow.
- Mobile-first responsiveness is preserved (handled by `CategoryStandardHero` and `CategoryPageLayout`).

