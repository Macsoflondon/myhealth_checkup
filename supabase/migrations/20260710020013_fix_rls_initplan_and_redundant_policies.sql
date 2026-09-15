
-- === Drop redundant policies that are fully subsumed by another policy on the same table/action ===
-- (verified: predicates are identical or the surviving policy already grants a superset)

DROP POLICY IF EXISTS "cp read admin" ON public.engine_checkpoints;
DROP POLICY IF EXISTS "freezes read admin" ON public.engine_freezes;
DROP POLICY IF EXISTS "runs read admin" ON public.engine_runs;
DROP POLICY IF EXISTS "admins read retention policy" ON public.audit_retention_policy;
DROP POLICY IF EXISTS "biomarker_read_all" ON public.biomarker_knowledge_hub;

-- === Rewrite remaining policies so auth.*() / has_role() are evaluated once per query, not once per row ===

-- audit_retention_policy
DROP POLICY IF EXISTS "admins manage retention policy" ON public.audit_retention_policy;
CREATE POLICY "admins manage retention policy" ON public.audit_retention_policy
  FOR ALL TO authenticated
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

-- biomarker_knowledge_hub
DROP POLICY IF EXISTS "biomarker_write_service" ON public.biomarker_knowledge_hub;
CREATE POLICY "biomarker_write_service" ON public.biomarker_knowledge_hub
  FOR ALL TO public
  USING ((select auth.role()) = 'service_role'::text);

-- recommendation_history
DROP POLICY IF EXISTS "rec_history_own_read" ON public.recommendation_history;
CREATE POLICY "rec_history_own_read" ON public.recommendation_history
  FOR SELECT TO authenticated
  USING (((select auth.uid())::text = user_id));

DROP POLICY IF EXISTS "rec_history_service_insert" ON public.recommendation_history;
CREATE POLICY "rec_history_service_insert" ON public.recommendation_history
  FOR INSERT TO public
  WITH CHECK ((select auth.role()) = 'service_role'::text);

DROP POLICY IF EXISTS "recommendation_history_insert_own" ON public.recommendation_history;
CREATE POLICY "recommendation_history_insert_own" ON public.recommendation_history
  FOR INSERT TO authenticated
  WITH CHECK (((select auth.uid()) IS NOT NULL) AND ((select auth.uid())::text = user_id));

-- fhir_export_jobs
DROP POLICY IF EXISTS "fhir_jobs_own_read" ON public.fhir_export_jobs;
CREATE POLICY "fhir_jobs_own_read" ON public.fhir_export_jobs
  FOR SELECT TO authenticated
  USING (((select auth.uid()) = user_id) OR has_role((select auth.uid()), 'admin'::app_role));

DROP POLICY IF EXISTS "fhir_jobs_own_insert" ON public.fhir_export_jobs;
CREATE POLICY "fhir_jobs_own_insert" ON public.fhir_export_jobs
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "fhir_jobs_own_update" ON public.fhir_export_jobs;
CREATE POLICY "fhir_jobs_own_update" ON public.fhir_export_jobs
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- data_sharing_grants
DROP POLICY IF EXISTS "sharing_grants_own_read" ON public.data_sharing_grants;
CREATE POLICY "sharing_grants_own_read" ON public.data_sharing_grants
  FOR SELECT TO authenticated
  USING (((select auth.uid()) = user_id) OR has_role((select auth.uid()), 'admin'::app_role));

DROP POLICY IF EXISTS "sharing_grants_own_insert" ON public.data_sharing_grants;
CREATE POLICY "sharing_grants_own_insert" ON public.data_sharing_grants
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "sharing_grants_own_update" ON public.data_sharing_grants;
CREATE POLICY "sharing_grants_own_update" ON public.data_sharing_grants
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- engine_audit_log
DROP POLICY IF EXISTS "audit read admin" ON public.engine_audit_log;
CREATE POLICY "audit read admin" ON public.engine_audit_log
  FOR SELECT TO authenticated
  USING (has_role((select auth.uid()), 'admin'::app_role));

DROP POLICY IF EXISTS "audit insert admin" ON public.engine_audit_log;
CREATE POLICY "audit insert admin" ON public.engine_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

-- engine_checkpoints
DROP POLICY IF EXISTS "cp write admin" ON public.engine_checkpoints;
CREATE POLICY "cp write admin" ON public.engine_checkpoints
  FOR ALL TO authenticated
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

-- engine_freezes
DROP POLICY IF EXISTS "freezes write admin" ON public.engine_freezes;
CREATE POLICY "freezes write admin" ON public.engine_freezes
  FOR ALL TO authenticated
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

-- engine_runs
DROP POLICY IF EXISTS "runs write admin" ON public.engine_runs;
CREATE POLICY "runs write admin" ON public.engine_runs
  FOR ALL TO authenticated
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

-- soc_incidents
DROP POLICY IF EXISTS "Admins view incidents" ON public.soc_incidents;
CREATE POLICY "Admins view incidents" ON public.soc_incidents
  FOR SELECT TO authenticated
  USING (has_role((select auth.uid()), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins update incidents" ON public.soc_incidents;
CREATE POLICY "Admins update incidents" ON public.soc_incidents
  FOR UPDATE TO authenticated
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins insert incidents" ON public.soc_incidents;
CREATE POLICY "Admins insert incidents" ON public.soc_incidents
  FOR INSERT TO authenticated
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

-- soc_incident_events
DROP POLICY IF EXISTS "Admins view incident events" ON public.soc_incident_events;
CREATE POLICY "Admins view incident events" ON public.soc_incident_events
  FOR SELECT TO authenticated
  USING (has_role((select auth.uid()), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins insert incident events" ON public.soc_incident_events;
CREATE POLICY "Admins insert incident events" ON public.soc_incident_events
  FOR INSERT TO authenticated
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) AND (actor_id = (select auth.uid())));

-- web_vitals
DROP POLICY IF EXISTS "Admins view web vitals" ON public.web_vitals;
CREATE POLICY "Admins view web vitals" ON public.web_vitals
  FOR SELECT TO authenticated
  USING (has_role((select auth.uid()), 'admin'::app_role));

-- profiles
DROP POLICY IF EXISTS "profiles self read" ON public.profiles;
CREATE POLICY "profiles self read" ON public.profiles
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "profiles self insert" ON public.profiles;
CREATE POLICY "profiles self insert" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "profiles self update" ON public.profiles;
CREATE POLICY "profiles self update" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id);

-- === Drop duplicate index ===
DROP INDEX IF EXISTS public.idx_csp_reports_received_at;
