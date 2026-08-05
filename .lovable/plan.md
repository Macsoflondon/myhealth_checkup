# Standardise the quiz call-to-action across every page

Every page should end with the same quiz CTA that category pages already use:

```text
NOT SURE WHERE TO START?
Find the Right Health Test for You              [ Start Your Quiz -> ]
```

Right now that block only exists inside `CategoryPageBottom`, and several pages roll their own variants ("Take the health quiz", "Take Our Health Questionnaire", turquoise pill buttons, different headings). The compare pages you screenshotted are in that group in the published build.

## What changes

1. **Extract the CTA into its own component** — `src/components/sections/QuizCTABanner.tsx`, lifted verbatim from the bottom of `CategoryPageBottom` (gradient border, navy panel, pink "Start Your Quiz ->" button, `/find-test` link). `CategoryPageBottom` then renders benefits + `QuizCTABanner`, so category pages look identical to today.

2. **Replace bespoke quiz CTAs** with `QuizCTABanner` on:
   - `ConditionsPage` — drops the "Not Sure Which Test You Need? / Take Our Health Questionnaire" section and the hero's duplicate quiz button stays as-is.
   - `ProviderProfilePage`
   - `FerritinVsIronComparisonGuidePage`
   - `TestFinderRecommendationsPage`, `TestFinderComparePage` (bottom CTA only — the in-quiz controls stay untouched)

3. **Confirm the compare pages** (`/compare`, `/compare/goals`, `/compare/goals/$slug`, `/compare/symptoms`, `/compare/symptoms/$slug`) all end with the standard block. They already call `CategoryPageBottom`; the mismatched version you saw is a stale published build, so this is verification plus a republish.

4. **Add the banner to content pages that currently end with nothing** — biomarker guides, wellness/at-home/most-popular already covered; any remaining public content page that lacks a closing CTA gets `QuizCTABanner`.

5. **Homepage untouched.** `Index.tsx` keeps its bespoke hero/journey/final CTA sections — those are deliberate homepage design, not the per-page footer CTA.

## Technical notes

- One shared component, no duplicated inline styles; all links point at `/find-test` (the `/quiz` redirect stays).
- Copy fixed as "Not Sure Where to Start?" / "Find the Right Health Test for You" / "Start Your Quiz ->" everywhere, British English.
- Verified afterwards with a Playwright pass over the compare, category, condition, provider and guide routes at mobile width, asserting the exact CTA text renders once per page.
