## Goal

Add the 4 new Goodbody fingerprint kit images (General Health, Cholesterol, Essential Well Man, Essential Well Woman) to the "Our Featured Partner of the Month" bento, mixed evenly with the existing 6 kit tiles. Image sizing inside the containers must match the current Goodbody tiles exactly.

## Files

- `src/components/sections/GoodbodyBentoShowcase.tsx` (only file touched)

## Upload assets

Use the lovable-assets CLI to upload the 4 user-supplied screenshots, then write `.asset.json` pointers under `src/assets/goodbody/`:

- `general-health-fingerprint.jpg.asset.json`
- `cholesterol-fingerprint.jpg.asset.json`
- `essential-well-man-fingerprint.jpg.asset.json`
- `essential-well-woman-fingerprint.jpg.asset.json`

Import each pointer JSON and reference `.url` from the `KIT` map. Keep existing `/images/tests/*.webp` paths for the 6 current tiles.

## Tile routing (per user choice)

- General Health → `/test/general-health`
- Cholesterol (fingerprint) → `/test/lipid-profile`
- Essential Well Man → `/tests/mens-health`
- Essential Well Woman → `/tests/womens-health`

## Layout changes

10 KitTiles + logo + callout. Reuse the existing `KitTile` component unchanged (same `aspect-square`, `object-contain p-2` — image sizing identical to current tiles).

Desktop (sm+): switch from `sm:grid-cols-3` to `sm:grid-cols-4`. New arrangement (4 cols × 4 rows, callout spans 2 cols × 2 rows for breathing room):

```text
Row 1: AdvWellMan | Logo            | PremiumComplete | GeneralHealth(NEW)
Row 2: EarlyCancer| Callout (2x2)   | <-spans->       | FemaleHormone
Row 3: WellWoman(NEW)|<-callout->   | <-callout->     | WellMan(NEW)
Row 4: Thyroid    | Cholesterol     | CholesterolFP(NEW) | SportsFitness*
```

(*If a 16th slot is undesired, swap last row to: Thyroid | Cholesterol(orig) | CholesterolFP(NEW) | — leave one empty or compress callout to span 2x3. Final balance decided during build to keep every row full.)

Mobile (<sm): keep 2-col structure, append two extra 2-tile rows so new fingerprint kits interleave with originals:

```text
Logo (2-wide)
AdvWellMan        | GeneralHealth(NEW)
PremiumComplete   | WellMan(NEW)
Callout + CTA (2-wide)
EarlyCancer       | FemaleHormone
WellWoman(NEW)    | CholesterolFP(NEW)
Thyroid           | Cholesterol(orig)
```

This evenly distributes the 4 new tiles across the grid on both breakpoints.

## Image sizing parity

No change to `KitTile`: same `aspect-square` container, same `object-contain p-2`. The new uploads are square-ish photos so they render at the same visual scale as existing kit shots.

## Out of scope

- No copy/heading/callout text changes.
- No new routes, no data-layer changes.
- No changes to other sections.
