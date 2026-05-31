Reorder homepage sections so "You're Never Alone on Your Health Journey" (rendered by `ClinicAndHelpSection`) sits directly below the "Trusted Health Comparison Platform" section (`TrustPlatformSection`), just above the footer.

Change in `src/pages/Index.tsx`:
- Move the `<Suspense>` block wrapping `<ClinicAndHelpSection />` (lines 224-228) to after the `<TrustPlatformSection />` block (after line 240).

New order at the bottom of the homepage:
1. TestimonialCarousel
2. CallToAction
3. TrustPlatformSection
4. ClinicAndHelpSection  ← moved here, last before footer
