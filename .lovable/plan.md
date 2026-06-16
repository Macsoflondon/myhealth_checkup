## Goal

Replace the ad-hoc "Sample Method / At-Home Kit / Venous Draw / Doctor Review" rows with six standardised, decision-grade rows, add a **Total Expected Cost** row, and refactor the filter system to match. Persist the new fields in Supabase so every comparison surface (test pages, provider tables, compare hub, category pages) reads from one source of truth.

## New comparison rows (in order)

1. Biomarkers
2. Turnaround Time
3. Sample Type
4. Collection Method
5. Additional Collection Fees *(amber pill when > £0)*
6. **Total Expected Cost** *(test price + mandatory fees, bold)*
7. Clinical Review

Green check for positive values, grey dash for unavailable, amber highlight for hidden fees.

## Database schema

New migration adds nullable structured columns to `provider_test_mapping` (and mirror on `provider_tests` for scraped catalogs):

```text
sample_type             text   -- CHECK enum
collection_method       text   -- CHECK enum
collection_fee_type     text   -- 'none' | 'fixed' | 'from' | 'varies' | 'self_arranged'
collection_fee_amount   numeric(6,2)
clinical_review_type    text   -- 'included' | 'optional' | 'gp_included' | 'consultant_included' | 'clinician_included' | 'not_included' | 'not_available'
clinical_review_fee     numeric(6,2)
```

Allowed `sample_type`: `finger_prick`, `venous`, `saliva`, `urine`, `stool`, `buccal_swab`, `multiple`.
Allowed `collection_method`: `home_kit`, `clinic`, `home_visit`, `mobile_phleb`, `third_party_phleb`, `self_arranged`, `multiple`.

Existing `sample_collection_method` text stays for back-compat. A one-off backfill in the same migration maps known free-text values into the new structured fields.

## Types & transformers

- `src/types/comparison.ts`: extend `EnhancedTestData` with the six new fields plus `totalExpectedCost` (`basePrice + (collection_fee_amount ?? 0) + (clinical_review_type === 'optional' ? 0 : clinical_review_fee ?? 0)`). Extend `ComparisonFilters` with the new arrays.
- `src/services/transformers/testDataTransformer.ts` + `src/hooks/useEnhancedComparison.ts`: populate them; gracefully `null` when missing.
- `src/integrations/supabase/types.ts` regenerates after migration — no manual edit.

## UI

- `src/components/compare/EnhancedComparisonTable.tsx` and `src/components/compare/ProviderComparisonTable.tsx`: new row order, icons, amber fee pill, bold Total row.
- New `src/lib/comparisonFormat.ts`: `SAMPLE_TYPE_LABELS`, `COLLECTION_METHOD_LABELS`, `REVIEW_LABELS`, `formatFee`, `computeTotal`.
- `src/components/compare/TestFeatureRow.tsx`: drop hardcoded "Doctor Review" casing.

## Filters

- `src/components/compare/CompareFilters.tsx` / `FiltersSidebar.tsx`: four new groups — Sample Type, Collection Method, Additional Collection Fees, Clinical Review.
- `src/components/compare/AdvancedFilters.tsx`: seven advanced toggles per brief (doctor/consultant/GP review included, home visit available, home kit only, venous required, finger-prick only).

## Out of scope

- Per-provider scraper updates to populate the new columns for every test (will be backfilled separately; UI renders `—` when null).
- Admin editors for the new fields (follow-up).

## Files touched

- `supabase/migrations/<new>.sql` — schema + backfill
- `src/types/comparison.ts`
- `src/lib/comparisonFormat.ts` *(new)*
- `src/services/transformers/testDataTransformer.ts`
- `src/hooks/useEnhancedComparison.ts`
- `src/components/compare/EnhancedComparisonTable.tsx`
- `src/components/compare/ProviderComparisonTable.tsx`
- `src/components/compare/CompareFilters.tsx`
- `src/components/compare/FiltersSidebar.tsx`
- `src/components/compare/AdvancedFilters.tsx`
- `src/components/compare/TestFeatureRow.tsx`

Approve and I'll ship in one pass.
