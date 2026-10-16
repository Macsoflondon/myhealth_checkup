-- Restored from supabase_migrations.schema_migrations (version 20261014100000, name health_intelligence_tighten_table_grants).
-- md5 of the recorded statements: 820da85b43f56f78e36652b3bcd71d4a
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Health Intelligence: align live table privileges with the 14 September 2026 design.
--
-- WHY
--   Supabase default privileges in schema public give anon, authenticated and
--   service_role every privilege on each new table. The 14 September migration
--   added narrow GRANT statements but never revoked those defaults. A live check
--   on 13 October 2026 found anon and authenticated holding SELECT, INSERT,
--   UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER and MAINTAIN on all 18 tables.
--   Row level security still blocks row access, but it is then the only control.
--   The Supabase linter does not flag this, so the tracker claim of least
--   privilege grants was not true in production.
--
-- WHAT
--   For each of the 18 tables: revoke everything from PUBLIC, anon and
--   authenticated, then grant back the exact set the 14 September migration
--   specified. service_role keeps ALL. No policy, trigger, function or data
--   change. All 18 tables are empty at the time of writing.
--   A check at the end raises an exception, and so rolls the migration back,
--   if any table does not end in the intended state.
--
-- ROLLBACK (restores the previous broad state, not recommended)
--   GRANT ALL ON TABLE public.benchmark_cohort_policies TO anon, authenticated;
--   GRANT ALL ON TABLE public.clinical_review_comments TO anon, authenticated;
--   GRANT ALL ON TABLE public.curated_test_profile_biomarkers TO anon, authenticated;
--   GRANT ALL ON TABLE public.curated_test_profiles TO anon, authenticated;
--   GRANT ALL ON TABLE public.diagnostic_reports TO anon, authenticated;
--   GRANT ALL ON TABLE public.health_profiles TO anon, authenticated;
--   GRANT ALL ON TABLE public.ingestion_adapters TO anon, authenticated;
--   GRANT ALL ON TABLE public.ingestion_events TO anon, authenticated;
--   GRANT ALL ON TABLE public.notification_channel_preferences TO anon, authenticated;
--   GRANT ALL ON TABLE public.notification_events TO anon, authenticated;
--   GRANT ALL ON TABLE public.observation_reference_ranges TO anon, authenticated;
--   GRANT ALL ON TABLE public.observations TO anon, authenticated;
--   GRANT ALL ON TABLE public.organisation_members TO anon, authenticated;
--   GRANT ALL ON TABLE public.organisations TO anon, authenticated;
--   GRANT ALL ON TABLE public.reference_range_contexts TO anon, authenticated;
--   GRANT ALL ON TABLE public.result_release_events TO anon, authenticated;
--   GRANT ALL ON TABLE public.source_documents TO anon, authenticated;
--   GRANT ALL ON TABLE public.specimens TO anon, authenticated;

-- Staff and read-only reference tables: signed-in users read, nobody writes through the API.

REVOKE ALL ON TABLE public.benchmark_cohort_policies FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.benchmark_cohort_policies TO authenticated;

REVOKE ALL ON TABLE public.ingestion_adapters FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.ingestion_adapters TO authenticated;

REVOKE ALL ON TABLE public.organisations FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.organisations TO authenticated;

REVOKE ALL ON TABLE public.organisation_members FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.organisation_members TO authenticated;

-- Server-side only: no API access for anon or authenticated.

REVOKE ALL ON TABLE public.ingestion_events FROM PUBLIC, anon, authenticated;

-- Health record tables: owner reads released data, writes go through the server.

REVOKE ALL ON TABLE public.diagnostic_reports FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.diagnostic_reports TO authenticated;

REVOKE ALL ON TABLE public.observations FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.observations TO authenticated;

REVOKE ALL ON TABLE public.observation_reference_ranges FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.observation_reference_ranges TO authenticated;

REVOKE ALL ON TABLE public.specimens FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.specimens TO authenticated;

REVOKE ALL ON TABLE public.result_release_events FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.result_release_events TO authenticated;

