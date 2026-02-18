

## Update BloodTestingExplainer Row 2 with Medichecks Content and Video

Replace the second row's image and text with Medichecks-specific content and the uploaded video.

### What changes

**Row 1 stays the same** -- "What can blood testing do for me?" content is unchanged.

**Row 2 updates (image left, text right):**
- Replace the label with "Trusted UK Provider"
- Replace the heading with "Medichecks"
- Replace the body text with the four paragraphs provided
- Change the CTA button text to "View Medichecks tests" and link it to `/medichecks`
- Replace the `<img>` element and the ResultsCard overlay with a `<video>` element playing `Medichecks_video-3.mp4`
- Remove the `healthResults` image import (no longer needed)
- Remove the `ResultsCard` component (no longer needed)

### Asset handling

- Copy `Medichecks_video-3.mp4` to `public/videos/medichecks-promo.mp4`
- Copy `Medichecks_video-4.mp4` to `public/videos/medichecks-promo-2.mp4` (spare)
- Video will autoplay, loop, muted, playsInline (matching existing video patterns)

### Technical details

**Modified file: `src/components/sections/BloodTestingExplainer.tsx`**
- Remove `healthResults` import and the `ResultsCard` component
- Replace Row 2 `<img>` + `<ResultsCard />` with a `<video>` element sourced from `/videos/medichecks-promo.mp4`
- Update Row 2 label to "Trusted UK Provider"
- Update Row 2 heading to "Medichecks"
- Update Row 2 body copy with the user-provided four paragraphs
- Update Row 2 CTA to "View Medichecks tests" linking to `/medichecks`
- Row 1 remains untouched

