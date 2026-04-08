
Plan: Correct the mistaken homepage section swap in `src/pages/Index.tsx`

What went wrong
- The wrong sections were reordered.
- Right now, `CallToAction` is still up near the top of the lower homepage block, while `TrustPlatformSection` was moved down near the footer.
- So the visible bottom-page sections the user meant to swap were not actually swapped.

Exact fix
- Edit only `src/pages/Index.tsx` around the current section block (`<CallToAction />`, `<TrustPlatformSection />`, `<ExpertQuotes />`).
- Move `<TrustPlatformSection />` back to its earlier position above the gradient divider.
- Leave everything else in the same relative order.
- Swap only the two lower homepage sections so the ending sequence becomes:

```text
TestimonialCarousel
HereToHelp
ExpertQuotes
CallToAction
Footer
```

Full relevant target order
```text
PartnersGrid
TrustPlatformSection
divider
PartnerShowcaseGrid
FeaturedPublications
TestimonialCarousel
HereToHelp
ExpertQuotes
CallToAction
```

Scope guardrails
- No text edits
- No style edits
- No component changes
- No route/footer/legal changes
- Only JSX reordering in one file

Verification
- Scroll to the bottom of `/` and confirm the last three content sections before the footer are:
  `Here to Help` → `Backed by Expert Guidance` → `Take Control of Your Health Today`
