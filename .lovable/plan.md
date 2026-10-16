# Why some provider tests are missing from the site: findings and recommended fixes

Nothing has been changed yet. All counts below come from live database queries run on 28/09/2026.

## 1. Active vs inactive counts

Total: 751 active, 167 inactive (918 rows).

| Provider | Active | Inactive |
|---|---|---|
| Medichecks | 200 | 6 |
| Medical Diagnosis | 154 | 80 |
| Clinilabs | 139 | 17 |
| Lola Health | 108 | 0 |
| Randox | 67 | 11 |
| London Medical Laboratory | 36 | 1 |
| Goodbody Clinic | 31 | 1 |
| London Health Company | 16 | 51 |

`provider_tests` has no column that records why a test was switched off. The only status column is `data_status`. Reasons below were rebuilt from test names, URLs, prices, whether an active twin exists, and the migrations and scrapers that deactivate rows.

Caveat: 76 inactive rows show `updated_at` = today. That timestamp comes from today's booking-link fix, which reset their check status. It does not mean they were deactivated today.

## 2. Inactive tests grouped by reason

**A. Correctly removed: junk, non-tests or scrape errors (about 27)**
- Medichecks (6): "404 Not Found", plus five "collection method" / "home collection kit is included" fragments.
- Randox (3): "Thank you for your patience.", "Flu Vaccine", "HPV Vaccine - 1 dose". The last two are vaccines; the Randox cleanup migration and the live scraper's junk rule handle these.
- Medical Diagnosis (5): Deposit 50, Deposit 100, Pathology services, Vitamin B12 shots, Premium Report (now attached as an add-on).
- Goodbody (1): GP Consultation.
- London Health Company (about 12): Preparing for your Blood Test (x2), Purple/Yellow/Extra tube and lancet packs, Replacement kits (x4), Fatigue Kit Replacement, Venous blood collection appointment, Venous Collection Kit.

