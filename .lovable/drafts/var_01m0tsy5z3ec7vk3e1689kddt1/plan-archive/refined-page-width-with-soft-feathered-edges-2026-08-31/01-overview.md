# Refined page width with soft feathered edges

Pull the whole platform inward from the browser edges and let the sides fade into the ambient navy background — no border, no card, no box.

## How it works

The site already has one shared shell (`MainLayout`) used by every page, and one gutter/container system in the global stylesheet (`--gutter`, `page-container`, `full-bleed`). That means this can be done in two places rather than component by component.

1. A new page-inset token adds breathing room outside the existing gutters: roughly 28px on desktop, ~16px on tablet, 0 on mobile (mobile keeps its current comfortable padding instead of getting squeezed).
2. The shell gets a soft horizontal fade at the left and right edges, so full-width bands (hero image, navy sections, footer) dissolve into the background rather than ending on a line.
3. Existing "must touch the edge" bands stop measuring themselves against the viewport and instead measure against the inset page, so nothing overflows and no horizontal scrollbar appears.

Nothing changes about component internals: cards, tables, comparison grids, search, CTAs and navigation keep their current widths and behaviour — the whole page just sits inward.
