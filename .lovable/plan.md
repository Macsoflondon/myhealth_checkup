

# Place Partner Video Next to Goodbody Card

## What you want

Take the first video from the "Featured Partners of the Month" section (the one at `/videos/partner-video.mp4`) and put it into the empty space next to the Goodbody card in the Partner Showcase Grid.

## New layout

```text
+-------------------------+-------------------------------+
| Goodbody (white card)   | Partner Video (looping)       |
+-------------------------+-------------------------------+
| Find a Clinic (navy)    | Take Control (navy)           |
+-------------------------+-------------------------------+
```

## Changes

**1. `src/components/sections/PartnerShowcaseGrid.tsx`**

- Replace the empty placeholder `<div className="hidden md:block" />` with a navy-background card containing the looping partner video (`/videos/partner-video.mp4`)
- The video card will use `rounded-2xl`, autoPlay, loop, muted, playsInline to match the existing style
- No new imports needed since the video is served from the public folder

**2. `src/components/sections/BrandVideoSection.tsx`**

- Remove the first (left) video element that references `/videos/partner-video.mp4`, since it is moving into the grid
- Keep the second Medichecks video in place
- Update layout classes so the remaining single video is centred

