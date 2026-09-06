# Fix Medical Diagnosis test data + remove the Randox ECG card

## What's wrong (confirmed against the live site and the database)

**Randox "ECG Test", £120** — an electrocardiogram, not a blood test, so it should not appear in blood-test listings.

**Medical Diagnosis "Bone Profile"** — the stored record says £39 with no phlebotomy fee. The provider's own page says:

- Price £41.00
- Phlebotomy service fee £21 → real total £62
- Turnaround 4 hours
- 11 tests included (our list already matches)
- A real product description ("This profile helps evaluate the health of your bones…")

Instead of that description, we are showing the provider's site-wide boilerplate — the stored text is a dump of their whole page (address, phone number, navigation menu, "Recent Posts"), which is why "About this test" reads like a company blurb. 86 of the 157 live Medical Diagnosis tests carry that same page-dump text, and all 157 have a £0 phlebotomy fee, so the "total expected cost" is understated by £21 across the whole provider.

The provider publishes a clean, structured product feed containing the correct price and the correct per-test description, so this is fixable properly rather than row by row.

## The fix

1. **Hide the Randox ECG card.** Mark that record inactive so it disappears from every listing, comparison and search. No route or component changes.

2. **Correct Medical Diagnosis at the source (the scraper).** Update the Medical Diagnosis sync so that, for every test, it:
   - takes the price from the provider's product feed (fixes £39 → £41 and any other drift);
   - uses the provider's own per-test description verbatim, and never falls back to page text that contains their navigation, address or "Recent Posts" — if no genuine description exists, the field is left empty rather than filled with boilerplate;
   - reads the phlebotomy service fee stated on each test ("Phlebotomy service fee: £21.") and stores it as the clinic collection fee, so total expected cost = test price + phlebotomy fee (£62 for Bone Profile);
   - keeps the turnaround wording exactly as published ("4 hours");
   - keeps the published tests-included list and count.

3. **Write the corrected collection wording.** "Clinic appt" is replaced with plain English: "In-clinic appointment — venous blood draw (phlebotomy fee £21)". Where a fee applies, the card and modal show the test price and the fee separately as well as the total, per our pricing-transparency rule.

4. **Re-sync all 157 live Medical Diagnosis tests** with the corrected logic, then spot-check Bone Profile plus a sample across allergy, hormones, heart and women's health against their live pages before calling it done.

5. **Clean up the existing boilerplate.** Any remaining record still holding the page-dump text has that text cleared so no test shows the company blurb as its description.

## Technical notes

- Randox ECG: `provider_tests` row `65b003e1-0ef0-4902-9b95-d34133c5b944` set `is_active = false` (data change, not a delete — reversible).
- Scraper: `supabase/functions/medical-diagnosis-scraper/index.ts`. It already reads `wp-json/wc/store/products`; that feed returns `prices.price = 4100` and a correct `short_description` for Bone Profile, so the wrong values in the database came from a different write path. Changes: drop the `CLINIC_VISIT_FEE = 0` / `phlebotomy_included: true` assumption in favour of a fee parsed from the description; drop the `"<name> from Medical Diagnosis."` and page-text description fallbacks; set `total_expected_cost = price + clinic_phlebotomy_cost`; replace `collection_method: 'Clinic phlebotomy'` with the wording above.
- Description rule preserved: `description = description_scraped`, verbatim provider text, `description_source = 'scraped_verbatim'`. No LLM rewriting.
- Boilerplate detection is a literal prefix match on the known page-dump opener, not a heuristic, so genuine descriptions can't be wiped by accident.
- Cleanup and re-sync run as data operations; the scraper edit is deployed first so the next scheduled run doesn't reintroduce the bad values.
- No frontend component changes are expected — cards, modal and comparison already read these fields. If the fee-and-total display isn't already split on the card, that presentation tweak is included.

## Not included

Only the Randox ECG is being hidden. If you want a wider sweep for other non-blood items (ultrasound, GP appointments, B12 shots and similar) across all providers, say so and I'll do that as a separate pass.
