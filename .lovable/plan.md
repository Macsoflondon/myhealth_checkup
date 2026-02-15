

# Remove Gap Between Gradient Divider and Stats

## What will change

The empty space between the multicoloured gradient divider (at the bottom of the Mission Section) and the "200+" stats will be eliminated. The turquoise border on the stats section will also be removed.

## Details

### 1. Remove bottom padding from MissionSection (`src/components/sections/MissionSection.tsx`, line 20)
- Change `pb-6 sm:pb-8 md:pb-10 lg:pb-14` to `pb-0` so nothing sits below the gradient divider
- Also remove the bottom margin on the divider wrapper (`mb-5 sm:mb-6 md:mb-8 lg:mb-12` on line 22) since there is no content below it

### 2. Strip turquoise border and reduce top padding on StatsHighlight (`src/components/sections/StatsHighlight.tsx`, line 10)
- Remove `border-t-4 border-primary` (the turquoise line)
- Change `pt-4` to `pt-2` (and similar for sm/md) so the stats sit just a few lines below the gradient divider

This keeps the multicoloured gradient divider intact while closing the gap directly above the statistics.

