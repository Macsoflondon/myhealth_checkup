Remove the capsule/pill border around the category heading on all category pages.

## Scope
Single shared component: `src/components/category/CategoryStandardHero.tsx`

## Change
- Remove the rounded `div` wrapper (lines 81–99) that renders the turquoise border, semi-transparent background, and padding around the `<h1>`.
- Keep the `<h1>` itself: white text, bold, sized as-is, centred in the hero.
- All other hero elements (benefits row, tricolour divider, ambient glow, background grid) remain unchanged.

## Impact
Every category page using `CategoryStandardHero` will show the plain category name with no capsule or border.