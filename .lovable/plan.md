Plan
====

Swap the positions of the category pill toolbar (`BrowseByCategoryBar`) and the scrolling category carousel (`TestCategoryTicker`), make the toolbar fit on one line, and join the carousel flush to the bottom of the hero section.

Changes
-------

1. Refactor `HeroMasthead.tsx`
   - Remove the inline `<TestCategoryTicker variant="inline" />` currently rendered at the bottom of the hero.
   - Insert the category toolbar at the bottom of the hero section so it sits directly above the hero image footer.
   - Flatten the hero bottom border-radius (`rounded-b-none`) so the hero and the carousel below read as one continuous card.

2. Refactor `Index.tsx`
   - Remove the `<BrowseByCategoryBar />` from its current position immediately after the hero.
   - Place `<TestCategoryTicker variant="inline" />` directly after the hero section, inside the hero margin wrapper so it shares the same horizontal margins and sits flush with the hero bottom.
   - Ensure the carousel has no top margin and `rounded-t-none`, matching the hero flat bottom.
   - Keep the `StatsBand` in the existing sticky scope below the carousel.

3. Make the toolbar fit on one line
   - Add a compact render mode to `BrowseByCategoryBar.tsx` that keeps the same links and the LanguageSwitcher + UserMenu cluster but uses smaller pills/tighter spacing so the entire row fits without wrapping on a 1264 px desktop viewport.
   - When embedded in the hero, render this compact variant; when pinned/sticky, the component can fall back to its current scrolling/one-line behaviour.
   - Verify the mobile hamburger and desktop pill strip both stay within a single row.

4. Preserve sticky behaviour
   - Wrap the hero (with its embedded toolbar) and the carousel in the existing sticky scope so the toolbar still pins to the top of the viewport once the hero scrolls out.

5. Visual cleanup
   - Ensure no double borders or whitespace gaps between the hero bottom and the carousel top.
   - Keep the hero background colour continuous into the carousel.
   - Confirm the `StatsBand` retains its current spacing below the carousel.

Verification
------------

- Visual check: toolbar is at the bottom of the hero card, carousel is directly below it, no gap.
- Toolbar does not wrap or overflow at the target viewport (1264 px).
- Sticky pinning still works after scrolling the hero.
- No console errors or import references to the old carousel placement remain.