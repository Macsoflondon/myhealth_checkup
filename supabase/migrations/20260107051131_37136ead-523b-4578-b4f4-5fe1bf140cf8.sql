-- Clear corrupted biomarker data for GoodBody tests
-- Corrupted data contains clinic location names instead of actual biomarkers
UPDATE public.provider_tests
SET biomarkers_list = NULL
WHERE provider_id = 'goodbody-clinic'
  AND biomarkers_list IS NOT NULL
  AND (
    biomarkers_list::text ILIKE '%location%'
    OR biomarkers_list::text ILIKE '%clinic%'
    OR biomarkers_list::text ILIKE '%aesthetic%'
    OR biomarkers_list::text ILIKE '%pharmacy%'
    OR biomarkers_list::text ILIKE '%health centre%'
    OR biomarkers_list::text ILIKE '%surgery%'
  );