-- Reconcile out-of-band production changes into the migration history.
--
-- Between July and September 2026 a number of changes were made to the production
-- database directly (dashboard, SQL editor, advisor fixes) rather than through a
-- migration. The repository's migrations therefore rebuilt a database that differed
-- from production: missing tables, columns, indexes and scheduled jobs, weaker
-- privileges and different row level security policies.
--
-- This migration brings a database built from the repository to production's state
-- as of 2026-09-28. It was generated from a structured comparison of production's
-- catalogue with a fresh replay of every earlier migration, and verified by
-- replaying the full history and comparing again. Every statement is idempotent.
--
-- Production already has this state. Its version is recorded in production's
-- migration history as applied, so it never runs there.
--
-- Deliberately not reproduced:
--   * the role db_admin_role, which exists only in production. Grants to it are
--     applied only where the role exists.
--   * extension versions, which follow the Postgres image.
--   * realtime.messages daily partitions, which Supabase Realtime manages itself.
--
-- See docs/MIGRATION_RECONCILIATION.md.

-- 1. Extensions present in production but never created by a migration.
CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgmq";
CREATE EXTENSION IF NOT EXISTS "pgroonga" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgsodium";
ALTER EXTENSION "ltree" SET SCHEMA "extensions";
ALTER EXTENSION "pg_trgm" SET SCHEMA "extensions";

-- 2. Tables created in production outside any migration.
CREATE SEQUENCE IF NOT EXISTS "private"."admin_recovery_audit_log_id_seq";
CREATE TABLE IF NOT EXISTS "private"."admin_recovery_audit_log" (
  "id" bigint DEFAULT nextval('private.admin_recovery_audit_log_id_seq'::regclass) NOT NULL,
  "success" boolean NOT NULL,
  "email_hash" text,
  "ip" text NOT NULL,
  "attempted_at" timestamp with time zone DEFAULT now() NOT NULL,
  "failure_reason" text,
  CONSTRAINT "admin_recovery_audit_log_pkey" PRIMARY KEY (id)
);
ALTER TABLE "private"."admin_recovery_audit_log" ENABLE ROW LEVEL SECURITY;
CREATE TABLE IF NOT EXISTS "private"."admin_recovery_rate_limits" (
  "key" text NOT NULL,
  "attempt_count" integer DEFAULT 1 NOT NULL,
  "first_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "admin_recovery_rate_limits_pkey" PRIMARY KEY (key)
);
ALTER TABLE "private"."admin_recovery_rate_limits" ENABLE ROW LEVEL SECURITY;
ALTER SEQUENCE "private"."admin_recovery_audit_log_id_seq" OWNED BY "private"."admin_recovery_audit_log"."id";

-- 3. Columns added, changed or dropped in production outside any migration.
ALTER TABLE "public"."saved_providers" ADD COLUMN IF NOT EXISTS "provider_website" text;
ALTER TABLE "public"."saved_providers" DROP COLUMN IF EXISTS "created_at";

-- 4. Constraints.

