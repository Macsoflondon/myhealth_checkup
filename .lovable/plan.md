# Plan: Modal QA + Working Compare Flow

## 1. Modal QA pass (`ProviderTestDetailModal.tsx`)

Verify and tighten so every provider's test renders cleanly at 375–1440px without overflow or clipping:

- Header title: add `break-words` + `pr-2` so very long test names (e.g. Randox panels) don't push the close button.
- Header pill row: already wraps — keep, but ensure price pill uses `formatTestPrice` fallback when `headerPrice` is 0.
- Description: add `whitespace-pre-line` so multi-line provider descriptions render.
- Collection options list items: switch to `flex-wrap` so long method names (e.g. "Self-arranged phlebotomist") don't crush the price column on 360px.
- Biomarkers: cap visible chips at ~24 with "+N more" toggle to avoid 200-row Randox panels blowing the modal height. Keep scrollable container as fallback.
- Provider card: ensure tagline truncates to 2 lines.
- CTA grid: keep 3-col on ≥sm, stacked on mobile. Ensure Book/Compare/Back all have consistent height and the disabled Book state is visually clear.
- Sanity check across providers: Medichecks, Goodbody (static data), Randox, Thriva, Lola, London Medical Lab, Tuli — confirm sections (collection options, biomarkers, accreditations) all populate via fallbacks already defined.

## 2. Working "+ Compare" feature

Currently the button links to `/compare?test=<name>` which the compare page ignores — selection state is local to `CompareTests` only. Replace with a shared, persistent compare store.

### New: `src/stores/compareStore.ts`
- Tiny Zustand store (already a dep) holding `items: CompareTestData[]`, `add`, `remove`, `clear`, `has(id)`.
- Persist to `localStorage` (`mhc:compare`) so selections survive navigation.

### `ProviderTestDetailModal.tsx`
- Replace the `<Link>` "+ Compare" with a button that:
  1. Maps the current `ProviderTestCardData` → `CompareTestData` shape.
  2. Calls `compareStore.add(test)`.
  3. Closes the modal and navigates to `/compare?openCompare=1` via `useNavigate`.
- Show "Added ✓" state briefly if user re-taps while already in list (toggle off).

### `CompareTests.tsx`
- On mount, seed `selectedTests` from `compareStore.items` and subscribe to changes (so additions from anywhere reflect immediately).
- Push local toggle changes back into the store (single source of truth).
- Read `?openCompare=1` from `useSearchParams` and auto-open `ComparisonPanel` when ≥2 items are present; otherwise just show the `ComparisonBar`.

### `UnifiedTestCard.tsx`
- `onCompareToggle` already exists for the in-page list; also call into `compareStore` so toggles from any card (home, carousels) accumulate the same selection set.

## 3. Verification
- Manual sweep: open modal on Home → Most Popular, Compare page → Recommended carousel, and a provider catalog. Tap "+ Compare" twice on different tests, confirm bar appears, navigate to `/compare`, confirm panel opens with both.
- Resize to 375px and 1440px, check no horizontal scroll inside modal for the longest Randox panel.

## Out of scope
- No backend / DB changes.
- No new compare logic — reuses existing `ComparisonPanel`.
