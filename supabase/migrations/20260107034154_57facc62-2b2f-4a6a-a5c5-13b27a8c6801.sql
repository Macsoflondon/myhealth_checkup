-- Fix Lola Health URLs that have incorrect slugs
-- The correct URL for ALP test is alkaline-phosphatase-alp, not alp-alkaline-phosphatase

UPDATE provider_tests 
SET 
  url = 'https://lolahealth.com/products/alkaline-phosphatase-alp',
  provider_test_id = 'alkaline-phosphatase-alp'
WHERE id = '47a28475-69a2-4c35-bf99-95f01d4dd41f';

-- Also update other tests with similar slug issues if they exist
UPDATE provider_tests 
SET 
  url = 'https://lolahealth.com/products/alanine-aminotransferase-alt',
  provider_test_id = 'alanine-aminotransferase-alt'
WHERE id = 'dee527a2-43b9-4d1d-825e-a8aeed99eb49';

UPDATE provider_tests 
SET 
  url = 'https://lolahealth.com/products/aspartate-transaminase-ast',
  provider_test_id = 'aspartate-transaminase-ast'
WHERE id = '7f4a5c39-c427-4bbf-8582-f13925fbed23';