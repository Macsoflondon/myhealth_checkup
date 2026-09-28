-- Restored verbatim from supabase_migrations.schema_migrations (version 20260706112558, name cleanup_medical_diagnosis_junk_and_categories).
-- md5 of the recorded statements: cc92969b2ed61c6bafe7214e390d87a7
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


delete from public.provider_tests
where provider_id = 'medical-diagnosis'
  and (test_name ilike '[PARAM]%' or test_name ilike '%!~!%');

delete from public.provider_tests
where provider_id = 'medical-diagnosis'
  and (url ilike '%/payments/%' or url ilike '%/deposit%' or test_name ilike '%deposit%');

update public.provider_tests set category = 'General Health'
where provider_id = 'medical-diagnosis' and is_active = true
  and test_name in ('Abdominal Health', 'Demodex spp. microscopy');

update public.provider_tests set category = 'Allergy'
where provider_id = 'medical-diagnosis' and is_active = true
  and test_name = 'Allergy';

update public.provider_tests set category = 'Gut Health'
where provider_id = 'medical-diagnosis' and is_active = true
  and test_name in ('Gastrointestinal Screen – Bacteria and Parasites', 'Gastrointestinal Screen – Stool Culture (PCR)', 'Zonulin');

update public.provider_tests set category = 'Hormones'
where provider_id = 'medical-diagnosis' and is_active = true
  and test_name in ('Hair loss profile', 'Serotonin');

update public.provider_tests set category = 'Kidney Function'
where provider_id = 'medical-diagnosis' and is_active = true
  and test_name = 'Kidney profile';

update public.provider_tests set category = 'Sports & Fitness'
where provider_id = 'medical-diagnosis' and is_active = true
  and test_name = 'Nutritional Status';

update public.provider_tests set category = 'Vitamins & Minerals'
where provider_id = 'medical-diagnosis' and is_active = true
  and test_name = 'Vitamin B12 shots';
