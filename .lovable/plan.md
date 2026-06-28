Restructure the homepage hero so the category carousel sits at the very top of the hero section, above the wordmark/nav header, and the entire hero/toolbar/ticker/stats band becomes a single full-width white block before the navy PartnersGrid.

Scope
- Move `TestCategoryTicker` into `HeroMasthead.tsx` as the first element, above the wordmark/nav row.
- Flatten `HeroMasthead`'s top rounded corners (`rounded-t-[28px]`) since the ticker is now the page-top edge; keep bottom rounded corners for the internal toolbar transition.
- Remove the `mx-4 sm:mx-8 md:mx-14 lg:mx-16` margins from the hero containers in `Index.tsx` so the white block spans the full viewport width.
- Add/adjust a `BrowseByCategoryBar` placement so the toolbar sits full-width inside the same white block without its own horizontal margins.
- Keep `StatsBand` as the bottom cap of the white block with its `rounded-b-[28px]` corners, so it cleanly transitions into the navy `PartnersGrid` below.
- Preserve the existing sticky toolbar behaviour and accessibility attributes.

Files
- `src/components/sections/HeroMasthead.tsx` — insert ticker at top, remove top rounding.
- `src/pages/Index.tsx` — remove margins on hero/toolbar/ticker/statsband containers.
- `src/components/layout/BrowseByCategoryBar.tsx` — add a full-width hero-stack placement if needed.

Verification
- Visual screenshot of the homepage top to confirm: carousel → hero header → H1 → hero image → toolbar → stats band → navy partners grid, with no navy gaps on the sides.
- Run `bunx tsc --noEmit` to catch type regressions.