## Part 1 — Comparison tray

**Resting state (nothing selected).** Replace the white dashed strip with a frosted, holographic surface: a translucent light-grey panel with heavy backdrop blur, a soft navy hairline, a faint turquoise-to-pink sheen at very low opacity, and no pulsing animation. It reads as a dormant surface waiting for input, not a call to action. Copy stays as it is: a short line explaining you can select up to five tests, and a "0/5" counter.

**Active state (one or more selected).** Lift the same surface to an opaque card with a turquoise top edge, a stronger shadow, and the counter badge in navy. The transition between states is a single smooth fade, so adding the first test visibly wakes the tray.

**Visibility.** Keep the homepage scroll gate exactly as it is. On other pages the resting tray is present as soon as the page can accept selections, rather than the current all-or-nothing behaviour. Confirm it appears on the category, comparison and test-detail routes.

**Layout.** Constrain the tray to the same 2.5cm page frame as the rest of the page, and make the pill row scroll horizontally with fading edges rather than sliding under the Clear button.

## Part 2 — Provider data corrections (previously approved)

- Goodbody Advanced Well Woman: 52 biomarkers; £20 in-clinic phlebotomy giving the £195 total the provider advertises; home visit shown as the paid alternative with an asterisk note.
- London Medical Laboratory Well Woman Premier Plus: full published panel count (47) with matching biomarker list; clinic phlebotomy £35, home visit £80.
- Clinilabs Essentials Female Hormone: £30 clinic phlebotomy fee, £50 for walk-ins, total expected cost £105.
- All four rows: clinical review recorded as included, with the correct professional wording per provider.

## Technical notes

- Tray work is confined to `src/components/compare/ComparisonBar.tsx` plus a token or two in `src/styles.css` for the frosted surface; no changes to selection state or `compareStore`.
- Data corrections write to `provider_tests` keyed on `provider_id` + `test_name`, filling `biomarker_count`, `biomarkers_list`, `collection_fee_type`, `collection_fee_amount`, `clinical_review_type`, `clinical_review_professional`, `home_phlebotomy_option` and `home_phlebotomy_cost`. Totals recompute themselves once the fee type is set.
- Widen the `collectionFeeNote` rule in `src/services/transformers/testDataTransformer.ts` so a note is emitted whenever a home-visit alternative exists, and set the fee/review fields during scrape so the next ingest does not blank them again.
- Bump the cached comparison payload key so corrected rows appear without a manual refresh.
- Record both items in `roadmap.md`.

## Verification

Empty tray on a category page shows the frosted resting surface; selecting a test switches it to the highlighted active state; the four-way comparison then reads 52 / 11 / 47 / 150 biomarkers with fees and clinical review populated.
