-- Deactivate Medichecks tests with legacy URL patterns (not /products/ or /tests/)
UPDATE provider_tests 
SET is_active = false, updated_at = now()
WHERE provider_id = 'medichecks' 
AND is_active = true 
AND url NOT LIKE '%/products/%' 
AND url NOT LIKE '%/tests/%';

-- Deactivate London Medical Laboratory tests with legacy URL patterns (trailing slashes)
UPDATE provider_tests 
SET is_active = false, updated_at = now()
WHERE provider_id = 'london-medical-laboratory' 
AND is_active = true 
AND url LIKE '%test/';

-- Deactivate any tests with old category-based URLs that are now 404s
UPDATE provider_tests 
SET is_active = false, updated_at = now()
WHERE is_active = true 
AND (
  url LIKE '%/vitamin-tests/%'
  OR url LIKE '%/hormone-tests/%'
  OR url LIKE '%/thyroid-tests/%'
  OR url LIKE '%/blood-tests/%'
  OR url LIKE '%/health-tests/%'
  OR url LIKE '%/iron-tests/%'
  OR url LIKE '%/cholesterol-tests/%'
  OR url LIKE '%/diabetes-tests/%'
  OR url LIKE '%/kidney-tests%'
  OR url LIKE '%/liver-tests%'
  OR url LIKE '%/fertility-tests/%'
  OR url LIKE '%/mens-health-tests/%'
  OR url LIKE '%/womens-health-tests/%'
  OR url LIKE '%/fatigue-tests/%'
  OR url LIKE '%/hair-loss-tests/%'
  OR url LIKE '%/mineral-tests/%'
  OR url LIKE '%/immunology-tests/%'
  OR url LIKE '%/biochemistry-tests/%'
  OR url LIKE '%/allergy-tests%'
);