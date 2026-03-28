

# Fix Goodbody Gallery — Mobile Layout & Tab Navigation

## Issues identified from screenshot (448px viewport)

1. **Tab navigation wraps awkwardly** — With 5 items (About + 4 category tabs), they wrap into uneven rows. Adding "Vitamin & Nutrition" makes this worse.
2. **Logo takes excessive vertical space** — The logo block (h-40/h-48) pushes tabs far down, and the side-by-side layout breaks on small screens.
3. **Broken test images** — Cards show `?` placeholder icons, meaning `/images/tests/` assets are missing or paths are wrong. This is an asset availability issue, not a code bug.
4. **Gallery counter mismatch** — Shows "23 tests" regardless of active tab because it reads from the full images array at render time.

## Plan

### 1. Make tab navigation horizontally scrollable on mobile
**File: `src/components/sections/GoodbodyTestGallery.tsx`**

Replace the `flex-wrap` nav with a horizontally scrollable container on mobile:
- Use `overflow-x-auto` with hidden scrollbar on the `<nav>` element
- Remove `flex-wrap`, add `whitespace-nowrap` so tabs stay single-line
- Add `scrollbar-hide` styling (same pattern used in `MobileCarousel`)

### 2. Reduce logo size on mobile
- Change logo height from `h-40` to `h-24 sm:h-40 md:h-48` 
- Reduce padding from `p-3 sm:p-4` to `p-2 sm:p-3`
- Center the logo on mobile, side-by-side on `sm+`

### 3. Stack logo above tabs on mobile
- Keep `flex-col` on mobile (already present), but ensure tabs take full width below the logo
- On `sm+`, keep the current side-by-side layout

### 4. Verify image paths exist
- Check whether `/images/tests/` directory exists in `public/` — if not, the broken images are an asset issue to flag separately

## Files modified
- `src/components/sections/GoodbodyTestGallery.tsx` — tab nav + logo sizing

