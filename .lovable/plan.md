

## Plan: Move "Expert Quotes" Below "Here to Help"

**File: `src/pages/Index.tsx`**

Reorder the sections so that `<ExpertQuotes />` is rendered after `<HereToHelp />` instead of its current position (after `<FeaturedPublications />`).

Current order (relevant part):
1. FeaturedPublications
2. **ExpertQuotes** ← move from here
3. TestimonialCarousel
4. CallToAction
5. HereToHelp

New order:
1. FeaturedPublications
2. TestimonialCarousel
3. CallToAction
4. HereToHelp
5. **ExpertQuotes** ← to here (just above Footer)

