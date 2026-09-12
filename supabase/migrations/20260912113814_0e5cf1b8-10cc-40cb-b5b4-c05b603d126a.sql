ALTER TABLE public.provider_tests
  ADD COLUMN IF NOT EXISTS what_is_tested text,
  ADD COLUMN IF NOT EXISTS preparation_notes text,
  ADD COLUMN IF NOT EXISTS test_limitations text;

COMMENT ON COLUMN public.provider_tests.what_is_tested IS 'Verbatim provider text describing what the test measures. Never AI-generated.';
COMMENT ON COLUMN public.provider_tests.preparation_notes IS 'Verbatim provider preparation instructions. Never AI-generated.';
COMMENT ON COLUMN public.provider_tests.test_limitations IS 'Verbatim provider-stated limitations of the test. Never AI-generated.';