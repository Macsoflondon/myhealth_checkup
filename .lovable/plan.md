# Trusted Providers page hero and spacing fixes

## Goal
Tighten the `/trusted-providers` page so the hero strapline is updated and the large empty white gap below the hero divider is removed.

## Changes

### 1. Update hero strapline
- File: `src/pages/TrustedProvidersPage.tsx`
- Replace the `strapline` prop on `<StandardPageHero />` with:
  "All our partners have been stringently assessed and are accredited and verified, using only UKAS-accredited laboratories and CQC-regulated clinics."

### 2. Remove the highlighted white space
- File: `src/components/sections/FeaturedProvidersGlass.tsx`
- The gap is created by the section's top padding (`py-16 md:py-24`) plus an empty header div with `py-10`.
- Reduce the section top padding to `pt-8 md:pt-10` (or remove entirely) and delete the empty header div that currently reserves vertical space.
- Keep the provider grid and trust footer unchanged.

## Acceptance criteria
- The hero paragraph displays the new strapline.
- No large blank white band appears between the hero gradient divider and the first provider card on mobile or desktop.
- Provider cards and trust footer remain visually intact.
