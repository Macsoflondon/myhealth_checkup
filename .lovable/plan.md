
## Goodbody Bento Showcase — Rearrangement

Edits to `src/components/sections/GoodbodyBentoShowcase.tsx`.

### Tile swaps

1. **Top-right ↔ top-center swap**
   - Move **Premium Complete Blood Test** kit into the top-right slot (currently the GOODBODY logo card).
   - Move the **GOODBODY logo card** into the top-center slot (currently Premium Complete).
   - Top-left stays: Advanced Well Man.

2. **Middle-bottom row reshuffle**
   - Replace **EpiSwitch PSE (Prostate)** tile (right side of third row) with **Cholesterol Blood Test**.
   - Remove EpiSwitch entirely from the grid.

3. **Bottom strip (3 tiles → 2 tiles + blank CTA slot)**
   - Remove the bottom **Cholesterol** tile (it's been promoted up a row).
   - Keep **Vitamins** (left) and **Sports & Fitness** (right).
   - Center bottom slot becomes **blank** — leave empty so the existing "View Goodbody Profile" CTA below sits cleanly with breathing room (no tile, no placeholder card).

### Final layout

```
[ Advanced Well Man ] [ GOODBODY LOGO ]    [ Premium Complete ]
[ Early Cancer      ] [ Callouts x2  ]    [ Female Hormone   ]
[ Thyroid           ] [ Callouts x2  ]    [ Cholesterol      ]
[ Vitamins          ] [   (blank)    ]    [ Sports & Fitness ]
```

### Sizing fix (overlap with "Our Providers Most Popular Tests")

Reduce tile row heights so the section no longer overlaps the next section:
- `auto-rows-[110px] sm:auto-rows-[140px]` → `auto-rows-[88px] sm:auto-rows-[112px]`
- Reduce logo size in the center logo card to keep proportions: `h-16 sm:h-20 md:h-24` → `h-12 sm:h-16 md:h-20`
- Tighten KitTile inner padding from `p-4` → `p-3` so the shrunken tiles still display the kit imagery clearly.

No other components or styles touched.
