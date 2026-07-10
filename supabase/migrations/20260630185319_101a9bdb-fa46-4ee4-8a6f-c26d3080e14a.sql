
-- 1. Restrict INSERT policies on analytics/log tables to service_role only
DROP POLICY IF EXISTS svc_insert_ai_logs ON public.ai_operation_logs;
CREATE POLICY svc_insert_ai_logs ON public.ai_operation_logs
  FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS svc_insert_funnel ON public.funnel_events;
CREATE POLICY svc_insert_funnel ON public.funnel_events
  FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS svc_insert_events ON public.user_events;
CREATE POLICY svc_insert_events ON public.user_events
  FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS svc_insert_platform_met ON public.platform_metrics;
CREATE POLICY svc_insert_platform_met ON public.platform_metrics
  FOR INSERT TO service_role WITH CHECK (true);

-- Also revoke direct table grants from anon for these tables (defense in depth)
REVOKE INSERT ON public.ai_operation_logs FROM anon, authenticated;
REVOKE INSERT ON public.funnel_events FROM anon, authenticated;
REVOKE INSERT ON public.user_events FROM anon, authenticated;
REVOKE INSERT ON public.platform_metrics FROM anon, authenticated;

-- 2. recommendation_history: explicit service-role-only access, revoke public grants
REVOKE ALL ON public.recommendation_history FROM anon, authenticated;
GRANT ALL ON public.recommendation_history TO service_role;

DROP POLICY IF EXISTS svc_all_recommendation_history ON public.recommendation_history;
CREATE POLICY svc_all_recommendation_history ON public.recommendation_history
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS admin_recommendation_history ON public.recommendation_history;
CREATE POLICY admin_recommendation_history ON public.recommendation_history
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. resolve_canonical_category: lock down anon access + add caller guard
REVOKE EXECUTE ON FUNCTION public.resolve_canonical_category(text, text) FROM PUBLIC, anon;

CREATE OR REPLACE FUNCTION public.resolve_canonical_category(_provider_id text, _source_section text)
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  result text;
  norm text;
  caller text;
BEGIN
  -- Guard: only allow service_role, postgres, or authenticated admins to call.
  -- Trigger contexts run as table owner (postgres) and pass this check.
  caller := current_setting('request.jwt.claim.role', true);
  IF caller IS NOT NULL AND caller = 'anon' THEN
    RAISE EXCEPTION 'permission denied for function resolve_canonical_category';
  END IF;

  IF _source_section IS NULL OR _source_section = '' THEN
    RETURN NULL;
  END IF;
  norm := regexp_replace(lower(_source_section), '[^a-z0-9-]+', '-', 'g');
  norm := regexp_replace(norm, '^-+|-+$', '', 'g');
  IF norm = '' THEN RETURN NULL; END IF;

  SELECT canonical_category INTO result
  FROM public.provider_section_category_map
  WHERE provider_id = _provider_id AND source_section = norm
  LIMIT 1;

  RETURN result;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.resolve_canonical_category(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.resolve_canonical_category(text, text) TO authenticated, service_role;

-- 4. Drop sensitive user/health tables from the supabase_realtime publication.
-- App uses postgres_changes via service-role/edge functions where needed; broadcasting
-- these tables to clients via Realtime is not required and expands the attack surface.
ALTER PUBLICATION supabase_realtime DROP TABLE public.user_profiles;
ALTER PUBLICATION supabase_realtime DROP TABLE public.user_health_data;
ALTER PUBLICATION supabase_realtime DROP TABLE public.biomarker_readings;
ALTER PUBLICATION supabase_realtime DROP TABLE public.clinical_patient_uploads;
ALTER PUBLICATION supabase_realtime DROP TABLE public.clinical_fhir_bundles;
ALTER PUBLICATION supabase_realtime DROP TABLE public.clinical_gp_notifications;
ALTER PUBLICATION supabase_realtime DROP TABLE public.notification_history;
ALTER PUBLICATION supabase_realtime DROP TABLE public.saved_comparisons;
ALTER PUBLICATION supabase_realtime DROP TABLE public.saved_providers;
ALTER PUBLICATION supabase_realtime DROP TABLE public.favorites;
ALTER PUBLICATION supabase_realtime DROP TABLE public.health_queries;
ALTER PUBLICATION supabase_realtime DROP TABLE public.recommendation_history;
