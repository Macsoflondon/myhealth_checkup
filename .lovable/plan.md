## Mobile layout for Featured Partner section

Restructure `src/components/sections/GoodbodyBentoShowcase.tsx` so the mobile (`<sm`) layout follows this order, while the existing `sm:` and larger layout stays exactly as it is today.

### New mobile order (2-column grid)

```text
Row 1: [ GOODBODY logo spanning 2 cols, ~square (h = 1 tile) ]
Row 2: [ Advanced Well Man ] [ Premium Complete ]
Row 3: [ Goodbody description + "View Goodbody Profile" CTA — spans 2 cols, height ≈ 2 tiles ]
Row 4: [ Early Cancer Screening ] [ Female Hormone & Fertility ]
Row 5: [ Thyroid Blood Test ] [ Cholesterol Blood Test ]
```

- Logo tile: `col-span-2`, white card, logo `object-contain` filling the card with comfortable padding.
- Text/CTA tile: `col-span-2`, condensed copy area sized to roughly the footprint of 4 kit tiles (2×2). Font sizes nudged down on mobile so all copy + CTA fit without overflow. CTA stays the existing turquoise → pink hover button linking to `/provider/goodbody`.
- Kit tiles unchanged in content, just reordered.

### Implementation approach

Render two separate grids in the component:

- `<div class="grid grid-cols-2 gap-3 sm:hidden">…mobile layout…</div>`
- `<div class="hidden sm:grid sm:grid-cols-3 gap-3 sm:gap-4">…existing desktop/tablet layout, unchanged…</div>`

This keeps the desktop/tablet bento exactly as designed (current 3-col layout with logo top-middle, callout row-span-2 in centre) and isolates all changes to the mobile breakpoint.

No changes to any other file, no data/business-logic changes.
