

## Update Provider Star Ratings & Review Counts

### Current vs Actual Trustpilot Data

| Provider | Current Rating | Actual Rating | Current Reviews | Actual Reviews |
|----------|---------------|---------------|-----------------|----------------|
| Medichecks | 4.7 | 4.0 | 3,521 / 800 base | ~950 |
| Goodbody Clinic | 4.6–4.8 | 4.8 | 1,240 / 400 base | ~3,400 |
| Thriva | 4.5 | 4.4 | 2,156 / 300 base | ~2,500 |
| Randox Health | 4.6–4.8 | 4.6 | 1,847 / 200 base | ~26,000 |
| London Medical Laboratory | 4.4 | 4.1 | 892 / 100 base | ~3,266 |
| Lola Health | 4.3–4.6 | 4.8 | 567 / 250 base | ~130 |

### Approach

Create a single shared constants file (`src/constants/providerRatings.ts`) as the single source of truth for all provider ratings and review counts, then update all 5 files that currently hardcode these values.

### Files to Change

1. **New file: `src/constants/providerRatings.ts`** — Central ratings/reviews lookup with helper functions. All values from Trustpilot.

2. **`src/pages/ProviderProfilePage.tsx`** (lines 57-69) — Replace `getProviderRating` function with import from shared constants.

3. **`src/pages/TestDetailPage.tsx`** (lines 54-62) — Replace `providerRatings` object with import from shared constants.

4. **`src/components/sections/MostPopularTestsSection.tsx`** (lines 19-47) — Replace `providerRatings` and `baseReviewCounts` with import. Remove hash-based fake review count generation; use actual Trustpilot totals.

5. **`src/components/compare/PremiumTestCard.tsx`** (lines 25-50) — Same as above — replace with shared import.

6. **`src/pages/MedichecksMensHealthPage.tsx`** (lines 139-140) — Replace hardcoded `rating={4.5}` and random `reviewCount` with Medichecks actual values (4.0, 950).

7. **`src/components/providers/medichecks/MedichecksTestCard.tsx`** (line 61-62) — Update defaults from `4.5` / `100` to `4.0` / `950`.

8. **`src/components/sections/NationwideClinics.tsx`** (line 145) — Update hardcoded `(4.8)` to use Goodbody's actual rating.

### Shared Constants Structure

```typescript
export const PROVIDER_RATINGS: Record<string, { rating: number; reviews: number; reviewsFormatted: string }> = {
  'medichecks': { rating: 4.0, reviews: 950, reviewsFormatted: '950' },
  'goodbody-clinic': { rating: 4.8, reviews: 3400, reviewsFormatted: '3,400' },
  'thriva': { rating: 4.4, reviews: 2500, reviewsFormatted: '2,500' },
  'randox': { rating: 4.6, reviews: 26000, reviewsFormatted: '26,000' },
  'london-medical-laboratory': { rating: 4.1, reviews: 3266, reviewsFormatted: '3,266' },
  'lola-health': { rating: 4.8, reviews: 130, reviewsFormatted: '130' },
};
```

With a helper `getProviderRating(id)` that normalises provider ID lookups (handling aliases like `goodbody` → `goodbody-clinic`, `randox-health` → `randox`).

