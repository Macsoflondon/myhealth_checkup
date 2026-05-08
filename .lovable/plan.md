## Goal
Make the hero slideshow images look brighter, like they did before the dark scrim was strengthened.

## Cause
The hero images themselves have no CSS filter. The darkening comes from a navy gradient overlay (`bg-gradient-to-b from-[#081129]/… via-[#081129]/… to-[#081129]/…`) layered on top of each image in `src/components/sections/Hero.tsx` (line 190), with per-slide opacities defined in the `heroSlides` array (lines 44–100). Current values sit between 40% and 80% — that's what's flattening the photos.

## Change
Reduce every overlay's navy opacity by roughly half, so the images read bright while the white text on top stays legible.

`src/components/sections/Hero.tsx`, slide themes:

| Slide | Current overlay | New overlay |
|---|---|---|
| 1 | from `/75` via `/45` to `/70` | from `/35` via `/15` to `/30` |
| 2 | from `/65` via `/40` to `/70` | from `/25` via `/10` to `/30` |
| 3 | from `/80` via `/55` to `/80` | from `/40` via `/20` to `/40` |
| 4 | from `/75` via `/50` to `/80` | from `/35` via `/15` to `/40` |
| 5 | from `/70` via `/45` to `/75` | from `/30` via `/15` to `/35` |

No other files touched. No image assets, no layout, no copy changes.

## Out of scope
- Headline / button styling
- Removing the overlay entirely (kept at a light tint so white text remains readable)
- Per-image colour grading or filters

If you'd prefer the overlay gone completely (no scrim at all) I can do that instead — just say so before approving.