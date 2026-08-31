# Technical details

## A. Spacing (presentation-only)

- `src/components/sections/PartnersGrid.tsx` — `EyebrowBadge` `mb-3`→`mb-2`; `SectionHeading` `mb-8 sm:mb-10`→`mb-4 sm:mb-5`.
- `src/components/sections/FeaturedPartnerWheel.tsx` — section inline padding `"54px 24px 48px"`→`"40px 24px 48px"`.
- `src/components/sections/TestCategoriesSection.tsx` — `pt-16 sm:pt-20 md:pt-24`→`pt-12 sm:pt-16 md:pt-20`; header `mb-10 sm:mb-14`→`mb-8 sm:mb-10`.
- Sweep: `HeroPopularTests`, `StartJourneySection`, `DreamHealthShowcase` (`mt-10 sm:mt-14` around filmstrip/grid), `TestimonialCarousel`, `ClinicAndHelpSection`, `CallToAction`, `NewsletterSection` — reduce only header-to-content gaps over ~2.5rem by ~25%.

## B. Card information (`src/components/sections/DreamHealthShowcase.tsx`)

Data check already run against `unified_provider_tests`: Goodbody Advanced Well Man (48 biomarkers, "2-3 working days", venous, clinic collection) and Medichecks VLDL (1 biomarker, "Results in 10 working days (estimated)", **empty description**) confirm the data is present — only the card omits it.

- In the card body (after the description paragraph, before the price row), render a chip row:
  - `biomarker_count > 0` → "{n} biomarkers" (accent-tinted chip).
  - `turnaround_days_text` → shown as-is; prefix with "typically" if the string lacks non-guaranteed wording (per compliance language standard).
  - `sample_type` / `collection_method` → short label via the same normalisation helpers already used in `UniversalTestCard` (import the shared util rather than duplicating logic).
- Description fallback: when `t.description` is blank, compose "Single-biomarker test — {biomarker}." / "{n}-biomarker panel." plus the sample label, so the paragraph is never empty.
- Each chip renders only when its value exists — no placeholders.
- `PopularTest` already carries `biomarker_count`, `turnaround_days_text`, `sample_type`, `markers` (passed through in `toCardData`), so no hook or query changes are expected; if `sample_type` proves absent on the hook's select, add that one column to the select list.

## Verification

- Playwright screenshots of the homepage popular-tests grid at 390px / 768px / 1440px: chips visible on Goodbody and Medichecks cards; no empty description paragraph.
- Re-check the three spacing sections at the same breakpoints.
- `npm run lint`; presentation-only, no test impact expected.
- Also record both tasks in `roadmap.md` at the start of implementation and clear them when done.