-- 5. Indexes: production dropped some and added others outside any migration.
DROP INDEX IF EXISTS "public"."idx_ai_logs_created";
DROP INDEX IF EXISTS "public"."idx_ai_logs_type";
DROP INDEX IF EXISTS "public"."idx_funnel_created";
DROP INDEX IF EXISTS "public"."idx_funnel_session";
DROP INDEX IF EXISTS "public"."idx_funnel_stage";
DROP INDEX IF EXISTS "public"."idx_platform_met_name";
DROP INDEX IF EXISTS "public"."idx_user_events_session";
DROP INDEX IF EXISTS "public"."idx_user_events_type";
DROP INDEX IF EXISTS "public"."ai_operation_logs_2025_created_at_idx";
DROP INDEX IF EXISTS "public"."ai_operation_logs_2025_job_type_created_at_idx";
DROP INDEX IF EXISTS "public"."ai_operation_logs_2026_created_at_idx";
DROP INDEX IF EXISTS "public"."ai_operation_logs_2026_job_type_created_at_idx";
DROP INDEX IF EXISTS "public"."ai_operation_logs_2027_created_at_idx";
DROP INDEX IF EXISTS "public"."ai_operation_logs_2027_job_type_created_at_idx";
DROP INDEX IF EXISTS "public"."ai_operation_logs_2028_created_at_idx";
DROP INDEX IF EXISTS "public"."ai_operation_logs_2028_job_type_created_at_idx";
DROP INDEX IF EXISTS "public"."biomarker_audit_runs_delta_idx";
DROP INDEX IF EXISTS "public"."biomarker_audit_runs_run_id_idx";
DROP INDEX IF EXISTS "public"."categories_active_idx";
DROP INDEX IF EXISTS "public"."categories_path_gist_idx";
DROP INDEX IF EXISTS "public"."category_aliases_alias_idx";
DROP INDEX IF EXISTS "public"."csp_reports_directive_idx";
DROP INDEX IF EXISTS "public"."funnel_events_2025_created_at_idx";
DROP INDEX IF EXISTS "public"."funnel_events_2025_funnel_stage_created_at_idx";
DROP INDEX IF EXISTS "public"."funnel_events_2025_session_id_created_at_idx";
DROP INDEX IF EXISTS "public"."funnel_events_2026_created_at_idx";
DROP INDEX IF EXISTS "public"."funnel_events_2026_funnel_stage_created_at_idx";
DROP INDEX IF EXISTS "public"."funnel_events_2026_session_id_created_at_idx";
DROP INDEX IF EXISTS "public"."funnel_events_2027_created_at_idx";
DROP INDEX IF EXISTS "public"."funnel_events_2027_funnel_stage_created_at_idx";
DROP INDEX IF EXISTS "public"."funnel_events_2027_session_id_created_at_idx";
DROP INDEX IF EXISTS "public"."funnel_events_2028_created_at_idx";
DROP INDEX IF EXISTS "public"."funnel_events_2028_funnel_stage_created_at_idx";
DROP INDEX IF EXISTS "public"."funnel_events_2028_session_id_created_at_idx";
DROP INDEX IF EXISTS "public"."idx_admin_log_created";
DROP INDEX IF EXISTS "public"."idx_admin_log_resource";
DROP INDEX IF EXISTS "public"."idx_admin_log_user";
DROP INDEX IF EXISTS "public"."idx_alerts_created";
DROP INDEX IF EXISTS "public"."idx_alerts_severity";
DROP INDEX IF EXISTS "public"."idx_alerts_type";
DROP INDEX IF EXISTS "public"."idx_audit_logs_siem_pending";
DROP INDEX IF EXISTS "public"."idx_biomarker_readings_recorded_at";
DROP INDEX IF EXISTS "public"."idx_clinical_bh_biomarker";
DROP INDEX IF EXISTS "public"."idx_clinical_bh_loinc";
DROP INDEX IF EXISTS "public"."idx_clinical_bh_user";
DROP INDEX IF EXISTS "public"."idx_clinical_uploads_status";
DROP INDEX IF EXISTS "public"."idx_clinical_uploads_user";
DROP INDEX IF EXISTS "public"."idx_consent_user";
DROP INDEX IF EXISTS "public"."idx_edge_fn_created";
DROP INDEX IF EXISTS "public"."idx_edge_fn_name";
DROP INDEX IF EXISTS "public"."idx_edge_fn_status";
DROP INDEX IF EXISTS "public"."idx_encryption_keys_purpose_status";
DROP INDEX IF EXISTS "public"."idx_favorites_test_id";
DROP INDEX IF EXISTS "public"."idx_favorites_user_id";
DROP INDEX IF EXISTS "public"."idx_fhir_user";
DROP INDEX IF EXISTS "public"."idx_health_queries_created_at";
DROP INDEX IF EXISTS "public"."idx_loinc_biomarker";
DROP INDEX IF EXISTS "public"."idx_newsletter_subscribers_email";
DROP INDEX IF EXISTS "public"."idx_newsletter_subscribers_status";
DROP INDEX IF EXISTS "public"."idx_notification_history_created_at";
DROP INDEX IF EXISTS "public"."idx_orders_status";
DROP INDEX IF EXISTS "public"."idx_orders_user_id";
DROP INDEX IF EXISTS "public"."idx_pia_checked_at";
DROP INDEX IF EXISTS "public"."idx_pia_provider_status";
DROP INDEX IF EXISTS "public"."idx_pia_run";
DROP INDEX IF EXISTS "public"."idx_popular_test_enrichment_cache_fetched_at";
DROP INDEX IF EXISTS "public"."idx_price_alerts_test_provider";
DROP INDEX IF EXISTS "public"."idx_price_alerts_user_enabled";
DROP INDEX IF EXISTS "public"."idx_price_history_lookup";
DROP INDEX IF EXISTS "public"."idx_price_history_test_provider_date";
DROP INDEX IF EXISTS "public"."idx_price_updates_test_provider";
DROP INDEX IF EXISTS "public"."idx_product_change_provider";
DROP INDEX IF EXISTS "public"."idx_product_change_test";
DROP INDEX IF EXISTS "public"."idx_product_change_type";
DROP INDEX IF EXISTS "public"."idx_product_pop_period";
DROP INDEX IF EXISTS "public"."idx_product_pop_test";
DROP INDEX IF EXISTS "public"."idx_product_scores_overall";
DROP INDEX IF EXISTS "public"."idx_product_scores_provider";
DROP INDEX IF EXISTS "public"."idx_protected_call_caller";
DROP INDEX IF EXISTS "public"."idx_protected_call_fn";
DROP INDEX IF EXISTS "public"."idx_protected_call_log_caller_recent";
DROP INDEX IF EXISTS "public"."idx_protected_call_log_ip_recent";
DROP INDEX IF EXISTS "public"."idx_protected_call_log_status_recent";
DROP INDEX IF EXISTS "public"."idx_prov_snapshots";
DROP INDEX IF EXISTS "public"."idx_provider_metrics_health";
DROP INDEX IF EXISTS "public"."idx_provider_test_mapping_provider_id";
DROP INDEX IF EXISTS "public"."idx_provider_test_mapping_provider_test";
DROP INDEX IF EXISTS "public"."idx_provider_test_mapping_test_id";
DROP INDEX IF EXISTS "public"."idx_provider_tests_lola_health";
DROP INDEX IF EXISTS "public"."idx_provider_tests_medichecks";
DROP INDEX IF EXISTS "public"."idx_provider_tests_popularity_rank";
DROP INDEX IF EXISTS "public"."idx_provider_tests_url_verified";
DROP INDEX IF EXISTS "public"."idx_ptm_collection_method";
DROP INDEX IF EXISTS "public"."idx_ptm_sample_type";
DROP INDEX IF EXISTS "public"."idx_ref_ranges_biomarker";
DROP INDEX IF EXISTS "public"."idx_revenue_provider";
DROP INDEX IF EXISTS "public"."idx_role_audit_actor";
DROP INDEX IF EXISTS "public"."idx_role_audit_target";
DROP INDEX IF EXISTS "public"."idx_scrape_chg_op";
DROP INDEX IF EXISTS "public"."idx_scrape_chg_provider";
DROP INDEX IF EXISTS "public"."idx_scrape_chg_type";
DROP INDEX IF EXISTS "public"."idx_scrape_ops_provider";
DROP INDEX IF EXISTS "public"."idx_scraper_alerts_provider";
DROP INDEX IF EXISTS "public"."idx_scraper_alerts_unack";
DROP INDEX IF EXISTS "public"."idx_scraping_jobs_provider_id";
DROP INDEX IF EXISTS "public"."idx_sec_scan_snapshots_has_diff";
DROP INDEX IF EXISTS "public"."idx_sec_scan_snapshots_scanned_at";
DROP INDEX IF EXISTS "public"."idx_seo_issues_severity";
DROP INDEX IF EXISTS "public"."idx_seo_issues_type";
DROP INDEX IF EXISTS "public"."idx_seo_kw_keyword";
DROP INDEX IF EXISTS "public"."idx_seo_kw_page";
DROP INDEX IF EXISTS "public"."idx_seo_metrics_crawled";
DROP INDEX IF EXISTS "public"."idx_seo_metrics_type";
DROP INDEX IF EXISTS "public"."idx_seo_metrics_url";
DROP INDEX IF EXISTS "public"."idx_snomed_biomarker";
DROP INDEX IF EXISTS "public"."idx_test_categories_provider_id";
DROP INDEX IF EXISTS "public"."idx_test_categories_realtime";
DROP INDEX IF EXISTS "public"."idx_test_results_date";
DROP INDEX IF EXISTS "public"."idx_tests_master_category";
DROP INDEX IF EXISTS "public"."idx_tests_master_test_code";
DROP INDEX IF EXISTS "public"."idx_tests_master_test_name_trgm";
DROP INDEX IF EXISTS "public"."idx_uploaded_test_results_test_date";
DROP INDEX IF EXISTS "public"."idx_user_health_data_recorded_at";
DROP INDEX IF EXISTS "public"."idx_user_health_scores_calculated_at";
DROP INDEX IF EXISTS "public"."idx_user_profiles_user_id";
DROP INDEX IF EXISTS "public"."idx_user_sessions_anonymous";
DROP INDEX IF EXISTS "public"."idx_user_sessions_started_at";
DROP INDEX IF EXISTS "public"."idx_user_sessions_user_id";
DROP INDEX IF EXISTS "public"."platform_metrics_2025_metric_name_recorded_at_idx";
DROP INDEX IF EXISTS "public"."platform_metrics_2026_metric_name_recorded_at_idx";
DROP INDEX IF EXISTS "public"."platform_metrics_2027_metric_name_recorded_at_idx";
DROP INDEX IF EXISTS "public"."platform_metrics_2028_metric_name_recorded_at_idx";
DROP INDEX IF EXISTS "public"."provider_biomarker_products_active_idx";
DROP INDEX IF EXISTS "public"."provider_biomarker_products_category_gin";
DROP INDEX IF EXISTS "public"."provider_biomarker_products_provider_idx";
DROP INDEX IF EXISTS "public"."provider_tests_category_ids_gin";
DROP INDEX IF EXISTS "public"."user_events_2025_event_type_created_at_idx";
DROP INDEX IF EXISTS "public"."user_events_2025_session_id_created_at_idx";
DROP INDEX IF EXISTS "public"."user_events_2026_event_type_created_at_idx";
DROP INDEX IF EXISTS "public"."user_events_2026_session_id_created_at_idx";
DROP INDEX IF EXISTS "public"."user_events_2027_event_type_created_at_idx";
DROP INDEX IF EXISTS "public"."user_events_2027_session_id_created_at_idx";
DROP INDEX IF EXISTS "public"."user_events_2028_event_type_created_at_idx";
DROP INDEX IF EXISTS "public"."user_events_2028_session_id_created_at_idx";
DROP INDEX IF EXISTS "public"."idx_audit_logs_created_at";
CREATE INDEX IF NOT EXISTS idx_ai_op_logs_user_id ON public.ai_operation_logs USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_user_id ON public.funnel_events USING btree (user_id);
CREATE INDEX IF NOT EXISTS ai_operation_logs_2025_user_id_idx ON public.ai_operation_logs_2025 USING btree (user_id);
CREATE INDEX IF NOT EXISTS ai_operation_logs_2026_user_id_idx ON public.ai_operation_logs_2026 USING btree (user_id);
CREATE INDEX IF NOT EXISTS ai_operation_logs_2027_user_id_idx ON public.ai_operation_logs_2027 USING btree (user_id);
CREATE INDEX IF NOT EXISTS ai_operation_logs_2028_user_id_idx ON public.ai_operation_logs_2028 USING btree (user_id);
CREATE INDEX IF NOT EXISTS funnel_events_2025_user_id_idx ON public.funnel_events_2025 USING btree (user_id);
CREATE INDEX IF NOT EXISTS funnel_events_2026_user_id_idx ON public.funnel_events_2026 USING btree (user_id);
CREATE INDEX IF NOT EXISTS funnel_events_2027_user_id_idx ON public.funnel_events_2027 USING btree (user_id);
CREATE INDEX IF NOT EXISTS funnel_events_2028_user_id_idx ON public.funnel_events_2028 USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_user_id ON public.admin_activity_log USING btree (admin_user_id);
CREATE INDEX IF NOT EXISTS idx_ai_prompt_versions_created_by ON public.ai_prompt_versions USING btree (created_by);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_biomarker_readings_uploaded_test_result_id ON public.biomarker_readings USING btree (uploaded_test_result_id);
CREATE INDEX IF NOT EXISTS idx_clinical_biomarker_history_source_upload_id ON public.clinical_biomarker_history USING btree (source_upload_id);
CREATE INDEX IF NOT EXISTS idx_clinical_biomarker_history_user_id ON public.clinical_biomarker_history USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_clinical_consent_records_user_id ON public.clinical_consent_records USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_clinical_fhir_bundles_source_upload_id ON public.clinical_fhir_bundles USING btree (source_upload_id);
CREATE INDEX IF NOT EXISTS idx_clinical_fhir_bundles_user_id ON public.clinical_fhir_bundles USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_clinical_gp_notifications_fhir_bundle_id ON public.clinical_gp_notifications USING btree (fhir_bundle_id);
CREATE INDEX IF NOT EXISTS idx_clinical_gp_notifications_user_id ON public.clinical_gp_notifications USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_clinical_patient_uploads_user_id ON public.clinical_patient_uploads USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_data_access_requests_user_id ON public.data_access_requests USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_encryption_keys_rotated_from ON public.encryption_keys USING btree (rotated_from);
CREATE INDEX IF NOT EXISTS idx_health_insights_created_by ON public.health_insights USING btree (created_by);
CREATE INDEX IF NOT EXISTS idx_operational_alerts_resolved_by ON public.operational_alerts USING btree (resolved_by);
CREATE INDEX IF NOT EXISTS idx_provider_tests_goals ON public.provider_tests USING gin (goals);
CREATE INDEX IF NOT EXISTS idx_provider_tests_total_cost ON public.provider_tests USING btree (total_expected_cost);
CREATE INDEX IF NOT EXISTS idx_revenue_events_user_id ON public.revenue_events USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_scrape_change_events_scrape_operation_id ON public.scrape_change_events USING btree (scrape_operation_id);
CREATE INDEX IF NOT EXISTS idx_scrape_operations_triggered_by_user_id ON public.scrape_operations USING btree (triggered_by_user_id);
CREATE INDEX IF NOT EXISTS idx_test_categories_parent_id ON public.test_categories USING btree (parent_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test_master_id ON public.test_results USING btree (test_master_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles USING btree (user_id, role);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id_fk ON public.user_sessions USING btree (user_id);

-- 6. Functions changed or created in production outside any migration.
CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.categories_set_path()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  parent_path extensions.ltree;
  parent_level integer;
  safe_slug text;
BEGIN
  safe_slug := regexp_replace(lower(NEW.slug), '[^a-z0-9_]+', '_', 'g');
  IF NEW.parent_id IS NULL THEN
    NEW.level := 0;
    NEW.path := safe_slug::extensions.ltree;
  ELSE
    SELECT path, level INTO parent_path, parent_level
    FROM public.categories WHERE id = NEW.parent_id;
    IF parent_path IS NULL THEN
      RAISE EXCEPTION 'Parent category % has no path', NEW.parent_id;
    END IF;
    NEW.level := parent_level + 1;
    NEW.path := parent_path || safe_slug::extensions.ltree;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_data_access_with_reason(_table_name text, _record_id uuid, _reason_code text, _purpose text DEFAULT NULL::text, _classification text DEFAULT 'C2'::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  _id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'authentication required';
  END IF;
  IF _reason_code IS NULL OR length(btrim(_reason_code)) < 3 THEN
    RAISE EXCEPTION 'reason_code is required (>= 3 chars)';
  END IF;
  IF _classification NOT IN ('C0','C1','C2','C3','C4') THEN
    RAISE EXCEPTION 'invalid data_classification';
  END IF;
  INSERT INTO public.audit_logs (
    user_id, action, table_name, record_id,
    reason_code, purpose, data_classification
  ) VALUES (
    auth.uid(), 'READ', _table_name, _record_id,
    _reason_code, _purpose, _classification
  ) RETURNING id INTO _id;
  RETURN _id;
END;
$function$;

REVOKE ALL ON FUNCTION "public"."rls_auto_enable"() FROM PUBLIC, anon, authenticated, service_role;
DO $g$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin_role') THEN EXECUTE 'GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO "db_admin_role";'; END IF; END $g$;
GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO "service_role";
REVOKE ALL ON FUNCTION "public"."audit_health_insights_insert"() FROM PUBLIC, anon, authenticated, service_role;
DO $g$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin_role') THEN EXECUTE 'GRANT EXECUTE ON FUNCTION "public"."audit_health_insights_insert"() TO "db_admin_role";'; END IF; END $g$;
GRANT EXECUTE ON FUNCTION "public"."audit_health_insights_insert"() TO "service_role";
REVOKE ALL ON FUNCTION "public"."call_edge_with_automations"(p_url text, p_body jsonb) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."call_edge_with_automations"(p_url text, p_body jsonb) TO "service_role";
GRANT EXECUTE ON FUNCTION "public"."call_edge_with_automations"(p_url text, p_body jsonb) TO "supabase_admin";
REVOKE ALL ON FUNCTION "public"."categories_set_path"() FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."categories_set_path"() TO PUBLIC;
GRANT EXECUTE ON FUNCTION "public"."categories_set_path"() TO "service_role";
REVOKE ALL ON FUNCTION "public"."cleanup_expired_recommendations"() FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."cleanup_expired_recommendations"() TO "service_role";
REVOKE ALL ON FUNCTION "public"."cleanup_old_health_queries"() FROM PUBLIC, anon, authenticated, service_role;
DO $g$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin_role') THEN EXECUTE 'GRANT EXECUTE ON FUNCTION "public"."cleanup_old_health_queries"() TO "db_admin_role";'; END IF; END $g$;
GRANT EXECUTE ON FUNCTION "public"."cleanup_old_health_queries"() TO "service_role";
REVOKE ALL ON FUNCTION "public"."cleanup_old_rate_limits"() FROM PUBLIC, anon, authenticated, service_role;
DO $g$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin_role') THEN EXECUTE 'GRANT EXECUTE ON FUNCTION "public"."cleanup_old_rate_limits"() TO "db_admin_role";'; END IF; END $g$;
GRANT EXECUTE ON FUNCTION "public"."cleanup_old_rate_limits"() TO "service_role";
REVOKE ALL ON FUNCTION "public"."handle_new_user_profile"() FROM PUBLIC, anon, authenticated, service_role;
DO $g$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin_role') THEN EXECUTE 'GRANT EXECUTE ON FUNCTION "public"."handle_new_user_profile"() TO "db_admin_role";'; END IF; END $g$;
GRANT EXECUTE ON FUNCTION "public"."handle_new_user_profile"() TO "service_role";
REVOKE ALL ON FUNCTION "public"."has_role"(_user_id uuid, _role app_role) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."has_role"(_user_id uuid, _role app_role) TO "anon";
GRANT EXECUTE ON FUNCTION "public"."has_role"(_user_id uuid, _role app_role) TO "authenticated";
DO $g$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin_role') THEN EXECUTE 'GRANT EXECUTE ON FUNCTION "public"."has_role"(_user_id uuid, _role app_role) TO "db_admin_role";'; END IF; END $g$;
GRANT EXECUTE ON FUNCTION "public"."has_role"(_user_id uuid, _role app_role) TO "service_role";
REVOKE ALL ON FUNCTION "public"."is_current_user_admin"() FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."is_current_user_admin"() TO "authenticated";
DO $g$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin_role') THEN EXECUTE 'GRANT EXECUTE ON FUNCTION "public"."is_current_user_admin"() TO "db_admin_role";'; END IF; END $g$;
GRANT EXECUTE ON FUNCTION "public"."is_current_user_admin"() TO "service_role";
REVOKE ALL ON FUNCTION "public"."log_data_access"() FROM PUBLIC, anon, authenticated, service_role;
DO $g$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin_role') THEN EXECUTE 'GRANT EXECUTE ON FUNCTION "public"."log_data_access"() TO "db_admin_role";'; END IF; END $g$;
GRANT EXECUTE ON FUNCTION "public"."log_data_access"() TO "service_role";
REVOKE ALL ON FUNCTION "public"."log_data_access_with_reason"(_table_name text, _record_id uuid, _reason_code text, _purpose text, _classification text) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."log_data_access_with_reason"(_table_name text, _record_id uuid, _reason_code text, _purpose text, _classification text) TO PUBLIC;
GRANT EXECUTE ON FUNCTION "public"."log_data_access_with_reason"(_table_name text, _record_id uuid, _reason_code text, _purpose text, _classification text) TO "authenticated";
GRANT EXECUTE ON FUNCTION "public"."log_data_access_with_reason"(_table_name text, _record_id uuid, _reason_code text, _purpose text, _classification text) TO "service_role";
REVOKE ALL ON FUNCTION "public"."log_sensitive_data_access"() FROM PUBLIC, anon, authenticated, service_role;
DO $g$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin_role') THEN EXECUTE 'GRANT EXECUTE ON FUNCTION "public"."log_sensitive_data_access"() TO "db_admin_role";'; END IF; END $g$;
GRANT EXECUTE ON FUNCTION "public"."log_sensitive_data_access"() TO "service_role";
REVOKE ALL ON FUNCTION "public"."match_biomarkers"(query_embedding vector, match_threshold double precision, match_count integer) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."match_biomarkers"(query_embedding vector, match_threshold double precision, match_count integer) TO "service_role";
REVOKE ALL ON FUNCTION "public"."set_audit_log_user_id"() FROM PUBLIC, anon, authenticated, service_role;
DO $g$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin_role') THEN EXECUTE 'GRANT EXECUTE ON FUNCTION "public"."set_audit_log_user_id"() TO "db_admin_role";'; END IF; END $g$;
GRANT EXECUTE ON FUNCTION "public"."set_audit_log_user_id"() TO "service_role";
REVOKE ALL ON FUNCTION "public"."set_health_insight_creator"() FROM PUBLIC, anon, authenticated, service_role;
DO $g$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin_role') THEN EXECUTE 'GRANT EXECUTE ON FUNCTION "public"."set_health_insight_creator"() TO "db_admin_role";'; END IF; END $g$;
GRANT EXECUTE ON FUNCTION "public"."set_health_insight_creator"() TO "service_role";
REVOKE ALL ON FUNCTION "public"."update_updated_at_column"() FROM PUBLIC, anon, authenticated, service_role;
DO $g$ BEGIN IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'db_admin_role') THEN EXECUTE 'GRANT EXECUTE ON FUNCTION "public"."update_updated_at_column"() TO "db_admin_role";'; END IF; END $g$;
GRANT EXECUTE ON FUNCTION "public"."update_updated_at_column"() TO "service_role";

-- 7. Row level security flags, view options and table privileges.
ALTER TABLE "public"."ai_operation_logs_2025" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ai_operation_logs_2026" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ai_operation_logs_2027" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ai_operation_logs_2028" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "public"."api_rate_limits" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."api_rate_limits" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."api_rate_limits" TO "service_role";
REVOKE ALL ON TABLE "public"."audit_logs" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."audit_logs" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."audit_logs" TO "service_role";
REVOKE ALL ON TABLE "public"."biomarker_audit_runs" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."biomarker_audit_runs" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."biomarker_audit_runs" TO "service_role";
REVOKE ALL ON TABLE "public"."biomarker_readings" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."biomarker_readings" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."biomarker_readings" TO "service_role";
ALTER TABLE "public"."blood_tests" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "public"."cron_run_log" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."cron_run_log" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."cron_run_log" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."cron_run_log" TO "service_role";
REVOKE ALL ON TABLE "public"."csp_reports" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."csp_reports" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."csp_reports" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."csp_reports" TO "service_role";
REVOKE ALL ON TABLE "public"."data_access_requests" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."data_access_requests" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."data_access_requests" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."data_access_requests" TO "service_role";
REVOKE ALL ON TABLE "public"."favorites" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."favorites" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."favorites" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."favorites" TO "service_role";
ALTER TABLE "public"."funnel_events_2025" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."funnel_events_2026" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."funnel_events_2027" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."funnel_events_2028" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "public"."health_insights" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."health_insights" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."health_insights" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."health_insights" TO "service_role";
REVOKE ALL ON TABLE "public"."health_queries" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."health_queries" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."health_queries" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."health_queries" TO "service_role";
REVOKE ALL ON TABLE "public"."newsletter_subscribers" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."newsletter_subscribers" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."newsletter_subscribers" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."newsletter_subscribers" TO "service_role";
REVOKE ALL ON TABLE "public"."notification_history" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."notification_history" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."notification_history" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."notification_history" TO "service_role";
REVOKE ALL ON TABLE "public"."orders" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."orders" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."orders" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."orders" TO "service_role";
ALTER TABLE "public"."platform_metrics_2025" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."platform_metrics_2026" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."platform_metrics_2027" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."platform_metrics_2028" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "public"."price_alert_preferences" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."price_alert_preferences" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."price_alert_preferences" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."price_alert_preferences" TO "service_role";
REVOKE ALL ON TABLE "public"."price_updates" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."price_updates" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."price_updates" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."price_updates" TO "service_role";
REVOKE ALL ON TABLE "public"."protected_call_log" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."protected_call_log" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."protected_call_log" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."protected_call_log" TO "service_role";
REVOKE ALL ON TABLE "public"."provider_image_audit" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."provider_image_audit" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."provider_image_audit" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."provider_image_audit" TO "service_role";
ALTER TABLE "public"."provider_metadata" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."recommendation_history" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "public"."role_audit_log" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."role_audit_log" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."role_audit_log" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."role_audit_log" TO "service_role";
REVOKE ALL ON TABLE "public"."saved_comparisons" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."saved_comparisons" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."saved_comparisons" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."saved_comparisons" TO "service_role";
REVOKE ALL ON TABLE "public"."saved_providers" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."saved_providers" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."saved_providers" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."saved_providers" TO "service_role";
REVOKE ALL ON TABLE "public"."scrape_run_log" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."scrape_run_log" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."scrape_run_log" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."scrape_run_log" TO "service_role";
REVOKE ALL ON TABLE "public"."scraper_alerts" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."scraper_alerts" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."scraper_alerts" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."scraper_alerts" TO "service_role";
REVOKE ALL ON TABLE "public"."scraping_jobs" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."scraping_jobs" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."scraping_jobs" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."scraping_jobs" TO "service_role";
REVOKE ALL ON TABLE "public"."security_alert_recipients" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."security_alert_recipients" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."security_alert_recipients" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."security_alert_recipients" TO "service_role";
REVOKE ALL ON TABLE "public"."security_scan_snapshots" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."security_scan_snapshots" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."security_scan_snapshots" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."security_scan_snapshots" TO "service_role";
ALTER TABLE "public"."sync_heartbeat" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "public"."test_results" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."test_results" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."test_results" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."test_results" TO "service_role";
REVOKE ALL ON TABLE "public"."translations_cache" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."translations_cache" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."translations_cache" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."translations_cache" TO "service_role";
REVOKE ALL ON TABLE "public"."uploaded_test_results" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."uploaded_test_results" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."uploaded_test_results" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."uploaded_test_results" TO "service_role";
REVOKE ALL ON TABLE "public"."user_consents" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_consents" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_consents" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_consents" TO "service_role";
ALTER TABLE "public"."user_events_2025" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_events_2026" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_events_2027" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_events_2028" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "public"."user_health_data" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_health_data" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_health_data" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_health_data" TO "service_role";
REVOKE ALL ON TABLE "public"."user_health_scores" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_health_scores" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_health_scores" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_health_scores" TO "service_role";
REVOKE ALL ON TABLE "public"."user_preferences" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_preferences" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "public"."user_preferences" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_preferences" TO "service_role";
REVOKE ALL ON TABLE "public"."user_profiles" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_profiles" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "public"."user_profiles" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_profiles" TO "service_role";
REVOKE ALL ON TABLE "public"."user_roles" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_roles" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE ON TABLE "public"."user_roles" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."user_roles" TO "service_role";
ALTER VIEW "public"."v_ai_ops_summary" SET (security_invoker=true);
REVOKE ALL ON TABLE "public"."v_ai_ops_summary" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_ai_ops_summary" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_ai_ops_summary" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_ai_ops_summary" TO "service_role";
ALTER VIEW "public"."v_commercial_funnel" SET (security_invoker=true);
REVOKE ALL ON TABLE "public"."v_commercial_funnel" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_commercial_funnel" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_commercial_funnel" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_commercial_funnel" TO "service_role";
ALTER VIEW "public"."v_executive_kpis" SET (security_invoker=true);
REVOKE ALL ON TABLE "public"."v_executive_kpis" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_executive_kpis" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_executive_kpis" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_executive_kpis" TO "service_role";
ALTER VIEW "public"."v_provider_health_latest" SET (security_invoker=true);
REVOKE ALL ON TABLE "public"."v_provider_health_latest" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_provider_health_latest" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_provider_health_latest" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_provider_health_latest" TO "service_role";
ALTER VIEW "public"."v_scrape_ops_recent" SET (security_invoker=true);
REVOKE ALL ON TABLE "public"."v_scrape_ops_recent" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_scrape_ops_recent" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_scrape_ops_recent" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_scrape_ops_recent" TO "service_role";
ALTER VIEW "public"."v_unresolved_alerts" SET (security_invoker=true);
REVOKE ALL ON TABLE "public"."v_unresolved_alerts" FROM PUBLIC, anon, authenticated, service_role;
GRANT INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_unresolved_alerts" TO "anon";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_unresolved_alerts" TO "authenticated";
GRANT INSERT, SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLE "public"."v_unresolved_alerts" TO "service_role";

-- 8. Row level security policies.
DROP POLICY IF EXISTS "Admins can view all audit logs" ON "public"."audit_logs";
DROP POLICY IF EXISTS "Users can view their own audit logs" ON "public"."audit_logs";
DROP POLICY IF EXISTS "Admins manage categories" ON "public"."categories";
DROP POLICY IF EXISTS "Admins manage aliases" ON "public"."category_aliases";
DROP POLICY IF EXISTS "Admins manage slug redirects" ON "public"."category_slug_redirects";
DROP POLICY IF EXISTS "Admins manage mappings" ON "public"."category_test_mapping";
DROP POLICY IF EXISTS "Lola Health products are viewable by everyone" ON "public"."lola_health_products";
DROP POLICY IF EXISTS "Only admins can manage Lola Health products" ON "public"."lola_health_products";
DROP POLICY IF EXISTS "Admins can view all notification history" ON "public"."notification_history";
DROP POLICY IF EXISTS "Users can view their own notification history" ON "public"."notification_history";
DROP POLICY IF EXISTS "Admins can view all orders" ON "public"."orders";
DROP POLICY IF EXISTS "Users can view their own orders" ON "public"."orders";
DROP POLICY IF EXISTS "Only service can update prices" ON "public"."price_updates";
DROP POLICY IF EXISTS "Price updates are viewable by everyone" ON "public"."price_updates";
DROP POLICY IF EXISTS "Admins manage biomarker products" ON "public"."provider_biomarker_products";
DROP POLICY IF EXISTS "Admins manage section map" ON "public"."provider_section_category_map";
DROP POLICY IF EXISTS "Only service can manage scraping jobs" ON "public"."scraping_jobs";
DROP POLICY IF EXISTS "Admins can insert test results" ON "public"."test_results";
DROP POLICY IF EXISTS "Users can insert their own test results" ON "public"."test_results";
DROP POLICY IF EXISTS "Admins can view all user profiles" ON "public"."user_profiles";
DROP POLICY IF EXISTS "Users can view their own profile" ON "public"."user_profiles";
DROP POLICY IF EXISTS "Admins can view all roles" ON "public"."user_roles";
DROP POLICY IF EXISTS "Users can view their own roles" ON "public"."user_roles";
DROP POLICY IF EXISTS "admin_admin_log" ON "public"."admin_activity_log";
CREATE POLICY "admin_admin_log" ON "public"."admin_activity_log" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_ai_logs" ON "public"."ai_operation_logs";
CREATE POLICY "admin_ai_logs" ON "public"."ai_operation_logs" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_ai_prompts" ON "public"."ai_prompt_versions";
CREATE POLICY "admin_ai_prompts" ON "public"."ai_prompt_versions" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_ai_vector" ON "public"."ai_vector_index_log";
CREATE POLICY "admin_ai_vector" ON "public"."ai_vector_index_log" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can approve biomarker audit runs" ON "public"."biomarker_audit_runs";
CREATE POLICY "Admins can approve biomarker audit runs" ON "public"."biomarker_audit_runs" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can read biomarker audit runs" ON "public"."biomarker_audit_runs";
CREATE POLICY "Admins can read biomarker audit runs" ON "public"."biomarker_audit_runs" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Users can delete their own biomarker readings" ON "public"."biomarker_readings";
CREATE POLICY "Users can delete their own biomarker readings" ON "public"."biomarker_readings" AS PERMISSIVE FOR DELETE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can insert their own biomarker readings" ON "public"."biomarker_readings";
CREATE POLICY "Users can insert their own biomarker readings" ON "public"."biomarker_readings" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can update their own biomarker readings" ON "public"."biomarker_readings";
CREATE POLICY "Users can update their own biomarker readings" ON "public"."biomarker_readings" AS PERMISSIVE FOR UPDATE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id))
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can view their own biomarker readings" ON "public"."biomarker_readings";
CREATE POLICY "Users can view their own biomarker readings" ON "public"."biomarker_readings" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "user_biomarker_history" ON "public"."clinical_biomarker_history";
CREATE POLICY "user_biomarker_history" ON "public"."clinical_biomarker_history" AS PERMISSIVE FOR ALL TO public
  USING (((( SELECT auth.uid() AS uid) = user_id) OR has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)));
