

# Codebase Architecture Audit — Detailed Report

## 1. Surviving Shim/Re-export Files (Still Present)

Four root-level components still exist solely to re-export from subdirectories. The previous cleanup missed them:

| File | Re-exports |
|------|-----------|
| `src/components/FounderStory.tsx` | `./sections/FounderStory` |
| `src/components/PartnerShowcase.tsx` | `./sections/PartnerShowcase` |
| `src/components/TrustBadgesSection.tsx` | `./sections/TrustBadgesSection` |
| `src/components/UKASBanner.tsx` | `./compliance/UKASBanner` |

**Consumer**: `AboutUsPage.tsx` imports all three section shims from root. Fix the import path there, then delete all four files.

**Step**: Update `AboutUsPage.tsx` imports to point at `@/components/sections/FounderStory`, `@/components/sections/PartnerShowcase`, `@/components/sections/TrustBadgesSection`, and `@/components/compliance/UKASBanner`. Delete the four shim files.

---

## 2. Dead Code — `LiveProviderService.ts` (409 lines, zero imports)

`src/services/LiveProviderService.ts` is imported nowhere except `src/services/index.ts` barrel. It defines its own `ProviderTestData` interface (duplicating `ProviderDataService.ts`), hardcodes provider names, and is never called. 409 lines of dead weight.

**Step**: Remove from `services/index.ts` barrel, delete the file.

---

## 3. Dead Code — `EnhancedTestCard.tsx` & `OfflineSyncExample.tsx`

- `src/components/enhanced/EnhancedTestCard.tsx` — zero imports anywhere.
- `src/components/examples/OfflineSyncExample.tsx` — zero imports anywhere.

Both directories contain only these single unused files.

**Step**: Delete both files and both directories.

---

## 4. Dual Hero Components — `Hero.tsx` vs `HeroSection.tsx`

Two completely separate hero components exist:
- `Hero.tsx` (184 lines) — the homepage hero with search bar, background image, trust signals.
- `HeroSection.tsx` (31 lines) — a reusable dark-navy section header used by ~29 pages.

The naming collision is confusing. `HeroSection` is really a `PageHeader` or `PageBanner`. It has nothing to do with the homepage hero.

**Step**: Rename `HeroSection.tsx` → `PageBanner.tsx` (or `SectionHero.tsx`). Update all 29 consumer imports. This eliminates the naming confusion without changing any functionality.

---

## 5. Provider Detail Page Wrappers — Still Redundant

The previous cleanup created a generic `ProviderTestDetailPage.tsx`, but 6 wrapper files still exist that do nothing but pass a `providerId` string:

```
GoodbodyTestDetailPage.tsx   → <ProviderTestDetailPage providerId="goodbody-clinic" />
MedichecksTestDetailPage.tsx → <ProviderTestDetailPage providerId="medichecks" />
ThrivaTestDetailPage.tsx     → <ProviderTestDetailPage providerId="thriva" />
RandoxTestDetailPage.tsx     → <ProviderTestDetailPage providerId="randox" />
LolaHealthTestDetailPage.tsx → <ProviderTestDetailPage providerId="lola-health" />
LondonMedicalLabTestDetailPage.tsx → <ProviderTestDetailPage providerId="london-medical-laboratory" />
```

These are 3-line files. The route config in `testRoutes.tsx` should inline the `providerId` prop directly:

```tsx
<Route path="/medichecks/:testId" element={<ProviderTestDetailPage providerId="medichecks" />} />
```

**Step**: Update `testRoutes.tsx` to import `ProviderTestDetailPage` once and inline the prop for all 6 routes. Delete the 6 wrapper files.

---

## 6. Provider Catalog Pages — Same Pattern, Not Yet Consolidated

Six catalog pages follow an identical template pattern but weren't consolidated:
- `GoodbodyTestsCatalogPage.tsx`
- `MedichecksTestsCatalogPage.tsx`
- `ThrivaTestsCatalogPage.tsx`
- `RandoxTestsCatalogPage.tsx`
- `LolaHealthTestsCatalogPage.tsx`
- `LondonMedicalLabTestsCatalogPage.tsx`

**Step**: Create a generic `ProviderTestsCatalogPage.tsx` (like the detail page pattern), update `featureRoutes.tsx` to inline the `providerId`, delete the 6 files.

