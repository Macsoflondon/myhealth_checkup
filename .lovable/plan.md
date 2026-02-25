

## Fix: Re-copy Uploaded Video and Force Cache Bust

### Problem
The code in `PartnerShowcaseGrid.tsx` is correct — it references `/videos/goodbody-promo.mp4` with the 0.5x playback rate. However, the uploaded video file may not have replaced the original correctly, or the browser is serving a cached version of the old video.

### Solution

**1. Re-copy the uploaded video file** (overwrite `public/videos/goodbody-promo.mp4`)
- Copy `user-uploads://White_Beige_Aesthetic_Minimalist_Photo_Collage_Zoom_Effect_Instagram_Reel.mp4` → `public/videos/goodbody-promo.mp4`

**2. Add a cache-busting query parameter** to force the browser to load the new file (`src/components/sections/PartnerShowcaseGrid.tsx`, line 65)

Change:
```tsx
src="/videos/goodbody-promo.mp4"
```
To:
```tsx
src="/videos/goodbody-promo.mp4?v=2"
```

This query string forces the browser to treat it as a new resource and bypass any cached version of the old video.

### Files Changed

| File | Change |
|---|---|
| `public/videos/goodbody-promo.mp4` | Re-copied from uploaded video |
| `src/components/sections/PartnerShowcaseGrid.tsx` | Added `?v=2` cache-bust parameter to video src |

