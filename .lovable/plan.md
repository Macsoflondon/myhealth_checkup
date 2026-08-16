# Increase header brand title and slogan font sizes

## Goal
Make the "myhealthcheckup" brand title and "Your health. Your choice." slogan in the site header larger by another two font-size steps across all breakpoints.

## Proposed changes

1. Update `src/components/layout/BrowseByCategoryBar.tsx`:
   - **Brand title** (line ~196): bump arbitrary font sizes up by two steps.
     - Mobile: `text-[36px]` → `text-[44px]`
     - Tablet: `md:text-[54px]` → `md:text-[64px]`
     - Desktop: `lg:text-[64px]` → `lg:text-[76px]`
   - **Slogan** (line ~201): step up through Tailwind standard classes.
     - Mobile: `text-xs` → `text-sm`
     - Small: `sm:text-sm` → `sm:text-base`
     - Medium: `md:text-base` → `md:text-lg`
   - **Container height** (line ~196): increase link height so the larger text does not clip.
     - `h-12 md:h-[72px] lg:h-[84px]` → `h-14 md:h-[84px] lg:h-[96px]`

## Verification
- Run `npm run lint` to confirm no style issues.
- Check desktop and mobile previews to ensure text remains vertically centred and does not wrap or clip.
