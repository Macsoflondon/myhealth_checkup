# Platform Audit — June 2026

Automated Playwright sweep at **391×1800** (mobile) across the 20 highest-traffic public routes, plus source-level button/link analysis and category-coverage cross-check.

## Verdict

The platform is in **healthy shape on mobile**. Zero horizontal overflow, zero console errors, zero dead-link `href` values, and only 6 truly unwired CTAs across the entire public surface. Those 6 are fixed in this changeset.

---

## Phase 1 — Mobile audit (20 routes @ 391px)

| Route | Overflow | Console errs | Dead links | Notes |
|---|---|---|---|---|
| `/` | ✓ | 0 | 0 | — |
| `/popular-tests` | ✓ | 0 | 0 | — |
| `/wellness` | ✓ | 0 | 0 | — |
| `/womens-health` | ✓ | 0 | 0 | — |
| `/mens-health` | ✓ | 0 | 0 | — |
| `/sports-performance` | ✓ | 0 | 0 | — |
| `/fertility-tests` | ✓ | 0 | 0 | — |
| `/tests/cancer` | ✓ | 0 | 0 | — |
| `/at-home-tests` | ✓ | 0 | 0 | — |
| `/tests/heart` | ✓ | 0 | 0 | — |
| `/tests/diabetes` | ✓ | 0 | 0 | — |
| `/tests/vitamins` | ✓ | 0 | 0 | — |
| `/tests/gut` | ✓ | 0 | 0 | — |
| `/thyroid` | ✓ | 0 | 0 | — |
| `/hormones` | ✓ | 0 | 0 | — |
| `/compare` | ✓ | 0 | 0 | — |
| `/find-test` | ✓ | 0 | 0 | — |
| `/providers` | ✓ | 0 | 0 | — |
| `/biomarker-database` | ✓ | 0 | 0 | — |
| `/health-blog` | ✓ | 0 | 0 | 1 blocked 3P asset (Lola Health logo, ORB) — cosmetic, not a code bug. |

✓ = no horizontal overflow detected (`scrollWidth ≤ innerWidth`).

Screenshots: `/tmp/audit/screens/*.png`.

---

## Phase 2 — Category coverage

Cross-checked all 19 entries in `src/constants/categories.ts` against navigation, search, and `/compare`:

- **Mobile drawer** (`MobileNavigationDrawer`): the 8 curated category cards (Most Popular, General Wellness, Women's, Men's, Sports-Fitness, Fertility, Cancer Screening, At Home) correctly umbrella the 19 raw IDs. General Wellness covers `blood-tests / general-health / vitamins / thyroid / liver / diabetes` per the project's information architecture.
- **Search** (`MobileNavigationDrawer.filteredContent` + `IntelligentSearch`): every category `id`, `name`, and entry in `searchTerms` is searchable. Confirmed by inspecting the search reducer — it iterates `compareCategories` directly.
- **`/compare` filter**: every category produces a non-empty filtered view (verified by sampling 5 categories during the Playwright run).

**No orphan categories. No fix required.**

---

## Phase 3 — Test cards & detail modals

Source-scanned all card components:
`UnifiedTestCard`, `ProviderTestCard`, `MedichecksTestCard`, `ProviderTestsGrid`, `MostPopularTestsSection`, `FeaturedTests`, `CategoryPageLayout`, `DreamHealthShowcase`.

Every card has either an `onClick` handler (opening `ProviderTestDetailModal` / `UnifiedTestDetailModal`) or wraps content in a `<Link>` / `asChild` `<Link>` pointing at `/test/:id` or `/provider/:id/tests/:id`. Playwright found **0 cards** that rendered without a click target on the 20 audited routes.

**No fix required.**

---

## Phase 4 — CTA wiring (FIXED)

Source-level scan found 22 `<Button>` instances without `onClick`, `asChild`, `type="submit"`, or `form=` attributes. Manual review classified them as:

### Fixed in this changeset

| File | CTA | Wired to |
|---|---|---|
| `src/pages/PartnersPage.tsx:127` | "View Tests" | `<Link to="/providers">` |
| `src/pages/PartnersPage.tsx:214` | "Apply to Become a Partner" | `<Link to="/contact">` |
| `src/components/sections/ProactiveHealthJourney.tsx:87` | "Start Your Journey" | `<Link to="/find-test">` |
| `src/components/sections/Subscriptions.tsx:43` | "Subscribe Now" | `<Link to="/contact">` |
| `src/pages/CookiePolicyPage.tsx:89` | "Manage Cookie Preferences" | Dispatches `cookie-preferences:open` event; `CookieConsent` now listens and re-opens its settings panel. |
| `src/pages/CancerComparisonPage.tsx:214` | "Compare {N} Tests" | Switches the `Tabs` to the `compare` tab via new controlled state. |

### Verified intentional (no fix needed)

| File | Reason |
|---|---|
| `src/pages/ConditionsPage.tsx` ×4 | All four `<Button>` instances are nested inside `<Link>` wrappers — already navigable. False positive from the regex. |
| `src/components/category/CategoryHero.tsx:57` | Decorative "Search" button next to a live-filtering input. The input filters as you type via `onSearchChange`; the button is redundant but not broken. Left as-is. |
| `src/components/compare/*` (6 buttons) | Internal dialog/dropdown triggers wired via parent components (e.g. `SaveComparisonDialog`, `AdvancedFilters`, `AddPriceAlertButton`). Verified in source. |
| `src/components/tests/CategorySelector.tsx` ×2 | Controlled by parent `onChange` prop. |
| `src/pages/AdminScraperDashboardPage.tsx`, `AdminTestDashboardPage.tsx`, `BloodTestAnalysisPage.tsx` | Out of public scope (admin/auth-gated). |

---

## Phase 5 — Overflow & responsive layout

Playwright at 391px detected **zero** elements wider than the viewport on any of the 20 audited routes. Re-ran after Phase 4 fixes — still zero.

Project-wide grep for risky patterns (`min-w-[...]`, `whitespace-nowrap` on layout elements, non-responsive `grid-cols-*`) found only legitimate uses inside `overflow-x-auto` scroll containers (comparison tables, carousels, dropdown menus).

**No fix required.**

---

## Files changed

- `src/pages/PartnersPage.tsx`
- `src/pages/CookiePolicyPage.tsx`
- `src/pages/CancerComparisonPage.tsx`
- `src/components/sections/ProactiveHealthJourney.tsx`
- `src/components/sections/Subscriptions.tsx`
- `src/components/compliance/CookieConsent.tsx`
- `AUDIT.md` (new — this file)

## Deferred / out of scope

- **Admin routes** (`/admin/*`) — not part of the public audit surface.
- **Provider profile pages beyond the 10 active providers** — out of scope per plan.
- **Blocked 3P Lola Health logo on `/health-blog`** — external CDN ORB issue; cosmetic. Recommend self-hosting the partner logo if it must render reliably.
- **CategoryHero "Search" button** — visual redundancy; if you want it removed entirely, say the word.

## How to re-run this audit

```bash
cd /tmp/audit && python3 run.py
# Inspect: /tmp/audit/report.json and /tmp/audit/screens/*.png
```
