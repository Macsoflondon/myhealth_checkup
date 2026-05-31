## Changes to `src/components/layout/Header.tsx` (desktop docked state only)

1. **Center the docked search bar**
   - Keep the left spacer at `flex-1` even when `isSearchDocked` (don't collapse it to `flex-[0]`), so the logo + search sit in the center flow.
   - Wrap the docked search container so it occupies a centered fixed-max-width slot: `flex-1 flex justify-center` with the inner input capped at `max-w-[640px]`.
   - Keep the right controls (`LanguageSwitcher` + `UserMenu`) at `flex-1 justify-end` in both states — they already do this; just ensure no width change happens when docking, so they stay visually anchored to the right edge.
   - Net effect: logo on left (unchanged position), search centered between logo and right controls, right controls don't shift.

2. **Make the sticky (docked) bar ~3 lines taller**
   - Increase docked vertical padding from `py-2 md:py-3` to roughly `py-8 md:py-10` (about 3 extra lines of ~16px line-height = ~48px added height).
   - Optionally bump the docked logo height slightly (`h-12 md:h-14 lg:h-16`) so the larger bar doesn't look empty.
   - Undocked padding (`py-4 md:py-6 lg:py-8`) stays unchanged.

## Out of scope
- Mobile header, promo ticker behaviour, nav toolbar, hero section, search submission logic.