---

## 7. Duplicate Route Definitions

`testRoutes.tsx` has duplicate paths for the same pages:
- `/tests/mens-health` and `/mens-health` both render `MensHealthPage`
- `/tests/womens-health` and `/womens-health` both render `WomensHealthPage`

One should be a `<Navigate>` redirect to the other, not a separate mount.

**Step**: Pick the canonical path (e.g., `/tests/mens-health`), redirect the other with `<Navigate to="/tests/mens-health" replace />`.

---

## 8. Service Layer Overlap — `ProviderService` vs `ProviderDataService`

- `ProviderService.ts` (84 lines) — thin wrapper around `constants/providers.ts`. Just calls `getProviderLogo()`, `getProviderName()`, etc. A class that wraps pure functions adds no value.
- `ProviderDataService.ts` (403 lines) — actual Supabase queries for `provider_tests` table with caching, pagination, search.

These serve completely different purposes but the naming suggests overlap.

**Step**: Either delete `ProviderService.ts` and have consumers call `constants/providers.ts` directly (they already can), or rename it to `ProviderMetadataService.ts` to clarify the distinction.

---

## 9. Offline Stack — Overbuilt for Current Usage

Four files form an offline sync stack:
- `OfflineStorageService.ts` (373 lines) — IndexedDB with localStorage fallback
- `OfflineSyncManager.ts` (205 lines) — sync orchestration
- `useOfflineQueue.ts` (70 lines) — in-memory queue for realtime
- `useOfflineSync.ts` (173 lines) — hook wrapping OfflineSyncManager

Plus `ConnectionManager.ts`, `ConflictResolver.ts`, `RealtimeSyncIndicator`, `OfflineSyncIndicator`, `OptimisticUpdateIndicator`.

This is ~1000 lines of infrastructure. Check whether any of it is actually triggered in production — the app is a comparison/discovery site, not a collaborative editor. If offline-first isn't a real requirement, this entire layer can be removed.

**Step**: Search for actual usage of `useOfflineSync` and `useRealtimeSync` in page/component code. If they're only used in the example component (which is dead code), remove the entire offline stack.

---

## 10. `data/` vs `constants/` Boundary Blur

- `src/data/` contains test data arrays (`medichecksTests.ts`, `goodbodyTests.ts`, `blogArticles.ts`, `categoryColors.ts`, etc.)
- `src/constants/` contains `categories.ts`, `providers.ts`, `providerRatings.ts`, etc.

Both hold static data. The split feels arbitrary — `categoryColors` is in `data/`, `categories` is in `constants/`. `providerBranding` is in `data/`, `providers` is in `constants/`.

**Step**: Move all static provider/category configuration into `constants/`. Reserve `data/` only for large dataset arrays (test listings). Or merge them entirely into `constants/`.

---

## 11. `i18n/` and `locales/` — Likely Incomplete

Both directories exist. If internationalization isn't actively used, these add confusion.

**Step**: Verify if any component imports from `i18n/` or `locales/`. If not, remove them.

---

## Priority Order

| # | Task | Files affected | Impact |
|---|------|---------------|--------|
| 1 | Delete dead code: `LiveProviderService`, `EnhancedTestCard`, `OfflineSyncExample` | 3 files (~450 lines) | Reduces confusion |
| 2 | Delete 4 remaining shim re-export files | 4 files + 1 consumer update | Clean imports |
| 3 | Inline 6 provider detail wrappers into routes | 6 files deleted, 1 route file updated | -18 lines of wrappers |
| 4 | Consolidate 6 catalog pages into generic | 6 files deleted, 1 new file, 1 route update | -~300 lines |
| 5 | Rename `HeroSection` → `PageBanner` | 1 rename + 29 import updates | Eliminates naming confusion |
| 6 | Fix duplicate routes (mens-health, womens-health) | 1 file | Correct routing |
| 7 | Delete or rename `ProviderService.ts` | 1 file + consumer updates | Clearer service boundaries |
| 8 | Audit offline stack usage, remove if unused | ~8 files (~1000 lines) | Major dead code removal |
| 9 | Merge `data/` config into `constants/` | ~5 file moves | Clearer boundaries |
| 10 | Check `i18n/`/`locales/` usage | 2 directories | Remove if unused |