DROP POLICY IF EXISTS "user_consent_records" ON "public"."clinical_consent_records";
CREATE POLICY "user_consent_records" ON "public"."clinical_consent_records" AS PERMISSIVE FOR ALL TO public
  USING (((( SELECT auth.uid() AS uid) = user_id) OR has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)));
DROP POLICY IF EXISTS "user_fhir_bundles" ON "public"."clinical_fhir_bundles";
CREATE POLICY "user_fhir_bundles" ON "public"."clinical_fhir_bundles" AS PERMISSIVE FOR ALL TO public
  USING (((( SELECT auth.uid() AS uid) = user_id) OR has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)));
DROP POLICY IF EXISTS "user_gp_notifications" ON "public"."clinical_gp_notifications";
CREATE POLICY "user_gp_notifications" ON "public"."clinical_gp_notifications" AS PERMISSIVE FOR ALL TO public
  USING (((( SELECT auth.uid() AS uid) = user_id) OR has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)));
DROP POLICY IF EXISTS "admin_loinc" ON "public"."clinical_loinc_mappings";
CREATE POLICY "admin_loinc" ON "public"."clinical_loinc_mappings" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "user_clinical_uploads" ON "public"."clinical_patient_uploads";
CREATE POLICY "user_clinical_uploads" ON "public"."clinical_patient_uploads" AS PERMISSIVE FOR ALL TO public
  USING (((( SELECT auth.uid() AS uid) = user_id) OR has_role(( SELECT auth.uid() AS uid), 'admin'::app_role)));
