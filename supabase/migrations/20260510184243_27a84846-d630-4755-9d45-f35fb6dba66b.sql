ALTER TABLE public.provider_tests
  ADD COLUMN IF NOT EXISTS turnaround_days_text TEXT,
  ADD COLUMN IF NOT EXISTS base_price NUMERIC,
  ADD COLUMN IF NOT EXISTS collection_options JSONB;