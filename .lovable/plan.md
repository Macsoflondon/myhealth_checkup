

# Add New Medichecks Video

## What will change

The uploaded video (Medichecks_video-2.mp4) will be added to the right half of the Medichecks card (bottom-right), restoring the split text/video layout that was just removed but with the new video file.

## Technical details

1. **Copy the uploaded video** to `src/assets/medichecks-animation.mp4` (replacing the old one)
2. **File:** `src/components/sections/PartnerShowcaseGrid.tsx`
   - Re-add the `import medichecksVideo from "@/assets/medichecks-animation.mp4"` import
   - Change the card container back to `flex flex-col lg:flex-row`
   - Add `lg:w-[55%]` back to the text div
   - Re-add the `lg:w-[45%]` video container with the `<video>` element (autoPlay, loop, muted, playsInline, object-cover, full height)

The result will be the same split layout as before, but with the new video file.

