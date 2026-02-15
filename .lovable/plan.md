

# Compact the Goodbody Card and Align Video

## What is changing

The Goodbody white card currently has 3 separate paragraphs of description text, making it tall. You want:
1. Condense the 3 paragraphs into a single shorter block so there are roughly 3 lines of text above the button
2. Reduce internal padding further to shrink the card
3. Reduce the Goodbody logo size further
4. Make the partner video only take up half the height of the new smaller Goodbody card (aligned to top), rather than stretching to fill the full height

## Changes

**In `src/components/sections/PartnerShowcaseGrid.tsx`:**

**Goodbody card content:**
- Merge the 3 description paragraphs into a single concise paragraph (~3 lines), e.g.:
  "GoodBody Clinics provide comprehensive private health checks at affordable prices across 200+ nationwide locations or via home testing. CQC regulated, UKAS-accredited labs, with GP-reviewed results and over 60 blood and wellness tests to choose from."
- Reduce inner padding from `p-5 lg:p-6` to `p-4 lg:p-5`
- Reduce logo height from `h-[140px]` to `h-[100px]`
- Reduce bottom margin on the paragraph from `mb-4` to `mb-3`

**Video card:**
- Change the video container from `items-center justify-center` (full stretch) to `items-start` so it aligns to the top
- Add `h-1/2` to the video element so it only occupies roughly half the container height, matching the new compact Goodbody card visually

