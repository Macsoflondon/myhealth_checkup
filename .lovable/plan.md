## Goal

Reorder the homepage so the "Our Providers Most Popular Tests" section appears immediately after the "Our Partners Have Featured in" carousel — pushing the Medichecks logo/video block and the "Find a Clinic Near You" block down below it.

## Current order

Inside `PartnerShowcaseGrid.tsx`:
1. "Our Featured Partners of the Month" heading
2. `GoodbodyTestGallery`
3. `FeaturedPublications` carousel ("Our Partners Have Featured in")
4. Medichecks logo + promo video + CTA
5. `UKRegionMap` "Find a Clinic Near You" card

Then in `src/pages/Index.tsx`, separately:
6. `DreamHealthShowcase` ("Our Providers Most Popular Tests")

## Target order

Inside `PartnerShowcaseGrid.tsx`:
1. Featured Partners heading
2. `GoodbodyTestGallery`
3. `FeaturedPublications` carousel
4. **`DreamHealthShowcase` ("Our Providers Most Popular Tests")** ← moved here
5. Medichecks logo + video + CTA
6. `UKRegionMap` "Find a Clinic Near You"

## Changes

1. **`src/pages/Index.tsx`** — remove the `<ScrollFadeIn>…<DreamHealthShowcase />…</ScrollFadeIn>` block (the lazy import stays available, but is no longer rendered here). This stops it appearing twice on the page.

2. **`src/components/sections/PartnerShowcaseGrid.tsx`** — import `DreamHealthShowcase` and render it directly between `<FeaturedPublications />` and the second `container` div that holds the Medichecks block. Render it full-width (outside the inner container) so its existing white section background and self-contained layout sit cleanly between the two surrounding blocks.

That's it — purely a reorder. No styling, copy, or data changes; the section keeps its current look and behaviour.

## Out of scope

- No edits to `DreamHealthShowcase` itself (filmstrip, headline, cards stay as they are now).
- No changes to other homepage sections, lazy-loading, or animations.
- The section background mismatch (Partner section is currently `bg-brand-navy bg-white` — Tailwind keeps the latter) is left as-is; if you want a single, intentional background colour for this combined block, say the word and I'll fold that in.
