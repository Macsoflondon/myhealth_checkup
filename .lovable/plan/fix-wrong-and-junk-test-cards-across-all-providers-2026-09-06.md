# Fix wrong and junk test cards across all providers

The £1.00 "Stool Bacteria and Parasites PCR" card is one symptom of a wider problem: the catalogue is showing entries that are not real, bookable consumer tests, and some cards carry provider boilerplate instead of the test's own description. This fixes the whole class, not just that one card.

## What is actually wrong (verified against live data)

- **3 Medical Diagnosis rows priced at £1.00** — the provider's own feed carries £1 placeholders for lab-component items (Stool Bacteria and Parasites PCR, two chlamydia/gonorrhoea PCR entries). £1 is not a real price.
- **87 Lola Health "add-on" entries** — single-biomarker items whose own description begins "This add-on measures…". They are extras bought alongside a panel, not standalone tests, and they clutter listings at £10–£12.
- **2 non-test entries** — Randox "ECG Test" (not a blood test) and "Medichecks E-Gift Card".
- **51 Medical Diagnosis rows still showing the site-wide boilerplate** ("Medical Diagnosis is a private clinical pathology laboratory based in North London…") instead of the test's own text.
- **28 active rows with no biomarker count**, which is why some cards read "Biomarkers not published".

## The fix

**1. Catalogue eligibility rule**

Add a single, explicit rule for what may appear as a test card, applied at the data layer so every listing, category page, comparison and search obeys it. An entry is excluded when any of these is true:

- the price is a placeholder (£5 or under) rather than a published consumer price
- the entry is an add-on/component rather than a standalone test
- the entry is not a diagnostic test at all (gift cards, vouchers, ECG and similar non-blood items)

Excluded rows are marked inactive in the data with a recorded reason, so nothing is deleted and the scrapers will not silently resurrect them.

**2. Stop the scrapers reintroducing them**

Apply the same rule at ingestion in the Medical Diagnosis, Lola Health, Medichecks and Randox sync paths: placeholder-priced and add-on items are skipped rather than written as cards. Provider-verbatim descriptions and raw scrape fields stay exactly as they are today.

**3. Finish the Medical Diagnosis description repair**

Replace the remaining boilerplate descriptions with each test's own text taken verbatim from the provider's product feed, without truncation. Rows where the provider publishes no test-specific text keep no description rather than borrowed copy.

**4. Verify what is left**

Re-check the previously reported cards (Bone Profile at £41 base, £21 phlebotomy, £62 total, 4 hours, 11 biomarkers) plus a sample across every provider, and confirm no card below £20 remains that is not a genuine standalone test.

## Technical notes

- Exclusions are recorded via a supported SQL data update setting `is_active = false`, never a delete; the Bone Profile numeric corrections already applied stay intact.
- Add-on detection for Lola Health uses the provider's own "This add-on" description prefix plus a single-biomarker count, so genuine single-marker standalone tests from other providers are unaffected.
- Scraper changes are limited to `medical-diagnosis-scraper`, `lola-health-scraper`, the Medichecks sync and `randox-scraper`; no schema change is required.
- Description backfill re-extracts from the WooCommerce feed without the current 1,000-character cut, preserving the verbatim rule.
