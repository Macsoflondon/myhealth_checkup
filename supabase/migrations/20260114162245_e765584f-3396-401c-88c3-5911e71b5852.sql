-- First, set ALL Lola Health tests to NOT be add-ons
UPDATE provider_tests 
SET is_addon = false, updated_at = now()
WHERE provider_id = 'lola-health';

-- Then, mark the actual add-on tests as is_addon = true
-- These are the single biomarker tests from the blood-test-add-ons collection
UPDATE provider_tests 
SET is_addon = true, updated_at = now()
WHERE provider_id = 'lola-health' 
AND (
  test_name ILIKE '%Albumin%' AND test_name NOT ILIKE '%profile%'
  OR test_name ILIKE '%ALP%'
  OR test_name ILIKE '%ALT%'
  OR test_name ILIKE '%Aluminium%'
  OR test_name ILIKE '%Amylase%'
  OR test_name ILIKE '%Anti-CCP%'
  OR test_name ILIKE '%Antimullerian Hormone%'
  OR test_name ILIKE '%Apolipoprotein A1%'
  OR test_name ILIKE '%Apolipoprotein B%'
  OR test_name ILIKE '%Arthritis Screen%'
  OR test_name ILIKE '%AST%Aspartate%'
  OR test_name ILIKE '%Beta-HCG%'
  OR test_name ILIKE '%Bilirubin%'
  OR test_name ILIKE '%Blood Group%'
  OR test_name ILIKE '%CA125%' OR test_name ILIKE '%CA 125%'
  OR test_name ILIKE '%Caeruloplasmin%'
  OR test_name = 'Calcium'
  OR test_name ILIKE '%Candida Albicans%'
  OR test_name ILIKE '%Chol:HDL%'
  OR test_name ILIKE '%Copper%Serum%'
  OR test_name ILIKE '%Corrected Calcium%'
  OR test_name ILIKE '%Cortisol%'
  OR test_name ILIKE '%Creatine Kinase%'
  OR test_name ILIKE '%Creatinine%'
  OR test_name ILIKE '%CRP%'
  OR test_name ILIKE '%DHEA Sulphate%'
  OR test_name ILIKE '%Dihydrotestosterone%'
  OR test_name ILIKE '%eGFR%'
  OR test_name ILIKE '%ESR%'
  OR test_name ILIKE '%Ferritin%'
  OR test_name ILIKE '%Folate%Serum%'
  OR test_name ILIKE '%Follicle Stimulating Hormone%'
  OR test_name ILIKE '%Free Androgen Index%'
  OR test_name ILIKE '%G6PD%'
  OR test_name ILIKE '%Gamma GT%'
);