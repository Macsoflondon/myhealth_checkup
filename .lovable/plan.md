

# Remove Medichecks Video

## What will change

The video section on the right half of the Medichecks card (bottom-right) will be completely removed. The card will keep only the Medichecks logo, heading, description text, and the "View Medichecks tests" button. The card layout will switch from a split text/video layout to a full-width text-only card (matching the Goodbody card above it).

## Technical details

**File:** `src/components/sections/PartnerShowcaseGrid.tsx`

1. **Remove the video import** (line 3) -- `import medichecksVideo` is no longer needed
2. **Remove the video container** (lines 138-150) -- the entire `lg:w-[45%]` div containing the `<video>` element
3. **Remove the width constraint** on the text div (line 118) -- change `lg:w-[55%]` to full width since video is gone
4. **Simplify the card flex direction** (line 117) -- remove `lg:flex-row` since there is no longer a two-column layout needed

Also clean up the unused `goodbodyVideo` import on line 2 since it was removed earlier but the import may still be there.

