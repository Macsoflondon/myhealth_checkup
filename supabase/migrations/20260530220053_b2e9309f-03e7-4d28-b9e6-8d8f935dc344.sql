UPDATE public.provider_tests
SET is_popular = false, popularity_rank = NULL, updated_at = now()
WHERE provider_id = 'randox' AND test_name ILIKE 'Male Hormone Quickdraw%';

UPDATE public.provider_tests
SET test_name = 'Menopause Clarity 31', updated_at = now()
WHERE provider_id = 'lola-health' AND test_name = 'Female Hormones Clarity 31';