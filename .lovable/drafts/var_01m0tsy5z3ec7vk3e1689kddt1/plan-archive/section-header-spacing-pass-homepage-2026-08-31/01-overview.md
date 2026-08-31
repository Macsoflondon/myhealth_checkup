# Section header spacing pass (homepage)

Tighten the vertical rhythm between each homepage section's header (eyebrow label + heading) and the content beneath it, so sections feel proportionate and premium rather than floaty.

## The three fixes you named

1. **"Accredited & Verified" label → logo carousel (PartnersGrid)**
   The eyebrow badge plus an empty `SectionHeading` currently carries `mb-8 sm:mb-10` of dead space before the logo carousel. Halve it (to `mb-4 sm:mb-5`) and drop the eyebrow's own `mb-3` to `mb-2`.

2. **"Featured Partner of the Month" (FeaturedPartnerWheel)**
   The section's top padding is `54px` before the eyebrow badge even renders. Cut the top padding by a quarter (`54px → 40px`) so the label sits closer to the section start, matching the tighter rhythm.

3. **"What We Compare" (TestCategoriesSection)**
   Section top padding (`pt-16 sm:pt-20 md:pt-24`) and the header block's bottom margin (`mb-10 sm:mb-14`) both reduce by a quarter (to `pt-12 sm:pt-15 md:pt-18` → implemented as `pt-12 sm:pt-16 md:pt-20`, and `mb-8 sm:mb-10`).

## Wider audit

While in there, sweep the remaining homepage sections (Hero Popular Tests, Simple Process, Start Journey, Most Popular Tests, Testimonials, Clinic & Help, Call to Action, Newsletter) and apply the same rule: header-to-content gaps stay, anything over ~2.5rem of empty margin between a heading and its content comes down by roughly a quarter. Only genuinely oversized gaps change — sections already tight (e.g. Simple Process, condensed last round) stay untouched.

## What does not change

- No content, ordering, colours, or typography changes — spacing only.
- No changes below the fold on other pages; this pass is the homepage only.
