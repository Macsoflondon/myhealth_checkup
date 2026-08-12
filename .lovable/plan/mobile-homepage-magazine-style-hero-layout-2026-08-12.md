# Mobile homepage: magazine-style hero layout

## Goal
Apply the chosen "magazine editorial layered" direction to the mobile homepage, but drop the asymmetric left-text/right-image hero split and keep the full-bleed hero imagery.

## What changes

### Mobile-only scope
All changes apply only below the `md` breakpoint. Desktop stays as-is.

### 1. Keep the existing top surfaces
- Scrolling category ticker strip at the very top.
- White brand bar: `myhealthcheckup` wordmark + hamburger + "Your health. Your choice." slogan.

### 2. Replace the asymmetric hero block with a full-bleed hero image
- Remove the magazine-style 5/12 text + 7/12 skewed image layout.
- Render the existing hero carousel image full-bleed at roughly 280–320 px height on mobile.
- Keep the existing `SLIDES` rotation and LQIP fade behaviour.

### 3. Add the overlapping navy caption band
- Position a navy card over the bottom of the hero image, inset with side margins (`mx-5` or similar).
- Copy: `HERO_CAPTION` — "Your trusted platform for comparing private health and screening tests."
- Add a 2 px pink (`#e70d69`) border along the bottom edge of the card for the layered editorial accent.

### 4. Restyle the accreditation standards grid
- Convert the six standards into a two-column list with thin coloured underline rules instead of circular icon tiles.
- Alternate underline colours: turquoise (`#22c0d4`), pink (`#e70d69`), navy (`#081129`).
- Keep the exact labels: UKAS-Accredited Labs, CQC-Regulated Clinics, ISO 15189 Certification, GDPR Compliant, Transparent Pricing, No GP Referral Needed.
- Add a small uppercase section label above the grid, e.g. "Our clinical standards".

### 5. Remove the current white standards section header caption
- The caption now lives on the hero overlap card, so hide it from `AccreditedProvidersBar.tsx` on mobile (it is already `hidden md:block`).

## Files to edit
- `src/components/sections/HeroMasthead.tsx` — mobile hero layout, full-bleed image, overlapping caption card.
- `src/components/sections/AccreditedProvidersBar.tsx` — restyle the six standards into the two-column underline-grid for mobile.
- `src/components/layout/BrowseByCategoryBar.tsx` — confirm the mobile brand bar/slogan styling still sits cleanly above the new hero.

## Verification
- Build passes (`npm run build:dev`).
- Mobile preview (390–393 px) shows: ticker → white brand bar → full-bleed hero image → navy caption card overlapping the hero bottom → standards grid.
- No layout regressions on desktop.
