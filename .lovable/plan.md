

# Add Brand Tagline Video Below Partners Section

## What will change

The uploaded video (`Your_health._Your_choice._One_trusted_platform!_1.mp4`) will be added below the "Our Trusted Partners" carousel section, positioned slightly off-centre to the right.

## Implementation

1. **Copy the uploaded video** into `src/assets/` as `brand-tagline-video.mp4` (replacing the existing file if the content is different, or using a new name if needed).

2. **Update the BrandVideoSection component** (or create a new placement) to render the video below the PartnersGrid in the homepage layout. The video will be:
   - Wrapped in a container with right-offset alignment (e.g. `ml-auto` or `mr-4` with a max-width constraint) so it sits slightly to the right
   - Auto-playing, looped, muted, inline (matching the existing video pattern)
   - Responsive with rounded corners

3. **Adjust the Index.tsx layout** to move `BrandVideoSection` directly after `PartnersGrid` (it currently sits after `FeaturedPublications`), placing it in the correct visual position beneath the partners carousel.

## Technical Details

- **File**: Copy `user-uploads://Your_health._Your_choice._One_trusted_platform!_1.mp4` to `src/assets/brand-tagline-video.mp4`
- **Component**: Update `src/components/sections/BrandVideoSection.tsx` to offset the video container to the right using `ml-auto` with a constrained max-width (e.g. `max-w-2xl`) and slight right padding
- **Layout**: In `src/pages/Index.tsx`, reorder so `BrandVideoSection` renders immediately after `PartnersGrid` instead of its current position after `FeaturedPublications`
