-- Re-apply the same trigger logic retroactively. A no-op UPDATE on
-- biomarkers_list fires trg_strip_biomarker_junk on every existing row,
-- so the cleanup logic lives in exactly one place.

UPDATE public.provider_tests
SET biomarkers_list = biomarkers_list
WHERE biomarkers_list @> '["Most popular tests"]'::jsonb
   OR biomarkers_list @> '["Dr Natasha Fernando Medical Director"]'::jsonb;