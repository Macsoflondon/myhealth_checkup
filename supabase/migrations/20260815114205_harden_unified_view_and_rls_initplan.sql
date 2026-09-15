-- 1. Fix SECURITY DEFINER view flagged by the Supabase security linter (ERROR level).
--    unified_provider_tests was bypassing the querying user's RLS. Switch it to
--    SECURITY INVOKER so it respects the caller's own row-level security, matching
--    the same fix already applied to comparison_test_groups on 2026-08-13.
--    Underlying tables (provider_tests, provider_test_mapping) already allow public
--    SELECT via their own RLS policies, so this does not remove any data the public
--    site currently shows.
ALTER VIEW public.unified_provider_tests SET (security_invoker = on);

-- 2. The view had blanket INSERT/UPDATE/DELETE/TRUNCATE grants to anon and
--    authenticated left over from its creation. The view has no INSTEAD OF triggers
--    so these were not currently exploitable, but they should not exist on a
--    public-facing view of commercial catalogue data. Restrict to read-only.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON public.unified_provider_tests FROM anon, authenticated;
GRANT SELECT ON public.unified_provider_tests TO anon, authenticated;

-- 3. Close out the remaining "Auth RLS Initialization Plan" performance/security
--    lints: wrap auth.uid()/auth.jwt() calls in a scalar subselect so Postgres
--    evaluates them once per query instead of once per row. Same pattern already
--    used elsewhere in this schema (see fix_rls_initplan_and_redundant_policies,
--    2026-07-10) and on the other policies on these same tables.
ALTER POLICY "Users can view their own backup codes" ON public.mfa_backup_codes
  USING ((select auth.uid()) = user_id);

ALTER POLICY "Admins manage apify provider configs" ON public.apify_provider_configs
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

ALTER POLICY "Admins can view scrape runs" ON public.scrape_runs
  USING (has_role((select auth.uid()), 'admin'::app_role));

ALTER POLICY "Admins can view provider test history" ON public.provider_test_history
  USING (has_role((select auth.uid()), 'admin'::app_role));

ALTER POLICY "Subscribers can view own record" ON public.newsletter_subscribers
  USING (lower(email) = lower(COALESCE(((select auth.jwt()) ->> 'email'::text), ''::text)));

-- 4. Add the two missing foreign-key indexes flagged on admin_recovery_tokens —
--    this table sits on the account-recovery path, so slow lookups here matter
--    for incident response as well as performance.
CREATE INDEX IF NOT EXISTS idx_admin_recovery_tokens_issued_by
  ON public.admin_recovery_tokens (issued_by);
CREATE INDEX IF NOT EXISTS idx_admin_recovery_tokens_target_user_id
  ON public.admin_recovery_tokens (target_user_id);
CREATE INDEX IF NOT EXISTS idx_soc_incidents_assignee_id
  ON public.soc_incidents (assignee_id);
