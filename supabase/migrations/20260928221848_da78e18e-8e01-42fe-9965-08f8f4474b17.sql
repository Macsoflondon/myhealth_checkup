ALTER TABLE public.provider_tests ALTER COLUMN url_verified DROP DEFAULT;
COMMENT ON COLUMN public.provider_tests.url_verified IS 'NULL = never checked (unknown); true = last check passed; false = last check failed (url_verified_at set).';
UPDATE public.provider_tests SET url_verified = NULL WHERE url_verified = false AND url_verified_at IS NULL;