## Assisted Test Finder — Build Plan

Extends the existing app at `/find-test` (currently rendering `AssistedTestFinder`) plus the comparison surfaces. The spec's dark-navy aesthetic already matches our existing dark theme tokens — we'll reuse `--bg-deep`-equivalents via existing `bg-[#081129]` / brand tokens rather than introducing new CSS variables.

### Scope split (4 phases)

**Phase 1 — Data model + scoring service (foundation, no UI yet)**
- `src/types/testFinder.ts` — all enums and `TestRecord`, `UserProfile`, `FieldStatus` from §7.
- `src/lib/testFinder/scoring.ts` — `ageToNumber`, `isSexCompatible`, `ageBoost`, `computeMatchScore`, `buildRecommendations`, `buildExplanation` (verbatim from §8/§9).
- `src/lib/testFinder/recommendationService.ts` — async `getRecommendations(tests, profile)` seam (deterministic now, LLM-ready later).
- `src/lib/testFinder/filters.ts` — `deriveFilterState`, `applyFilters` (AND across groups, OR within).
- `src/data/testFinderSeed.ts` — the 8 SEED_TESTS from §11 with verification flags intact.
- `src/lib/testFinder/labels.ts` — label maps for SampleType / CollectionMethod / fee / clinical review (§4.2).
- Vitest unit tests for scoring + filter logic + total-cost computation.

**Phase 2 — Redesigned comparison table (`/compare` surface)**
- New `src/components/testFinder/ComparisonTable.tsx` (column-per-test, sticky left label rail).
- Rows in §4.1 order: Provider header → Biomarkers → Turnaround → Sample Type → Collection Method → Additional Fees → Clinical Review → Total Expected Cost (3 sub-rows) → Book.
- Cell renderers: `SampleTypeCell`, `CollectionMethodCell` (primary + "+N more" chip), `AdditionalFeesCell` (amber pill), `ClinicalReviewCell` (green check / grey dash), `TotalCostCell` (estimate tooltip for range/varies).
- `VerificationMark.tsx` — dotted underline + tooltip for any `needs_verification` field, plus a global legend.
- Mobile: stacked card layout ≤2 tests, horizontal snap-scroll for 3+. Uses `useIsMobile`.
- Strip "Doctor review" everywhere; surface as "Clinical review".

**Phase 3 — Standalone filters panel**
- `src/components/testFinder/FiltersPanel.tsx` — collapsible slide-over on mobile, left rail on desktop ≥lg.
- Groups: Health Goals, Sample Type, Collection Method, Additional Fees, Clinical Review, Advanced (collapsed).
- Active-filter count, Clear all, "Adjusted from your quiz" inline note + "Reset to quiz defaults".
- Filter state lives in a Zustand store `src/stores/testFinderStore.ts` (mirrors existing `compareStore` pattern) holding `profile`, `filters`, `quizDefaults`, `selectedTestIds`.

**Phase 4 — Quiz + Recommendations screen**
- Rebuild `src/components/tests/AssistedTestFinder.tsx` as a multi-step wizard:
  1. Sex (internal) → 2. Age band (internal) → 3. Goals (multi) → 4. Concerns (contextual to sex) → 5. Preferences.
  - Progress bar, Back/Next, Skip on optional steps.
- On completion: build `UserProfile`, call `getRecommendations`, apply `deriveFilterState`, route to `/find-test/recommendations`.
- New page `src/pages/TestFinderRecommendationsPage.tsx` — ranked recommendation cards with `buildExplanation` lines, "Compare these tests" CTA (loads top 3 into `compareStore` and navigates to `/compare`).
- Persistent "Restart quiz" affordance on recommendations + comparison screens.

### Technical details

**Routing**
- `/find-test` → existing quiz entry (now the new wizard).
- `/find-test/recommendations` → new recommendations page.
- `/compare` → existing route gets the new `ComparisonTable` when items come from the finder store; existing `ProviderComparisonTable` remains for legacy callers until migrated.

**State**
```text
testFinderStore (Zustand)
├── profile: UserProfile | null
├── quizFilters: FilterState | null   // snapshot at quiz completion
├── filters: FilterState              // live, user-editable
├── recommendations: TestRecord[]
└── selectedTestIds: string[]         // for compare table
```

**Styling tokens (reuse, don't introduce)**
- Background: existing navy `bg-[#081129]` / `bg-[#0F2238]` for panels.
- Accent cyan `#22c0d4` (existing `brand-turquoise`), accent magenta `#e70d69` (existing `brand-pink`).
- Amber fee pill: `bg-[#FFF4E0] text-[#B26A00]` — added as local Tailwind arbitrary classes only inside `AdditionalFeesCell` (not a new theme token).

**Verification UI**
- `<VerificationMark>` wraps any value whose `verification[field]` is `needs_verification`; renders dotted underline + Radix tooltip "Pending verification against provider's live site". Legend component sits above the table.

**Total expected cost rules** (§4.4) implemented in `lib/testFinder/cost.ts`:
- `none` → price; "No additional fees".
- `fixed` → price + amount.
- `range` / `varies_by_location` → price + min, label "Estimate" + tooltip.
- `patient_arranged` → price, note "+ your own phlebotomy cost".

**No live AI in this build.** `getRecommendations` stays deterministic; seam is async so a Lovable AI Gateway edge function can be dropped in later without UI changes.

### Out of scope (defer)
- Migrating existing real-provider data (`src/data/compare/*`) into the new `TestRecord` shape — Phase 5 once the seed flow is validated.
- Saving quiz results to Supabase — current build is client-only via Zustand + sessionStorage.
- Live-AI recommendation backend.

### Delivery order
I'll ship Phase 1 first (tested foundation, no visible change), then Phase 2 (visible: new comparison rows), then Phase 3 + 4 together (quiz → filters → recommendations end-to-end). You can review after each phase before I proceed.
