-- Restored verbatim from supabase_migrations.schema_migrations (version 20260930151340, name launch_blockers_funnel_insert_and_mhc_sync_secret_rpc).
-- md5 of the recorded statements: cd8989f5288c105e7ee4657baea00f7b
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Launch-blocker fixes (platform audit, 30 Sep 2026)
--
-- 1. funnel_events: the front end (src/lib/funnelTracking.ts) inserts one row per
--    Book click / quiz start / quiz complete as the anon or authenticated role.
--    The 2026-09-27 reconciliation left those roles with SELECT/UPDATE/DELETE but
--    no INSERT, and the only policy is admin-only, so every click has failed with
--    HTTP 401 and no real funnel data has ever been recorded. Grant INSERT with a
--    tightly scoped policy, and drop the write privileges the browser roles never
--    needed (RLS already blocked them; this is defence in depth).
--
-- 2. Purge the July demo/seed rows from funnel_events and revenue_events. They are
--    the only rows in both tables and Crux Control > Historical Analytics renders
--    them as if they were real traffic and commission.
--
-- 3. mhc_sync_secret(): the mhc-* scraper functions compare ?secret= against the
--    MHC_SYNC_SECRET edge-function secret, while the cron jobs read the value from
--    Vault (mhc_sync_secret). When the functions were redeployed on 2026-09-29
--    without that env var, every 6-hourly run has returned 401. This RPC lets the
--    functions (running as service_role) read the same Vault entry as the cron jobs,
--    so the two sides cannot drift apart again. EXECUTE is limited to service_role.

-- ---------------------------------------------------------------------------
-- 1. funnel_events write access for the browser roles
-- ---------------------------------------------------------------------------
REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.funnel_events FROM anon, authenticated;
GRANT INSERT ON public.funnel_events TO anon, authenticated;

DROP POLICY IF EXISTS "public_insert_funnel_events" ON public.funnel_events;
CREATE POLICY "public_insert_funnel_events"
  ON public.funnel_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    funnel_stage IN ('quiz_start', 'quiz_complete', 'provider_click')
    AND session_id IS NOT NULL
    AND length(session_id) BETWEEN 8 AND 64
    AND (anonymous_id IS NULL OR length(anonymous_id) <= 64)
    AND (user_id IS NULL OR user_id = (SELECT auth.uid()))
    AND (revenue_amount IS NULL OR revenue_amount >= 0)
    AND (entity_name IS NULL OR length(entity_name) <= 300)
    AND (entity_id IS NULL OR length(entity_id) <= 128)
    AND (provider_id IS NULL OR length(provider_id) <= 64)
  );

COMMENT ON POLICY "public_insert_funnel_events" ON public.funnel_events IS
  'Browser clients may append quiz/provider-click funnel events for their own session. Reads remain admin-only (admin_funnel).';

-- ---------------------------------------------------------------------------
-- 2. Remove demo/seed analytics rows
-- ---------------------------------------------------------------------------
DELETE FROM public.revenue_events
  WHERE session_id LIKE 'demo-session-%' OR session_id LIKE 'seed-session-%'
     OR order_reference LIKE 'ORD-DEMO-%' OR order_reference LIKE 'ORD-SEED-%';
DELETE FROM public.funnel_events
  WHERE session_id LIKE 'demo-session-%' OR session_id LIKE 'seed-session-%';

-- ---------------------------------------------------------------------------
-- 3. Vault-backed sync secret for the mhc-* scraper functions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.mhc_sync_secret()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT s.decrypted_secret
    FROM vault.decrypted_secrets s
   WHERE s.name = 'mhc_sync_secret'
   ORDER BY s.created_at DESC
   LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.mhc_sync_secret() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.mhc_sync_secret() FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mhc_sync_secret() TO service_role;

COMMENT ON FUNCTION public.mhc_sync_secret() IS
  'Returns the shared mhc-* scraper sync secret from Vault. service_role only; used by the mhc-* edge functions to validate ?secret= against the same value the cron jobs send.';
