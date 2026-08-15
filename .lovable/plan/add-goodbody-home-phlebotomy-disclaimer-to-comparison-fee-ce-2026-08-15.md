# Add Goodbody home-phlebotomy disclaimer to comparison fee cell

## What we're doing

In the side-by-side comparison table, Goodbody's "Additional Collection Fees" cell currently shows `from £20`. We will add an asterisk and a tooltip so users understand that the £195 total already includes the standard phlebotomy fee, while a home visit is an extra £20.

## Changes

1. **Extend `CompareTestData`**  
   Add `collectionFeeNote?: string | null` to `src/types/entities.ts` so the comparison row can carry a fee disclaimer.

2. **Populate the note from the transformer**  
   In `src/services/transformers/testDataTransformer.ts`, set `collectionFeeNote` for Goodbody rows where `collection_fee_type === 'from'` and a home-visit option applies. The note text will read like:  
   "The total shown (£195) includes the standard phlebotomy fee. A home-visit phlebotomy appointment costs an additional £20."

3. **Render asterisk + tooltip in the comparison table**  
   In `src/components/compare/ProviderComparisonTable.tsx`, update the "Additional Collection Fees" row so that when `collectionFeeNote` is present:
   - the fee label is appended with an asterisk (e.g. `from £20*`),
   - the label is wrapped in a clickable/hover tooltip using the existing shadcn `Tooltip` component,
   - the tooltip displays the disclaimer text.

4. **Keep totals unchanged**  
   The existing `computeTotalExpectedCost` logic remains as-is; the note is purely explanatory and does not alter the displayed £195 total.

## Expected result

Goodbody's fee cell will show `from £20*` with a tooltip explaining the £20 home-visit surcharge, while the total expected cost stays at £195.
