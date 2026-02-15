
# Crop the Partner Video from Top and Bottom

## What is changing

The partner video next to the Goodbody card will be cropped from the top and bottom using CSS `overflow-hidden` on the container and `object-cover` on the video. This trims roughly two lines of content from the top and bottom edges without touching the Goodbody card.

## Changes

**In `src/components/sections/PartnerShowcaseGrid.tsx`:**

1. **Video container** (the `div` wrapping the video): ensure it has `overflow-hidden` and a constrained height so the video overflows and gets clipped.
2. **Video element**: change from `max-h-[400px] w-auto object-contain` to `w-full h-full object-cover`. This makes the video fill the container and crop equally from top and bottom rather than shrinking to fit.
3. The `rounded-2xl` stays on the container to keep rounded corners on the cropped result.

The Goodbody card is not touched at all.
