-- Add new columns for enhanced Lola Health data
ALTER TABLE provider_tests
ADD COLUMN IF NOT EXISTS is_addon boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS original_price numeric,
ADD COLUMN IF NOT EXISTS discount_percentage integer,
ADD COLUMN IF NOT EXISTS symptoms jsonb,
ADD COLUMN IF NOT EXISTS who_should_test text,
ADD COLUMN IF NOT EXISTS conditions jsonb;

-- Add index for addon filter queries
CREATE INDEX IF NOT EXISTS idx_provider_tests_is_addon ON provider_tests(is_addon) WHERE is_addon = true;