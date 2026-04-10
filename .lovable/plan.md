

## Two Quick Layout Fixes

### 1. Add spacing above the BrandTicker promotions
The BrandTicker currently has `pt-0` so the scrolling promos sit flush against the very top. Add top padding (`pt-1.5 sm:pt-2`) to the inner wrapper to give them breathing room.

**File:** `src/components/sections/BrandTicker.tsx`
- Change `pt-0 pb-1.5 sm:pb-2` → `pt-1.5 pb-1.5 sm:pt-2 sm:pb-2`

### 2. Remove the dark navy gap above the Hero
In `Index.tsx`, the Hero is wrapped in `<div className="mt-4">` which exposes the navy page background between the gradient divider and the hero image. Remove that margin so the hero image sits directly against the section separator.

**File:** `src/pages/Index.tsx`
- Change `<div className="mt-4">` → `<div>`

