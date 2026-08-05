# Fix the test information card: real overviews, accurate metrics, honest collection wording

## What I verified in the live data

- **No descriptions exist.** Every Goodbody row in `provider_tests` has `description = NULL`. The card is not showing bad copy from the database — it is showing a hardcoded fallback string, `Comprehensive screening from {provider}.`, in `ProviderTestsGrid.tsx`. Platform-wide this affects **511 of 762 active tests**, not just Goodbody.
- **"Clinic visit" is a flag, not the sample method.** The modal label comes from `home_kit_available` / `clinic_visit_available` booleans only. The stored `sample_type` ("Venous") and `collection_method` ("Clinic appt") are never shown, so the user is never told it is a venous blood draw.
- **TruCheck's title is corrupted.** Stored as `TruCheck‚Ñ¢ - Early Cancer Screening Blood Test` — a mis-decoded `™`. Three other rows are corrupted the same way (two Medichecks, one Medical Diagnosis).
- **TruCheck's "18 biomarkers" is wrong in meaning.** The 18 stored values are cancer groups (Adrenal, Breast, Gastrointestinal, Skin, Thyroid…), not biomarkers. The card labels any count as "biomarkers / Measured".
- **Advanced Well Man's count is inconsistent.** `biomarker_count = 49` but the stored list holds 18 entries — several are grouped labels ("Liver Function", "Iron Studies") rather than individual markers. **79 tests platform-wide** have this count-vs-list mismatch.
- Rich, accurate Goodbody copy already exists in `src/data/goodbodyTestDetails.ts` (descriptions, biomarkers, who-should-take, preparation, turnaround) but this card never reads it — only the older `ProviderTestDetailModal` does.

## What I will build

### 1. Stop inventing copy (highest priority)
Remove the `Comprehensive screening from {provider}.` fallback everywhere. When a provider has published no overview, the card states it plainly — "Overview not published by this provider" — consistent with the missing-data treatment already used for biomarkers and turnaround. Fabricated filler is worse than an honest gap on a comparison platform.

### 2. Give Goodbody real overviews
Wire the curated `goodbodyTestDetails` content into the universal card path so each Goodbody test shows its own two-to-three-sentence overview, who it suits, and preparation notes — not a generic line. Where the curated file has no entry (TruCheck, EpiSwitch PSE, NIPT, NAD, H. Pylori), I will write accurate entries from the provider's own product pages.

### 3. Say what the sample actually is
Replace the boolean-derived "Clinic visit" chip with the real collection description built from `sample_type` + `collection_method`:
- Goodbody venous panels → **"Venous blood draw — in-clinic appointment"**
- Goodbody finger-prick kits → **"Finger-prick sample — at-home kit"**

Falls back to the flags only when sample data is genuinely absent.

### 4. Fix the corrupted names and the metric labels
- Repair the four mis-encoded test names (`TruCheck™`, `Men's`, `Women's`, `Testosterone – Key Markers`) and add decoding at the scraper write path so they cannot come back.
- Add a measurement-type concept so a card can say **"75 cancer types screened"** instead of "18 biomarkers" for multi-cancer early-detection tests such as TruCheck. Cancer-screening panels that count cancers, allergy panels that count allergens, and blood panels that count biomarkers stop being described interchangeably.
- Correct Advanced Well Man: publish the full itemised marker list from Goodbody's page and reconcile `biomarker_count` to the actual list length, so the headline number is defensible.

### 5. Audit the rest
Produce an admin-visible list of the remaining 507 tests with no overview and 78 with a count mismatch, so the same fix can be rolled through the other providers rather than patched per complaint.

## Technical notes

- Card/modal changes: `src/components/cards/UniversalTestCard.tsx` (`collectionLabel`, description block, metric label), `src/lib/universalTestAdapter.ts`, `src/components/providers/ProviderTestsGrid.tsx` (drop the fallback string).
- Content changes: extend `src/data/goodbodyTestDetails.ts`; data corrections applied to `provider_tests` scoped to `provider_id` + exact `test_name`, per the existing write rules.
- New column `measurement_type` (`biomarkers` | `cancers` | `allergens`) on `provider_tests`, defaulted to `biomarkers`, set via migration; `TruCheck™` set to `cancers` with the correct count.
- Encoding fix in the shared scrape pipeline so UTF-8 is decoded correctly for all providers.
- Descriptions remain provider-sourced factual summaries — no diagnostic or outcome language.

## Out of scope for this pass

Writing overviews for all 507 remaining tests across the other eight providers. That is a content job I will scope once you have seen the Goodbody result and confirmed the tone.
