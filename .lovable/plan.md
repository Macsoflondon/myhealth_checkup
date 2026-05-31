## Goal

Show only true, provider-verified biomarker information for every test, restore the in-clinic / home-visit / DIY pricing layout for Goodbody modals, and stop the scraper from re-inserting incorrect biomarkers.

## Phase 1 — Stop the bleeding (display + flagged data)

1. **Fix the inflated-count display bug** in `src/components/providers/ProviderTestDetailModal.tsx`:
   - Replace `Math.max(test.biomarker_count ?? 0, biomarkers.length)` with: if a biomarkers list exists, use `biomarkers.length`; otherwise fall back to `biomarker_count`. The list is the source of truth.
2. **Manual correction migration** for the Male Hormone & Fertility Blood Test (Goodbody):
   - Set `biomarkers_list` to the 6 hormones actually tested (Testosterone, Free Androgen Index, SHBG, FSH, LH, Prolactin — to be verified against `goodbodyclinic.com/products/male-hormone-and-fertility-blood-test` in step 1.3).
   - Set `biomarker_count = 6`.
3. **Verify against the live page** with Firecrawl before writing the correction.

## Phase 2 — Goodbody modal layout (collection options + pricing tiers)

1. Extend `src/data/goodbodyTestDetails.ts` schema with a `collectionOptions` field: `{ method, price, note? }[]` covering In-clinic, Home visit (where offered), DIY blood-draw kit (where offered) — mirroring the reference image.
2. Update `ProviderTestDetailModal.tsx` so that when `goodbodyStatic.collectionOptions` exists, it renders the same pricing-tier block currently used for DB `collection_options`. Goodbody static data wins for Goodbody rows.
3. Populate `collectionOptions` per Goodbody test using the live Goodbody product pages (price tiers scraped via Firecrawl).

## Phase 3 — Full biomarker audit across all 640 active tests

Built as an admin-triggered edge function `audit-biomarkers` so it can be re-run and resumed:

1. For each active row in `provider_tests`, fetch the product `url` via Firecrawl (markdown + html).
2. Extract the biomarker list using a provider-specific extractor (one per provider: medichecks, goodbody-clinic, randox, thriva, lola-health, london-medical-laboratory, london-health-company, clinilabs, tuli-health). Each extractor scopes to the actual "What's tested" / spec section of the page, not footers or related-product blocks.
3. Write results to a new `biomarker_audit_runs` table: `provider_id`, `provider_test_id`, `url`, `scraped_biomarkers jsonb`, `scraped_count int`, `stored_count int`, `stored_list jsonb`, `delta text` (match / count-mismatch / list-mismatch / missing-url / extraction-failed), `run_id`, `created_at`.
4. Admin dashboard page `/admin/biomarker-audit` to review deltas and approve corrections per row (single click → updates `provider_tests.biomarkers_list` + `biomarker_count`). No automatic overwrites — you approve.
5. Batched in chunks of 20 with a 1-second delay between Firecrawl calls; resumable via `run_id`.

## Phase 4 — Stop the regression (Goodbody scraper accuracy)

Rewrite the biomarker extractor in `supabase/functions/goodbody-scraper/index.ts`:

- Restrict extraction to the product-description / "What's included" / "Biomarkers tested" section only. Currently it scans the entire markdown including related-product blocks, which is why B12 / folate creep in.
- Use a deny-list per test category (e.g. a hormone test should never pick up B12, folate, ferritin unless the page's spec section explicitly lists them).
- For Goodbody specifically, since you've chosen "keep curated file": the scraper updates price, URL, availability, and `collection_options`, but does NOT overwrite `biomarkers_list` or `biomarker_count`. Those stay sourced from `src/data/goodbodyTestDetails.ts`.

## Phase 5 — Verification

- Verify Phase 1 in the live preview: open the Male Hormone & Fertility modal, confirm 6 biomarkers shown, no "including Vitamin D" text, no "What is a Male Hormone…" title.
- Verify Phase 2: open a Goodbody modal, confirm in-clinic / home / DIY tiers render.
- Phase 3 result delivered as a downloadable CSV of all 640 tests with their audit verdict for your review before any mass update.

## Technical notes

- New table `public.biomarker_audit_runs` with grants for `authenticated` (read) and `service_role` (all); RLS scoped to admins via `has_role`.
- New edge function `audit-biomarkers` (verify_jwt false, internal-only via service-role check, uses `FIRECRAWL_API_KEY` from env).
- Migration files for: (a) flagged-test correction, (b) new audit table, (c) any subsequent admin-approved corrections.
- No changes to public-facing copy beyond the modal display fix and the corrected biomarker numbers.

## Out of scope

- Re-auditing biomarkers for tests that are no longer active.
- Editing the underlying provider-website data (we only mirror what they publish).
- Automatically applying scraped corrections without your review.