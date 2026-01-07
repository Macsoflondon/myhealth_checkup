-- Add url_verified field to track validated URLs
ALTER TABLE provider_tests
ADD COLUMN IF NOT EXISTS url_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS url_verified_at timestamp with time zone;

-- Create index for quick lookup of unverified URLs
CREATE INDEX IF NOT EXISTS idx_provider_tests_url_verified 
ON provider_tests(url_verified) WHERE url_verified = false;