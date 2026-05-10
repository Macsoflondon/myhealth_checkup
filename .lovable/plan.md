## Goal

For every test currently shown in "Our Providers' Most Popular Tests" (all `is_popular = true` rows across Lola Health, Goodbody, Medichecks, Randox, London Medical Laboratory, Thriva, Tuli), verify the real turnaround time, lowest available price, and collection options on the live provider page, then store and display them correctly.

## What's wrong today

1. **Turnaround is provider-wide, not per-test.** `formatTurnaround()` in `ProviderTestDetailModal.tsx` returns one hard-coded string per provider (e.g. all Lola Health = "3–5 working days"). Lola's Peak Insights 70 is actually 2 working days.
2. **Price is shown as a single figure (£230)** even when the provider lists tiered pricing ("from £195"). There is no "from" prefix and no concept of a base price.
3. **Collection method copy is misleading.** Lola Health offers three options: in-clinic phlebotomy (+£35), at-home phlebotomy (+£35), or self-arranged phlebotomist (free). The card just says "At-home phlebotomy service".

## Approach

### 1. Source of truth — scrape every popular test
Run a one-off admin script (Supabase Edge Function using the existing `FIRECRAWL_API_KEY`) that, for each `is_popular = true` row in `provider_tests`:
- fetches the `url` with Firecrawl (`formats: ['markdown']`)
- extracts: turnaround in working days, lowest/base price, available collection methods + any add-on cost
- writes the verified values back via a follow-up migration

Output a CSV/JSON to `/mnt/documents/popular-tests-audit.json` for review before applying.

### 2. Schema additions (one migration)
Add three nullable columns to `provider_tests`:
- `turnaround_days_text TEXT` — e.g. "2 working days", "Same day"
- `base_price NUMERIC` — lowest available price; if set, UI shows "from £X"
- `collection_options JSONB` — array of `{ method, price_modifier, note }`, e.g.
  ```
  [
    { "method": "In-clinic phlebotomy", "price_modifier": 35, "note": "+£35" },
    { "method": "At-home phlebotomy",  "price_modifier": 35, "note": "+£35" },
    { "method": "Self-arranged phlebotomist", "price_modifier": 0, "note": "Free" }
  ]
  ```

### 3. Data update
Apply scraped, human-reviewed values via `INSERT … ON CONFLICT` style updates (insert tool) for every popular test. Lola's Peak Insights 70 lands as: turnaround "2 working days", base_price 195, three collection options as above.

### 4. UI changes — `ProviderTestDetailModal.tsx` and `ProviderTestCard.tsx`
- **Turnaround pill:** prefer `test.turnaround_days_text`, fall back to current `formatTurnaround(provider_id)`.
- **Price:** if `test.base_price` is set, render `from £{base_price}` (card and modal). Otherwise unchanged.
- **Collection method block in modal:** if `collection_options` exists, replace the Finger-prick/Venous badges with a single line — "Multiple collection options available" — plus a Tooltip (shadcn `Tooltip`) listing each option and its price modifier. If no `collection_options`, keep existing badge behaviour.
- **Card:** keep the current finger-prick/venous badges (no change), since the user only asked for the modal fix.

### 5. QA
After data is in:
- Spot-check 4 tests in the modal (Peak Insights 70, Vital Check 56, a Goodbody test, a Randox test) and confirm the displayed turnaround, "from £X" and tooltip match the live provider page.

## Out of scope
- Repopulating biomarker lists (separate task).
- Changing how `formatTurnaround` works for non-popular tests.
- Card-level redesign of badges (modal only for collection options).

## Technical notes
- Scraper job: new edge function `audit-popular-tests` invoked manually from `/admin/test-dashboard` (or run once via `supabase--curl_edge_functions`) — no cron.
- Firecrawl call uses `summary` + `markdown` to keep token cost down; parse with simple regex for "working days" and "£" patterns, then a small LLM step (existing `LOVABLE_API_KEY`/`OPENAI_API_KEY`) for collection options.
- New columns are additive and nullable, so existing reads are unaffected.
- Tooltip component already exists in `src/components/ui/tooltip.tsx`.

## Deliverables
1. Migration adding the three columns.
2. Edge function `audit-popular-tests` + JSON audit artifact for review.
3. Data update applying verified turnaround / base_price / collection_options to ~20 popular tests.
4. Modal + card edits to render "from £X", per-test turnaround, and the collection-options tooltip.
