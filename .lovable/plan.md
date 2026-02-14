

# Fix Medichecks Video Display

## What will change

The video is currently cropped because `object-cover` forces it to fill the container, cutting off parts of the video. The fix will change the video fitting so the full video is visible within the card.

## Technical details

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

1. **Change video object-fit** (line 144): Switch from `object-cover` to `object-contain` so the entire video is visible without cropping
2. **Add a background colour** to the video container (line 137): Add `bg-[#081129]` (or a neutral colour matching the video's background) so any letterboxing looks intentional rather than leaving white gaps
3. **Add vertical centering** to the video container: Add `flex items-center justify-center` so the video sits centred within its space

