

## Plan: Swap TrustPlatformSection and CallToAction on Homepage

**File: `src/pages/Index.tsx`**

Swap the positions of `<TrustPlatformSection />` (currently line 139, before the divider) and `<CallToAction />` (currently line 157, between HereToHelp and ExpertQuotes).

**New order:**

1. JourneySimplified
2. PartnersGrid
3. **CallToAction** ← moved up here (was below HereToHelp)
4. Gradient divider
5. PartnerShowcaseGrid
6. FeaturedPublications
7. TestimonialCarousel
8. HereToHelp
9. **TrustPlatformSection** ← moved down here (was above divider)
10. ExpertQuotes

