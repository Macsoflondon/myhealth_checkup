## Goal
Merge the mobile drawer's two tabs so there's no overlap. The **Menu** tab becomes site navigation only; the **Test Categories** tab holds every test/category entry.

## File
`src/components/header/MobileNavigationDrawer.tsx` — only file that needs changes. `NavigationItems.tsx` (data) stays untouched so desktop nav is unaffected.

## Menu tab — after
Only the 5 sections from `moreNavigationSections`:
- About (About Us, FAQs)
- Services (Our Providers, Assisted Test Finder)
- Compare (Compare Tests)
- Resources (Health Resources Hub, Biomarker Library)
- Contact (Contact Us)

Drop the `primaryNavigationItems` render block from this tab entirely (currently shows General Wellness, Women's Health, Men's Health, Sports-Fitness, Fertility-Prenatal, Cancer Screening, At Home Tests, Most Popular Tests, How It Works).

## Test Categories tab — after
Replace the current 5 grouped category-ID cards (Essential Tests / Organ Health / Gender Specific / Specialist Tests / Lifestyle & Wellness) with the canonical category pages from `primaryNavigationItems`, since General Wellness already covers the "Essential Tests" buckets:

1. Most Popular Tests → `/popular-tests`
2. General Wellness → `/wellness`
3. Women's Health → `/womens-health`
4. Men's Health → `/mens-health`
5. Sports-Fitness Health → `/sports-performance`
6. Fertility - Prenatal → `/fertility-tests`
7. Cancer Screening → `/tests/cancer`
8. At Home Tests → `/at-home-tests`

Rendered as the existing 2-column icon-card grid (reuse current card styling). Keep the "View All Test Categories" CTA → `/compare`.

## Assumptions (flag if wrong)
- **How It Works** moves into the Menu tab as a standalone link below Contact (it's informational, not a test category).
- **Most Popular Tests** sits at the top of the Test Categories tab.
- Icon/colour for each category mapped using the existing `getCategoryIcon` / `getCategoryColour` helpers — I'll add 8 new entries keyed by route slug.
- Tab labels stay "Menu" / "Test Categories"; search bar behaviour unchanged.
- Desktop nav, `NavigationItems.tsx`, and `MobileDropdownMenu.tsx` are out of scope.

## Out of scope
Removing `categoryGroups`, `compareCategories` usage, and unused icon imports from the drawer (will clean up dead code as part of the edit).
