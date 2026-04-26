-- Drop the overly permissive policies and replace with more restrictive ones
-- The api_rate_limits table is only used by edge functions via service role
-- We can restrict RLS policies since edge functions using service role bypass RLS

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow rate limit reads for checking" ON public.api_rate_limits;
DROP POLICY IF EXISTS "Allow rate limit inserts" ON public.api_rate_limits;
DROP POLICY IF EXISTS "Allow rate limit updates" ON public.api_rate_limits;
DROP POLICY IF EXISTS "Allow rate limit deletes" ON public.api_rate_limits;

-- Create restrictive policies that deny all direct client access
-- Edge functions use service role key which bypasses RLS entirely
-- This provides defense-in-depth: even if anon key is used, no access is granted

-- Deny all SELECT from anon users (service role bypasses this)
CREATE POLICY "Rate limits managed by service role only - no select"
ON public.api_rate_limits
FOR SELECT
USING (false);

-- Deny all INSERT from anon users (service role bypasses this)
CREATE POLICY "Rate limits managed by service role only - no insert"
ON public.api_rate_limits
FOR INSERT
WITH CHECK (false);

-- Deny all UPDATE from anon users (service role bypasses this)
CREATE POLICY "Rate limits managed by service role only - no update"
ON public.api_rate_limits
FOR UPDATE
USING (false)
WITH CHECK (false);

-- Deny all DELETE from anon users (service role bypasses this)
CREATE POLICY "Rate limits managed by service role only - no delete"
ON public.api_rate_limits
FOR DELETE
USING (false);