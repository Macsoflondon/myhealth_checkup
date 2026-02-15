

# Shrink the Partner Showcase Grid Section

## What is changing

The entire "Our Featured Partners" grid section is too large. The grid container (Goodbody card + video + bottom cards) will be reduced from `max-w-7xl` (~1280px) to `max-w-5xl` (~1024px) — roughly a 20% reduction in overall width. Additionally, card padding will be tightened and the Goodbody logo will be scaled down.

## Changes

**In `src/components/sections/PartnerShowcaseGrid.tsx`:**

- Reduce grid container from `max-w-7xl` to `max-w-5xl`
- Reduce Goodbody logo height from `h-[200px]` to `h-[140px]`
- Reduce card padding from `p-6 lg:p-8` to `p-5 lg:p-6` on all cards
- Reduce section vertical padding from `py-12 sm:py-16 md:py-20` to `py-8 sm:py-12 md:py-14`

This shrinks the whole section proportionally — Goodbody card, video, and the two bottom cards — without breaking the 2-column grid layout.

