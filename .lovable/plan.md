## Goal
Remove the text label that appears under/over each test kit image in the homepage "Explore Our Test Range" filmstrip.

## Where the text comes from
The `HoverExpand_001` component (`src/components/ui/expand-on-hover.tsx`) renders the `image.code` string in two places:
- Mobile carousel: a `<p>` under each thumbnail (lines 168–172)
- Desktop hover view: a floating `<span>` overlay on the active image (lines 320–333)

The component is reused by `FilmstripGallery`, `GoodbodyTestGallery`, and `TestProductFilmstrip`, so a blanket removal would affect all of them.

## Approach
Add an optional `showLabels` prop (default `true`) to `HoverExpand_001`. Wrap both the mobile `<p>` block and the desktop `<AnimatePresence>` overlay so they only render when `showLabels` is true. Pass `showLabels={false}` from `TestProductFilmstrip` only — other galleries keep their current labels.

## Files to change
- `src/components/ui/expand-on-hover.tsx` — add prop, gate both label renders
- `src/components/sections/TestProductFilmstrip.tsx` — pass `showLabels={false}`
