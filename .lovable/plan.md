

## Plan: Hero Photo Adjustments and Badge Relocation

**File**: `src/components/sections/Hero.tsx`

### Changes

1. **Lighten all hero photos** — Reduce the dark overlay opacity from `bg-[#081129]/55` to `bg-[#081129]/40` (line 103).

2. **Home kit photo** (`heroHomeKit`) — Shift `objectPosition` from `18% 25%` to `center 45%` to push the test kit higher into view above the search container (line 27).

3. **Laptop/results photo** (`heroEmpowered`) — Shift `objectPosition` from `center 30%` to `center 45%` to bring the laptop screen into the visible area (line 16).

4. **Couple walking photo** (`heroActive`) — Shift `objectPosition` from `center 20%` to `center 35%` to show faces more prominently (line 33).

5. **Compare photo** (`heroCompare`) — Shift `objectPosition` from `center 25%` to `center 35%` (line 39).

6. **Move the "UK's Leading..." badge** — Relocate it from its current position above the H1 (lines 108–112) to below the popular search container and above the trust signals (after line 188). This frees up vertical space so hero images (especially the walkers) are less obscured by UI elements at the top.

### Limitation

The request to black out the mobile phone screen in `heroClinic` or `heroActive` requires editing the actual image file — this cannot be done with CSS/code alone. I'd recommend editing the source `.jpg` in an image editor and re-uploading it.

