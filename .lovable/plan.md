## Goal
Bring `/compare` in line with every other page: full site chrome (header, sticky toolbar, floating nav dock, footer via `MainLayout`) and restore the previous category comparison table shown in the screenshot — dark navy header strip with "PROVIDERS" label, three "Select a test" slots, and rows for Biomarkers / Turnaround Time / Sample Type / Collection Method / Additional Collection Fees / Total Expected Cost / Clinical Review / Book.

## Current state
- `/compare` → `src/components/DiagnosticTestComparison.tsx` rendered raw, no `MainLayout`, no header/footer, custom search + 7-row inline grid.
- The "old" table the user wants back already exists at `src/components/compare/ProviderComparisonTable.tsx` (519 lines). It has the exact dark-navy header, "Select a test" slot UI, the row labels in the screenshot, and the bottom "Add test" booking row.

## Changes

**1. `src/pages/ComparePage.tsx` (new, thin)**
- Wraps the page in `MainLayout` (same import other category pages use: `import MainLayout from "@/layouts/MainLayout"`) — that gives it the global header, ticker, floating nav dock, and footer automatically, identical to `/at-home-tests`, `/tests/cancer`, etc.
- Adds the standard page header block used across category pages: turquoise eyebrow ("COMPARE TESTS"), navy H1 "Compare Diagnostic Tests", DM Sans subhead, trust-strip row (matches the visual rhythm of `AtHomeTestsPage`).
- Renders `<ProviderComparisonTable />` as the body.
- `<Helmet>` with proper title / meta description / canonical for `/compare`.

**2. `src/routes/featureRoutes.tsx`**
- Swap `DiagnosticTestComparison` for the new `ComparePage` on the `/compare` route. Other compare sub-routes (`/compare/symptoms`, `/compare/goals`, etc.) untouched.

**3. `src/components/compare/ProviderComparisonTable.tsx`**
- Keep as-is structurally. Quick audit pass only to confirm it (a) reads from the existing comparison store / unified view used elsewhere, (b) doesn't hardcode a max-width that conflicts with `MainLayout` containers, and (c) has no leftover white-on-white contrast bugs. Patch only if any of those fail — no redesign.

**4. `src/components/DiagnosticTestComparison.tsx`**
- Leave the file in place (referenced from nowhere else after the route swap) but stop importing it. Safe to delete in a follow-up; not removing now to keep this change reversible.

## Out of scope
- No design changes to the table itself (matches the screenshot already).
- No changes to `/compare/symptoms`, `/compare/goals`, symptom hubs, or saved comparisons.
- No data-model changes.

## Verification
Drive Playwright to `/compare` on desktop + mobile: confirm the global header + floating dock render above the table, the three "Select a test" slots show, picking tests via the existing comparison store populates rows, and no console errors.
