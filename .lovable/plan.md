# Platform-wide dark-background text contrast fix

Goal: no dark text left sitting on a dark surface anywhere on the site. Every card, panel, modal, dropdown, table and hero with a navy or dark gradient background gets legible light text, with brand colours preserved.

## What gets checked

Every component/page that paints a dark surface (navy #081129, navy gradients, slate/gray-800+, provider brand primaries) and then renders text inside it. Initial scan found ~50 files with dark surfaces; ~30 of those also use dark text tokens inside the same file, so those are the primary suspects.

Highest-risk areas from the scan:

- Test cards and card internals: `UniversalTestCard`, `SimilarTestsSection`, `DiagnosticTestComparison`, `ProviderTestDetailModal`, `expand-on-hover`
- Comparison surfaces: `CompareTests`, `ComparisonBar`, `CancerBiomarkerGroup`, `ProviderPriceComparison`, `ProviderComparisonSidebar`, `TestViewToggle`
- Navigation/dropdowns: `BrowseByCategoryBar`, `CategoryPillDropdown`, `MegaMenuDropdown`, `MoreDropdownMenu`, `MobileDropdownMenu`, `NavItemDropdown`, `LanguageSwitcher`, `UserMenu`
- Content pages with navy heroes/sections: `PartnersPage`, `SymptomDetailPage`, `GoalDetailPage`, `ContactPage`, `FAQsPage`, `CancerBiomarkersReferencePage`, `FerritinVsIronComparisonGuidePage`, `HealthBlogPage`, `ProviderTestCatalogPage`, `TestFinderComparePage`
- Quiz/AI surfaces: `AssistedTestFinder`, `TestFinderQuiz`, `RecommendationEngine`, `HiddenGapDetector`
- Auth/dashboard/admin: `Auth`, `ResetPassword`, `MfaEnrollment`, `MfaStepUp`, `HealthDataHub`, `StoredBiomarkerAnalysis`, admin pages, `soc-watch-dashboard`
- Shared: `BrandTypography`, `StandardPageHero`, `GlobalPageBackground`, `PromoBanner`, `CookieConsent`

## How it gets fixed

1. Build a repo audit script (`scripts/audit-contrast.mjs`) that parses `className` strings, resolves the nearest dark-surface class in a JSX subtree, and flags any descendant using a dark foreground token (`text-[#081129]`, `text-navy`, `text-slate-700/800/900`, `text-gray-700/800/900`, `text-black`, bare `text-foreground` / `text-muted-foreground` on a dark surface). Output is a file:line report.
2. Work the report card-by-card, fixing each hit at source rather than sprinkling overrides:
   - Dark surface + body copy -> white/`text-white/80` for secondary copy
   - Muted copy on navy -> a `--on-navy-muted` token added to `src/styles.css` (light slate at ~72% opacity) instead of `text-muted-foreground`
   - Badges/pills on navy -> light fill or translucent-white fill with white text and a pink/turquoise accent border, matching the existing Add-on badge treatment
   - Icons inheriting dark colour -> `currentColor` with the corrected parent text colour
   - Provider-brand-coloured panels -> force white text/icons (same fix already applied to Trust & Accreditation)
3. Add the semantic tokens (`--on-dark`, `--on-dark-muted`) to `src/styles.css` so future dark sections have a correct default rather than hardcoded whites.
4. Visual verification sweep with Playwright at 390px and 1280px over the key routes (home, a category page, a test detail, compare, provider profile, quiz, auth, providers, blog hub), capturing screenshots for before/after comparison of the flagged sections.
5. Wire the audit script into CI (`.github/workflows/`) so a dark-text-on-dark-surface regression fails the build.

## Technical notes

- No business logic, data, or layout changes — presentation classes and CSS tokens only.
- Semantic tokens go in `src/styles.css` (Tailwind v4 `@theme`), no hardcoded hex in components where a token can be used.
- The audit is heuristic (static JSX class analysis); the Playwright pass is what confirms real rendered contrast, so both run before this is called done.
- Admin surfaces are included, since the admin dashboard is intentionally white-themed and dark leftovers there are equally unreadable.
