-- Remove add-on flag from comprehensive test panels that are NOT add-ons
UPDATE provider_tests 
SET is_addon = false, updated_at = now()
WHERE provider_id = 'lola-health' 
AND (
  test_name ILIKE '%Core Health%'
  OR test_name ILIKE '%Blood Health%'
  OR test_name ILIKE '%Cardiovascular Health%'
  OR test_name ILIKE '%TruAge%'
  OR test_name ILIKE '%TruHealth%'
  OR test_name ILIKE '%Active Boost%'
  OR test_name ILIKE '%Hormones Clarity%'
  OR test_name ILIKE '%Hormones 7%'
  OR test_name ILIKE '%GutID%'
  OR test_name ILIKE '%Peak Insights%'
  OR test_name ILIKE '%Vital Check%'
  OR test_name ILIKE '%Heavy Metal Blood Test%'
  OR test_name ILIKE '%Liver%Kidney%'
  OR test_name ILIKE '%Thyroid%Hormonal%'
  OR test_name ILIKE '%Membership%'
);