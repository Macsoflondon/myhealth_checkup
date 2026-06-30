# Scroll-Gated ComparisonBar

Make the floating comparison bar hidden by default and only fade in once the user scrolls down to the live comparison table section. Fade it back out once they scroll past it. Then verify a clean production build.

## Changes

### 1. `src/components/compare/ComparisonBar.tsx`
- Add `hasReached` state, default `false`.
- Add `IntersectionObserver` watching a `#comparison-anchor` sentinel: set `hasReached = true` when it enters viewport.
- Add a second observer on `#comparison-end` sentinel: set `hasReached = false` once the table scrolls out of view below the fold.
- Wrap the root in a transition layer:
  - Hidden: `opacity-0 translate-y-full pointer-events-none`
  - Visible: `opacity-100 translate-y-0`
  - Transition: `transition-all duration-300 ease-out`

### 2. `src/pages/Index.tsx`
- Insert `<div id="comparison-anchor" aria-hidden="true" />` immediately above `<ProviderComparisonTable />`.
- Insert `<div id="comparison-end" aria-hidden="true" />` immediately below it.

### 3. Build verification
- Run `bun run build` and fix any TypeScript / bundler errors that surface.

## Notes

- Existing comparison persistence logic (selected tests, clear, compare CTA) is untouched — only visibility gating changes.
- Sentinels are zero-height divs so they don't affect layout.
- Two-way fade so the bar disappears again on other parts of the page.
