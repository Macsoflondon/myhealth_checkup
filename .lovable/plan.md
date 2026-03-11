

## Plan: Fix Ugly Category Titles

### Problem
The `getCategoryDisplayName()` function in `src/utils/categoryTaglines.ts` only maps ~10 category slugs. When a slug like `sports-performance-tests` isn't found, the fallback just capitalizes the first letter, producing "Sports-performance-tests" — ugly and broken-looking (as seen in your screenshot).

### Solution
Add all missing category slugs to both the `categoryDisplayNames` and `categoryTaglines` maps in `src/utils/categoryTaglines.ts`. Also improve the fallback to properly title-case any unknown slug (replace hyphens with spaces, capitalize each word).

### File: `src/utils/categoryTaglines.ts`

**Add these entries to `categoryDisplayNames`:**
- `sports-performance` → "Sports Performance"
- `sports-performance-tests` → "Sports Performance Tests"
- `at-home-tests` → "At-Home Tests"
- `longevity-tests` → "Longevity Tests"
- `iron-tests` → "Iron Tests"
- `energy-tests` → "Energy Tests"
- `nutrition-tests` → "Nutrition Tests"
- `allergy-testing` → "Allergy Testing"
- `sexual-health` → "Sexual Health"
- `gp-monitoring` → "GP Monitoring"
- `antibody-tests` → "Antibody Tests"
- `infection-tests` → "Infection Tests"
- `immunity-tests` → "Immunity Tests"
- `autoimmunity-tests` → "Autoimmunity Tests"
- `liver-health` → "Liver Health"
- `kidney-health` → "Kidney Health"
- `weight-loss-tests` → "Weight Loss Tests"
- `popular-tests` → "Popular Tests"

**Add matching entries to `categoryTaglines`.**

**Improve the fallback** in `getCategoryDisplayName` from:
```ts
category.charAt(0).toUpperCase() + category.slice(1)
```
to:
```ts
category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
```

This ensures any future unmapped slug still renders as proper title case (e.g. `new-category-name` → "New Category Name").

Single file change: `src/utils/categoryTaglines.ts`.

