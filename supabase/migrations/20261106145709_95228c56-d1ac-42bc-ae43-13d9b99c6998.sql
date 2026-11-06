-- Public write lockdown: no anonymous visitor writes directly to the database.
DROP POLICY IF EXISTS "Anyone can log an affiliate click" ON public.affiliate_clicks;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLES FROM anon;

-- Per-visitor click rate limit, keyed on a salted IP hash (raw IP never stored).
CREATE TABLE IF NOT EXISTS public.affiliate_click_rate_limits (
  ip_hash text NOT NULL,
  window_start timestamptz NOT NULL,
  hits integer NOT NULL DEFAULT 0,
  PRIMARY KEY (ip_hash, window_start)
);
GRANT ALL ON public.affiliate_click_rate_limits TO service_role;
ALTER TABLE public.affiliate_click_rate_limits ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (bypasses RLS) may touch it.

CREATE OR REPLACE FUNCTION public.affiliate_click_rate_hit(p_ip_hash text, p_limit integer DEFAULT 20)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  w timestamptz := to_timestamp(floor(extract(epoch FROM now()) / 600) * 600);
  n integer;
BEGIN
  IF p_ip_hash IS NULL OR length(p_ip_hash) <> 64 THEN RETURN false; END IF;
  INSERT INTO public.affiliate_click_rate_limits (ip_hash, window_start, hits)
  VALUES (p_ip_hash, w, 1)
  ON CONFLICT (ip_hash, window_start) DO UPDATE SET hits = affiliate_click_rate_limits.hits + 1
  RETURNING hits INTO n;
  DELETE FROM public.affiliate_click_rate_limits WHERE window_start < now() - interval '1 hour';
  RETURN n <= p_limit;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.affiliate_click_rate_hit(text, integer) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.affiliate_click_rate_hit(text, integer) TO service_role;

-- Admin-only writes require a two-factor (aal2) session at the database layer.
DO $$
DECLARE t record;
BEGIN
  FOR t IN
    SELECT DISTINCT p.tablename
    FROM pg_policies p
    WHERE p.schemaname = 'public'
      AND p.cmd IN ('INSERT','UPDATE','DELETE','ALL')
      AND p.tablename NOT LIKE '%biomarker%'
      AND coalesce(p.qual,'') || coalesce(p.with_check,'') LIKE '%has_role%admin%'
      AND coalesce(p.qual,'') || coalesce(p.with_check,'') NOT LIKE '%= user_id%'
      AND coalesce(p.qual,'') || coalesce(p.with_check,'') NOT LIKE '%user_id =%'
      AND NOT EXISTS (
        SELECT 1 FROM pg_policies q
        WHERE q.schemaname='public' AND q.tablename=p.tablename
          AND q.cmd IN ('INSERT','UPDATE','DELETE','ALL')
          AND coalesce(q.qual,'') || coalesce(q.with_check,'') LIKE '%auth.uid()%= user_id%')
  LOOP
    BEGIN
    EXECUTE format('DROP POLICY IF EXISTS admin_writes_require_mfa_ins ON public.%I', t.tablename);
    EXECUTE format('DROP POLICY IF EXISTS admin_writes_require_mfa_upd ON public.%I', t.tablename);
    EXECUTE format('DROP POLICY IF EXISTS admin_writes_require_mfa_del ON public.%I', t.tablename);
    EXECUTE format($f$CREATE POLICY admin_writes_require_mfa_ins ON public.%I AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK ((SELECT auth.jwt() ->> 'aal') = 'aal2')$f$, t.tablename);
    EXECUTE format($f$CREATE POLICY admin_writes_require_mfa_upd ON public.%I AS RESTRICTIVE FOR UPDATE TO authenticated USING ((SELECT auth.jwt() ->> 'aal') = 'aal2')$f$, t.tablename);
    EXECUTE format($f$CREATE POLICY admin_writes_require_mfa_del ON public.%I AS RESTRICTIVE FOR DELETE TO authenticated USING ((SELECT auth.jwt() ->> 'aal') = 'aal2')$f$, t.tablename);
    EXCEPTION WHEN insufficient_privilege THEN
      RAISE NOTICE 'skipped guarded table %', t.tablename;
    END;
  END LOOP;
END $$;

-- Rollback:
-- CREATE POLICY "Anyone can log an affiliate click" ON public.affiliate_clicks FOR INSERT TO anon, authenticated WITH CHECK (clicked_at >= now() - interval '5 minutes' AND clicked_at <= now() + interval '5 minutes');
-- GRANT INSERT ON public.affiliate_clicks TO anon;
-- DROP FUNCTION public.affiliate_click_rate_hit(text, integer); DROP TABLE public.affiliate_click_rate_limits;
-- For each table: DROP POLICY admin_writes_require_mfa_ins/upd/del ON public.<table>;