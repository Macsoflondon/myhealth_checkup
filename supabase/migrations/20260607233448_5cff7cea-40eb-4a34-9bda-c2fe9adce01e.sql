UPDATE public.provider_tests
SET
  biomarker_count = 1,
  biomarkers_list = to_jsonb(ARRAY[test_name]),
  home_kit_available = true,
  clinic_visit_available = true,
  sample_type = 'Venous blood',
  updated_at = now()
WHERE provider_id = 'lola-health'
  AND is_addon = true;