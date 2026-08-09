# Hero tweaks: drop clinic slide, centre toolbar, larger button text

## 1. Remove the clinic reception photo

Delete that slide from the hero rotation so the carousel runs through the remaining four images (jogging woman, senior couple, bench phone, at-home kit).

## 2. Properly centre the toolbar

The dock is currently pushed right: measured on the live page it sits 147px from the left edge and 1px from the right. Cause is a full-width spacer element sitting next to the toolbar inside the hero's flex row, which eats the left-hand space, so `mx-auto` has nothing left to balance. Fix the row so the dock is the only sizing element and centres for real.

## 3. Match button text to the ticker

The top ticker uses 12px / 14px / 16px across mobile, small and medium+ breakpoints. Category pills and the "More" button currently sit at 11.5-14px. Bump them to the same scale so the toolbar text reads at the same size as the ticker.

## Technical detail

- `src/components/sections/hero-slides.ts`: remove the `clinicReceptionAsset` slide entry and its import.
- `src/components/layout/BrowseByCategoryBar.tsx`:
  - The `sentinelRef` div (`h-px w-full`) is a sibling of the desktop bar inside the hero's `flex items-center` container and consumes the row width. Make it non-participating for hero placement (absolute/`w-0`, or move it outside the flex row) so the dock's `mx-auto w-fit` centres.
  - Pill/More font sizes: replace `text-[11.5px] lg:text-[12px] xl:text-[12px] 2xl:text-[14px]` with `text-xs sm:text-sm md:text-base` equivalents on the "More" button, and pass the same scale through `CategoryPillDropdown`.
- `src/components/layout/CategoryPillDropdown.tsx`: update the non-dense label classes to the ticker scale; keep the dense (straddle) variant as-is so the non-home toolbar still fits one line.
- Verify at 1895px, 1280px and 768px that left/right gaps around the dock are equal and the row still fits without horizontal scroll; if the larger text overflows at 768-1024px, keep the existing horizontal scroll behaviour rather than shrinking the font back.
