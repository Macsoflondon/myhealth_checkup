-- Mark specific popular tests from our providers
-- Reset existing popular flags first
UPDATE provider_tests SET is_popular = false, popularity_rank = NULL WHERE is_popular = true;

-- Medichecks tests
UPDATE provider_tests SET is_popular = true, popularity_rank = 1 
WHERE id = '5a03083f-02cc-4756-847b-50519fdf99e1';  -- Optimal Health Blood Test £249

UPDATE provider_tests SET is_popular = true, popularity_rank = 2 
WHERE id = '9e13e9a2-4bfb-46ae-8037-1d6ee17e835f';  -- Ultimate Performance Blood Test £199

UPDATE provider_tests SET is_popular = true, popularity_rank = 3 
WHERE id = '49963510-c6ee-4705-8f49-8bfb06384022';  -- Advanced Well Woman Blood Test £159

UPDATE provider_tests SET is_popular = true, popularity_rank = 4 
WHERE id = '9c807d24-d7c9-401c-915b-128d2c93453c';  -- Advanced Well Man Blood Test £159

-- Lola Health tests
UPDATE provider_tests SET is_popular = true, popularity_rank = 5 
WHERE id = '1d48f07f-6104-45fe-89e0-a80d7448669b';  -- Peak Insights 70 £185

UPDATE provider_tests SET is_popular = true, popularity_rank = 6 
WHERE id = 'b6c6177a-6db5-410b-877d-a896f53a8c75';  -- Vital Check 56 £150

UPDATE provider_tests SET is_popular = true, popularity_rank = 7 
WHERE id = 'ae18041e-9811-4bef-962a-46f6554d21ef';  -- Core Health 45 £120

UPDATE provider_tests SET is_popular = true, popularity_rank = 8 
WHERE id = '6a01a702-6463-4a99-8814-2ec52c6147d1';  -- Female Hormones Clarity 31 £115

-- Goodbody Clinic tests
UPDATE provider_tests SET is_popular = true, popularity_rank = 9 
WHERE id = '38d56339-a139-4a70-b222-b533cd6a59fc';  -- Premium Complete Blood Test £249

UPDATE provider_tests SET is_popular = true, popularity_rank = 10 
WHERE id = 'bdf88d6f-5e7d-497d-9a94-54b253a96af4';  -- Advanced Well Man Blood Test £175

UPDATE provider_tests SET is_popular = true, popularity_rank = 11 
WHERE id = '43aaf7fe-8786-4ad5-89ac-a300c00e9de5';  -- Advanced Well Woman Blood Test £175

UPDATE provider_tests SET is_popular = true, popularity_rank = 12 
WHERE id = '48a3de7e-5718-4da8-9b0e-45c5e938b54f';  -- TruCheck Early Cancer Screening £1199

UPDATE provider_tests SET is_popular = true, popularity_rank = 13 
WHERE id = '544772f2-0bf1-41ec-b4dd-4c4c4f2c6db2';  -- Bowel Cancer FIT Test £69