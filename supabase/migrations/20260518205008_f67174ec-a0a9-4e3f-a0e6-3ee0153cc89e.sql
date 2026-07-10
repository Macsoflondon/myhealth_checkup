-- Deactivate scraper junk rows so they stop appearing in catalogues
UPDATE public.provider_tests
SET is_active = false, updated_at = now()
WHERE test_name LIKE '[PARAM]%' OR test_name LIKE '%!~!%';

-- Deactivate zero/null-priced rows (cannot be sold)
UPDATE public.provider_tests
SET is_active = false, updated_at = now()
WHERE is_active = true AND (price IS NULL OR price <= 0);