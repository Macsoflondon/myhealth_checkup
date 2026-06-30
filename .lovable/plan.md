Three small, scoped changes — homepage only.

## 1. `ComparisonBar` — fade out when table leaves viewport
File: `src/components/compare/ComparisonBar.tsx`

- Replace the current "sticky-true once observed" logic with a live observer that toggles `hasReached` based on whether the comparison section is intersecting.
- Observe `#comparison-anchor` with `rootMargin: "0px 0px -20% 0px"` (reveal as table enters) AND a new bottom sentinel `#comparison-end` (hide once user scrolls past).
- `hasReached = anchorVisibleOrPassed && !endPassed`. Implementation: track both via two observers; bar shows after anchor first intersects and hides once end sentinel's `boundingClientRect.bottom < 0` (passed above viewport).
- Keep early-return `setHasReached(true)` when `#comparison-anchor` is absent (non-home pages unchanged).
- Strengthen the hidden state to fully off-screen: change `translate-y-4` → `translate-y-full` in `revealClass`. Empty-state ghost strip now starts off-page and slides up as user scrolls down to the comparison section, and slides back down once the table is scrolled past.

## 2. `Index.tsx` — add end sentinel
File: `src/pages/Index.tsx`

- Add `<div id="comparison-end" aria-hidden="true" />` directly **after** the `ProviderComparisonTable` `LazyMount`. (`#comparison-anchor` already exists directly before it.)

## 3. Hero image flush to viewport bottom (desktop/tablet)
File: `src/components/sections/HeroMasthead.tsx`

- Bump the hero `<section>` minimum height so the image area (flex-1) reaches the bottom edge of the viewport on tablet/desktop. Change `min-h-[84svh] sm:min-h-[96svh]` → `min-h-[84svh] sm:min-h-[100svh]`.
- No other layout changes; mobile preserved at 84svh.

## Out of scope
- Non-home routes (no anchors present → bar stays visible as today).
- No visual/colour changes to bar contents, hero typography, or section ordering.
