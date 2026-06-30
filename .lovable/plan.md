# Plan: Scroll-gated ComparisonBar + Build Verification

## 1. Scroll-gated visibility (homepage only)

**`src/pages/Index.tsx`** — Add a sentinel `<div id="comparison-anchor" />` immediately before the lazy `ProviderComparisonTable` mount (currently the import exists but the section is not rendered in the JSX shown; re-add the section inside a `LazyMount` with the anchor directly above it so the bar reveals as the user scrolls down to the live comparison table).

**`src/components/compare/ComparisonBar.tsx`**:
- Add `hasReached` state, default `false`.
- `useEffect`: query `#comparison-anchor`. If missing (non-home pages, deep test pages, `/compare`), set `hasReached = true` immediately to preserve existing behaviour.
- If present, attach an `IntersectionObserver` with `rootMargin: "0px 0px -20% 0px"` so it triggers as the comparison table scrolls into view. Once `isIntersecting` fires, set `hasReached = true` and keep it true (sticky) so the bar stays visible after passing the section.
- Wrap both the empty-state return and the active-tray return in an outer `<div>` with `transition-all duration-500 ease-out` and toggle classes: `opacity-0 translate-y-4 pointer-events-none` when `!hasReached`, `opacity-100 translate-y-0` when reached. Preserve `pointer-events-none` on the empty-state mobile/desktop strip as today.

## 2. Production build verification

- Run `bun run build`.
- If TypeScript or Vite/Rollup errors appear, fix them in place (typed refs, missing imports, unused symbols). Re-run until the build exits clean.

## Files touched
- `src/components/compare/ComparisonBar.tsx` — IntersectionObserver gating + fade wrapper.
- `src/pages/Index.tsx` — render `ProviderComparisonTable` with `#comparison-anchor` sentinel directly above it.

## Out of scope
- Non-home pages keep current always-visible behaviour.
- No visual/styling changes to the bar's contents.
