

# Replace Brand Video Section with Goodbody and Medichecks Animations

## What changes

The current single brand video section (section 9) will be replaced with two provider-specific animations displayed side by side. The standalone Goodbody logo section (section 5) will be removed since Goodbody is now featured in the video section.

## Steps

### 1. Add the two uploaded videos to the project

Copy both uploaded video files into `src/assets/`:
- `Your_health._Your_choice._One_trusted_platform!_3.mp4` as `goodbody-animation.mp4`
- `Your_health._Your_choice._One_trusted_platform!_4.mp4` as `medichecks-animation.mp4`

### 2. Update BrandVideoSection to show two videos side by side

Rewrite `src/components/sections/BrandVideoSection.tsx` to display two looping, muted, autoplay videos in a two-column grid layout:
- Left: Goodbody animation
- Right: Medichecks animation
- On mobile, the videos stack vertically
- Both retain the navy background and rounded corners styling

### 3. Remove GoodbodyFeatureSection from the homepage

Edit `src/pages/Index.tsx`:
- Remove the `GoodbodyFeatureSection` import and its usage (section 5)
- The section order shifts: Stats Highlight is now followed directly by Partners Grid

### 4. Clean up exports

Remove `GoodbodyFeatureSection` from `src/components/sections/index.ts` if it is listed there.

## Technical details

| Action | File | Detail |
|--------|------|--------|
| Copy | `src/assets/goodbody-animation.mp4` | Uploaded video 3 |
| Copy | `src/assets/medichecks-animation.mp4` | Uploaded video 4 |
| Edit | `src/components/sections/BrandVideoSection.tsx` | Two-column video grid |
| Edit | `src/pages/Index.tsx` | Remove GoodbodyFeatureSection |
| Optional | `src/components/sections/index.ts` | Remove unused export |

No new dependencies required.

