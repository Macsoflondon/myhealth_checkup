
-- Deactivate the standalone "Premium Report" line item — it's not a test,
-- it's now represented as an attached add-on fee on the real tests below.
UPDATE provider_tests
SET is_active = false, updated_at = now()
WHERE id = 'c8f35905-ca61-498f-9209-9a992ce6a1bd'; -- Premium Report (standalone, £37)

-- Base tests where Premium Report is a genuine £37 OPTIONAL add-on.
-- Verified directly against this provider's own bundled pricing:
-- Diabetes Profile I £61 vs "...plus Premium Report" £98 = exactly £37
-- Health Screening Profile £162 vs bundle £199 = exactly £37
-- Prostate Profile £65 vs bundle £102 = exactly £37
-- Thyroid Profile I £64 vs bundle £101 = exactly £37
UPDATE provider_tests
SET clinical_review_type = 'optional', clinical_review_fee = 37, updated_at = now()
WHERE id IN (
  'ac565228-902b-43f4-abf4-3f3c48c62f1f', -- Diabetes Profile I
  'e47e447b-ad81-4972-bde6-199d16b4dbaf', -- Health Screening Profile
  '3202c5fe-a831-400f-b23f-08c84d97bb43', -- Prostate Profile
  'e4d06f55-4c4e-48d1-99e4-dabcf9d043cc'  -- Thyroid Profile I
);

-- Bundle rows where Premium Report is already INCLUDED in the listed price —
-- mark as included with no separate fee, so the comparison table's Total
-- Expected Cost doesn't double-count the £37 that's already baked into price.
UPDATE provider_tests
SET clinical_review_type = 'included', clinical_review_fee = NULL, updated_at = now()
WHERE id IN (
  'a9b5d749-6826-4c3c-b847-effb07ce52c5', -- Comprehensive Profile plus Premium Report
  '55f577ac-abee-4db4-a419-ce8e8c9f1343', -- Diabetes Profile I plus Premium Report
  '492bf5f2-c9f6-4fcd-9b63-b223cbf6740d', -- Full Health Assessment – Men plus Premium Report
  '068bff53-2f35-4b55-a192-38a13551bf69', -- Full Health Assessment – Women plus Premium Report
  '2ba9e350-7e4b-4735-ba85-3820a09a7295', -- Health Screening Profile plus Premium Report
  '465768d5-988a-462c-8bc3-ddeefd19b8f8', -- Prostate Profile plus Premium Report
  '00f71a64-1c1f-407b-b8a0-7008e32b9d66'  -- Thyroid Profile I plus Premium Report
);