**B. Correctly removed: duplicates with a live equivalent (about 42)**
- Medical Diagnosis (24): old `[slug]`-suffixed profile rows (Thyroid, Kidney profile, Women's Hormones, Metabolic Panel, and so on). Each has an active twin.
- Randox (7): Everyman Complete, Everywoman, Signature, General Health Quickdraw, AMH Quickdraw, PSA Quickdraw, Thyroid Blood Test. Each has an active twin (Randox URL-collision migration).
- Clinilabs (14 of 17): placeholder rows pointing at the Clinilabs homepage, deactivated by the 05/08 and 06/08 duplicate migrations. The real "... Blood Test" product rows are active.
- London Medical Laboratory (1): Allergy Complete (active twin exists).
- London Health Company (2): Advanced Prostate Screening, TSH Blood Test Kit (price-conflict duplicates with active twins).

**C. Removed with no live equivalent: likely wrong (see section 4, about 60)**
- Medical Diagnosis: single tests and cultures deactivated by `deactivate_medical_diagnosis_non_test_items` (16/08) and later clean-ups.
- London Health Company: about 23 real test kits with no URL and no price, left over from the `london_health_company_full_cleanup` migration.
- Clinilabs: 3 placeholder rows with no real product row.
- Randox: Food Sensitivity Test.

**Automatic deactivation paths (these run on every scrape):**
- `mhc-shopify-sync` and `mhc-medichecks-sync` switch a product off when it matches the provider's junk rule.
- `_shared/scrape/upsertWithProvenance.ts` switches off a live row that scrapes at £1 or less. There are currently 0 rows at or below £1.

## 3. Front-end filters that hide active tests

| Filter | File and condition | Active tests hidden |
|---|---|---|
| Missing image | `useAllTests.ts`: `.not("image_url","is",null)` | 17 (Clinilabs 13, Randox 2, Lola 1, Medichecks 1) |
| Missing category | `useAllTests.ts`: `.not("canonical_category","is",null)` | 5 (overlap with the missing-image rows) |
| Missing URL | `useAllTests.ts`: `.not("url","is",null)` | 0 |
| Missing price | `ProviderTestsGrid.tsx`, `useTestCatalogue.ts`, `useRecommendedTests.ts`, `useAtHomeTests.ts`, `useDynamicComparisonPanels.ts` | 2 (Randox) |
| Price of £0 or less | `useAtHomeTests.ts`, `useDynamicComparisonPanels.ts`: `.gt("price",0)` | 0 beyond the 2 above |
| Junk name | `is-junk-test-name.ts` via `ProviderTestsGrid`, `useAtHomeTests`, `useCompareTestsData` | 7 active rows match (Medichecks 5, Randox 2). These are junk that is still active. |
| Add-ons | `useAtHomeTests.ts`: `.eq("is_addon", false)` | 75 hidden from At-home only (by design) |
| Home-kit route | `useAtHomeTests.ts`: `hasHomeKitRoute` | At-home only (by design) |
| Thriva exclusion | `useDynamicComparisonPanels.ts`, `StartJourneySection.tsx` | 0 (no Thriva rows) |
| Row cap | `useAllTests.ts` and `useTestCatalogue.ts`: `.limit(1000)` | 0 today (751 active), but it will bite above 1,000 |

Not filters (no test hidden by these):
- **Link-check status:** after today's fix it only changes Book to Enquire, and never hides a card. 22 active rows have a genuine failed check.
- **Biomarkers:** 38 active rows have no biomarkers, but no list query filters on biomarkers.

Net result: the All Tests page hides 17 active tests. Provider pages hide at most 2 (no price) plus the 7 junk matches.

Open item: the `unified_provider_tests` view returns 879 rows against 751 active tests. The extra 128 rows are not name duplicates (0 found), so the view's joins are probably producing them. This needs checking separately.

## 4. Tests that look wrongly deactivated

**Medical Diagnosis (priced, no active twin):**
- Adeno / Rota Virus Antigen, ALP Isoenzymes, Estriol Free E3, Glycoprotein Polymorphism GPIa, Haemoglobinopathy Screen, HCV Real Time PCR, Human Papilloma Virus (HPV) 20 Low & High Risk Subtypes, LDH isoenzymes, Lipoprotein Electrophoresis, Protein Electrophoresis, Omega 3/6, Prothrombin Time / INR, RBC Folate, Reticulocytes, Urine Examination, Yersinia IgA IgG, Zika IgG IgM.
- Comprehensive Profile SP9, Full Health Assessment - Men, Full Health Assessment - Women, Testosterone – Key Markers (its stored name has a garbled dash).
- Cultures: 15 priced "Culture – ..." rows and 15 unpriced "... Swab" rows are both inactive. As a result, no culture test from Medical Diagnosis is live at all. One set should be live.

**London Health Company (no URL and no price, so they can't simply be switched back on):**
- Advanced Hair Loss Blood Test, Blood Count Test (both variants), High-Sensitivity CRP, Folate Blood Test Kit (x2), Iron Profile / Iron Status Profile, TRT Monitoring Blood Test Bundle, Early Pregnancy Blood Test, Nutrients (Ferritin, Vitamin D, B12) Blood Test (x2), Vitamin D Blood Test (x2), At-Home Vitamin B12, At-Home Thyroid Function, At-Home HbA1c, Cortisol Blood Test Kit, Total Testosterone / Testosterone (x3), Progesterone Hormone Test, Menopause Hormone Panel (x2), Health Check Blood Test (24 Biomarkers), Chlamydia & Gonorrhoea STI Urine Test.
- Some of these are older copies of the 16 active products. The clear gaps are hair loss, blood count, hs-CRP, folate, iron profile, TRT bundle, Vitamin D, progesterone, the 24-biomarker health check and the STI test.

**Clinilabs (homepage placeholder, no real product row):**
- Alphafetoprotein level (AFP), Anti Mullerian Hormone (AMH), ALEX² Allergy Test (300 Allergens).

**Randox:**
- Food Sensitivity Test (£178).

## Recommended fixes (not applied)

1. **Record a reason when a test is switched off.** Add nullable `deactivated_reason` and `deactivated_at` columns to `provider_tests` through a new additive migration. Populate them from the scrapers' junk and suspicious-price paths, and in every future clean-up migration.
2. **London Health Company:** re-run its Shopify sync and check why 23 real kits lack a URL and price. It is probably the handle-matching in the `full_cleanup` migration. Reactivate only rows that come back with a real product URL and price.
3. **Medical Diagnosis:** review the 21 single tests and profiles listed above against the provider's live site. Reactivate verified ones through a data change, and fix the garbled "Testosterone – Key Markers" name. Choose one culture set (priced or swab), fill in missing prices, and reactivate it.
4. **Clinilabs:** find the real product URLs for AFP, AMH and ALEX² and restore them. Otherwise leave them off.
5. **Randox Food Sensitivity Test:** confirm it is still sold. Reactivate if so.
6. **Seven active junk rows** (Medichecks 5, Randox 2): switch them off so the database matches what the site already hides.
7. **All Tests page:** stop requiring an image. Show the card with the brand tile instead (as `UniversalTestCard` already supports), so the 17 imageless tests appear. Fill in the 5 missing categories.
8. **Row cap:** replace the `.limit(1000)` on `useAllTests` and `useTestCatalogue` with paging before the catalogue grows past 1,000.
9. **View row count:** check why `unified_provider_tests` returns 879 rows for 751 active tests.

Every data change above should be checked against the provider's live page. None will bulk-reactivate rows.
