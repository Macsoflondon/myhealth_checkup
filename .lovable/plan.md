
## Problem

The two "Live Comparison" cards on the homepage are not live:
- Prices, providers, and the "Prices verified June 2026…" footer are hardcoded in `LiveComparisonCard.tsx` / `StartJourneySection.tsx`.
- Only 3 panels seeded in DB (`full-blood-count`, `thyroid-health`, `testosterone-check`), last scraped 13 June 2026.
- The `refresh-live-comparison-panels-hourly` pg_cron job exists but is **inactive** (`active: false`).
- Rotation currently only shows a handful of hardcoded tests, not the wider catalogue.

## Fix

### 1. Wire the UI to Supabase (no more hardcoded prices)

- `src/components/sections/StartJourneySection.tsx`: replace `TESTS` and `LEFT_PANELS/RIGHT_PANELS` constants with a `useQuery` against `live_comparison_panels` (ordered by `display_order`). Split panels into two groups (even indexes → left card, odd → right card, or halve the ordered list) so both cards rotate through the full set in lock-step without duplicates. Keep the sync rotation interval.
- `src/components/sections/LiveComparisonCard.tsx`:
  - Accept panels shaped from the DB (`slug`, `panel_name`, `rows[]`, `last_scraped_at`). Adapter maps `rows` → the existing `providers[].options[]` shape (group multiple options per provider by name).
  - Delete the `DEFAULT_LIVE_COMPARISON_PANELS` constant.
  - Replace the hardcoded footer with dynamic copy derived from the panel's `last_scraped_at`:
    - `< 24h` → "Prices verified today from provider websites."
    - `< 7d` → "Prices verified {N} days ago from provider websites."
    - else → "Prices verified {DD Mon YYYY} from provider websites."
    - Always appended: "Always confirm current pricing before booking."
- Keep a minimal loading skeleton (same card frame) so there's no CLS.

### 2. Expand seeded panels so rotation actually rotates

Add a migration that upserts a broader panel set into `live_comparison_panels` (each row includes a real provider `url` so the scraper can fetch a price). Target set (initial):

Male Hormone, Female Hormone, Thyroid Health, Vitamin D, Vitamin B12, Full Blood Count, Cholesterol / Lipid, HbA1c / Diabetes, Iron Studies, Liver Function, Kidney Function, PSA (Prostate).

Each panel: 4–6 providers picked from Medichecks, Randox, Thriva, Goodbody, Lola Health, London Medical Laboratory, with the correct product URL. A background sub-agent will collect the exact URLs from `provider_tests` / provider sites before writing the migration.

### 3. Make the scraper actually run every 6 hours

- Reactivate + reschedule the pg_cron job via `supabase.insert` SQL (not migration — contains project-specific URL/anon key):
  ```sql
  select cron.unschedule('refresh-live-comparison-panels-hourly');
  select cron.schedule(
    'refresh-live-comparison-panels-6h',
    '0 */6 * * *',
    $$ select public.call_edge_with_automations(
         'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/refresh-live-comparison-panels',
         '{}'::jsonb); $$
  );
  ```
- Trigger `refresh-live-comparison-panels` once immediately after seeding so `last_scraped_at` is fresh and the UI footer reads "verified today".
- `supabase/functions/refresh-live-comparison-panels/index.ts` is left as-is (it already scrapes `£` from each row's URL with JSON-LD → meta → regex fallbacks and preserves the last known good price on failure).

### 4. Verification

- Query `live_comparison_panels` after seed + scrape: confirm ≥ 10 panels, `last_scraped_at` within the last hour, prices populated.
- Load homepage, confirm both cards rotate through all panels in lock-step with no overlap, and footer shows "verified today".

## Files touched

- `src/components/sections/LiveComparisonCard.tsx` (rewrite data source + footer)
- `src/components/sections/StartJourneySection.tsx` (fetch from Supabase, split panels)
- `supabase/migrations/<new>_expand_live_comparison_panels.sql` (seed panels + URLs)
- `supabase` insert (not migration): unschedule old cron + reschedule 6-hourly + one-shot invoke
- No changes to the scraper edge function
