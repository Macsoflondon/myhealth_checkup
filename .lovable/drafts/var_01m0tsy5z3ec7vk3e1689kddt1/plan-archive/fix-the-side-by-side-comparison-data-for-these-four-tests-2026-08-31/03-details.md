## What gets corrected

**1. Biomarker counts**
- Goodbody Advanced Well Woman: 51 → 52, with the biomarker list re-pulled from the product page so count and list agree.
- London Medical Laboratory Well Woman Premier Plus: 21 → the full panel set published on the product page (currently 47 across the listed panels), list re-pulled to match.

**2. Additional collection fees**
- Clinilabs Essentials Female Hormone: fee of £30 for the in-clinic phlebotomy appointment, with a note that a walk-in is £50, so the total expected cost becomes £105 rather than £75.
- Goodbody: the £175 test plus the £20 in-clinic phlebotomy appointment gives the £195 total the provider advertises, with an asterisk note explaining that a home visit is charged instead of the clinic appointment.
- London Medical Laboratory: clinic phlebotomy £35, home visit £80 — both already held, neither shown.

**3. Clinical review**
Every one of the four includes a written clinical/doctor's report in the price. Each row gets a review type of "included" with the correct professional wording per provider, so the Clinical Review row stops showing a dash.

**4. Collection options for Goodbody**
Restore the two-option display: in-clinic phlebotomy included in the total, or an at-home visit for an extra fee. The comparison cell shows both, with the surcharge in a tooltip on the asterisk.

## Technical notes

- Data corrections are applied to `provider_tests` (`provider_id` + `test_name` keys) — `biomarker_count`, `biomarkers_list`, `collection_fee_type`, `collection_fee_amount`, `clinical_review_type`, `clinical_review_professional`, `home_phlebotomy_option`, `home_phlebotomy_cost`, `collection_method`. No schema change needed; all columns exist.
- `computeTotalExpectedCost` in `src/lib/comparisonFormat.ts` already adds mandatory `fixed`/`from` fees, so totals correct themselves once the fee type is populated.
- `src/services/transformers/testDataTransformer.ts` currently only emits a `collectionFeeNote` when the fee type is `from`. Widen it so a note is emitted whenever a home-visit alternative exists, and add the walk-in note for Clinilabs.
- The Clinilabs / Goodbody / LML scrapers currently drop `collection_fee_type` and `clinical_review_type`, which is why they are null. Set them during ingest so the next scrape doesn't wipe the corrections.
- Clear the cached comparison payload (the `mhc:compare:*` storage key) so the corrected rows show without a manual refresh.

## Verification

Re-open the four-way comparison and confirm: 52 / 11 / 47 / 150 biomarkers, fees of £20*, £30, £35 and Randox as published, clinical review marked included on all four, and Goodbody showing both collection options.
