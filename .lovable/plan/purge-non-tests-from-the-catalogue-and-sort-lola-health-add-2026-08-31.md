# Purge non-tests from the catalogue, and sort Lola Health add-ons last

## What's wrong today

A database sweep confirms non-test rows are still live and displayed, for example:

- `medichecks` — "Visit a Medichecks partner clinic [collection method]", "collection method - urine in-store", "collection method - urine nurse-visit"
- `clinilabs` — "Phlebotomy (Venous draw) at clinic"

These are collection/appointment line items and gift-card style products, not tests. The existing junk filter (`src/utils/is-junk-test-name.ts`) only catches gift cards, vouchers and HTTP error titles — it has no rules for clinic visits, nurse visits, phlebotomy or collection-method rows, so these slip through everywhere.

Lola Health currently has 34 full tests and 74 add-ons, all interleaved in the same grid with no ordering rule, so add-ons dominate the listing.

## What will change

**1. Catalogue sweep (all 8 providers, every active row)**

Parallel sub-agents review each provider's active rows and classify anything that is not a diagnostic test: gift cards, e-vouchers, credit/top-ups, clinic visits, nurse/home visits, phlebotomy or blood-draw appointments, consultations, standalone collection-method entries, shipping/postage lines, and report-only products. Findings are reviewed as one list before anything is removed.

**2. Remove the confirmed non-tests**

A single migration deletes the confirmed rows from `provider_tests` along with their dependent mapping and biomarker rows, so they disappear from every page, comparison table and search at once.

**3. Stop them coming back**

Extend the shared junk-name rules (client copy and the scraper copy used at ingest) to cover visit/appointment/phlebotomy/collection-method/voucher/credit patterns, so a re-scrape rejects them at write time rather than after the fact.

**4. Lola Health: add-ons below full tests**

Full test kits list first, add-ons after, on the provider profile grid and any Lola listing — applied as a general rule (add-ons sort last) rather than a Lola-only hack, since the same logic suits London Health Company.

**5. Make the add-on badge obvious**

Strengthen the existing amber "Add-on" pill on the test card so it reads clearly at a glance on both the resting image face and the hover face: stronger amber, bolder weight, slightly larger, with a visible border.

## Technical notes

- Junk rules: extend `src/utils/is-junk-test-name.ts` and `supabase/functions/_shared/scrape/isJunkTestName.ts` with matching patterns; keep the two files in sync and add a unit test covering the confirmed real-world names.
- Deletion via `supabase--migration` (explicit id list), cascading to `provider_test_mapping` / `provider_test_biomarkers`.
- Ordering: add `is_addon` ascending as the first sort key in `src/components/providers/ProviderTestsGrid.tsx` (before `is_popular` / `popularity_rank`), and mirror in any Lola listing hook that isn't already filtering add-ons out.
- Badge: styling-only edit in `src/components/cards/UniversalTestCard.tsx` at the two existing badge sites plus the resting-face overlay.
- Verification: re-query `provider_tests` for the junk patterns (expect zero), and screenshot the Lola provider page at mobile and desktop to confirm ordering and badge visibility.
