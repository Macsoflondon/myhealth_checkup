-- Evaluate auth.uid() and has_role() once per query, not once per row.
-- Access rules are unchanged; only the evaluation plan improves.

-- Single-policy tables: wrap auth calls.
ALTER POLICY "Admins can read affiliate clicks" ON public.affiliate_clicks
  USING ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "Admins manage affiliate conversions" ON public.affiliate_conversions
  USING ((select public.has_role((select auth.uid()), 'admin'::public.app_role)))
  WITH CHECK ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "benchmark_cohort_policies admin manage" ON public.benchmark_cohort_policies
  USING ((select public.has_role((select auth.uid()), 'admin'::public.app_role)))
  WITH CHECK ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "health_profiles owner all" ON public.health_profiles
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));
ALTER POLICY "ingestion_adapters admin manage" ON public.ingestion_adapters
  USING ((select public.has_role((select auth.uid()), 'admin'::public.app_role)))
  WITH CHECK ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "ingestion_events admin read" ON public.ingestion_events
  USING ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "notification_channel_preferences own all" ON public.notification_channel_preferences
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));
ALTER POLICY "notification_events own read" ON public.notification_events
  USING (user_id = (select auth.uid()));
ALTER POLICY "Admins add plugin settings" ON public.os_plugin_settings
  WITH CHECK ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "Admins change plugin settings" ON public.os_plugin_settings
  USING ((select public.has_role((select auth.uid()), 'admin'::public.app_role)))
  WITH CHECK ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "Admins read plugin settings" ON public.os_plugin_settings
  USING ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "Admins read plugin snapshots" ON public.os_plugin_snapshots
  USING ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "Admins read plugin sync log" ON public.os_plugin_sync_log
  USING ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "admins read exclusions" ON public.provider_test_exclusions
  USING ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "Users can delete their own profile" ON public.user_profiles
  USING ((select auth.uid()) = user_id);

-- image_audit_results: service_role bypasses RLS, so the auth.role() policy
-- was redundant and made every signed-in read evaluate two policies.
DROP POLICY "Service role manage image_audit_results" ON public.image_audit_results;
CREATE POLICY "Service role manage image_audit_results" ON public.image_audit_results
  FOR ALL TO service_role USING (true) WITH CHECK (true);
ALTER POLICY "Admins read image_audit_results" ON public.image_audit_results
  USING ((select public.has_role((select auth.uid()), 'admin'::public.app_role)));

-- clinical_review_comments: merge the two read policies into one.
DROP POLICY "clinical_review_comments author read" ON public.clinical_review_comments;
DROP POLICY "clinical_review_comments subject read" ON public.clinical_review_comments;
CREATE POLICY "clinical_review_comments read" ON public.clinical_review_comments
  FOR SELECT TO authenticated
  USING (
    author_user_id = (select auth.uid())
    OR (is_released AND (
      (diagnostic_report_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.diagnostic_reports r
        WHERE r.id = clinical_review_comments.diagnostic_report_id
          AND private.owns_health_profile(r.health_profile_id)))
      OR (observation_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.observations o
        WHERE o.id = clinical_review_comments.observation_id
          AND private.owns_health_profile(o.health_profile_id)))
    ))
  );

-- Tables with an admin FOR ALL policy plus a read policy: split the admin
-- policy into write-only policies and fold admin access into the read policy,
-- so each SELECT evaluates one policy.
DO $$
DECLARE
  t text;
  p text;
  adm constant text := '(select public.has_role((select auth.uid()), ''admin''::public.app_role))';
BEGIN
  FOR t, p IN VALUES
    ('curated_test_profiles', 'curated_test_profiles admin manage'),
    ('curated_test_profile_biomarkers', 'curated_test_profile_biomarkers admin manage'),
    ('reference_range_contexts', 'reference_range_contexts admin manage'),
    ('organisations', 'organisations admin manage'),
    ('organisation_members', 'organisation_members admin manage')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', p, t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (%s)', t || ' admin insert', t, adm);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (%s) WITH CHECK (%s)', t || ' admin update', t, adm, adm);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (%s)', t || ' admin delete', t, adm);
  END LOOP;
