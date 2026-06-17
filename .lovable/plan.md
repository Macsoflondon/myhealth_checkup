## Objective
In `ProviderTestDetailModal.tsx`, rearrange the CTA buttons so **Compare** sits to the left of **Book** and they display side-by-side rather than stacked.

## What will change
1. **Order swap**: The Compare button renders first (left), Book button renders second (right).
2. **Layout**: Change the buttons container from vertical stack to a horizontal flex row.
3. **Responsiveness**: On narrow viewports they should remain usable—likely via a `flex-col sm:flex-row` container with equal width buttons (`flex-1`) on larger screens.

## Files
- `src/components/providers/ProviderTestDetailModal.tsx` — update the CTA block (lines ~373-405)

## No other scope
No changes to compare logic, navigation, styling tokens, or other components.