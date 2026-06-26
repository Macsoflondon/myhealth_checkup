## Add a 4th "At-Home Tests" category card

**File:** `src/components/sections/TestCategoriesSection.tsx`

### Changes
1. Append a 4th entry to the `categories` array:
   - `tag`: "At-Home Tests"
   - `tagVariant`: `"pink"` (alternate with existing palette)
   - `count`: "300+ Kits"
   - `title`: "At-Home Test Kits"
   - `description`: "Convenient finger-prick and sample collection kits delivered to your door. UKAS-accredited lab analysis with results typically returned within days — no clinic visit needed."
   - `link`: `/at-home-tests` (matches the sticky bar "At Home" route — to be confirmed)
   - `linkLabel`: "Explore Kits"
   - `image`: a relevant at-home-kit image (reuse hero `bloodTestKit` slide asset if available, otherwise an Unsplash finger-prick kit photo)

2. Update the grid to accommodate 4 columns on large screens so all cards stay one row on desktop while keeping the existing mobile/tablet behaviour:
   - `grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4`
   - (alternatively keep `lg:grid-cols-3` and let the 4th wrap below — confirm preference)

### Style parity
Reuse exact card markup, overlay gradient, tag pill styling, heading sizes, and CTA treatment — no other visual changes.

### Open question
- Should the 4 cards sit on a single row at desktop (`xl:grid-cols-4`, slightly narrower), or keep 3-up with the 4th wrapping to a centred second row?
