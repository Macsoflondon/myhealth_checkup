CREATE POLICY "Users can update their own saved providers"
ON public.saved_providers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);