DROP POLICY IF EXISTS "admin_ref_ranges" ON "public"."clinical_reference_ranges";
CREATE POLICY "admin_ref_ranges" ON "public"."clinical_reference_ranges" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_snomed" ON "public"."clinical_snomed_mappings";
CREATE POLICY "admin_snomed" ON "public"."clinical_snomed_mappings" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can read cron run log" ON "public"."cron_run_log";
CREATE POLICY "Admins can read cron run log" ON "public"."cron_run_log" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can read CSP reports" ON "public"."csp_reports";
CREATE POLICY "Admins can read CSP reports" ON "public"."csp_reports" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Only admins can update data access requests" ON "public"."data_access_requests";
CREATE POLICY "Only admins can update data access requests" ON "public"."data_access_requests" AS PERMISSIVE FOR UPDATE TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Users can create their own requests" ON "public"."data_access_requests";
CREATE POLICY "Users can create their own requests" ON "public"."data_access_requests" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can view their own requests" ON "public"."data_access_requests";
CREATE POLICY "Users can view their own requests" ON "public"."data_access_requests" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "admin_edge_fn" ON "public"."edge_function_logs";
CREATE POLICY "admin_edge_fn" ON "public"."edge_function_logs" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins read encryption keys" ON "public"."encryption_keys";
CREATE POLICY "Admins read encryption keys" ON "public"."encryption_keys" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Users can create their own favorites" ON "public"."favorites";
CREATE POLICY "Users can create their own favorites" ON "public"."favorites" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can delete their own favorites" ON "public"."favorites";
CREATE POLICY "Users can delete their own favorites" ON "public"."favorites" AS PERMISSIVE FOR DELETE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can view their own favorites" ON "public"."favorites";
CREATE POLICY "Users can view their own favorites" ON "public"."favorites" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "admin_funnel" ON "public"."funnel_events";
CREATE POLICY "admin_funnel" ON "public"."funnel_events" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Only admins can insert health insights" ON "public"."health_insights";
CREATE POLICY "Only admins can insert health insights" ON "public"."health_insights" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((has_role(( SELECT auth.uid() AS uid), 'admin'::app_role) OR has_role(( SELECT auth.uid() AS uid), 'moderator'::app_role)));
DROP POLICY IF EXISTS "Users can mark own insights as read" ON "public"."health_insights";
CREATE POLICY "Users can mark own insights as read" ON "public"."health_insights" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));
DROP POLICY IF EXISTS "Users view own insights, admins and moderators view all" ON "public"."health_insights";
CREATE POLICY "Users view own insights, admins and moderators view all" ON "public"."health_insights" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (((( SELECT auth.uid() AS uid) = user_id) OR has_role(( SELECT auth.uid() AS uid), 'admin'::app_role) OR has_role(( SELECT auth.uid() AS uid), 'moderator'::app_role)));
DROP POLICY IF EXISTS "Users can create their own health queries" ON "public"."health_queries";
CREATE POLICY "Users can create their own health queries" ON "public"."health_queries" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can delete their own health queries" ON "public"."health_queries";
CREATE POLICY "Users can delete their own health queries" ON "public"."health_queries" AS PERMISSIVE FOR DELETE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can update their own health queries" ON "public"."health_queries";
CREATE POLICY "Users can update their own health queries" ON "public"."health_queries" AS PERMISSIVE FOR UPDATE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id))
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can view their own health queries" ON "public"."health_queries";
CREATE POLICY "Users can view their own health queries" ON "public"."health_queries" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Admins can delete subscribers" ON "public"."newsletter_subscribers";
CREATE POLICY "Admins can delete subscribers" ON "public"."newsletter_subscribers" AS PERMISSIVE FOR DELETE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can update subscribers" ON "public"."newsletter_subscribers";
CREATE POLICY "Admins can update subscribers" ON "public"."newsletter_subscribers" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_alerts" ON "public"."operational_alerts";
CREATE POLICY "admin_alerts" ON "public"."operational_alerts" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Only admins can update orders" ON "public"."orders";
CREATE POLICY "Only admins can update orders" ON "public"."orders" AS PERMISSIVE FOR UPDATE TO public
  USING (has_role(( SELECT ( SELECT auth.uid() AS uid) AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT ( SELECT auth.uid() AS uid) AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Users can create their own orders" ON "public"."orders";
CREATE POLICY "Users can create their own orders" ON "public"."orders" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "admin_platform_metrics" ON "public"."platform_metrics";
CREATE POLICY "admin_platform_metrics" ON "public"."platform_metrics" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Users can create their own alert preferences" ON "public"."price_alert_preferences";
CREATE POLICY "Users can create their own alert preferences" ON "public"."price_alert_preferences" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can delete their own alert preferences" ON "public"."price_alert_preferences";
CREATE POLICY "Users can delete their own alert preferences" ON "public"."price_alert_preferences" AS PERMISSIVE FOR DELETE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can update their own alert preferences" ON "public"."price_alert_preferences";
CREATE POLICY "Users can update their own alert preferences" ON "public"."price_alert_preferences" AS PERMISSIVE FOR UPDATE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id))
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can view their own alert preferences" ON "public"."price_alert_preferences";
CREATE POLICY "Users can view their own alert preferences" ON "public"."price_alert_preferences" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "admin_product_change" ON "public"."product_change_log";
CREATE POLICY "admin_product_change" ON "public"."product_change_log" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_product_pop" ON "public"."product_popularity";
CREATE POLICY "admin_product_pop" ON "public"."product_popularity" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_product_scores" ON "public"."product_scores";
CREATE POLICY "admin_product_scores" ON "public"."product_scores" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can read protected call log" ON "public"."protected_call_log";
CREATE POLICY "Admins can read protected call log" ON "public"."protected_call_log" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_prov_snapshots" ON "public"."provider_catalogue_snapshots";
CREATE POLICY "admin_prov_snapshots" ON "public"."provider_catalogue_snapshots" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view image audit" ON "public"."provider_image_audit";
CREATE POLICY "Admins can view image audit" ON "public"."provider_image_audit" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_provider_metrics" ON "public"."provider_metrics";
CREATE POLICY "admin_provider_metrics" ON "public"."provider_metrics" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "rec_history_service_insert" ON "public"."recommendation_history";
CREATE POLICY "rec_history_service_insert" ON "public"."recommendation_history" AS PERMISSIVE FOR INSERT TO "service_role"
  WITH CHECK ((( SELECT auth.role() AS role) = 'service_role'::text));
DROP POLICY IF EXISTS "admin_revenue" ON "public"."revenue_events";
CREATE POLICY "admin_revenue" ON "public"."revenue_events" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can read role audit log" ON "public"."role_audit_log";
CREATE POLICY "Admins can read role audit log" ON "public"."role_audit_log" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Users can create their own saved comparisons" ON "public"."saved_comparisons";
CREATE POLICY "Users can create their own saved comparisons" ON "public"."saved_comparisons" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can delete their own saved comparisons" ON "public"."saved_comparisons";
CREATE POLICY "Users can delete their own saved comparisons" ON "public"."saved_comparisons" AS PERMISSIVE FOR DELETE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can update their own saved comparisons" ON "public"."saved_comparisons";
CREATE POLICY "Users can update their own saved comparisons" ON "public"."saved_comparisons" AS PERMISSIVE FOR UPDATE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id))
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can view their own saved comparisons" ON "public"."saved_comparisons";
CREATE POLICY "Users can view their own saved comparisons" ON "public"."saved_comparisons" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can remove their saved providers" ON "public"."saved_providers";
CREATE POLICY "Users can remove their saved providers" ON "public"."saved_providers" AS PERMISSIVE FOR DELETE TO public
  USING ((( SELECT auth.uid() AS uid) = user_id));
