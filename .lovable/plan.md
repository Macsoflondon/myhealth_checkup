

## Replace GoodBody Video and Slow Playback

### Changes

**1. Copy the uploaded video to the public folder**
- Copy `user-uploads://White_Beige_Aesthetic_Minimalist_Photo_Collage_Zoom_Effect_Instagram_Reel.mp4` to `public/videos/goodbody-promo.mp4` (overwriting the existing file)

**2. Slow the video playback to 0.5x** (`src/components/sections/PartnerShowcaseGrid.tsx`, line 63-70)
- Add a `ref` to the GoodBody `<video>` element
- Use a `useEffect` + `onLoadedMetadata` or inline `ref` callback to set `video.playbackRate = 0.5`

### Implementation Detail

Add `useRef` import and a ref callback on the video element:

```tsx
import { useRef, useEffect } from "react";
```

On the video element (line 63-70), add a ref callback that sets playback rate:

```tsx
<video
  ref={(el) => { if (el) el.playbackRate = 0.5; }}
  src="/videos/goodbody-promo.mp4"
  autoPlay
  loop
  muted
  playsInline
  className="w-full object-contain rounded-xl"
/>
```

### Files Changed

| File | Change |
|---|---|
| `public/videos/goodbody-promo.mp4` | Replaced with uploaded video |
| `src/components/sections/PartnerShowcaseGrid.tsx` | Added ref callback to set `playbackRate = 0.5` on GoodBody video |

