# Category toolbar redesign — floating dock

Direction chosen: tab rail + grid panel, reworked as a **centred floating pill-shaped dock with depth**.

## What changes visually

**The bar**
- Becomes a self-contained rounded dock (fully pill-shaped ends, ~`rounded-full`), centred horizontally, max-width capped so it never spans the full window edge-to-edge.
- Frosted white surface (`bg-white/80` + backdrop blur), hairline slate border, soft layered drop shadow for lift. It floats over the navy hero rather than sitting flush as a white band.
- Inner padding of ~6px so each category sits as a "slot" inside the tray.
- Pills lose their individual outlines. Resting state is plain text + small turquoise icon; hover gets a soft grey fill; the active/open category gets a light turquoise fill with turquoise text and a bolder weight.
- Chevrons only on categories that actually have subcategories, and they rotate on open.
- "More" stays at the right end as a navy solid pill.

**The dropdown**
- Frosted glass panel with heavy soft shadow, rounded 16px, opening 12px below the dock with a short fade + rise (no bounce).
- Subcategories become rows with a small tinted icon tile plus the label, instead of the current bare bullet list — two columns on wide panels so long categories don't produce a tall thin column.
- Footer strip inside the panel: small uppercase category label on the left, "View all" link (pink) on the right.
- The panel keeps rendering through a portal so it can never be clipped by the dock's horizontal scroll.

**Brand correction:** the prototype used generic cyan/slate. The build uses our tokens — turquoise `#22c0d4`, navy `#081129`, pink `#e70d69`, Montserrat.

**Mobile:** the dock keeps its pill shape, sits inset with side padding, and scrolls horizontally with hidden scrollbars and edge fade masks so it's obvious there's more to the right. Tapping a category opens the same panel anchored to the viewport width rather than the pill.

## Technical notes

- `src/components/layout/BrowseByCategoryBar.tsx` — container restyle (dock shell, centring, edge masks), pill restyle, More button restyle. Existing portal logic for the More menu is kept.
- `src/components/layout/CategoryPillDropdown.tsx` — panel restyle, two-column subcategory grid, icon-tile rows, footer strip. Portal the panel the same way the More menu is portalled so overflow clipping is fixed for category panels too.
- No changes to routing, category data (`subcategoryMap`), or click targets — same links, same destinations.
- New tokens for the glass surface and dock shadow added to `src/styles.css` rather than hardcoded hex in components.
- Verify at 390px, 768px, 1024px, 1440px for no overflow and no clipped panels.

Once it's in, tell me what to push further — density, glass strength, colour weighting.
