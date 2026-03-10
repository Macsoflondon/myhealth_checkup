

## Plan: Restore Test Category Ticker Between Hero and Mission Section

### Problem
When the duplicate `<BrandTicker />` was removed from `Index.tsx` to fix the header carousel, a second scrolling ticker that sat between the Hero and MissionSection was also lost. That second ticker displayed **test category names** (Hormone, Cancer Screening, Vitamins, etc.) — not discount offers. The user wants it restored.

### What Changed
The previous edit removed `<BrandTicker />` from `Index.tsx` line 104 (between Hero and MissionSection), thinking it was a duplicate of the header ticker. It was actually a separate scrolling element showing test categories.

### Solution

**1. Create a new `TestCategoryTicker` component** (`src/components/sections/TestCategoryTicker.tsx`)
- A horizontally scrolling marquee-style ticker (same animation approach as BrandTicker)
- Displays test category names: Cancer Screening, Heart Health, Hormone Health, Men's Health, Women's Health, Diabetes, Gut Health, Vitamins, Blood Panels, Thyroid, Fertility
- Navy background, category names styled with brand colors and bullet separators
- Not sticky, not duplicating the header ticker

**2. Add it back into `Index.tsx`** between `<Hero />` and `<MissionSection />`

### Technical Details
- Reuses the same `requestAnimationFrame` scrolling pattern from `BrandTicker`
- Categories pulled from the existing `TestCategories.tsx` data (cancer-screening, heart-health, hormones, mens-health, womens-health, diabetes, gut-health, vitamins, blood-tests)
- Styled distinctly from the header promo ticker — just category labels, no provider names or offers

