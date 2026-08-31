# Technical details

All edits are spacing utilities / inline padding values. No logic, data, or component-structure changes.

## Files and exact changes

**`src/components/sections/PartnersGrid.tsx`**
- `EyebrowBadge ... className="mb-3"` → `mb-2`.
- `SectionHeading className="mb-8 sm:mb-10"` → `mb-4 sm:mb-5` (halves the dead gap before the carousel). The heading renders blank text, so only its margin matters.

**`src/components/sections/FeaturedPartnerWheel.tsx`**
- Section inline style `padding: "54px 24px 48px"` → `"40px 24px 48px"` (top down ~25%).

**`src/components/sections/TestCategoriesSection.tsx`**
- Section `pt-16 sm:pt-20 md:pt-24` → `pt-12 sm:pt-16 md:pt-20`.
- Header wrapper `mb-10 sm:mb-14` → `mb-8 sm:mb-10`.

**Homepage sweep (same rule: oversized header gaps down ~25%)**
- Check in turn: `HeroPopularTests`, `StartJourneySection`, `DreamHealthShowcase`, `TestimonialCarousel`, `ClinicAndHelpSection`, `CallToAction`, `NewsletterSection`. Only sections whose header-to-content margin exceeds ~2.5rem are adjusted; `JourneySimplified` (already condensed) is left alone.

## Verification

- Screenshot each affected section at mobile (390px), tablet (768px), and desktop (1440px) via Playwright and confirm the gaps read as reduced by the requested amounts with no clipping or overlap.
- `npm run lint` clean; no type or test impact expected (presentation-only).
