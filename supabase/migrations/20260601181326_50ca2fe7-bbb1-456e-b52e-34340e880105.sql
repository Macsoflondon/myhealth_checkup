
-- P0: Delete scraper error rows
DELETE FROM public.provider_tests WHERE test_name = 'Thank you for your patience.';

-- P0: Null out corrupted biomarker lists (Goodbody Clinic + Lola Health junk-scraped rows)
UPDATE public.provider_tests
SET biomarkers_list = NULL, biomarker_count = NULL
WHERE provider_id IN ('goodbody-clinic','lola-health')
  AND biomarkers_list IS NOT NULL
  AND biomarkers_list::text ~ '(ytidb|LAST_RESULT_ENTRY_KEY|\[View All\]|\[Skip to content\]|View cart|Our Blood Tests|&amp;|\]\(http)';

-- P0: Strip "| Buy Online ..." marketing suffix from Goodbody descriptions
UPDATE public.provider_tests
SET description = trim(regexp_replace(description, '\s*\|\s*Buy Online.*$', '', 'i'))
WHERE provider_id = 'goodbody-clinic'
  AND description ~* 'Buy Online';

-- P1: Clear Goodbody placeholder biomarker_count = 100
UPDATE public.provider_tests
SET biomarker_count = NULL
WHERE provider_id = 'goodbody-clinic' AND biomarker_count = 100;

-- P1: Clear Randox placeholder biomarker_count = 150 or 350
UPDATE public.provider_tests
SET biomarker_count = NULL
WHERE provider_id = 'randox' AND biomarker_count IN (150, 350);

-- P2: Delete Randox AMH row with soft-hyphen Unicode corruption in test name
DELETE FROM public.provider_tests
WHERE provider_id = 'randox'
  AND test_name ~ E'\u00ad';

-- P2: Re-derive biomarker_count from cleaned biomarkers_list where array is small/valid
UPDATE public.provider_tests
SET biomarker_count = jsonb_array_length(biomarkers_list)
WHERE biomarkers_list IS NOT NULL
  AND jsonb_typeof(biomarkers_list) = 'array'
  AND (biomarker_count IS NULL OR biomarker_count <> jsonb_array_length(biomarkers_list))
  AND jsonb_array_length(biomarkers_list) BETWEEN 1 AND 80;