DROP POLICY IF EXISTS "Users can save providers" ON "public"."saved_providers";
CREATE POLICY "Users can save providers" ON "public"."saved_providers" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));
DROP POLICY IF EXISTS "Users can update their own saved providers" ON "public"."saved_providers";
CREATE POLICY "Users can update their own saved providers" ON "public"."saved_providers" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));
DROP POLICY IF EXISTS "Users can view their own saved providers" ON "public"."saved_providers";
CREATE POLICY "Users can view their own saved providers" ON "public"."saved_providers" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT auth.uid() AS uid) = user_id));
DROP POLICY IF EXISTS "admin_scrape_changes" ON "public"."scrape_change_events";
CREATE POLICY "admin_scrape_changes" ON "public"."scrape_change_events" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_scrape_ops" ON "public"."scrape_operations";
CREATE POLICY "admin_scrape_ops" ON "public"."scrape_operations" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins view scrape runs" ON "public"."scrape_run_log";
CREATE POLICY "Admins view scrape runs" ON "public"."scrape_run_log" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can acknowledge alerts" ON "public"."scraper_alerts";
CREATE POLICY "Admins can acknowledge alerts" ON "public"."scraper_alerts" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view scraper alerts" ON "public"."scraper_alerts";
CREATE POLICY "Admins can view scraper alerts" ON "public"."scraper_alerts" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view scraping jobs" ON "public"."scraping_jobs";
CREATE POLICY "Admins can view scraping jobs" ON "public"."scraping_jobs" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins manage alert recipients" ON "public"."security_alert_recipients";
CREATE POLICY "Admins manage alert recipients" ON "public"."security_alert_recipients" AS PERMISSIVE FOR ALL TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can acknowledge scan snapshots" ON "public"."security_scan_snapshots";
CREATE POLICY "Admins can acknowledge scan snapshots" ON "public"."security_scan_snapshots" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins can view scan snapshots" ON "public"."security_scan_snapshots";
CREATE POLICY "Admins can view scan snapshots" ON "public"."security_scan_snapshots" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_seo_issues" ON "public"."seo_crawl_issues";
CREATE POLICY "admin_seo_issues" ON "public"."seo_crawl_issues" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_seo_keywords" ON "public"."seo_keyword_rankings";
CREATE POLICY "admin_seo_keywords" ON "public"."seo_keyword_rankings" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "admin_seo_metrics" ON "public"."seo_page_metrics";
CREATE POLICY "admin_seo_metrics" ON "public"."seo_page_metrics" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins read SIEM cursor" ON "public"."siem_export_cursor";
CREATE POLICY "Admins read SIEM cursor" ON "public"."siem_export_cursor" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Professionals can update test results" ON "public"."test_results";
CREATE POLICY "Professionals can update test results" ON "public"."test_results" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING ((has_role(( SELECT auth.uid() AS uid), 'admin'::app_role) OR has_role(( SELECT auth.uid() AS uid), 'moderator'::app_role)))
  WITH CHECK ((has_role(( SELECT auth.uid() AS uid), 'admin'::app_role) OR has_role(( SELECT auth.uid() AS uid), 'moderator'::app_role)));
