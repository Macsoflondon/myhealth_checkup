
-- 1) Fix biomarker_knowledge_hub write policy: restrict to service_role grantee
-- Table is created out-of-band on production; guard for preview environments.
DO $$ BEGIN
  DROP POLICY IF EXISTS biomarker_write_service ON public.biomarker_knowledge_hub;
  CREATE POLICY biomarker_write_service ON public.biomarker_knowledge_hub
    AS PERMISSIVE FOR ALL TO service_role
    USING (true) WITH CHECK (true);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- 2) Fix recommendation_history guest spoofing: require authenticated user
-- Table is created out-of-band on production; guard for preview environments.
DO $$ BEGIN
  DROP POLICY IF EXISTS rec_history_user_read ON public.recommendation_history;
  CREATE POLICY rec_history_user_read ON public.recommendation_history
    AS PERMISSIVE FOR SELECT TO authenticated
    USING (user_id = auth.uid()::text);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- 3) Revoke public/anon/authenticated EXECUTE on SECURITY DEFINER functions
-- match_biomarkers is created out-of-band; guard for preview environments.
DO $$ BEGIN
  REVOKE EXECUTE ON FUNCTION public.match_biomarkers(extensions.vector, double precision, integer) FROM PUBLIC, anon, authenticated;
EXCEPTION WHEN undefined_function OR undefined_object THEN NULL;
END $$;

REVOKE EXECUTE ON FUNCTION public.resolve_canonical_category(text, text) FROM PUBLIC, anon, authenticated;

-- 4) Encrypt date_of_birth at rest: change column type to text so encrypted
-- payloads (enc:<base64>) fit. The validate_encrypted_fields trigger already
-- enforces that any non-null value must be encrypted.
ALTER TABLE public.user_profiles
  ALTER COLUMN date_of_birth TYPE text USING date_of_birth::text;
