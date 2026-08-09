# Tighten homepage hero header and toolbar spacing

Compress the vertical space above the homepage slogan and between the slogan and the hero image carousel, while keeping the category toolbar buttons vertically centred in the white band.

## Changes

1. **Reduce the H1/slogan area height from the top by two lines**
   - Trim the top padding of the slogan container in `HeroMasthead.tsx` by roughly two standard text lines on desktop (`sm:` / `lg:` breakpoints).
   - This moves the wordmark + "Your health. Your choice." block upward.

2. **Bring the hero carousel closer to the H1**
   - Reduce the vertical height of the white category toolbar band so the hero image carousel sits closer to the slogan area.
   - This will be done by trimming the toolbar's vertical padding, not by removing the pink hairline dividers.

3. **Centre toolbar buttons vertically in the remaining band**
   - Ensure the `BrowseByCategoryBar` buttons remain perfectly centred within the reduced white toolbar band by using equal top/bottom padding and/or flex centring on the band wrapper.

## Technical details

- File: `src/components/sections/HeroMasthead.tsx`
- "Two lines" will be interpreted as approximately 2rem of reduced top padding on desktop.
- The white toolbar band will keep its brand-pink top and bottom borders.
- After the change the hero image carousel will start noticeably closer to the slogan area.
