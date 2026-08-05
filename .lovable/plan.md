# Unify the Compare pages with the standard category style

Right now the three Compare pages don't match the rest of the site:

- **Compare by symptom** and **Compare by goal** use the old centred `PageBanner` (navy block with a big title + subtitle) and then a white content area with light cards.
- **Compare tests** already uses the standard category header, but its body sits on white rather than the standard navy panel.
- Every other dropdown/category page (At Home Test Kits, Most Popular, General Wellness) uses one consistent pattern: navy header strip with the section name between pink hairlines and a tricolour divider, a navy content panel, and the pink "Not sure where to start?" quiz card at the bottom.

## What changes

Apply the standard category page pattern to all three Compare pages:

1. **Header** — replace `PageBanner` with the standard category header (`CategoryStandardHero`) showing just the page name: "Compare by Symptom", "Compare by Goal", "Compare Tests". Same tricolour divider and toolbar anchor as every category page.
2. **Body** — the symptom and goal grids move onto the standard navy content panel with the same padding as the category pages, and their cards are restyled to the dark-panel treatment (glass card, white heading, turquoise link, turquoise hover border) instead of the current white cards. Compare tests keeps its existing content but sits on the same navy panel.
3. **Bottom** — the bespoke navy "Not sure where to start?" band on the symptom and goal pages is replaced with the shared `CategoryPageBottom` card (gradient border, "Start Your Quiz" button to `/find-test`), matching every other category page.
4. **Detail pages** — the individual symptom pages (`/compare/symptoms/:slug`) and goal pages (`/compare/goals/:slug`) also use `PageBanner`; they get the same header + bottom treatment so drilling down stays consistent.

Existing copy, SEO tags, JSON-LD and links stay exactly as they are — this is presentation only.

## Technical notes

- Files: `src/pages/CompareBySymptomPage.tsx`, `src/pages/CompareByGoalPage.tsx`, `src/pages/CompareTests.tsx`, `src/pages/SymptomDetailPage.tsx`, `src/pages/GoalDetailPage.tsx`.
- Swap `PageBanner` for `CategoryStandardHero` (`pillLabel`, `as="h1"`), wrap content in `section.py-12 sm:py-16 px-4 sm:px-6 lg:px-12 xl:px-16 bg-[#08122b]` with a `max-w-6xl` inner container, and append `CategoryPageBottom` before the footer.
- Card restyle uses existing brand tokens (`#22c0d4`, `#e70d69`, white/10 borders) — no new tokens, no hardcoded greys.
- `PageBanner` stays in place for the legal/content pages that still use it.
