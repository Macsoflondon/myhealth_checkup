-- 1) Fix mislabelled / noisy test names
UPDATE public.provider_tests SET test_name = 'Advanced Well Woman Blood Test'
  WHERE id = '43aaf7fe-8786-4ad5-89ac-a300c00e9de5';
UPDATE public.provider_tests SET test_name = 'Premium Complete Blood Test'
  WHERE id = '38d56339-a139-4a70-b222-b533cd6a59fc';
UPDATE public.provider_tests SET test_name = 'Advanced Well Woman Blood Test'
  WHERE id = '49963510-c6ee-4705-8f49-8bfb06384022';
UPDATE public.provider_tests SET test_name = 'Advanced Well Man Blood Test'
  WHERE id = '9c807d24-d7c9-401c-915b-128d2c93453c';
UPDATE public.provider_tests SET test_name = 'Female Hormone Blood Test'
  WHERE id = 'b025e29c-2f0c-48ba-8e3c-216f24dc2445';
UPDATE public.provider_tests SET test_name = 'Male Hormone Blood Test'
  WHERE id = '2b239d83-5097-46eb-a393-9e55ce9d59f3';
UPDATE public.provider_tests SET test_name = 'Sports Hormone Blood Test'
  WHERE id = 'a768800e-15db-4d51-8ad0-a75b7165a788';
UPDATE public.provider_tests SET test_name = 'TruCheck Early Cancer Screening'
  WHERE id = '48a3de7e-5718-4da8-9b0e-45c5e938b54f';
UPDATE public.provider_tests SET test_name = 'Bowel Cancer FIT Test'
  WHERE id = '544772f2-0bf1-41ec-b4dd-4c4c4f2c6db2';

-- Lola Health: strip noisy suffixes globally
UPDATE public.provider_tests
SET test_name = regexp_replace(
                  regexp_replace(test_name, '\s*\|\s*Lola Health\s*$', '', 'i'),
                  '\s*[—-]\s*\d+\s*Biomarkers\s*$', '', 'i')
WHERE provider_id = 'lola-health'
  AND (test_name ILIKE '%| Lola Health%' OR test_name ~* 'Biomarkers\s*$|Biomarkers\s*\|');

-- 2) Reset is_popular for the four partners shown on homepage
UPDATE public.provider_tests
SET is_popular = false, popularity_rank = NULL
WHERE provider_id IN ('goodbody-clinic','medichecks','lola-health','randox')
  AND is_popular = true;

-- 3) Re-curate from each partner's actual bestseller list
-- Goodbody (order from goodbodyclinic.com/collections/bestsellers)
UPDATE public.provider_tests SET is_popular=true, popularity_rank=1
  WHERE id='38d56339-a139-4a70-b222-b533cd6a59fc'; -- Premium Complete
UPDATE public.provider_tests SET is_popular=true, popularity_rank=2
  WHERE id='43aaf7fe-8786-4ad5-89ac-a300c00e9de5'; -- Advanced Well Woman
UPDATE public.provider_tests SET is_popular=true, popularity_rank=3
  WHERE id='bdf88d6f-5e7d-497d-9a94-54b253a96af4'; -- Advanced Well Man
UPDATE public.provider_tests SET is_popular=true, popularity_rank=4
  WHERE id='7079f27f-c86c-4794-9f49-9302193101dd'; -- Female Hormone & Fertility
UPDATE public.provider_tests SET is_popular=true, popularity_rank=5
  WHERE id='2360757d-1e73-44d5-848b-cb9f95d3f8bf'; -- Male Hormone & Fertility

-- Medichecks (order from medichecks.com/collections/bestsellers)
UPDATE public.provider_tests SET is_popular=true, popularity_rank=1
  WHERE id='4510bef6-c762-4ae7-a753-aef13adfac51'; -- Advanced Thyroid Function
UPDATE public.provider_tests SET is_popular=true, popularity_rank=2
  WHERE id='49963510-c6ee-4705-8f49-8bfb06384022'; -- Advanced Well Woman
UPDATE public.provider_tests SET is_popular=true, popularity_rank=3
  WHERE id='9c807d24-d7c9-401c-915b-128d2c93453c'; -- Advanced Well Man
UPDATE public.provider_tests SET is_popular=true, popularity_rank=4
  WHERE id='a768800e-15db-4d51-8ad0-a75b7165a788'; -- Sports Hormone
UPDATE public.provider_tests SET is_popular=true, popularity_rank=5
  WHERE id='5a03083f-02cc-4756-847b-50519fdf99e1'; -- Optimal Health

-- Lola Health (existing curated rank order, excluding £0 / placeholder rows)
UPDATE public.provider_tests SET is_popular=true, popularity_rank=1
  WHERE id='ed54e87f-706f-4e4e-be09-7015221e1049'; -- Peak Insights 70
UPDATE public.provider_tests SET is_popular=true, popularity_rank=2
  WHERE id='d219922e-a809-45cd-9b10-1c1efe49f7a8'; -- Vital Check 56
UPDATE public.provider_tests SET is_popular=true, popularity_rank=3
  WHERE id='abb9c729-33fb-426c-af97-ae0e285eab6a'; -- Thyroid & Hormonal Function
UPDATE public.provider_tests SET is_popular=true, popularity_rank=4
  WHERE id='8a7ff511-8c16-4530-8cb6-5622618d969c'; -- Male Active Boost 36
UPDATE public.provider_tests SET is_popular=true, popularity_rank=5
  WHERE id='631c5f5e-65b2-4480-9418-41c737265ac2'; -- Female Hormones Clarity 31

-- Randox (existing 5 popular rows reapplied — site has no public bestseller page)
UPDATE public.provider_tests SET is_popular=true, popularity_rank=1
  WHERE id='386ac434-193c-4501-8fb5-5a538f7a44a4'; -- General Health Test
UPDATE public.provider_tests SET is_popular=true, popularity_rank=2
  WHERE id='2781e800-9d40-4027-91a6-d15a775cb32c'; -- Thyroid Blood Test
UPDATE public.provider_tests SET is_popular=true, popularity_rank=3
  WHERE id='953117fe-fc55-498b-b205-773fc94369d0'; -- Vitamin D Test
UPDATE public.provider_tests SET is_popular=true, popularity_rank=4
  WHERE id='b3d6bfc4-8be9-40a6-9171-fbec2bcd7c70'; -- (existing 4th popular)