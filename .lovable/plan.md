# Standardise the Compare pages

Bring the three Compare pages in the More menu into the same layout used by every other non-homepage page (About, FAQs, Our Providers, Health Resource Hub, Biomarker Library, Assisted Test Finder).

## The standard being applied

1. Navy `#081129` hero via the shared `StandardPageHero`: Montserrat title between pink hairlines, one-line strapline, optional turquoise tick stats, tricolour divider.
2. White page body underneath — no navy mid-page blocks.
3. Consistent close: benefit cards then the quiz CTA banner before the footer.

## Pages changed

**Compare tests hub (`/compare`)**
- Swap `CategoryStandardHero` for `StandardPageHero` with title "Compare blood tests", strapline about comparing price, biomarkers, sample method and typical turnaround, and tick stats (live test count, provider count).
- Convert the navy "Compare by goal / Compare by symptom" entry cards to white cards with navy text, pink/turquoise accents and hairline borders, matching the card style used on the other standardised pages.
- Keep the category-filtered view working: when a category is active, the hero title becomes that category name and the entry cards stay hidden, as today.

**Compare by goal (`/compare/goals`)**
- `StandardPageHero` titled "Compare by goal", strapline "Start with the outcome you're working towards and see the panels that support it", tick stats for the number of goals covered.
- Body stays white; remove the now-duplicated inner "What's your health goal?" heading block so there is one title per page.

**Compare by symptom (`/compare/symptoms`)**
- Same treatment: hero titled "Compare by symptom", strapline about starting from what you're experiencing, tick stat for symptoms covered; inner duplicate heading removed.

**Goal and symptom detail pages**
- `/compare/goals/:slug` and `/compare/symptoms/:slug` move to `StandardPageHero` too, titled "Tests for {name}" with the goal/symptom short description as the strapline, so the whole Compare branch matches.

## Technical notes

- Only `src/pages/CompareTests.tsx`, `CompareByGoalPage.tsx`, `CompareBySymptomPage.tsx`, `GoalDetailPage.tsx`, `SymptomDetailPage.tsx` are edited; `StandardPageHero` is reused unchanged.
- `CategoryPageBottom` (navy benefit cards + quiz CTA) is retained on all five pages as the standard footer block.
- Existing `Helmet` JSON-LD, route heads, canonical URLs and data hooks are untouched.
- British English copy; sentence-case headings; no new colours outside `#081129`, `#e70d69`, `#22c0d4`.