REVOKE ALL ON TABLE public.notification_events FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.notification_events TO authenticated;

-- Owner-writable tables.

REVOKE ALL ON TABLE public.health_profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.health_profiles TO authenticated;

REVOKE ALL ON TABLE public.source_documents FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.source_documents TO authenticated;

REVOKE ALL ON TABLE public.clinical_review_comments FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.clinical_review_comments TO authenticated;

REVOKE ALL ON TABLE public.notification_channel_preferences FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.notification_channel_preferences TO authenticated;

-- Public reference data: the only tables anon may read.

REVOKE ALL ON TABLE public.curated_test_profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.curated_test_profiles TO anon, authenticated;

REVOKE ALL ON TABLE public.curated_test_profile_biomarkers FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.curated_test_profile_biomarkers TO anon, authenticated;

REVOKE ALL ON TABLE public.reference_range_contexts FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.reference_range_contexts TO anon, authenticated;

-- Verify the end state. Any difference raises an exception and rolls everything back.

DO $verify$
DECLARE
  expected CONSTANT jsonb := '{
    "benchmark_cohort_policies":        {"anon": [], "authenticated": ["SELECT"]},
    "clinical_review_comments":         {"anon": [], "authenticated": ["INSERT", "SELECT"]},
    "curated_test_profile_biomarkers":  {"anon": ["SELECT"], "authenticated": ["SELECT"]},
    "curated_test_profiles":            {"anon": ["SELECT"], "authenticated": ["SELECT"]},
    "diagnostic_reports":               {"anon": [], "authenticated": ["SELECT"]},
    "health_profiles":                  {"anon": [], "authenticated": ["DELETE", "INSERT", "SELECT", "UPDATE"]},
    "ingestion_adapters":               {"anon": [], "authenticated": ["SELECT"]},
    "ingestion_events":                 {"anon": [], "authenticated": []},
    "notification_channel_preferences": {"anon": [], "authenticated": ["INSERT", "SELECT", "UPDATE"]},
    "notification_events":              {"anon": [], "authenticated": ["SELECT"]},
    "observation_reference_ranges":     {"anon": [], "authenticated": ["SELECT"]},
    "observations":                     {"anon": [], "authenticated": ["SELECT"]},
    "organisation_members":             {"anon": [], "authenticated": ["SELECT"]},
    "organisations":                    {"anon": [], "authenticated": ["SELECT"]},
    "reference_range_contexts":         {"anon": ["SELECT"], "authenticated": ["SELECT"]},
    "result_release_events":            {"anon": [], "authenticated": ["SELECT"]},
    "source_documents":                 {"anon": [], "authenticated": ["INSERT", "SELECT"]},
    "specimens":                        {"anon": [], "authenticated": ["SELECT"]}
  }'::jsonb;
  all_privs CONSTANT text[] := ARRAY['DELETE', 'INSERT', 'REFERENCES', 'SELECT', 'TRIGGER', 'TRUNCATE', 'UPDATE'];
  tbl  text;
  rl   text;
  priv text;
  want text[];
  have text[];
BEGIN
  FOR tbl IN SELECT jsonb_object_keys(expected) LOOP
    FOREACH rl IN ARRAY ARRAY['anon', 'authenticated'] LOOP
      want := ARRAY(SELECT jsonb_array_elements_text(expected -> tbl -> rl) ORDER BY 1);
      have := ARRAY(
        SELECT p FROM unnest(all_privs) AS p
        WHERE has_table_privilege(rl, format('public.%I', tbl), p)
        ORDER BY p
      );
      IF want IS DISTINCT FROM have THEN
        RAISE EXCEPTION 'Grant mismatch on public.% for role %: expected %, found %', tbl, rl, want, have;
      END IF;
    END LOOP;

    FOREACH priv IN ARRAY all_privs LOOP
      IF NOT has_table_privilege('service_role', format('public.%I', tbl), priv) THEN
        RAISE EXCEPTION 'service_role lost % on public.%', priv, tbl;
      END IF;
    END LOOP;
  END LOOP;
END
$verify$;
