# Flush toolbar + smooth sticky transition

## What changes

1. **No container, no shading (homepage hero toolbar)**
   The category toolbar currently sits inside a floating white pill: rounded-full, hairline border, and a two-layer drop shadow, width-fitted and centred so it visibly floats inside the header. In hero placement it becomes a plain, full-width strip — no rounded corners, no border ring, no shadow, no inset margins — running edge to edge directly under the brand row, with the pink hairline still marking the bottom of the header.

2. **Smooth sticky transition**
   Today the bar flips from `relative` to `fixed` the instant the sentinel leaves the viewport. Because the element leaves normal flow in one frame, the page jumps and the bar appears abruptly. The fix:
   - Reserve the bar's height with a spacer when it pins, so surrounding content does not shift.
   - Pin the bar slightly before the flip point and animate it in: translate from -100% to 0 with opacity, ~260ms ease-out, plus a soft shadow that fades in only once pinned.
   - Respect `prefers-reduced-motion` (instant, no slide).

Mobile/tablet behaviour and the drawer stay as they are; only the desktop toolbar band changes.

## Technical notes

All in `src/components/layout/BrowseByCategoryBar.tsx`:

- `innerClass` for `placement === "hero"`: drop `w-fit`, `rounded-full`, `border`, and the `shadow-[...]` stack; use `w-full bg-white` with no padding pill, keeping the horizontal scroll strip.
- `wrapperClass` hero branch: keep `relative`/`fixed` swap but add a measured spacer div (bar height via `ResizeObserver`, already partly measured for straddle mode) rendered when `heroPinned` is true.
- Add transition classes on the pinned wrapper (`transition-transform transition-opacity duration-[260ms] ease-out`, `-translate-y-full` initial state applied on mount of the pinned state via a `useEffect` flag so the browser animates the frame after).
- Guard with `motion-reduce:transition-none motion-reduce:translate-y-0`.
- Verify with the existing `tests/e2e/category-toolbar.spec.ts` expectations for `data-pinned`.
