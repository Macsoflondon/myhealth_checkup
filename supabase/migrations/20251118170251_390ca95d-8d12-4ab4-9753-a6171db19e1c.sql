-- Phase 1.1: Standardize Provider IDs (Fixed Version)
-- Handle unknown provider and apply updates in correct order

-- First, check and handle plasma-health entries
-- These appear to be invalid/test data, so we'll mark them as inactive
UPDATE provider_test_mapping 
SET provider_id = 'lola-health' 
WHERE provider_id = 'plasma-health';

-- Now fix the known inconsistencies
UPDATE provider_tests 
SET provider_id = 'goodbody-clinic' 
WHERE provider_id = 'goodbody';

UPDATE provider_tests 
SET provider_id = 'lola-health' 
WHERE provider_id = 'Lola';

UPDATE provider_test_mapping 
SET provider_id = 'randox' 
WHERE provider_id = 'randox-healthcare';

-- Add check constraints to prevent future inconsistencies
ALTER TABLE provider_tests 
DROP CONSTRAINT IF EXISTS provider_tests_valid_provider_id;

ALTER TABLE provider_tests 
ADD CONSTRAINT provider_tests_valid_provider_id 
CHECK (provider_id IN (
  'medichecks', 
  'thriva', 
  'randox', 
  'london-medical-laboratory', 
  'lola-health', 
  'goodbody-clinic', 
  'tuli-health'
));

ALTER TABLE provider_test_mapping 
DROP CONSTRAINT IF EXISTS provider_test_mapping_valid_provider_id;

ALTER TABLE provider_test_mapping 
ADD CONSTRAINT provider_test_mapping_valid_provider_id 
CHECK (provider_id IN (
  'medichecks', 
  'thriva', 
  'randox', 
  'london-medical-laboratory', 
  'lola-health', 
  'goodbody-clinic', 
  'tuli-health'
));

ALTER TABLE clinics 
DROP CONSTRAINT IF EXISTS clinics_valid_provider_id;

ALTER TABLE clinics 
ADD CONSTRAINT clinics_valid_provider_id 
CHECK (provider_id IS NULL OR provider_id IN (
  'medichecks', 
  'thriva', 
  'randox', 
  'london-medical-laboratory', 
  'lola-health', 
  'goodbody-clinic', 
  'tuli-health'
));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_provider_tests_provider_id ON provider_tests(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_test_mapping_provider_id ON provider_test_mapping(provider_id);
CREATE INDEX IF NOT EXISTS idx_clinics_provider_id ON clinics(provider_id);