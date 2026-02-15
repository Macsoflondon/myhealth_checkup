

# Replace the First Partner Video (Properly This Time)

## What will change

The left/first video in the "Featured Partners of the Month" section will be properly replaced with your uploaded video file (`Untitled_Mobile_Video_1-2.mp4`).

## Steps

**1. Copy your uploaded video into the project**
- Copy `user-uploads://Untitled_Mobile_Video_1-2.mp4` to `src/assets/partner-video.mp4`, overwriting the existing file completely.

**2. Update the aria-label (line 19)**
- Change the aria-label from "GoodBody Clinic..." to something more appropriate for the new video content.

The import and source reference in `BrandVideoSection.tsx` already point to `partner-video.mp4`, so once the actual file is properly overwritten with your new upload, the correct video will display.

## What comes next
Once this is done, you can upload the new Medichecks video and we will replace the second (right) video in the same way.