END;
$$;

ALTER POLICY "curated_test_profiles public read published" ON public.curated_test_profiles
  USING (is_published OR (select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "curated_test_profile_biomarkers public read" ON public.curated_test_profile_biomarkers
  USING (
    EXISTS (SELECT 1 FROM public.curated_test_profiles p
            WHERE p.id = curated_test_profile_biomarkers.curated_test_profile_id AND p.is_published)
    OR (select public.has_role((select auth.uid()), 'admin'::public.app_role))
  );
ALTER POLICY "reference_range_contexts public read active" ON public.reference_range_contexts
  USING ((is_active AND governance_status = 'approved')
    OR (select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "organisations member read" ON public.organisations
  USING (private.is_org_member(id)
    OR (select public.has_role((select auth.uid()), 'admin'::public.app_role)));
ALTER POLICY "organisation_members self read" ON public.organisation_members
  USING (user_id = (select auth.uid())
    OR (select public.has_role((select auth.uid()), 'admin'::public.app_role)));

-- Cover foreign keys so joins and parent deletes do not scan child tables.
CREATE INDEX IF NOT EXISTS clinical_review_comments_diagnostic_report_id_idx ON public.clinical_review_comments (diagnostic_report_id);
CREATE INDEX IF NOT EXISTS clinical_review_comments_observation_id_idx ON public.clinical_review_comments (observation_id);
CREATE INDEX IF NOT EXISTS clinical_review_comments_organisation_id_idx ON public.clinical_review_comments (organisation_id);
CREATE INDEX IF NOT EXISTS clinical_review_comments_superseded_by_idx ON public.clinical_review_comments (superseded_by);
CREATE INDEX IF NOT EXISTS curated_test_profile_biomarkers_biomarker_id_idx ON public.curated_test_profile_biomarkers (biomarker_id);
CREATE INDEX IF NOT EXISTS data_sharing_grants_user_id_idx ON public.data_sharing_grants (user_id);
CREATE INDEX IF NOT EXISTS diagnostic_reports_ordering_organisation_id_idx ON public.diagnostic_reports (ordering_organisation_id);
CREATE INDEX IF NOT EXISTS diagnostic_reports_source_document_id_idx ON public.diagnostic_reports (source_document_id);
CREATE INDEX IF NOT EXISTS diagnostic_reports_superseded_by_idx ON public.diagnostic_reports (superseded_by);
CREATE INDEX IF NOT EXISTS ingestion_events_diagnostic_report_id_idx ON public.ingestion_events (diagnostic_report_id);
CREATE INDEX IF NOT EXISTS notification_channel_preferences_consent_record_id_idx ON public.notification_channel_preferences (consent_record_id);
CREATE INDEX IF NOT EXISTS notification_events_health_profile_id_idx ON public.notification_events (health_profile_id);
CREATE INDEX IF NOT EXISTS observations_biomarker_id_idx ON public.observations (biomarker_id);
CREATE INDEX IF NOT EXISTS observations_source_document_id_idx ON public.observations (source_document_id);
CREATE INDEX IF NOT EXISTS observations_specimen_id_idx ON public.observations (specimen_id);
CREATE INDEX IF NOT EXISTS observations_supersedes_observation_id_idx ON public.observations (supersedes_observation_id);
CREATE INDEX IF NOT EXISTS os_plugin_settings_updated_by_idx ON public.os_plugin_settings (updated_by);
CREATE INDEX IF NOT EXISTS reference_range_contexts_biomarker_id_idx ON public.reference_range_contexts (biomarker_id);
CREATE INDEX IF NOT EXISTS reference_range_contexts_clinical_reference_range_id_idx ON public.reference_range_contexts (clinical_reference_range_id);
CREATE INDEX IF NOT EXISTS saved_comparisons_user_id_idx ON public.saved_comparisons (user_id);
CREATE INDEX IF NOT EXISTS source_documents_clinical_patient_upload_id_idx ON public.source_documents (clinical_patient_upload_id);
CREATE INDEX IF NOT EXISTS specimens_diagnostic_report_id_idx ON public.specimens (diagnostic_report_id);