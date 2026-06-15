## Goal

Replace the abrupt sticky-toolbar jump with a smooth, scroll-driven collapse: as the user scrolls, the promo ticker and logo bar glide upward off-screen while the navigation toolbar gradually locks to the top of the viewport. The nav remains permanently visible once docked.

## Current problem

In `src/components/layout/Header.tsx`:
- Three stacked sticky layers (promo ticker `top:0`, logo bar `top:tickerHeight`, toolbar `top:tickerHeight+logoBarHeight`).
- `isSearchDocked` is a binary IntersectionObserver toggle at the hero sentinel. When it flips, the ticker `max-height` collapses and the logo bar's `top` jumps from `tickerHeight` to `0` — the toolbar's `top` recomputes in the same frame. Even with the `transition-[top]` we added, the toggle is binary so the motion still feels like a snap because the trigger is a single threshold, not a continuous scroll value.
- A second `isToolbarSticky` boolean toggles at `scrollY > 120` and adds a shadow, compounding the "jump" feel.

## Approach: continuous scroll-driven transform

Drive the header collapse from `window.scrollY` directly (rAF-throttled), not from a binary observer. Map scroll progress 0 → N pixels (e.g. `0 → tickerHeight + logoBarShrinkAmount`, ~160px) to a `collapseProgress` value 0..1, then:

1. **Promo ticker** — translate upward with `transform: translateY(-progress * tickerHeight)` and fade `opacity: 1 - progress`. Keep it `sticky top:0` so it scrolls away naturally; the transform just accelerates and hides it cleanly before the logo bar reaches the top.
2. **Logo bar** — keep `sticky top:0` always. Smoothly shrink its internal padding and logo height using `progress` (interpolate `py` from `py-6` → `py-1`, logo height `h-32` → `h-12`). This produces the "rolling up" feel: the bar visually compresses as it sticks.
3. **Toolbar** — keep `sticky` directly under the logo bar via `top: currentLogoBarHeight` (measured live by the existing `ResizeObserver`). Because the logo bar shrinks continuously, the toolbar's docked position glides up smoothly instead of jumping.
4. **Search input swap** — fade between the centred full logo and the docked search bar using `opacity` cross-fade tied to `progress > 0.6`, instead of a hard mount/unmount. Both elements share the same absolutely-positioned slot so layout doesn't shift.
5. **Shadow** — interpolate `box-shadow` opacity from `progress` so the elevation appears gradually rather than snapping on at 120px.
6. Respect `prefers-reduced-motion`: fall back to the current binary behaviour.

## Files to change

- `src/components/layout/Header.tsx`
  - Replace `isToolbarSticky` boolean and `isSearchDocked` IntersectionObserver with a single `collapseProgress` state driven by a rAF scroll listener.
  - Derive `isSearchDocked` as `collapseProgress > 0.6` for the search/logo swap, but apply visual properties (padding, logo height, ticker translate, opacity, shadow) as interpolated inline styles using `progress`.
  - Keep the existing `ResizeObserver` measurement of `logoBarHeight` so the toolbar's sticky `top` continues to track the shrinking logo bar.
- `src/components/layout/Header.module.css`
  - Add `will-change: transform, opacity` to the ticker/logo bar for GPU smoothness.
  - Remove the `toolbar-float` keyframe wiggle while sticky (it competes with the collapse transform and contributes to the jittery feel).
  - Keep the reduced-motion media query and expand it to disable the new transforms.

## Technical notes

- Scroll listener uses `passive: true` and `requestAnimationFrame` coalescing — one state write per frame max.
- Interpolation helper: `const lerp = (a, b, t) => a + (b - a) * Math.min(1, Math.max(0, t))`.
- Collapse distance: `COLLAPSE_PX = 160` (tunable). `progress = clamp(scrollY / COLLAPSE_PX, 0, 1)`.
- Mobile branch (the early `if (isMobile)` return) is left untouched — the issue is desktop-only.
- No business logic, routing, data, or component API changes. Pure presentation.

## Out of scope

- Mobile header behaviour.
- Any change to navigation items, search submission, or routing.
- Footer, hero, or other sections.
