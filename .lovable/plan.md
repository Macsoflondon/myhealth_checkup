## Approach
A literal "fix everything across 94 pages" sweep would be enormous and risk regressions. Instead I'll run a **targeted automated audit + fix pass** in 5 phases, using Playwright at 391px against the live preview to find real issues rather than guessing from source.

## Phase 1 — Automated mobile audit (no code changes)
Run Playwright across the 20 highest-traffic public routes at 375px and 391px:
`/`, `/popular-tests`, `/wellness`, `/womens-health`, `/mens-health`, `/sports-performance`, `/fertility-tests`, `/tests/cancer`, `/at-home-tests`, `/tests/heart`, `/tests/diabetes`, `/tests/vitamins`, `/tests/gut`, `/thyroid`, `/hormones`, `/compare`, `/find-test`, `/providers`, `/biomarker-database`, `/health-blog`.

For each: capture screenshot, measure `document.documentElement.scrollWidth > innerWidth` (horizontal overflow), list buttons with no onClick/href, list links with `href="#"` or `to=""`, log console errors. Dump to `/tmp/audit/report.json`.

## Phase 2 — Category coverage sweep
- Cross-check every entry in `src/constants/categories.ts` (19 categories) against:
  - `primaryNavigationItems` (desktop nav) + `testCategoryCards` (mobile drawer) — add anything missing.
  - `MobileNavigationDrawer` search index + `IntelligentSearch` — confirm every category id, name, and synonym is searchable.
  - `/compare` filter + `compareCategories` — confirm clicking any category from any surface lands on a populated filtered view.
- Fix: any orphan category gets a card on the mobile drawer + a route in `_known-routes.ts` if missing.

## Phase 3 — Test card + detail modal sweep
- Audit all 8 card components (`UnifiedTestCard`, `ProviderTestCard`, `MedichecksTestCard`, `ProviderTestsGrid` items, plus 4 category-page variants).
- Standardise: every card must (a) be clickable as a whole, (b) open `ProviderTestDetailModal` (or `TestDetailPage` for routed cards), (c) expose a primary "Book" or "Compare" CTA.
- Fix any card that currently renders without a click target or modal trigger.

## Phase 4 — CTA wiring sweep
- Grep `<Button` and `<button` across `src/pages` + `src/components/sections` + `src/components/category` for instances missing `onClick`, `asChild` + `<Link>`, `href`, or `type="submit"`.
- For each dead button, wire it to the most contextually obvious destination:
  - "Find a test" / "Get started" → `/find-test`
  - "Compare tests" → `/compare`
  - "Browse all tests" → `/popular-tests`
  - "Book consultation" → `/contact`
- Flag any button where intent is ambiguous and leave a `TODO: wire CTA` comment instead of guessing wrong.

## Phase 5 — Mobile overflow fixes
For every page flagged in Phase 1:
- Wrap stray wide elements (`min-w-[...]`, fixed-pixel tables) in `overflow-x-auto` containers.
- Replace `whitespace-nowrap` on text blocks with responsive wrapping.
- Convert any fixed-width grid (`grid-cols-3` without responsive prefix) to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- Ensure section padding uses the project's container standard (`container mx-auto px-4 sm:px-6 lg:px-8`).
- Confirm tap targets ≥ 44×44 on primary CTAs.

## Out of scope
- Admin routes (`/admin/*`) — separate concern.
- Provider profile pages other than the 6 active ones (Goodbody, Medichecks, Thriva, Randox, Lola, LML, LHC, Blood Tests London, Medical Diagnosis, Clinilabs).
- Visual redesign — fixes preserve current visual language.
- Copy changes.
- Backend / Supabase schema.

## Deliverable
A single changeset touching ~15–30 files. Plus `AUDIT.md` at the repo root listing every issue found + every fix applied + anything deferred with a clear `TODO` and reason. You can spot-check the report and tell me what to revisit.

## Risk
Phases 3 + 4 may surface inconsistencies that are intentional (e.g. a card that's deliberately decorative). I'll leave anything ambiguous untouched with a `TODO` rather than silently rewire it.
