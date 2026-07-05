## Change

In `src/components/sections/StatsBand.tsx`:

- Bump the `<h2>` clamp from `clamp(1.4rem, 6vw, 2.1rem)` to `clamp(1.9rem, 7.5vw, 3rem)` so the heading is noticeably larger on both mobile and desktop.
- Change the outer flex row from `sm:justify-between` + `sm:text-left` to `sm:justify-center` + `text-center`, and drop `sm:text-left` on the wrapper, so the heading + buttons cluster in the middle of the navy band instead of hugging the edges.
- Keep the turquoise `health` and pink `asset.` spans, colours, font, and buttons exactly as they are.

No other files touched.