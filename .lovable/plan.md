

## Change Quiz Background to Faint Turquoise

Replace the light pink gradient background on the Assisted Test Finder page with a faint turquoise gradient.

### What changes

**File: `src/components/tests/AssistedTestFinder.tsx`**

There are 4 instances of `bg-gradient-to-b from-secondary/10 to-background` (on the welcome, loading, results, and main quiz step wrappers). Each will be changed to:

`bg-gradient-to-b from-[hsl(187_72%_48%/0.1)] to-background`

This uses the brand turquoise (#22c0d4) at 10% opacity, creating a faint turquoise wash that fades to white -- matching the existing gradient pattern but in the correct colour.

