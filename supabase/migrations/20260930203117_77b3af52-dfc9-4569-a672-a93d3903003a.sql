DROP POLICY IF EXISTS "Public read image_audit_results" ON public.image_audit_results;
CREATE POLICY "Admins read image_audit_results" ON public.image_audit_results
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));