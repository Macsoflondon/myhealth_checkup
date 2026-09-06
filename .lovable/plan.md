# Two cards per test: home kit, and in-clinic/nurse visit

Right now the Prostate PSA card shows £69 (the finger-prick kit price) but its collection line still reads "Home finger-prick kit; clinic phlebotomy; nurse home visit" — the raw provider text, not the route the card is actually priced for.

## What changes

**Card 1 — At-home finger-prick kit**
- Total expected cost: £69.00
- Collection line: "At-home finger-prick kit" only. No mention of clinic or nurse visit anywhere on the card or in its modal.

**Card 2 — Blood draw by a professional**
- One card covering both venous routes, with two totals stacked:
  - Total expected cost (in-clinic draw): £109.00
  - Total expected cost (nurse home visit): £129.00 — shown below, in smaller type
- Collection line names only the two venous routes. No mention of the finger-prick kit.

Tests with only one route keep a single card exactly as today.

## Technical notes

- `deriveCollectionVariants` (src/lib/collectionVariants.ts) currently emits three separate variants. Add a grouping step that merges `clinic` and `home_visit` into one `venous` listing carrying both totals, leaving `home_kit` as its own listing. Single-route rows are unaffected.
- `UniversalTestCard` collection display (`collectionLabel` / `collectionDetail`) falls back to the row's raw `collection_method` string, which is why all three routes appear. When a variant is supplied, the variant's own label/detail wins and the raw string is not used.
- Card/modal price block renders one total for single-route variants and the two-line stacked total for the venous listing; the secondary line uses smaller, muted type.
- Compare keys and React keys use the variant id (`<test id>::home_kit`, `<test id>::venous`).
- Presentation only — no schema change, no new rows, no scraper change.

## Verification

- Goodbody Prostate PSA renders two cards: kit at £69 (kit wording only), venous at £109 with £129 nurse visit below.
- At-home listings show only the kit card; clinic/phlebotomy listings show only the venous card.
- Unit tests for the merged variant, typecheck, and a browser pass over the Goodbody provider page.
