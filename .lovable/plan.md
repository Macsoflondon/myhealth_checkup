# Plan: reposition hero blood-test kit image

## Goal
Centre the blood-test kit box within the hero image frame so it is clearly visible (currently it sits at the lower-left edge and is partly clipped).

## Context
- The homepage hero uses `src/components/sections/HeroMasthead.tsx`.
- Hero slides are rendered with `object-fit: cover` and `object-position` controlled by per-breakpoint CSS custom properties (`posMobile`, `posTablet`, `posDesktop`) defined in the `SLIDES` array and applied in `src/index.css`.
- The blood-test kit slide uses `hero-blood-test-kit.png` (landscape 1590×872). The rendered container is portrait (`min-h-[55svh]`), so the image is heavily cropped on the sides on mobile/tablet and on the top/bottom on desktop.
- Current focal points: `posMobile: "45% 55%"`, `posTablet: "center 55%"`, `posDesktop: "center 55%"`.

## Proposed change
Update the focal points for the `bloodTestKit` slide to move the crop window so the kit box sits nearer the middle of the visible frame:
- `posMobile: "35% 60%"` — show more of the left side of the image (where the kit is) and keep the vertical focus on the lower half.
- `posTablet: "40% 60%"` — slightly less horizontal shift for the wider tablet viewport.
- `posDesktop: "50% 65%"` — on desktop the full width is visible, so focus lower in the image to bring the kit up from the bottom edge.

## Verification
After the change, check the hero renders on mobile, tablet and desktop viewports and confirm the blood-test kit box is clearly visible and no longer clipped at the left edge.

## Files to edit
- `src/components/sections/HeroMasthead.tsx` (single line in the `SLIDES` array).
