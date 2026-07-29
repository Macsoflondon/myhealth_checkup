## Goal
Clean up the desktop/tablet hero header block in `src/components/sections/HeroMasthead.tsx` (mobile layout unchanged).

## Changes

1. **Language switcher + login on the slogan line**
   - Remove the separate controls row (the `hidden sm:flex items-center justify-end …` block that currently sits below the slogan).
   - Put `LanguageSwitcher` and `UserMenu` in a right-aligned group on the same flex row as the slogan: slogan left, controls right, vertically centred, with a small gap so the slogan can wrap safely on narrower tablet widths.

2. **Reduce the gap to the hero image**
   - Drop the now-redundant `mt-6/mt-8` spacing that came with the removed controls row, and tighten the hero image container's top margin so the picture sits closer under the slogan.

3. **Brighten the hairline divider**
   - The line between the wordmark and the slogan currently uses `border-white/10`. Raise it to roughly `border-white/25` so it is visible but still a hairline. The lower divider disappears with the removed row, so only the one line remains.

## Notes
- No changes to business logic, data, or the mobile header (which keeps its own controls in `BrowseByCategoryBar`).
- Verified after implementation by screenshotting the desktop hero in the running preview.
