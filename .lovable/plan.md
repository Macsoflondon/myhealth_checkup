# Plan: Hero section spacing adjustment

## What we will change

In `src/components/sections/HeroMasthead.tsx` only:

1. **Increase the gap between the "Compare." H1 and the slogan span by ~two text lines.**
   - Current: `mb-3` on the `<h1>`.
   - Change to: `mb-10` (adds ~1.75rem, roughly two blank lines relative to the `text-lg` slogan).

2. **Reduce the remaining hero footer whitespace to a single line.**
   - Current: `<div className="h-10 sm:h-14" aria-hidden="true" />`.
   - Change to: `<div className="h-5 sm:h-6" aria-hidden="true" />`.

This reuses the dead space freed by moving the stat cards into `StatsBand`, shifting it upward between the headline and slogan while keeping a minimal one-line gap below the hero image.

## Why this approach

- Keeps all changes inside the hero component — no impact on the category bar, sticky toolbar, or `StatsBand`.
- Preserves the already-removed stat-card block; we are only tuning the residual whitespace.
- Uses existing Tailwind spacing scale for predictable responsive behaviour.

## Verification

- Build the project and check the preview at desktop and mobile viewport.
- Confirm:
  - The slogan sits visibly lower than the H1 by about two lines.
  - Only a single blank line remains between the bottom of the hero image and the end of the hero section.
  - No layout overlap with `BrowseByCategoryBar` or `StatsBand`.

## Files touched

- `src/components/sections/HeroMasthead.tsx`