DO $$
DECLARE
  target_ids uuid[] := ARRAY[
    'bca70a67-d7ff-4637-a665-34e644d592f0'::uuid,
    'e9358354-377f-43f7-a9ad-4c05174a53a3'::uuid,
    '797949c5-315b-4e3b-b93b-10b53e600830'::uuid,
    'd38b340c-47e9-400e-a589-1f60c7f38700'::uuid,
    'ff179997-e417-44ed-b0ae-cc4cfa782a6f'::uuid,
    '05575867-a7bd-4cbc-9d1e-415f77076a5d'::uuid,
    'd9808a8f-8e9d-41c0-baae-5fde59a94d4c'::uuid
  ];
BEGIN
  DELETE FROM public.category_test_mapping WHERE provider_test_id = ANY(target_ids);
  DELETE FROM public.image_audit_results WHERE provider_test_id = ANY(target_ids);
  DELETE FROM public.provider_test_biomarkers WHERE provider_test_id = ANY(target_ids);
  DELETE FROM public.provider_test_history WHERE provider_test_id = ANY(target_ids);
  DELETE FROM public.provider_test_mapping
  WHERE provider_test_uuid = ANY(target_ids)
     OR provider_test_id = ANY(SELECT unnest(target_ids)::text);
  DELETE FROM public.provider_tests WHERE id = ANY(target_ids);
END $$;