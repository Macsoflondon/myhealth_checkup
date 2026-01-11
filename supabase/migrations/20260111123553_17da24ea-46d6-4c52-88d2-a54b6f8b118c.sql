-- Add RLS policies for api_rate_limits table
-- This table is used for rate limiting in edge functions
-- It should be accessible by the edge functions (using service role)
-- but not directly by users

-- Policy: Allow service role and edge functions to manage rate limits
-- Since edge functions use service role key, they bypass RLS
-- For anon users (rate limit checks), we need to allow read access
-- to check current rate limits

-- Allow anyone to read rate limits (needed for rate limit checks before auth)
CREATE POLICY "Allow rate limit reads for checking"
ON public.api_rate_limits
FOR SELECT
USING (true);

-- Allow anyone to insert rate limits (for initial request tracking)
CREATE POLICY "Allow rate limit inserts"
ON public.api_rate_limits
FOR INSERT
WITH CHECK (true);

-- Allow updates for incrementing counters
CREATE POLICY "Allow rate limit updates"
ON public.api_rate_limits
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow deletes for cleanup operations
CREATE POLICY "Allow rate limit deletes"
ON public.api_rate_limits
FOR DELETE
USING (true);