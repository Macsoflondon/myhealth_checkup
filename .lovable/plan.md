

# Centre the Mission Banner Text

## What will change

The navy banner text ("Your health is your greatest asset!") will be vertically centred with more balanced padding and kept on a single line.

## Details

**File: `src/components/sections/MissionSection.tsx`**

### 1. Increase and balance vertical padding (line 26)
- Change `py-3 sm:py-4 md:py-6 lg:py-8` to `py-6 sm:py-8 md:py-10 lg:py-12` so the text sits comfortably in the middle of the navy band with equal space above and below.

### 2. Keep text on one line (line 28)
- Add `whitespace-nowrap` to the `h2` element so the heading never wraps to a second line on any screen size.

These two small tweaks give the banner a more balanced, centred feel while keeping the gradient dividers and all existing styling intact.

