

## Problem

The `TestCategoryTicker` has two bugs:

1. **Jumping/stuttering** -- It uses a fixed `speed = 0.4` per frame instead of delta-based timing, so it jumps on tab refocus and stutters across different refresh rates. It also uses `offsetWidth` (integer) for reset measurement, causing a visible snap.

2. **"Cancer Screening" gets clipped** -- The reset logic measures only `firstChild.offsetWidth` (one item), but the seamless loop reset should be based on the width of one full set of categories. When it resets after just one item width, categories get cut off mid-text.

3. **Missing category** -- "Fitness & Performance" needs to be added to the ticker.

## Plan

### 1. Fix the animation in `TestCategoryTicker.tsx`

Apply the same proven pattern from `BrandTicker.tsx`:
- Use `useCallback` to measure one full set width using `getBoundingClientRect()` (sub-pixel precision)
- Use delta-based timing with a `pxPerMs` constant (e.g., `0.04`) for frame-rate independent movement
- Clamp delta to 50ms to prevent jumps on tab refocus
- Reset position when it exceeds one full set width (not one item width)
- Use `translate3d` for GPU compositing
- Add `backfaceVisibility: "hidden"` for Safari
- Use refs for position tracking instead of closure variables
- Increase number of duplicated sets to 8 (matching BrandTicker) so there is always content visible during reset

### 2. Add "Fitness & Performance" to the categories array

Add `"Fitness & Performance"` to the `categories` array in `TestCategoryTicker.tsx`, after "Longevity Tests" (or similar logical position).

### Files to edit
- `src/components/sections/TestCategoryTicker.tsx` -- rewrite animation logic + add category

