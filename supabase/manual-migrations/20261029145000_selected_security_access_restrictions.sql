-- DRAFT ONLY: Claude must review and apply this through the migration workflow.
-- No live database changes have been made by Lovable.
-- Scope: the three access decisions approved on 29/10/2026 only.
-- No public catalogue read policies or stored clinical/catalogue data change.

BEGIN;

-- Preserve public kit-image delivery. Public buckets serve object URLs without
-- a storage.objects SELECT policy; that policy also enables file listing.
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

-- 1. Health scores are trusted calculated outputs, not user-editable inputs.
-- Retain the existing owner-scoped read rule; deny direct client mutations.
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

-- 2. Rejected scrape labels and reasons are internal reference data.
-- Honour the existing biomarker structural lock; never disable its guard.
-- Read the key inside a DO block so it is not returned in query output.
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

-- 3. Only trusted internal services may list provider kit-image objects.
-- Do not revoke global storage grants: other buckets are out of scope.
ALTER POLICY "Public read provider-test-images"
  ON storage.objects TO service_role;

-- Post-change checks: fail the transaction if any selected rule stays broad.
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

COMMIT;

-- Claude verification after applying:
-- * A signed-in owner can read their scores, not other users' scores.
-- * Direct owner inserts/updates/deletes of scores fail; service writes work.
-- * anon/authenticated cannot read known_scrape_junk_labels; service reads work.
-- * anon/authenticated kit-image listing returns no objects or is denied.
-- * Existing public provider kit-image URLs still answer 200.
-- * node scripts/check-rls-grants.mjs, security/performance advisors and
--   migration-parity pass; then mark only these three scan findings fixed.

-- ROLLBACK (review before execution; restores the previous access model):
-- BEGIN;
-- DO $$ DECLARE unlock_key text; BEGIN
--   SELECT decrypted_secret INTO unlock_key FROM vault.decrypted_secrets
--     WHERE name = 'biomarker_lock_key' LIMIT 1;
--   IF unlock_key IS NULL THEN RAISE EXCEPTION 'Unlock key unavailable'; END IF;
--   PERFORM set_config('app.biomarker_unlock', unlock_key, true);
-- END; $$;
-- ALTER POLICY "Users can insert their own health scores" ON public.user_health_scores TO PUBLIC;
-- ALTER POLICY "Users can update their own health scores" ON public.user_health_scores TO PUBLIC;
-- ALTER POLICY "Users can delete their own health scores" ON public.user_health_scores TO PUBLIC;
-- GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
--   ON TABLE public.user_health_scores TO anon, authenticated;
-- ALTER POLICY known_scrape_junk_labels_public_read ON public.known_scrape_junk_labels TO PUBLIC;
-- GRANT SELECT, MAINTAIN ON TABLE public.known_scrape_junk_labels TO anon, authenticated;
-- ALTER POLICY "Public read provider-test-images" ON storage.objects TO PUBLIC;
-- COMMIT;