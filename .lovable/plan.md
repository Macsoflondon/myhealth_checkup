# Global Sticky Category Bar Rollout

## Goal
Every page in the app shows the sticky category toolbar at the top. The PromoTicker carousel is retired. Homepage keeps its existing hide-until-hero behaviour.

## Current state (audit)
- ~15 pages use `MainLayout` → already have the sticky bar.
- ~48 pages render `<Header />` directly, plus all DB-driven category pages via `CategoryPageLayout` → currently show only `PromoTicker`, no sticky bar.
- ~31 pages (admin tools, Dashboard, a few content pages) render neither → no top chrome at all.

## Changes

### 1. Replace `Header.tsx` contents
File: `src/components/layout/Header.tsx`
- Drop `<PromoTicker />`.
- Render `<StickyCategoryBar />` (always-visible variant — no `hideUntilTriggerId`).
- Keep `ErrorBoundary` wrapper and `className` passthrough so existing call sites keep working unchanged.

Result: all ~48 direct `<Header />` users and every page routed through `CategoryPageLayout`/`DbCategoryPage` immediately get the sticky bar instead of the ticker.

### 2. Add the bar to the "neither" pages
For each page that uses neither `MainLayout` nor `<Header />`, add `<Header />` at the top of its returned JSX (since Header now == sticky bar). Targets:

Admin: `AdminAuth`, `AdminRecovery`, `AdminBiomarkerAuditPage`, `AdminBiomarkerValidationPage`, `AdminTestDashboardPage`, `AdminTestMapperPage`, `Dashboard`.

Content / category: `CancerScreeningPage`, `ClinilabsPage`, `DiabetesTestingPage`, `FemaleHormonesTestPage`, `FertilityTestsPage`, `GeneralHealthTestPage`, `GoodbodyClinicPage`, `GutHealthPage`, `HeartHealthPage`, `HormonesPage`*, `IronProfileTestPage`, `LipidProfileTestPage`, `LondonHealthCompanyPage`, `LondonMedicalLaboratoryPage`, `MaleHormoneTestPage`, `MedicalDiagnosisPage`, `MensHealthPage`, `ProviderTestDetailPage`, `SportsPerformancePage`, `ThyroidPage`, `VitaminDTestPage`, `VitaminDeficiencyPage`, `WellWomanTestPage`, `WomensHealthPage`.

*Pages routed through `DbCategoryPage`/`CategoryPageLayout` are already covered by change #1 — verify per-file and skip if already inherited.

### 3. Delete `PromoTicker` usages
Search-and-remove any other direct `<PromoTicker />` imports/usages outside `Header.tsx`. Leave the component file in place (could be reused later) but unreferenced.

### 4. Homepage behaviour unchanged
`Index.tsx` continues using `MainLayout`, which passes `hideUntilTriggerId="sticky-bar-hero-end"` so the hero stays uncovered until scroll. No edits needed.

## Verification
- Visit `/wellness`, `/cancer-screening`, `/hormones`, `/dashboard`, `/admin/test-dashboard`, `/contact`, `/privacy-policy` — sticky bar present at top, no ticker.
- Visit `/` — hero clear on load, sticky bar appears once hero scrolls past.
- Mobile viewport — bar collapses to the compact "Menu" sheet trigger (already implemented).

## Out of scope
- Restyling the sticky bar.
- Re-introducing promo messaging elsewhere (can be a follow-up if desired).
