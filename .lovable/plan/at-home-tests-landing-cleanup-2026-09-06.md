# At-Home Tests Landing Cleanup

## Goal
Tidy the `/at-home-tests` landing view so the duplicated quiz banner is removed and the intro paragraph sits lower, no longer flush with the category toolbar.

## Changes

1. Remove the duplicated "Find the Right Health Test for You" quiz banner from the landing view in `src/pages/AtHomeTestsPage.tsx` (the section rendered after `AtHomeSectionGrid`).
2. Add vertical spacing above the intro paragraph that currently reads "Finger-prick kits grouped so you can go straight to the area that you care about." so it is visually separated from the toolbar.
3. Run `bunx tsgo --noEmit` and a Playwright screenshot of `/at-home-tests` to confirm the banner is gone, the intro text is lower, and the remaining lower quiz banner/section layout is unaffected.

## Out of scope
- No changes to the subcategory listing view.
- No changes to data, hooks, or routes.
- No changes to the General Wellness page.
