## Goal
Remove the PromoTracker marquee that sits above the hero. It's rendered as the first sticky element inside `Header` (both mobile and desktop branches), not inside the hero itself.

## Changes

### `src/components/layout/Header.tsx`
- Remove imports: `PromoTracker`, `PromoTrackerFallback`, and the now-unused `SectionErrorBoundary` and `useRef`.
- Remove the `promoTrackerRef` ref and the `tickerHeight` state.
- Remove the `useEffect` that measures PromoTracker height via `ResizeObserver`.
- **Mobile branch**: drop the `SectionErrorBoundary` + `<PromoTracker />` block. The `sticky top-0 z-50` wrapper stays so the mobile header itself remains sticky.
- **Desktop branch**: drop the sticky `<div ref={promoTrackerRef}>` wrapper containing PromoTracker. Replace the toolbar's `style={{ top: tickerHeight }}` with `top-0` (class) so the nav toolbar sticks to the top of the viewport once the user scrolls past the logo bar.

### `src/layouts/MainLayout.tsx`
- Update the header doc comment to drop the "(with PromoTracker)" mention. No functional change.

### Files NOT changed
- `src/components/sections/PromoTracker.tsx` and `PromoTrackerFallback.tsx`: left in place (unused) so the ticker can be reinstated later without restoring deleted code. No other consumers exist.

## Verification
- Home `/` hero sits directly below the navy logo bar — no marquee strip above it.
- On scroll, the nav toolbar sticks to viewport top with no empty gap where the ticker used to be.
- Mobile header still sticks correctly; no layout shift.