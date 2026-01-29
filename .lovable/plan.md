

# Fix Video Cropping in TaglineVideoSection

## Problem

The video is currently using `object-cover` CSS property, which scales the video to completely fill the container while cropping any overflow. This results in parts of the video being cut off.

## Solution

Change from `object-cover` to `object-contain` so the entire video is visible within the container without any cropping. The video will scale to fit within the box while maintaining its aspect ratio.

## Technical Change

**File:** `src/components/sections/TaglineVideoSection.tsx`

| Line | Current | Updated |
|------|---------|---------|
| 13 | `object-cover` | `object-contain` |

**Before:**
```tsx
className="absolute inset-0 w-full h-full object-cover"
```

**After:**
```tsx
className="absolute inset-0 w-full h-full object-contain"
```

## Result

The full video will be visible within the container box. If the video's aspect ratio differs from the 16:9 container, there may be some empty space (letterboxing) on the sides or top/bottom, but no content will be cropped.

