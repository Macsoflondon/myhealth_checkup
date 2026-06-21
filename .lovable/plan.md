# Hero image — show more, full width

The carousel container is already full bleed (`-mx-6 sm:-mx-9`), but the image is zoomed (`scale-[1.04]`) and cropped tight via `object-cover` on a fixed `h-[520px]` with `objectPosition: center 30%`, so subjects get cut off.

## Changes in `src/components/sections/HeroMasthead.tsx` (carousel block, ~line 138-143)

1. **Remove the `scale-[1.04]` zoom** so the image renders 1:1 within the frame — no extra cropping.
2. **Increase frame height** from `h-[520px]` to `h-[600px] md:h-[680px]` so more of each photo is visible while preserving the full-width band.
3. **Recentre crop** with `objectPosition: "center center"` (current `center 30%` pushes faces/subjects out of frame top).
4. Keep `object-cover` (full-width fill, no letterboxing) and the navy backdrop for safety.

No other sections, no copy, no card/logo changes.