DROP POLICY IF EXISTS "Users can view their own results" ON "public"."test_results";
CREATE POLICY "Users can view their own results" ON "public"."test_results" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can delete their own uploaded results" ON "public"."uploaded_test_results";
CREATE POLICY "Users can delete their own uploaded results" ON "public"."uploaded_test_results" AS PERMISSIVE FOR DELETE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can insert their own uploaded results" ON "public"."uploaded_test_results";
CREATE POLICY "Users can insert their own uploaded results" ON "public"."uploaded_test_results" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can update their own uploaded results" ON "public"."uploaded_test_results";
CREATE POLICY "Users can update their own uploaded results" ON "public"."uploaded_test_results" AS PERMISSIVE FOR UPDATE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id))
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can view their own uploaded results" ON "public"."uploaded_test_results";
CREATE POLICY "Users can view their own uploaded results" ON "public"."uploaded_test_results" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can create their own consents" ON "public"."user_consents";
CREATE POLICY "Users can create their own consents" ON "public"."user_consents" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));
DROP POLICY IF EXISTS "Users can update their own consents" ON "public"."user_consents";
CREATE POLICY "Users can update their own consents" ON "public"."user_consents" AS PERMISSIVE FOR UPDATE TO public
  USING ((( SELECT auth.uid() AS uid) = user_id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));
DROP POLICY IF EXISTS "Users can view their own consents" ON "public"."user_consents";
CREATE POLICY "Users can view their own consents" ON "public"."user_consents" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT auth.uid() AS uid) = user_id));
DROP POLICY IF EXISTS "admin_user_events" ON "public"."user_events";
CREATE POLICY "admin_user_events" ON "public"."user_events" AS PERMISSIVE FOR ALL TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Users can delete their own health data" ON "public"."user_health_data";
CREATE POLICY "Users can delete their own health data" ON "public"."user_health_data" AS PERMISSIVE FOR DELETE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can insert their own health data" ON "public"."user_health_data";
CREATE POLICY "Users can insert their own health data" ON "public"."user_health_data" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can update their own health data" ON "public"."user_health_data";
CREATE POLICY "Users can update their own health data" ON "public"."user_health_data" AS PERMISSIVE FOR UPDATE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id))
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can view their own health data" ON "public"."user_health_data";
CREATE POLICY "Users can view their own health data" ON "public"."user_health_data" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can delete their own health scores" ON "public"."user_health_scores";
CREATE POLICY "Users can delete their own health scores" ON "public"."user_health_scores" AS PERMISSIVE FOR DELETE TO public
  USING ((( SELECT auth.uid() AS uid) = user_id));
DROP POLICY IF EXISTS "Users can insert their own health scores" ON "public"."user_health_scores";
CREATE POLICY "Users can insert their own health scores" ON "public"."user_health_scores" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can update their own health scores" ON "public"."user_health_scores";
CREATE POLICY "Users can update their own health scores" ON "public"."user_health_scores" AS PERMISSIVE FOR UPDATE TO public
  USING ((( SELECT auth.uid() AS uid) = user_id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));
DROP POLICY IF EXISTS "Users can view their own health scores" ON "public"."user_health_scores";
CREATE POLICY "Users can view their own health scores" ON "public"."user_health_scores" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can insert their own preferences" ON "public"."user_preferences";
CREATE POLICY "Users can insert their own preferences" ON "public"."user_preferences" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can update their own preferences" ON "public"."user_preferences";
CREATE POLICY "Users can update their own preferences" ON "public"."user_preferences" AS PERMISSIVE FOR UPDATE TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id))
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can view their own preferences" ON "public"."user_preferences";
CREATE POLICY "Users can view their own preferences" ON "public"."user_preferences" AS PERMISSIVE FOR SELECT TO public
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can insert their own profile" ON "public"."user_profiles";
CREATE POLICY "Users can insert their own profile" ON "public"."user_profiles" AS PERMISSIVE FOR INSERT TO "authenticated"
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Users can update their own profile" ON "public"."user_profiles";
CREATE POLICY "Users can update their own profile" ON "public"."user_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id))
  WITH CHECK ((( SELECT ( SELECT auth.uid() AS uid) AS uid) = user_id));
DROP POLICY IF EXISTS "Admins can demote non-admin users only" ON "public"."user_roles";
CREATE POLICY "Admins can demote non-admin users only" ON "public"."user_roles" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING ((has_role(( SELECT auth.uid() AS uid), 'admin'::app_role) AND (user_id <> ( SELECT auth.uid() AS uid)) AND (role <> 'admin'::app_role)))
  WITH CHECK (((role = 'user'::app_role) AND (user_id <> ( SELECT auth.uid() AS uid))));
