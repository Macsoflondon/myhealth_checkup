# Biomarker library — hero rebuild + menu rename

## What changes

**1. Hero header (the navy block at the top of /biomarker-database)**

Right now it's a one-off design: left-aligned, Playfair serif headline, a turquoise chip, a long two-line paragraph and four tick-stats floating underneath. It doesn't match any other page.

It gets rebuilt to the standard category header used everywhere else on the site:

- Navy `#081129` panel with the subtle dot grid and the two ambient glow orbs (same as every category page).
- Centred title flanked by short pink hairlines: **Complete Biomarker Reference Library**.
- Tricolour divider bar (turquoise → pink → turquoise) closing the section.
- Montserrat, not Playfair — the serif goes.
- The intro sentence is kept but shortened to one centred line under the title, in muted white.
- The four tick items (101 Biomarkers / 17 Categories / Sex-Specific Ranges / Clinical Tips) become a compact centred row of small turquoise-tick stats sitting above the divider, so the section reads as one tidy block rather than a stack of loose parts.
- Biomarker and category counts stay derived from the data, not hardcoded.

The sticky search + category filter strip below is left as-is structurally, but the chips get brought onto brand tokens (navy active state, turquoise accents) so the join between the two sections doesn't look like two different sites.

**2. Rename in the More menu**

"Biomarker Library" becomes **"Complete Biomarker Reference Library"** in:

- the More dropdown / navigation items list
- the toolbar icon map key so it keeps its icon and colour
- the breadcrumb label map
- the route's SEO title

Route path `/biomarker-database` is unchanged, so no links break.

## Technical notes

- `src/components/biomarker-library/BiomarkerLibraryUI.tsx` — replace the hero `<div>` (currently inline-styled, lines ~162–178) with the `CategoryStandardHero` pattern; add the stats row and strapline inside it. Drop the Playfair `@import` style tag and swap remaining Playfair usages in section/card headings to Montserrat.
- `src/components/header/NavigationItems.tsx:150`, `src/components/layout/BrowseByCategoryBar.tsx:31`, `src/components/common/SiteBreadcrumb.tsx:25`, `src/routes/biomarker-database.tsx` — label rename.
- Colour values continue to come from the existing `COLORS` map in `biomarkerData.ts` (navy/turquoise/pink already correct there).
- Check at 390px, 768px and 1440px: title wraps cleanly, stat row wraps to two lines on mobile without breaking the divider.
