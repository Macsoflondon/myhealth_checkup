
## Add Decorative Half-Circles to All Navy Sections

Scatter semi-transparent turquoise and pink half-circles across every dark blue section on the homepage to break up the solid navy backgrounds. Sections that already have circles will get additional ones for more visual texture.

### What Changes

Each navy section gets a set of absolutely-positioned, partially off-screen circles (creating the "half-circle" effect). Every section gets a unique arrangement so they don't all look identical.

### Section-by-Section Breakdown

**1. PartnersGrid (Our Trusted Partners carousel)**
- Currently: no decorative elements, no `relative overflow-hidden`
- Add: `relative overflow-hidden` to section wrapper
- Add: 3 circles -- large turquoise top-right, medium pink bottom-left, small turquoise bottom-right

**2. PartnerShowcaseGrid (Featured Partners of the Month)**
- Currently: 2 circles (left-centre turquoise, upper-right pink)
- Add: 2 more -- medium turquoise bottom-right corner, small pink top-left corner

**3. FeaturedPublications (As Seen In)**
- Currently: no decorative elements (already has `relative overflow-hidden`)
- Add: 3 circles -- large pink bottom-left, medium turquoise top-right, small turquoise centre-left

**4. TestimonialCarousel**
- Currently: 2 circles (top-left turquoise, bottom-right pink)
- Add: 2 more -- medium turquoise right-centre, small pink top-right

**5. TrustPlatformSection**
- Currently: 2 circles (left-centre turquoise, upper-right pink)
- Add: 2 more -- medium pink bottom-left, small turquoise bottom-right

**6. MissionSection (navy banner)**
- This is a thin banner, not a full section -- skip adding circles here as they would be clipped by the narrow height and look odd.

### Technical Details

- All circles use `absolute` positioning with `rounded-full` and partial `translate` values to push them off-screen (creating the half-circle effect)
- Opacity kept at 5% (`bg-brand-turquoise/5` or `bg-brand-pink/5`) to remain subtle
- Sizes vary between `w-32 h-32` (small), `w-56 h-56` (medium), and `w-72 h-72` / `w-96 h-96` (large)
- Parent sections need `relative overflow-hidden` if not already set
- Files to edit:
  - `src/components/sections/PartnersGrid.tsx`
  - `src/components/sections/PartnerShowcaseGrid.tsx`
  - `src/components/sections/FeaturedPublications.tsx`
  - `src/components/sections/TestimonialCarousel.tsx`
  - `src/components/sections/TrustPlatformSection.tsx`
