-- Step 1: Deactivate ALL duplicate tests across ALL providers, keeping newest per provider/test_name
WITH ranked AS (
  SELECT id, provider_id, test_name, created_at,
    ROW_NUMBER() OVER (PARTITION BY provider_id, test_name ORDER BY created_at DESC) as rn
  FROM provider_tests
  WHERE is_active = true
)
UPDATE provider_tests
SET is_active = false, updated_at = now()
WHERE id IN (
  SELECT id FROM ranked WHERE rn > 1
);

-- Step 2: Fix biomarker counts for Lola Health single-biomarker tests
UPDATE provider_tests
SET biomarker_count = 1, updated_at = now()
WHERE provider_id = 'lola-health'
  AND is_active = true
  AND biomarker_count IS NULL
  AND test_name NOT ILIKE '%screen%'
  AND test_name NOT ILIKE '%panel%'
  AND test_name NOT ILIKE '%profile%'
  AND test_name NOT ILIKE '%core health%'
  AND test_name NOT ILIKE '%comprehensive%';

-- Step 3: Add unique index to prevent future duplicates
CREATE UNIQUE INDEX IF NOT EXISTS provider_tests_unique_active 
ON provider_tests (provider_id, test_name) 
WHERE is_active = true;