

## GoodBody Row 1 Polish -- Spacing, Video, and Text Improvements

### What changes

All changes are in `src/components/sections/PartnerShowcaseGrid.tsx`, Row 1 (GoodBody) only.

**1. Add spacing between heading text and logo**
- Change the `gap-4` on the flex container (line 36) to `gap-16` to create generous separation between the "Know more. Live Better." heading block and the GoodBody logo on desktop.

**2. Vertically centre the heading text against the logo**
- Change `md:items-start` to `md:items-center` on the flex container so "Know more. Live Better." sits at the vertical midpoint of the logo rather than top-aligned.

**3. Video: crop top/bottom slightly and enlarge**
- Wrap the video in an `overflow-hidden` container with negative vertical margins or use `object-cover` with a taller fixed aspect ratio to trim a small amount from the top and bottom.
- Change the video from `object-contain aspect-video` to `object-cover aspect-[16/8]` (wider crop ratio trims top and bottom edges) and scale the container up with `scale-110` on the video element itself so the visible content is larger without losing meaningful content. The `overflow-hidden` on the parent ensures the cropped edges are hidden cleanly.

**4. Brighten GoodBody text**
- The "Trusted UK Provider" label is already turquoise. The heading "Know more. Live Better." is already `text-white`. The paragraph text is `text-white/70`. No changes needed for heading brightness -- it is already bright white.
- If the paragraphs feel dim, they can stay at `text-white/70` as this is the established pattern.

**5. Add vertical breathing room**
- Increase `space-y-5` on the text column (line 35) to `space-y-7` so paragraphs are not cramped.
- Add `mb-12` or increase `mb-8` to `mb-14` on the row container (line 34) to give more space between Row 1 and Row 2.

**6. CTA link verification**
- The link already points to `/providers/goodbody-clinic` (line 58) which is correct.

### Technical details

**File: `src/components/sections/PartnerShowcaseGrid.tsx`**

Line 34 -- increase bottom margin:
```
- className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center mb-8"
+ className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-center mb-14"
```

Line 35 -- increase paragraph spacing:
```
- className="space-y-5 text-center md:text-left"
+ className="space-y-7 text-center md:text-left"
```

Line 36 -- widen gap and vertically centre:
```
- className="flex flex-col md:flex-row md:justify-between md:items-start gap-4"
+ className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-16"
```

Lines 65-74 -- video container with crop and scale:
```
- <div className="relative">
-   <video ... className="rounded-xl w-full object-contain aspect-video" />
- </div>
+ <div className="relative overflow-hidden rounded-xl">
+   <video ... className="w-full object-cover aspect-[16/8] scale-110" />
+ </div>
```

This trims the top and bottom edges of the video while scaling it up, and the `overflow-hidden` on the parent keeps the crop clean within rounded corners.

