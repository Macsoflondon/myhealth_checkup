## Remove Physician Assistant claims from medical review pages

Four files need updating to remove any suggestion that the clinical reviewer is a Physician Assistant / Physician Associate, works under a supervising doctor, or does not hold independent prescribing rights.

### Changes

1. **`src/pages/MedicalReviewPage.tsx`**
   - Replace the disclaimer paragraph that explicitly names "Physician Associates" and states they work "under the supervision of doctors" and "do not currently hold independent prescribing rights" with a neutral statement confirming the reviewer is a Registered Healthcare Professional and that content is informational only.
   - The reviewer `role` field already reads "Clinical Reviewer — Registered Healthcare Professional" and does not need changing.

2. **`src/components/compliance/HowWeRank.tsx`**
   - Rephrase the byline and registration reference so "PA43353" is clearly presented as an HCPC registration number, not a job-title abbreviation. No other reviewer details change.

3. **`src/pages/LegalPage.tsx`**
   - Update the Medical Review card description to match the revised, neutral phrasing used in HowWeRank.

4. **`public/llms.txt`**
   - Update the medical reviewer line from "Nathanial Smith PA" to "Nathanial Smith, Registered Healthcare Professional (HCPC)" so the public LLM context no longer implies the PA title.

All other clinical-review metadata, scope text, and HCPC registration number remain intact.