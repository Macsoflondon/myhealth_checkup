

## Move "As Seen In" Publications Carousel into PartnerShowcaseGrid

Move the "Our Partners Have Featured In" scrolling carousel from its standalone position on the homepage (between PartnerShowcaseGrid and TestimonialCarousel) into the PartnerShowcaseGrid component, placed between the Goodbody gallery and the Medichecks section.

### Changes

**1. `src/components/sections/PartnerShowcaseGrid.tsx`**
- Import the `FeaturedPublications` component
- Insert it between the Goodbody gallery divider (line 36) and the Medichecks container (line 41)
- The publications carousel will render inline within the navy background, maintaining visual continuity
- Remove the duplicate divider at line 44-47 since the publications section has its own gradient lines

**2. `src/pages/Index.tsx`**
- Remove the standalone `<FeaturedPublications />` call (line 125) since it now lives inside PartnerShowcaseGrid
- Remove the `FeaturedPublications` import (line 13) if no longer used elsewhere

### Result
The homepage flow becomes: ... → PartnerShowcaseGrid (Goodbody → Publications Carousel → Medichecks → Find a Clinic) → TestimonialCarousel → ...

