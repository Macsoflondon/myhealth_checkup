-- Deactivate all old GoodBody test records with incorrect URLs
-- Keep only the new ones with correct goodbodyclinic.com/products/ URLs

UPDATE provider_tests 
SET is_active = false 
WHERE provider_id = 'goodbody-clinic' 
AND (
  url LIKE '%goodbody.co.uk%' 
  OR url LIKE '%health.goodbodyclinic.com%'
  OR provider_test_id LIKE 'Goodbody%'
  OR provider_test_id LIKE 'gb-%'
);