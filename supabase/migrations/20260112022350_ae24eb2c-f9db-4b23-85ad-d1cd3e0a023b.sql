-- Fix biomarker counts for single-biomarker tests across all providers
-- Set biomarker_count = 1 for tests that appear to test a single biomarker

UPDATE provider_tests
SET biomarker_count = 1, updated_at = now()
WHERE is_active = true
  AND biomarker_count IS NULL
  AND test_name NOT ILIKE '%screen%'
  AND test_name NOT ILIKE '%panel%'
  AND test_name NOT ILIKE '%profile%'
  AND test_name NOT ILIKE '%comprehensive%'
  AND test_name NOT ILIKE '%package%'
  AND test_name NOT ILIKE '%essential%'
  AND test_name NOT ILIKE '%advanced%'
  AND test_name NOT ILIKE '%complete%'
  AND test_name NOT ILIKE '%full%'
  AND test_name NOT ILIKE '%core health%'
  AND test_name NOT ILIKE '%well man%'
  AND test_name NOT ILIKE '%well woman%'
  AND test_name NOT ILIKE '%baseline%'
  AND test_name NOT ILIKE '%ultimate%';