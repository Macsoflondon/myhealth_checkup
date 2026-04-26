# Plan: Rebuild PromoTicker using the proven TestCategoryTicker engine

## Why
The CSS-only `PromoTicker` is still not animating in the user's browser, while `TestCategoryTicker` (rAF + JS-driven `translate3d`) reliably scrolls. Easiest fix: copy the category ticker's mechanism verbatim, swap the content for the promo items.

## Changes

### 1. Rewrite `src/components/sections/PromoTicker.tsx`
- Delete the entire current pure-CSS implementation.
- Reimplement using the **exact same structure** as `TestCategoryTicker.tsx`:
  - `useRef` for `trackRef`, `positionRef`, `singleSetWidthRef`
  - `measureSetWidth()` measures the width of one full set of promo items
  - `requestAnimationFrame` loop with `pxPerMs = 0.04`, clamped delta, wraps at `setWidth`
  - `ResizeObserver` + `window.resize` + `document.fonts.ready` re-measure
  - `visibilitychange` resets `lastTime` to avoid jump after tab refocus
  - `?debugTickers` query param shows a small overlay (label: "PromoTicker")
- Render **8 sets** of the 3 promos (`SETS = 8`), flattened, so the track is wide enough for a smooth wrap.
- Keep existing visual styling: navy background, top 2px gradient accent, bottom 3px gradient accent, mask fade on left/right edges, `data-testid="promo-ticker-track"` on the track for the existing E2E test.
- Keep promo content identical:
  - GoodBody — "5% off on all popular blood tests" — `#0bb77e`
  - Medichecks — "20% off all tests with code APRIL20" — `#e70d68`
  - Lola Health — "£20 off with code Mar20" — `#fa757e`
- Keep typography (`font-heading font-bold`, white body text, pink bullet separator).

### 2. No other files change
- `Header.tsx` already imports `PromoTicker` — no edits needed.
- E2E test `e2e/homepage-tickers.spec.ts` continues to work (`data-testid="promo-ticker-track"` preserved, selector untouched).
- Update unit test `src/components/sections/__tests__/PromoTicker.test.tsx` — the inline `animation:` style assertion will no longer hold; replace it with assertions that the track exists, has the testid, and that promo items are rendered multiple times (proving the SETS duplication).

## Out of scope
- No changes to `TestCategoryTicker` (it works).
- No tailwind config changes.
- No header/layout changes.

## Risk
Low. The category ticker has been running reliably in the same page; cloning its engine onto identical markup is a like-for-like swap.
