

# Match Video Height to Goodbody Card

## What is changing

The partner video next to the Goodbody card will be sized to match the full height of the Goodbody card, so both columns appear equal.

## Changes

**In `src/components/sections/PartnerShowcaseGrid.tsx`:**

1. **Remove `items-center` from the grid container** — revert to the default `items-stretch` so both columns match height.
2. **Update the video element** — change from `max-h-[400px] w-auto object-contain` to `w-full h-full object-cover` so the video fills the entire container, matching the card height.

This gives a clean side-by-side layout where the video column is exactly the same height as the Goodbody card.

