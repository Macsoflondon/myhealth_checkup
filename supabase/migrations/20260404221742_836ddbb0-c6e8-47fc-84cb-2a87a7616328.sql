-- Fix: Add explicit restrictive DELETE policy to health_insights
CREATE POLICY "Health insights cannot be deleted by users"
  ON public.health_insights FOR DELETE TO public
  USING (false);
