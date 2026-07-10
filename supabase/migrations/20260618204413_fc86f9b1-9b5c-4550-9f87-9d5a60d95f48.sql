UPDATE public.provider_tests
SET biomarker_count = 295,
    collection_options = '[
      {"method":"Royal Mail finger-prick kit","note":"+£3.99","price_modifier":3.99},
      {"method":"On-site phlebotomy (clinic)","note":"+£35","price_modifier":35},
      {"method":"At-home phlebotomy (self-arranged)","note":"+£80","price_modifier":80}
    ]'::jsonb
WHERE provider_id = 'london-medical-laboratory'
  AND test_name ILIKE 'allergy complete%';