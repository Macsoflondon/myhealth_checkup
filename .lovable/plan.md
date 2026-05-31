# Fix “Our Partners Most Popular Tests” on homepage

## What I’ll change
1. Replace the current selection logic so the homepage section always builds a pool from real `provider_tests` rows with:
   - a live test URL
   - a real external image URL
   - provider-owned row data only
2. Keep provider mixing by round-robin across providers, then cap the homepage display at exactly 9 cards.
3. Stop depending on the tiny `is_popular` subset when it cannot fill 9 cards; use it as a priority signal, then backfill from other valid provider tests.
4. Keep every card wired directly to the provider test URL, and keep the displayed image as the test’s own `image_url`.
5. Leave generated/fallback imagery out completely.

## Expected result
- The homepage section shows 9 test containers, not 3.
- Cards are mixed across providers instead of grouped by one brand.
- Card data stays direct from provider rows already stored in Supabase.
- Images stay the real test image URLs from those rows.

## Technical details
- Update `usePopularTestsFromDatabase` so it returns a bigger valid pool of provider rows with the fields already needed by the homepage.
- Prioritisation order:
  1. `is_popular = true` valid rows first
  2. then additional valid rows from other providers to fill the pool
- Update `DreamHealthShowcase.tsx` selection logic to:
  - filter only real external `image_url` + non-empty `url`
  - interleave by provider
  - slice to 9 final cards
  - keep the carousel sourced from the same 9 cards
- Remove any logic that accidentally collapses the pool to 3 visible cards.

## Constraints I’ll keep
- No generated images
- No synthetic copy for missing images
- No fake/test placeholder assets
- Use provider test URLs for click-throughs
- Keep scope limited to this homepage section and its fetch logic