-- Deactivate legacy Randox records with old /tests/ URL pattern
UPDATE provider_tests 
SET is_active = false, updated_at = now()
WHERE provider_id = 'randox' 
  AND url LIKE '%/tests/%'
  AND url NOT LIKE '%/en-GB/product/%';

-- Deactivate legacy Goodbody 404 URLs
UPDATE provider_tests 
SET is_active = false, updated_at = now()
WHERE provider_id = 'goodbody-clinic' 
  AND provider_test_id IN (
    'well-woman-blood-test', 'well-man-blood-test', 
    'vitamin-d-blood-test', 'thyroid-blood-test',
    'pcos-blood-test', 'liver-function-blood-test',
    'lipid-profile-blood-test', 'kidney-function-blood-test',
    'hormone-blood-test-male', 'hormone-blood-test-female',
    'full-blood-count-test', 'female-fertility-blood-test',
    'essential-vitamins-blood-test', 'essential-blood-test',
    'diabetes-blood-test', 'cardiac-health-blood-test',
    'basic-vitamins-blood-test'
  );