# Centre the hero toolbar and square off the hero image top corners

## What we are changing
From the screenshot the desktop homepage has two layout issues:
1. The category toolbar in the white band looks shifted to the right instead of centred.
2. The hero image area has rounded top corners, leaving a gap against the straight pink divider below the toolbar.

## Steps

1. **Centre the category toolbar in `src/components/layout/BrowseByCategoryBar.tsx`**
   - For `placement === "hero"`, change the inner dock layout so the pill group and "More" button are centred as a unit within the white toolbar band.
   - Replace the left-aligned `justify-start` on the scrollable pill row with `justify-center`, and make the dock fill the available width (`w-full`) while keeping the items centred, rather than using `w-fit` with left-heavy content.
   - Preserve the existing overflow/scroll behaviour and dropdown positioning.

2. **Square off the hero image top corners in `src/components/sections/HeroMasthead.tsx`**
   - Remove `rounded-t-[18px]` from the hero image container so the top edge is flat and flush with the toolbar's bottom pink divider.
   - Ensure no other rounded classes remain on the top edge of that container.

3. **Visual verification**
   - Capture a Playwright screenshot at desktop width (~1920 px) focused on the toolbar/hero boundary.
   - Confirm the toolbar pill group is visually centred in the white band.
   - Confirm the hero image top edge is straight and meets the divider without a radius.
   - Spot-check tablet and mobile for layout regressions.

4. **Build check**
   - Run `npm run build:dev` to confirm the Tailwind classes compile cleanly.
