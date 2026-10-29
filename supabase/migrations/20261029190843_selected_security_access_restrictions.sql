DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets
    WHERE id = 'provider-test-images' AND public = true
  ) THEN
    RAISE EXCEPTION 'Provider kit-image bucket must remain public before restricting listing';
  END IF;
END;
$$;

ALTER POLICY "Users can insert their own health scores"
  ON public.user_health_scores TO service_role;
ALTER POLICY "Users can update their own health scores"
  ON public.user_health_scores TO service_role;
ALTER POLICY "Users can delete their own health scores"
  ON public.user_health_scores TO service_role;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
  ON TABLE public.user_health_scores FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.user_health_scores TO authenticated;
GRANT ALL ON TABLE public.user_health_scores TO service_role;

DO $$
DECLARE
  unlock_key text;
BEGIN
  SELECT decrypted_secret INTO unlock_key
  FROM vault.decrypted_secrets WHERE name = 'biomarker_lock_key' LIMIT 1;
  IF unlock_key IS NULL OR unlock_key = '' THEN
    RAISE EXCEPTION 'Biomarker unlock key unavailable; aborting restrictions';
  END IF;
  PERFORM set_config('app.biomarker_unlock', unlock_key, true);
END;
$$;
ALTER POLICY known_scrape_junk_labels_public_read
  ON public.known_scrape_junk_labels TO service_role;
REVOKE ALL ON TABLE public.known_scrape_junk_labels FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.known_scrape_junk_labels TO service_role;

ALTER POLICY "Public read provider-test-images"
  ON storage.objects TO service_role;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE (schemaname = 'public' AND tablename = 'user_health_scores'
      AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
      AND roles && ARRAY['public', 'anon', 'authenticated']::name[])
    OR (schemaname = 'public' AND tablename = 'known_scrape_junk_labels'
      AND roles && ARRAY['public', 'anon', 'authenticated']::name[])
    OR (schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'Public read provider-test-images'
      AND roles && ARRAY['public', 'anon', 'authenticated']::name[])
  ) THEN
    RAISE EXCEPTION 'Selected access restrictions did not take effect';
  END IF;
END;
$$;

SELECT set_config('app.biomarker_unlock', '', true);