
UPDATE provider_tests
SET is_active = false, updated_at = now()
WHERE id IN (
  '40e0a494-2799-4a53-86de-b88de6d3dffc', -- Medichecks E-Gift Card
  'ff179997-e417-44ed-b0ae-cc4cfa782a6f', -- Visit a Medichecks partner clinic [collection method]
  'd3030f9d-c319-4791-a05f-c57030845253', -- Arrange for a Medichecks nurse to visit [collection method]
  '797949c5-315b-4e3b-b93b-10b53e600830', -- collection method - urine in-store
  'd38b340c-47e9-400e-a589-1f60c7f38700', -- collection method - urine nurse-visit
  'bca70a67-d7ff-4637-a665-34e644d592f0'  -- Phlebotomy (Venous draw) at clinic (Clinilabs)
);
