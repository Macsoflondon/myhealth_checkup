-- Seed popular tests with common blood test categories
-- Mark tests as popular based on common popular test types

-- Thyroid tests (very popular)
UPDATE provider_tests 
SET is_popular = true, popularity_rank = 2 
WHERE test_name ILIKE '%Thyroid%' AND is_active = true AND (is_popular IS NULL OR is_popular = false);

-- Vitamin D tests
UPDATE provider_tests 
SET is_popular = true, popularity_rank = 3 
WHERE test_name ILIKE '%Vitamin D%' AND is_active = true AND (is_popular IS NULL OR is_popular = false);

-- Well Woman tests
UPDATE provider_tests 
SET is_popular = true, popularity_rank = 4 
WHERE test_name ILIKE '%Well Woman%' AND is_active = true AND (is_popular IS NULL OR is_popular = false);

-- Well Man tests
UPDATE provider_tests 
SET is_popular = true, popularity_rank = 5 
WHERE test_name ILIKE '%Well Man%' AND is_active = true AND (is_popular IS NULL OR is_popular = false);

-- Cholesterol tests
UPDATE provider_tests 
SET is_popular = true, popularity_rank = 6 
WHERE test_name ILIKE '%Cholesterol%' AND is_active = true AND (is_popular IS NULL OR is_popular = false);

-- Diabetes/HbA1c tests
UPDATE provider_tests 
SET is_popular = true, popularity_rank = 7 
WHERE (test_name ILIKE '%HbA1c%' OR test_name ILIKE '%Diabetes%') AND is_active = true AND (is_popular IS NULL OR is_popular = false);

-- Liver function tests
UPDATE provider_tests 
SET is_popular = true, popularity_rank = 8 
WHERE test_name ILIKE '%Liver%' AND is_active = true AND (is_popular IS NULL OR is_popular = false);

-- Testosterone tests
UPDATE provider_tests 
SET is_popular = true, popularity_rank = 9 
WHERE test_name ILIKE '%Testosterone%' AND is_active = true AND (is_popular IS NULL OR is_popular = false);

-- Kidney tests
UPDATE provider_tests 
SET is_popular = true, popularity_rank = 10 
WHERE test_name ILIKE '%Kidney%' AND is_active = true AND (is_popular IS NULL OR is_popular = false);

-- Iron/Anaemia tests
UPDATE provider_tests 
SET is_popular = true, popularity_rank = 11 
WHERE (test_name ILIKE '%Iron%' OR test_name ILIKE '%Anaemia%' OR test_name ILIKE '%Anemia%') AND is_active = true AND (is_popular IS NULL OR is_popular = false);