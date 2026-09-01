# Condense Accredited Providers Bar spacing

## Problem
The homepage "Our clinical standards" quality-assurance grid still looks too spread out. The user previously asked for the spacing to be reduced; it was not applied correctly, and the labels remain visually separated.

## Current state
`src/components/sections/AccreditedProvidersBar.tsx` uses:
- Section vertical padding: `py-2 sm:py-2`
- Header block margin: `mb-2`
- Grid row/column gaps: `gap-y-2 gap-x-3 sm:gap-x-4`
- Underline-to-label margin: `mb-1`
- Hero caption margin: `mb-1 sm:mb-1`

These values leave too much whitespace between the six assurance labels.

## Change
Tighten the AccreditedProvidersBar layout while preserving the existing two-column → six-column responsive grid and brand colours.

Specific edits to `src/components/sections/AccreditedProvidersBar.tsx`:
1. Reduce section vertical padding to `py-1 sm:py-1.5`.
2. Reduce header margin to `mb-1`.
3. Reduce grid gaps to `gap-y-1 gap-x-2 sm:gap-x-3`.
4. Reduce underline-to-label margin to `mb-0.5`.
5. Reduce hero caption margin to `mb-0.5`.
6. Verify the component still renders the six items in a clean, compact row on desktop and a tidy 2-column grid on mobile.

## Verification
- Run `bunx tsgo --noEmit -p tsconfig.json` to confirm no type regressions.
- Capture desktop and mobile preview screenshots of the homepage standards section to confirm the labels are visibly condensed and no longer spread out.
