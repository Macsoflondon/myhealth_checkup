

# Centre the StatsHighlight Section Content Vertically

## What is changing

The StatsHighlight section currently has very little top padding (`pt-2`) but much more bottom padding (`pb-10` to `pb-16`), which pushes the stats text upward and close to the top border. The fix is to equalise the top and bottom padding so the content sits centred vertically within the section.

## Change

**In `src/components/sections/StatsHighlight.tsx` (line 10):**

Update the section padding from asymmetric (`pt-2 pb-10 sm:pt-2 sm:pb-12 md:pt-3 md:pb-16`) to balanced padding (`py-10 sm:py-12 md:py-16`). This gives equal space above and below the stats, centering them within the section.

