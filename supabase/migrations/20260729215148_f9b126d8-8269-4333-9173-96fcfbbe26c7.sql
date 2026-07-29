-- 1. Remove the junk scraped row whose title is an error page
UPDATE public.provider_tests
SET is_active = false, home_kit_available = false
WHERE test_name ~* '^(404|403|500|error|page not found|not found|access denied|just a moment)'
   OR test_name ILIKE '%404 not found%';

-- 2. Lola Health is a phlebotomy service (nurse home visit or clinic), not a self-collected
--    finger-prick kit. Only the TruAge / TruHealth / Biological DNA kits are posted home kits.
UPDATE public.provider_tests
SET sample_type = 'Venous',
    home_kit_available = false,
    clinic_visit_available = true,
    collection_method = 'Phlebotomy (nurse visit or clinic)'
WHERE provider_id = 'lola-health'
  AND COALESCE(sample_type, '') NOT IN ('Stool', 'Urine', 'Saliva')
  AND test_name !~* '(truage|truhealth|biological kit)';
