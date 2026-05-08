## Goal

Update the "Your health. On the perfect plan." section on the homepage (`src/components/sections/DreamHealthShowcase.tsx`) so that:

1. The Lola Health "Cardiovascular" test is hidden.
2. Tests are interleaved across providers (no provider clustering).
3. Two rows are removed from the bottom (12 cards instead of 18 — 4 rows on desktop).
4. The filmstrip carousel directly above the headline shows 8 actual popular test kit images instead of the current generic kit photos.

All changes are presentation-only and live in `DreamHealthShowcase.tsx`. The shared `usePopularTestsFromDatabase` hook is not modified, so other consumers are unaffected.

## Changes

### 1. Filter out Lola Health Cardiovascular

In the component, after data loads, drop any test where `provider_id === 'lola-health'` AND the cleaned name matches "cardiovascular" (case-insensitive). This is precise and won't accidentally remove other Lola Health tests or other providers' cardio tests.

### 2. Interleave tests across providers (round-robin)

Group the loaded tests by `provider_id`, then walk the groups in round-robin order so the rendered grid alternates Medichecks → Thriva → Randox → Lola Health → GOODBODY → London Medical Lab → Medichecks → … Pure presentation reorder, no data mutation.

### 3. Trim to 12 cards

Cap the rendered list at 12 (4 rows × 3 columns on desktop, 6 rows × 2 on tablet, 12 stacked on mobile). The hook is already requested with `limit=18`; we simply slice the interleaved result.

### 4. Replace the top filmstrip with 8 popular-test images

The current `tiles` array uses static kit images. Replace it with the first 8 entries of the interleaved popular-tests list, each rendered in the existing tile style with:
- `src` = `getOverrideImage(test.test_name) || test.image_url || kitImages[i % kitImages.length]` (same fallback chain as the cards below, so the Medichecks Advanced Well Man override and any future overrides apply).
- `alt` = the cleaned test name.
- While loading, render 8 skeleton tiles in the same layout to prevent layout shift.

The carousel keeps its existing horizontal scroll, snap, and rounded-tile styling — only the image sources change.

## Out of scope

- No changes to the database, the `usePopularTestsFromDatabase` hook, navigation, or any other section.
- No styling/typography changes to cards or the headline.
- No new packages.

## Notes / assumptions

- "Two rose from the bottom" is read as "two rows from the bottom" — i.e. drop the last 6 cards (2 rows of 3 on desktop), leaving 12. If you actually meant 1 row or a different count, say the word and I'll adjust.
- "Eight of the Tesco images" is read as "eight of the test images" — i.e. the kit photos from the popular tests just below. Confirm if you meant something else.
