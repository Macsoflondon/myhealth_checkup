-- Allow authenticated users to read their own newsletter subscription record by email match
CREATE POLICY "Subscribers can view own record"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (lower(email) = lower(coalesce((auth.jwt() ->> 'email')::text, '')));