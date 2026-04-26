-- Add RLS policies for test_results table
-- Users can insert their own test results (for uploading personal results)
CREATE POLICY "Users can insert their own test results"
ON public.test_results
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins/Moderators can insert test results on behalf of users (e.g., from provider integrations)
CREATE POLICY "Admins can insert test results"
ON public.test_results
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'moderator')
);

-- Only admins/moderators can update test results (e.g., adding professional notes, interpretations)
CREATE POLICY "Professionals can update test results"
ON public.test_results
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'moderator')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'moderator')
);