# Fix the General Health Blood Tests page

## What's actually happening

The category links in the header dropdown (General Wellness, Women's Health, General Health, etc.) all point to `/compare?category=<id>`. That URL does not render a category page — it renders the generic **Compare Tests** page, which was never built to be a category browse view. That is why it looks wrong:

1. **No filters, no test grid, no result count.** The page keeps filter state internally but renders no filter UI, so it always falls into its "nothing searched" branch and shows only 8 "recommended" tests in a single horizontally scrolling row that gets clipped at the right edge.
2. **Wrong tests.** The recommended list isn't strictly scoped to the category, so unrelated rows appear (Allergy Complete, Peak Insights 70) under a "General Health Blood Tests" heading.
3. **Compare by goal / Compare by symptom cards sit at the top.** Those two entry cards belong on the `/compare` hub, not on every category header.
4. **Large blank white band under the quiz CTA.** `CategoryPageBottom` takes `benefitsTitle` and `benefits` props but never renders them — it only renders the CTA inside a white padded section, so the passed benefits vanish and leave empty white space.

## Fix

**1. Route category links to the real category page**
- Point the dropdown and mobile drawer entries at the existing category landing route (`/tests/<category>`) instead of `/compare?category=<id>`.
- Keep `/compare?category=<id>` working by redirecting it to the matching category route, so existing links and bookmarks don't break.

**2. Restore `/compare` to its own job**
- `/compare` (no category) keeps the compare hub layout: standard hero, the goal and symptom entry cards, the recommended row, and the quiz CTA.
- Remove the `getCompareHeader(category)` title switching from this page, since categories no longer land here.

**3. Make sure the category landing page matches the rest of the platform**
- Verify `/tests/general-health` renders the standard category layout: `CategoryStandardHero` title, toolbar, live test count, and a responsive multi-column test grid (not a clipped horizontal row).
- Where the category page is still on older styling, bring it onto the same navy panel + `CategoryPageBottom` pattern used by the other category pages.

**4. Fix the blank white band**
- Either render the `benefits` grid inside `CategoryPageBottom` (three-up cards above the CTA) or drop the unused props and tighten the section padding so no empty white space remains. Recommended: render the benefits, since every caller already passes three of them.

## Technical notes

- Files: `src/components/header/MegaMenuDropdown.tsx`, `src/components/header/MobileNavigationDrawer.tsx`, `src/pages/CompareTests.tsx`, `src/pages/CategoryLandingPage.tsx`, `src/components/sections/CategoryPageBottom.tsx`, plus a redirect in the `/compare` route.
- Category ids stay raw slugs (`general-health`, `womens-health`) throughout — no display names in URLs.
- Verify after the change with screenshots at 390px and 1280px for `/tests/general-health`, `/compare`, and one legacy `/compare?category=womens-health` link.
