

# Replace GoodBody Video with Uploaded Video

## What will change

The GoodBody animation video (left/first video) in the "Featured Partners of the Month" section will be removed and replaced with your uploaded video.

## Details

**File: `src/components/sections/BrandVideoSection.tsx`**

### 1. Replace the video import (line 1)
- Remove `import goodbodyVideo from "@/assets/goodbody-animation.mp4"`
- Add `import partnerVideo from "user-uploads://Untitled_Mobile_Video_1.mp4"`

### 2. Update the video source (line 21)
- Change the `src` from `goodbodyVideo` to `partnerVideo`
- Update the `aria-label` to reflect the new video content

Everything else (the Medichecks video, layout, styling, and autoplay behaviour) stays exactly as it is.

