## Changes to `src/components/sections/HeroMasthead.tsx`

1. **Shrink the hero by ~3 lines of vertical space**
   - Reduce `min-h-[88svh] sm:min-h-[100svh]` → `min-h-[76svh] sm:min-h-[88svh]` (≈3 lines / ~12svh trim).
   - Tighten the H1 top gap from `mt-8 sm:mt-20` → `mt-4 sm:mt-10` to absorb the reduction without crushing the image.

2. **Reinstate the TestCategoryTicker carousel**
   - Re-import `TestCategoryTicker` from `@/components/sections/TestCategoryTicker`.
   - Re-mount it inline directly below the image wrapper (after the closing `</div>` of the image block, before the section closes), using `variant="inline"` as before.
   - Keep the image wrapper as `flex-1 min-h-0` so the ticker sits flush at the base of the hero card.

No other files touched. No business logic changes.