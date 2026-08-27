DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['clinical_patient_uploads','clinical_fhir_bundles','clinical_gp_notifications','user_profiles']
  LOOP
    IF EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime DROP TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;
CREATE POLICY "Users can delete their own profile"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);