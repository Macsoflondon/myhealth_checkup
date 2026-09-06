# Split tests by collection route, and fix missing biomarker counts

Two problems are visible on the Goodbody Prostate PSA card:

1. It says biomarkers are "not published by this provider" — Goodbody's own product page clearly shows 1 biomarker (PSA). We stored nothing.
2. It shows one flat "Total expected cost £69". £69 is the at-home finger-prick kit price. Goodbody also charges +£40 for a clinic blood draw and +£60 for a nurse home visit — none of that is shown, and the same card appears in every tab regardless of collection route.

## What changes for visitors

**One card per collection route.** A test that offers both a home finger-prick kit and a nurse/clinic draw now appears as two distinct listings:

- In the at-home / finger-prick tabs: the kit card at the kit price (PSA: £69).
- In the clinic / phlebotomy tabs: the same test at kit price plus the draw fee (PSA: £109 clinic, £129 nurse home visit), labelled with the collection route so the price is never ambiguous.

Each card's headline figure is the real total for that route, and the modal states which route it is and what the fee covers. Tests with only one route keep a single card exactly as today.

**Biomarker counts filled in.** Where a provider publishes its biomarker list and we simply hadn't captured it, the count and list are corrected. Cards only say "not published" when the provider genuinely doesn't publish it.

## Scope

Every provider, not just Goodbody. Current state in the database:

- 76 active tests already flag both a home kit and a clinic visit (64 Medichecks, 10 Goodbody, 2 London Medical Laboratory) — these are the ones that split into two cards.
- Collection fees are already stored for most rows (`clinic_phlebotomy_cost`, `home_phlebotomy_cost`), so the pricing maths mostly works from data we hold.
- 38 active rows have no biomarker count (17 Randox, 10 Goodbody, 6 Medichecks, plus a few others) — each is checked against the provider's page and either filled in or explicitly marked as not published.

## Technical approach

**1. Route variants in the presentation layer, not duplicate rows.**
Keep one row per test in `provider_tests`. Add a small derivation (`src/lib/collectionVariants.ts`) that expands a test row into 1-3 variants — `home_kit` (finger-prick), `clinic` (venous draw at a clinic), `home_visit` (nurse to your door) — based on `home_kit_available`, `clinic_visit_available`, `sample_type`, `clinic_phlebotomy_cost`, `home_phlebotomy_cost`. Each variant carries a stable id (`<test id>:<route>`), a route label, and a route total. This keeps writes on `provider_tests` untouched and avoids duplicating catalogue data.

**2. Listing queries consume variants.**
`useAtHomeTests` currently filters `sample_type ilike '%finger%'` — it drops any test whose stored sample type is venous even when a finger-prick kit exists, which is why the PSA kit is missing from the at-home tab. Switch it (and the category/comparison listings that share `testQueryBuilder`) to select on route variants rather than raw `sample_type`. Phlebotomy-oriented tabs take the `clinic` / `home_visit` variants.

**3. Card and modal display.**
`UniversalTestCard` and its adapters (`universalTestAdapter`, `resolve-test-fields`) take an optional variant. Headline price becomes the variant total; the collection line names the route; the modal adds a short breakdown (kit/test price + draw fee = total) using the existing `comparisonFormat` helpers. Comparison selection keys off the variant id so a clinic listing and a kit listing of the same test can be compared side by side.

**4. Data corrections.**
Migration-free data updates via SQL for: Goodbody Prostate PSA (`biomarker_count = 1`, list `["Total PSA"]`, `sample_type` corrected so the finger-prick kit variant resolves), plus the audited biomarker backfill across the 38 gap rows. Rows where the provider truly publishes nothing get `biomarkers_not_stated = true` so the "not published" wording stays honest and doesn't get re-flagged.

**5. Scraper fixes so it stays right.**
- `goodbody-scraper`: parse the "What biomarkers do we test?" section for count and marker names, and capture the collection-option pricing table into `clinic_phlebotomy_cost` / `home_phlebotomy_cost`.
- Where a provider page publishes no markers, set `biomarkers_not_stated` rather than leaving nulls that look like a capture failure.
- No change to description handling — `description` stays provider-verbatim.

## Verification

- Goodbody Prostate PSA appears in the at-home finger-prick tab at £69 and in the clinic tab at £109 / nurse visit at £129, each with the route named.
- Its card and modal show 1 biomarker (PSA), not "not published".
- Tests with a single route still render exactly one card.
- Typecheck, unit tests, and a browser pass over `/at-home-tests` and `/tests/cancer`.