DROP POLICY IF EXISTS "Only admins can delete roles" ON "public"."user_roles";
CREATE POLICY "Only admins can delete roles" ON "public"."user_roles" AS PERMISSIVE FOR DELETE TO "authenticated"
  USING ((has_role(( SELECT auth.uid() AS uid), 'admin'::app_role) AND (user_id <> ( SELECT auth.uid() AS uid)) AND (role <> 'admin'::app_role)));
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON "storage"."objects";
CREATE POLICY "Authenticated users can upload videos" ON "storage"."objects" AS PERMISSIVE FOR INSERT TO "authenticated"
  WITH CHECK (((bucket_id = 'videos'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));
DROP POLICY IF EXISTS "Users can delete their own test results" ON "storage"."objects";
CREATE POLICY "Users can delete their own test results" ON "storage"."objects" AS PERMISSIVE FOR DELETE TO public
  USING (((bucket_id = 'test-results'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));
DROP POLICY IF EXISTS "Users can delete their own videos" ON "storage"."objects";
CREATE POLICY "Users can delete their own videos" ON "storage"."objects" AS PERMISSIVE FOR DELETE TO public
  USING (((bucket_id = 'videos'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));
DROP POLICY IF EXISTS "Users can update their own test results" ON "storage"."objects";
CREATE POLICY "Users can update their own test results" ON "storage"."objects" AS PERMISSIVE FOR UPDATE TO public
  USING (((bucket_id = 'test-results'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));
DROP POLICY IF EXISTS "Users can update their own videos" ON "storage"."objects";
CREATE POLICY "Users can update their own videos" ON "storage"."objects" AS PERMISSIVE FOR UPDATE TO public
  USING (((bucket_id = 'videos'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));
DROP POLICY IF EXISTS "Users can upload their own test results" ON "storage"."objects";
CREATE POLICY "Users can upload their own test results" ON "storage"."objects" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK (((bucket_id = 'test-results'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));
DROP POLICY IF EXISTS "Users can upload their own videos" ON "storage"."objects";
CREATE POLICY "Users can upload their own videos" ON "storage"."objects" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK (((bucket_id = 'videos'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));
DROP POLICY IF EXISTS "Users can view their own test results" ON "storage"."objects";
CREATE POLICY "Users can view their own test results" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO public
  USING (((bucket_id = 'test-results'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));
DROP POLICY IF EXISTS "Users can view their own videos" ON "storage"."objects";
CREATE POLICY "Users can view their own videos" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO public
  USING (((bucket_id = 'videos'::text) AND ((( SELECT auth.uid() AS uid))::text = (storage.foldername(name))[1])));
DROP POLICY IF EXISTS "deny_all_access" ON "private"."admin_recovery_audit_log";
CREATE POLICY "deny_all_access" ON "private"."admin_recovery_audit_log" AS RESTRICTIVE FOR ALL TO public
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "deny_all_access" ON "private"."admin_recovery_rate_limits";
CREATE POLICY "deny_all_access" ON "private"."admin_recovery_rate_limits" AS RESTRICTIVE FOR ALL TO public
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."ai_operation_logs_2025";
CREATE POLICY "__deny_all_api" ON "public"."ai_operation_logs_2025" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."ai_operation_logs_2026";
CREATE POLICY "__deny_all_api" ON "public"."ai_operation_logs_2026" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."ai_operation_logs_2027";
CREATE POLICY "__deny_all_api" ON "public"."ai_operation_logs_2027" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."ai_operation_logs_2028";
CREATE POLICY "__deny_all_api" ON "public"."ai_operation_logs_2028" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "Audit logs: admins or own" ON "public"."audit_logs";
CREATE POLICY "Audit logs: admins or own" ON "public"."audit_logs" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING ((has_role(( SELECT auth.uid() AS uid), 'admin'::app_role) OR (( SELECT auth.uid() AS uid) = user_id)));
DROP POLICY IF EXISTS "blood_tests_public_read" ON "public"."blood_tests";
CREATE POLICY "blood_tests_public_read" ON "public"."blood_tests" AS PERMISSIVE FOR SELECT TO public
  USING (true);
DROP POLICY IF EXISTS "Admins delete categories" ON "public"."categories";
CREATE POLICY "Admins delete categories" ON "public"."categories" AS PERMISSIVE FOR DELETE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins insert categories" ON "public"."categories";
CREATE POLICY "Admins insert categories" ON "public"."categories" AS PERMISSIVE FOR INSERT TO "authenticated"
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins update categories" ON "public"."categories";
CREATE POLICY "Admins update categories" ON "public"."categories" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins delete aliases" ON "public"."category_aliases";
CREATE POLICY "Admins delete aliases" ON "public"."category_aliases" AS PERMISSIVE FOR DELETE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins insert aliases" ON "public"."category_aliases";
CREATE POLICY "Admins insert aliases" ON "public"."category_aliases" AS PERMISSIVE FOR INSERT TO "authenticated"
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins update aliases" ON "public"."category_aliases";
CREATE POLICY "Admins update aliases" ON "public"."category_aliases" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins delete slug redirects" ON "public"."category_slug_redirects";
CREATE POLICY "Admins delete slug redirects" ON "public"."category_slug_redirects" AS PERMISSIVE FOR DELETE TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins insert slug redirects" ON "public"."category_slug_redirects";
CREATE POLICY "Admins insert slug redirects" ON "public"."category_slug_redirects" AS PERMISSIVE FOR INSERT TO public
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins update slug redirects" ON "public"."category_slug_redirects";
CREATE POLICY "Admins update slug redirects" ON "public"."category_slug_redirects" AS PERMISSIVE FOR UPDATE TO public
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins delete mappings" ON "public"."category_test_mapping";
CREATE POLICY "Admins delete mappings" ON "public"."category_test_mapping" AS PERMISSIVE FOR DELETE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins insert mappings" ON "public"."category_test_mapping";
CREATE POLICY "Admins insert mappings" ON "public"."category_test_mapping" AS PERMISSIVE FOR INSERT TO "authenticated"
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins update mappings" ON "public"."category_test_mapping";
CREATE POLICY "Admins update mappings" ON "public"."category_test_mapping" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."funnel_events_2025";
CREATE POLICY "__deny_all_api" ON "public"."funnel_events_2025" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."funnel_events_2026";
CREATE POLICY "__deny_all_api" ON "public"."funnel_events_2026" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."funnel_events_2027";
CREATE POLICY "__deny_all_api" ON "public"."funnel_events_2027" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."funnel_events_2028";
CREATE POLICY "__deny_all_api" ON "public"."funnel_events_2028" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "lola_products_admin_delete" ON "public"."lola_health_products";
CREATE POLICY "lola_products_admin_delete" ON "public"."lola_health_products" AS PERMISSIVE FOR DELETE TO "authenticated", "dashboard_user"
  USING (has_role(( SELECT ( SELECT auth.uid() AS uid) AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "lola_products_admin_insert" ON "public"."lola_health_products";
CREATE POLICY "lola_products_admin_insert" ON "public"."lola_health_products" AS PERMISSIVE FOR INSERT TO "authenticated", "dashboard_user"
  WITH CHECK (has_role(( SELECT ( SELECT auth.uid() AS uid) AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "lola_products_admin_update" ON "public"."lola_health_products";
CREATE POLICY "lola_products_admin_update" ON "public"."lola_health_products" AS PERMISSIVE FOR UPDATE TO "authenticated", "dashboard_user"
  USING (has_role(( SELECT ( SELECT auth.uid() AS uid) AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT ( SELECT auth.uid() AS uid) AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Notification history: admins or own" ON "public"."notification_history";
CREATE POLICY "Notification history: admins or own" ON "public"."notification_history" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING ((has_role(( SELECT auth.uid() AS uid), 'admin'::app_role) OR (( SELECT auth.uid() AS uid) = user_id)));
DROP POLICY IF EXISTS "Orders: admins or own" ON "public"."orders";
CREATE POLICY "Orders: admins or own" ON "public"."orders" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING ((has_role(( SELECT auth.uid() AS uid), 'admin'::app_role) OR (( SELECT auth.uid() AS uid) = user_id)));
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."platform_metrics_2025";
CREATE POLICY "__deny_all_api" ON "public"."platform_metrics_2025" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."platform_metrics_2026";
CREATE POLICY "__deny_all_api" ON "public"."platform_metrics_2026" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."platform_metrics_2027";
CREATE POLICY "__deny_all_api" ON "public"."platform_metrics_2027" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."platform_metrics_2028";
CREATE POLICY "__deny_all_api" ON "public"."platform_metrics_2028" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "Price updates: public can select" ON "public"."price_updates";
CREATE POLICY "Price updates: public can select" ON "public"."price_updates" AS PERMISSIVE FOR SELECT TO public
  USING (true);
DROP POLICY IF EXISTS "Admins delete biomarker products" ON "public"."provider_biomarker_products";
CREATE POLICY "Admins delete biomarker products" ON "public"."provider_biomarker_products" AS PERMISSIVE FOR DELETE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins insert biomarker products" ON "public"."provider_biomarker_products";
CREATE POLICY "Admins insert biomarker products" ON "public"."provider_biomarker_products" AS PERMISSIVE FOR INSERT TO "authenticated"
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins update biomarker products" ON "public"."provider_biomarker_products";
CREATE POLICY "Admins update biomarker products" ON "public"."provider_biomarker_products" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins delete section map" ON "public"."provider_section_category_map";
CREATE POLICY "Admins delete section map" ON "public"."provider_section_category_map" AS PERMISSIVE FOR DELETE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins insert section map" ON "public"."provider_section_category_map";
CREATE POLICY "Admins insert section map" ON "public"."provider_section_category_map" AS PERMISSIVE FOR INSERT TO "authenticated"
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Admins update section map" ON "public"."provider_section_category_map";
CREATE POLICY "Admins update section map" ON "public"."provider_section_category_map" AS PERMISSIVE FOR UPDATE TO "authenticated"
  USING (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role))
  WITH CHECK (has_role(( SELECT auth.uid() AS uid), 'admin'::app_role));
DROP POLICY IF EXISTS "Insert results (admin or own)" ON "public"."test_results";
CREATE POLICY "Insert results (admin or own)" ON "public"."test_results" AS PERMISSIVE FOR INSERT TO "authenticated"
  WITH CHECK ((has_role(( SELECT ( SELECT auth.uid() AS uid) AS uid), 'admin'::app_role) OR (user_id = ( SELECT ( SELECT auth.uid() AS uid) AS uid))));
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."user_events_2025";
CREATE POLICY "__deny_all_api" ON "public"."user_events_2025" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."user_events_2026";
CREATE POLICY "__deny_all_api" ON "public"."user_events_2026" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."user_events_2027";
CREATE POLICY "__deny_all_api" ON "public"."user_events_2027" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "__deny_all_api" ON "public"."user_events_2028";
CREATE POLICY "__deny_all_api" ON "public"."user_events_2028" AS PERMISSIVE FOR ALL TO "anon", "authenticated"
  USING (false)
  WITH CHECK (false);
DROP POLICY IF EXISTS "User profiles: admins or own" ON "public"."user_profiles";
CREATE POLICY "User profiles: admins or own" ON "public"."user_profiles" AS PERMISSIVE FOR SELECT TO "authenticated"
  USING ((has_role(( SELECT auth.uid() AS uid), 'admin'::app_role) OR (( SELECT auth.uid() AS uid) = user_id)));
DROP POLICY IF EXISTS "View roles (admin or own)" ON "public"."user_roles";
CREATE POLICY "View roles (admin or own)" ON "public"."user_roles" AS PERMISSIVE FOR SELECT TO public
  USING ((has_role(( SELECT ( SELECT auth.uid() AS uid) AS uid), 'admin'::app_role) OR (user_id = ( SELECT ( SELECT auth.uid() AS uid) AS uid))));
DROP POLICY IF EXISTS "Anonymous users cannot access realtime messages" ON "realtime"."messages";
CREATE POLICY "Anonymous users cannot access realtime messages" ON "realtime"."messages" AS PERMISSIVE FOR SELECT TO "anon"
  USING (false);

-- 9. Realtime publication membership.
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'private' AND tablename = 'admin_recovery_audit_log') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "private"."admin_recovery_audit_log"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'private' AND tablename = 'admin_recovery_rate_limits') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "private"."admin_recovery_rate_limits"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'audit_logs') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."audit_logs"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'biomarker_audit_runs') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."biomarker_audit_runs"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'biomarker_hub') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."biomarker_hub"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'biomarker_readings') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."biomarker_readings"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'categories') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."categories"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'favorites') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."favorites"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'health_queries') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."health_queries"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'live_comparison_panels') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."live_comparison_panels"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'lola_health_products') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."lola_health_products"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notification_history') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."notification_history"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'popular_test_enrichment_cache') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."popular_test_enrichment_cache"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'price_history') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."price_history"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'saved_comparisons') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."saved_comparisons"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'saved_providers') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."saved_providers"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'test_categories') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."test_categories"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'tests_master') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."tests_master"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'user_health_data') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."user_health_data"; END IF; END $p$;
DO $p$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'user_preferences') THEN ALTER PUBLICATION "supabase_realtime" ADD TABLE "public"."user_preferences"; END IF; END $p$;
DO $p$ BEGIN IF EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'engine_audit_log') THEN ALTER PUBLICATION "supabase_realtime" DROP TABLE "public"."engine_audit_log"; END IF; END $p$;

-- 10. Storage bucket settings.
UPDATE storage.buckets SET file_size_limit = 20971520 WHERE id = 'test-results';

-- 11. Scheduled jobs. Every command reads its credentials from Vault; on a
--     database without those Vault secrets the calls fail harmlessly.
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'mhc-thriva';
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'run-all-scrapers-every-6-hours';
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'run-all-scrapers-nightly';
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'scrape-and-verify-twice-daily';
SELECT cron.schedule('apply-audit-retention-weekly', '15 3 * * 0', $cron$ SELECT public.run_logged_cleanup('apply-audit-retention', 'SELECT public.apply_audit_retention()'); $cron$);
SELECT cron.schedule('check-price-alerts-every-6-hours-v2', '0 1,7,13,19 * * *', $cron$
    select public.call_edge_with_automations(
      'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/price-alert-checker',
      jsonb_build_object('time', now())
    );
  $cron$);
SELECT cron.schedule('cleanup-cron-log-weekly', '30 3 * * 0', $cron$ select public.cleanup_cron_run_log(); $cron$);
SELECT cron.schedule('cleanup-csp-reports-weekly', '15 3 * * 0', $cron$ select public.run_logged_cleanup('cleanup_csp_reports', 'DELETE FROM public.csp_reports WHERE received_at < now() - INTERVAL ''30 days'''); $cron$);
SELECT cron.schedule('cleanup-rate-limits-hourly', '5 * * * *', $cron$ select public.run_logged_cleanup('cleanup_old_rate_limits', 'DELETE FROM public.api_rate_limits WHERE window_start < NOW() - INTERVAL ''1 hour'''); $cron$);
SELECT cron.schedule('gsc-resubmit-sitemap-daily', '0 6 * * *', $cron$select public.call_edge_with_service_role(
      'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/gsc-resubmit-sitemap',
      '{}'::jsonb
    );$cron$);
SELECT cron.schedule('mhc-clinilabs', '6 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-shopify-sync?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&provider=clinilabs&page=1', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-goodbody', '10 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-shopify-rich-sync?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&provider=goodbody-clinic', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-lml', '20 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-lml-scrape?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&limit=40', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-lola', '8 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-shopify-sync?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&provider=lola-health&page=1', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-london-health', '12 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-shopify-rich-sync?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&provider=london-health-company', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-medical-diagnosis-b1', '16 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-page-scrape?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&provider=medical-diagnosis&offset=0&limit=30', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-medical-diagnosis-b2', '19 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-page-scrape?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&provider=medical-diagnosis&offset=30&limit=30', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-medical-diagnosis-b3', '22 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-page-scrape?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&provider=medical-diagnosis&offset=60&limit=30', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-medical-diagnosis-b4', '25 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-page-scrape?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&provider=medical-diagnosis&offset=90&limit=30', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-medical-diagnosis-b5', '28 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-page-scrape?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&provider=medical-diagnosis&offset=120&limit=30', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-medichecks-p1', '0 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-medichecks-sync?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&page=1', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-medichecks-p2', '2 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-medichecks-sync?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&page=2', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-medichecks-p3', '4 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-medichecks-sync?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&page=3', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('mhc-nightly-scrape-health-check', '0 3 * * *', $cron$
    select public.call_edge_with_automations(
      'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/scraper-health-check',
      jsonb_build_object('scheduled', true, 'time', now())
    );
  $cron$);
SELECT cron.schedule('mhc-randox', '14 */6 * * *', $cron$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-randox-scrape?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&limit=40', timeout_milliseconds:=120000)$cron$);
SELECT cron.schedule('promote-provider-tests-6h', '35 */6 * * *', $cron$select public.call_edge_with_service_role('https://clvuioagsgfadynuvodj.supabase.co/functions/v1/promote-provider-tests', jsonb_build_object('since', (now() - interval '7 hours')::text));$cron$);
SELECT cron.schedule('refresh-live-comparison-panels-6h', '0 */6 * * *', $cron$
  SELECT public.call_edge_with_service_role(
    'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/refresh-live-comparison-panels',
    '{}'::jsonb
  );
  $cron$);
SELECT cron.schedule('refresh-popular-tests-daily', '30 4 * * *', $cron$
    select public.call_edge_with_automations(
      'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/scrape-popular-tests',
      jsonb_build_object('scheduled', true, 'time', now())
    );
  $cron$);
SELECT cron.schedule('soc-cluster-every-5-min', '*/5 * * * *', $cron$
  select public.call_edge_with_service_role(
    'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/soc-cluster'
  );
  $cron$);

-- 12. Event triggers (last, so they apply only to objects created from here on,
--     as in production).
DO $e$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_event_trigger WHERE evtname = 'ensure_rls') THEN CREATE EVENT TRIGGER "ensure_rls" ON ddl_command_end WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO') EXECUTE FUNCTION public.rls_auto_enable(); END IF; END $e$;

-- 13. Column-level privileges. Production has none; earlier migrations left
--     redundant column grants on test_categories that production no longer has.
--     (Table-level privileges on test_categories are unchanged and match production.)
REVOKE SELECT (id, name, provider_id, display_order, created_at, last_price_update) ON public.test_categories FROM anon, authenticated;

-- 14. Comments set in production outside any migration.
COMMENT ON COLUMN public.saved_providers.notes IS 'ISO, CQC, UKAS accredited labs';
