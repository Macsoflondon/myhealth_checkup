-- Add popularity columns to provider_tests table for tracking popular/bestseller tests
ALTER TABLE public.provider_tests 
ADD COLUMN IF NOT EXISTS is_popular BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS popularity_rank INTEGER;

-- Create index for efficient querying of popular tests
CREATE INDEX IF NOT EXISTS idx_provider_tests_is_popular ON public.provider_tests(is_popular) WHERE is_popular = true;
CREATE INDEX IF NOT EXISTS idx_provider_tests_popularity_rank ON public.provider_tests(popularity_rank) WHERE popularity_rank IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.provider_tests.is_popular IS 'Whether this test is marked as a popular/bestseller test by the provider';
COMMENT ON COLUMN public.provider_tests.popularity_rank IS 'Ranking of popularity across all providers (lower = more popular)';