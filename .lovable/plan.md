
# Make the Partners Carousel Section Dark Blue

## What will change

The "Our Trusted Partners" carousel section will get a dark blue background with updated text and card styling to match.

## Details

**File: `src/components/sections/PartnersGrid.tsx`**

### 1. Section background (line 17)
- Change `bg-muted/30` to `bg-[#081129]`

### 2. Heading text (lines 19-23)
- Add `titleClassName="text-white"` to the `SectionHeading` so "Our Trusted" displays in white against the dark background

### 3. Carousel card styling (line 34)
- Change `bg-background` to `bg-white` so the logo cards remain visible
- Update `border-border/50` to `border-white/20` for a subtle border on dark background
- Update hover shadow from `hover:shadow-primary/10` to `hover:shadow-[#22c0d4]/20` for a turquoise glow

These changes keep the carousel logos clearly visible on white cards while giving the section a bold navy backdrop consistent with the rest of the homepage design rhythm.
