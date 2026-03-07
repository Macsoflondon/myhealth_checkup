

## Plan: Reduce Desktop Header Height

The logo image currently uses `h-32 lg:h-40 xl:h-48` (128px / 160px / 192px). Reducing these by ~20-25% will trim space above and below the logo without changing the logo's aspect ratio or the button sizes.

**File:** `src/components/layout/Header.tsx` (line 96)

Change logo heights from:
- `h-32` → `h-28`
- `lg:h-40` → `lg:h-34` (use arbitrary `lg:h-[136px]`)
- `xl:h-48` → `xl:h-40`

This removes roughly one line of space above and one below the logo, shrinking the header while keeping the logo, slogan, and buttons visually unchanged.

