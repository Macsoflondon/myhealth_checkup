

## Zoom Out Hero Background Images

Currently the hero images use `object-cover` which crops tightly. To "zoom out" (show more of each image), we scale the images down slightly within their container using a CSS transform.

### Change

**File: `src/components/sections/Hero.tsx`** (line 95)

Add `scale-[0.85]` to the image className. This shrinks each image to 85% within the absolutely-positioned container, revealing more of the photograph while still filling the frame. Combined with `object-cover`, the visible area expands without leaving gaps.

