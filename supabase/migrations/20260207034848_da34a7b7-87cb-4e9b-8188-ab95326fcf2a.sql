-- Step 1: Delete the duplicate inactive "Advanced Thyroid Function Blood Test" record
-- (keeping the active one at id 4510bef6-c762-4ae7-a753-aef13adfac51)
DELETE FROM provider_tests 
WHERE id = '16719461-83e4-4a94-8777-48e26a418208';

-- Step 2: Reactivate all remaining inactive Medichecks tests
-- These were incorrectly deactivated due to the URL structure migration
UPDATE provider_tests 
SET is_active = true, 
    updated_at = now()
WHERE provider_id = 'medichecks' 
  AND is_active = false;