
Summary
- The uploaded screenshot already matches the existing dark `CallToAction` component.
- The correct change is to insert that section between `HereToHelp` and `TrustPlatformSection` on the homepage.

Implementation
1. Update `src/pages/Index.tsx`
   - Import `CallToAction`.
   - Render `<CallToAction />` immediately after `<HereToHelp />`.
   - Keep `<TrustPlatformSection />` directly after it.

2. Leave all other sections untouched
   - Keep `StartJourneySection` where it is now under `PartnersGrid`.
   - Do not move `ExpertQuotes`, `FeaturedPublications`, `TestimonialCarousel`, or any upper homepage sections.
   - Do not change any text, buttons, colours, or styling in the CTA itself unless the screenshot reveals a mismatch during implementation.

Technical details
- No new component is needed.
- `src/components/sections/CallToAction.tsx` already closely matches the screenshot:
  - navy background
  - decorative circles
  - white heading/subtext
  - turquoise and pink CTA buttons
- This should be a one-file homepage composition change unless