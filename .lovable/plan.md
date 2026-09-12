# Fill in missing biomarkers, richer provider detail, and correct collection listings

The Medichecks Advanced Thyroid Function card shows three real faults. All three are data-capture failures, not display bugs.

## What I confirmed in the live data

- The stored row has `biomarker_count = 10` but **no biomarker list at all** (`biomarkers_list` is null). The card is telling the truth about what we hold — we simply never captured the names, even though Medichecks publishes all ten on the product page.
- This is not one row: **every one of the 200 active Medichecks tests has no biomarker list**, 194 of them with a count and no names. Randox has 18 more, plus a handful across Clinilabs, Lola Health and Medical Diagnosis.
- The description we show (258 characters) is genuinely all we captured. Medichecks' page carries far more — what each marker tells you, who the test suits, how to prepare — and none of it is stored.
- The row flags both a home finger-prick kit and a clinic draw, but no clinic draw fee is stored, so the two routes cannot be priced apart and the listing collapses into a single, misleading card.

## What changes for visitors

**Biomarker names appear.** The thyroid card lists its ten markers (TSH, Free T3, Free T4, thyroglobulin and thyroid peroxidase antibodies, plus the nutrient markers). "Not published by this provider" is reserved for tests where the provider genuinely publishes nothing.

**Fuller test information, in the provider's own words.** Each test page gains distinct sections captured verbatim from the provider's page — what the test measures and why, who it suits, and how to prepare — rather than a single short paragraph. Nothing is AI-written or reworded; the locked verbatim rule stands, we simply capture more of what the provider already publishes and present it as clearly labelled sections with the source link.

**Two listings, one per collection route.** A test offering both a home finger-prick kit and a clinic draw appears twice: once as the at-home kit at the kit price, once as the clinic draw at kit price plus the draw fee, each labelled so the price is never ambiguous. Finger-prick listings stop appearing in clinic-collection contexts and vice versa. Tests with only one route keep a single card.

## Scope

All eight providers, prioritised by the size of the gap: Medichecks (200 rows), Randox (18), then the remainder.

## Technical approach

**1. Capture biomarker lists.** Medichecks' Shopify feed does not carry the marker list, so the per-product page is the source. Extend the Medichecks page-scrape path to parse the published marker section into `biomarkers_list`, reconcile `biomarker_count` against the parsed length, and set `biomarkers_not_stated` only when the page truly lists none. Reuse `_shared/scrape/normaliseBiomarkers.ts` so casing and de-duplication stay consistent, and write through `upsertWithProvenance` so provenance and history are recorded. Same treatment for the Randox and remaining gap rows using each provider's existing scraper.

**2. Capture richer provider sections.** Add nullable text columns for the additional verbatim sections (`what_is_tested`, `preparation_notes`, alongside the existing `who_should_test`), each written straight from the provider page at scrape time with `description_source = 'scraped_verbatim'`. `description` and `description_scraped` behaviour is unchanged. Render the new sections in `ProviderTestDetailTemplate` and the card modal, each shown only when captured.

**3. Split by collection route.** Route variants already exist in `src/lib/collectionVariants.ts`. Two fixes are needed: capture Medichecks' clinic draw and nurse visit fees into `clinic_phlebotomy_cost` / `home_phlebotomy_cost` so the routes price apart, and audit the category and thyroid listings so they consume variants rather than the raw row — a route with no captured fee must not silently merge into the kit listing.

**4. Backfill, then hold the line.** Run the corrected scrapers across the catalogue to fill existing rows, then extend `audit-scrape-completeness` to flag any row with a biomarker count but no list, so this gap surfaces in the admin dashboard rather than on a customer's screen.

## Verification

- The Advanced Thyroid Function card and modal list ten named biomarkers.
- It appears as a finger-prick kit listing and a separate clinic-draw listing, each priced for its route.
- Its detail page shows the provider's fuller sections, verbatim, with the source link.
- Catalogue-wide count of active rows with a biomarker count but no list drops to zero.
- Typecheck, unit tests, and a browser pass over the thyroid category and the test detail page.
