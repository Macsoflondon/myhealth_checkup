## Objective
Increase the visual size of the three homepage category cards (Blood Tests, Cancer Screening, Wellness & Longevity) by approximately 1.5x, matching the larger featured-article card proportions in the Medichecks reference.

## Current state
- `src/components/sections/TestCategoriesSection.tsx` renders 3 image-overlay cards at:
  - `min-h-[320px]` / `min-h-[380px]`
  - Title `text-xl sm:text-2xl`, description `text-sm`, tag `text-[10px]`, CTA `text-[11px]`
  - Padding `p-6 sm:p-7`, gap `gap-5 sm:gap-6`

## Changes
1. **Card dimensions**: raise `min-h` from 320/380 px to ~480/570 px (1.5x).
2. **Typography scale-up**: title → ~1.5x, description → ~1.5x, tag/CTA → ~1.5x.
3. **Spacing**: padding and grid gap scaled proportionally.
4. **Overlay gradient**: extend dark zone to keep text legible on taller cards.

## Verification
- Screenshot desktop and mobile (390px) to confirm no overflow, text remains readable, and cards match the requested density.