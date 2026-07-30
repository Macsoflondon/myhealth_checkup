## Goal

Add breathing room above and below the straddling category toolbar on all category pages, per the drawn lines.

## Changes

**1. Space between the tricolour divider and the toolbar** — `src/components/category/CategoryStandardHero.tsx`

The navy section currently ends with `pb-6 sm:pb-8` right after the tricolour gradient line, so the toolbar (portalled into `#page-toolbar-anchor` at the navy/white boundary) overlaps close to it. Increase the navy section's bottom padding by roughly one text line: `pb-6 sm:pb-8` → `pb-11 sm:pb-14`. The header block grows taller, the tricolour line stays where it is relative to the heading, and the toolbar keeps straddling the boundary — just with clear navy space above it.

**2. Space between the toolbar and "74 tests found" / the sort dropdown** — `src/components/category/CategoryPageLayout.tsx`

The white results section starts at `pt-6 sm:pt-8`, which puts the count row and "Most Popular" select directly under the toolbar's lower half. Increase to `pt-12 sm:pt-16` so the row clears the toolbar with matching whitespace.

## Notes

- Both values are chosen so the toolbar sits with visually even gaps above (navy) and below (white).
- Change applies to every page using the standard category hero/layout; the homepage is untouched since it doesn't render this hero.
- I'll verify with a browser screenshot at desktop and mobile widths that the toolbar still centres on the colour boundary and nothing collides.
