-- 1) Engine tables: admin-only SELECT
DROP POLICY IF EXISTS "audit read auth" ON public.engine_audit_log;
CREATE POLICY "audit read admin" ON public.engine_audit_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "cp read auth" ON public.engine_checkpoints;
CREATE POLICY "cp read admin" ON public.engine_checkpoints
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "freezes read auth" ON public.engine_freezes;
CREATE POLICY "freezes read admin" ON public.engine_freezes
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "runs read auth" ON public.engine_runs;
CREATE POLICY "runs read admin" ON public.engine_runs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) recommendation_history: drop blanket 'guest' visibility (out-of-band table — guard)
DO $$
BEGIN
  DROP POLICY IF EXISTS "recommendation_history_own_read" ON public.recommendation_history;
  DROP POLICY IF EXISTS "rec_history_user_read" ON public.recommendation_history;
  CREATE POLICY "rec_history_own_read" ON public.recommendation_history
    FOR SELECT TO authenticated
    USING ((auth.uid())::text = user_id);
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- 3) SECURITY DEFINER function search_path fix
CREATE OR REPLACE FUNCTION public.cleanup_expired_recommendations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.recommendation_history
  WHERE data_retention_expiry < NOW();
END;
$$;

-- 4) Revoke authenticated EXECUTE on SECURITY DEFINER match_biomarkers (out-of-band function — guard)
DO $$
BEGIN
  REVOKE EXECUTE ON FUNCTION public.match_biomarkers(extensions.vector, double precision, integer) FROM authenticated, anon, PUBLIC;
  GRANT EXECUTE ON FUNCTION public.match_biomarkers(extensions.vector, double precision, integer) TO service_role;
EXCEPTION WHEN undefined_function OR undefined_object THEN NULL;
END $$;