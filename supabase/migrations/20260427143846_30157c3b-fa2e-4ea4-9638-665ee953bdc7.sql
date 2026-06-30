
-- Lock down SECURITY DEFINER functions that should NOT be executable by anon/authenticated.
-- Trigger functions are invoked by Postgres internally and never need direct EXECUTE
-- grants from clients. Maintenance/cron functions should only run as the postgres or
-- service role.

-- Trigger-only functions: revoke direct EXECUTE from PUBLIC, anon, authenticated.
REVOKE EXECUTE ON FUNCTION public.audit_health_insights_insert() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_data_access() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_sensitive_data_access() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.restrict_health_insights_update() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sanitize_scraping_job_error() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_audit_log_user_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_health_insight_creator() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_encrypted_fields() FROM PUBLIC, anon, authenticated;

-- Maintenance/cleanup functions — service_role/cron only.
REVOKE EXECUTE ON FUNCTION public.cleanup_old_health_queries() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_rate_limits() FROM PUBLIC, anon, authenticated;

-- Add an explicit service_role INSERT policy on newsletter_subscribers so the flow
-- remains explicit and survives any future force-RLS toggle. (service_role bypasses RLS
-- by default, this is a belt-and-braces clarification.)
DROP POLICY IF EXISTS "Service role can insert subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Service role can insert subscribers"
  ON public.newsletter_subscribers
  FOR INSERT
  TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can update subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Service role can update subscribers"
  ON public.newsletter_subscribers
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add an explicit service_role INSERT policy on user_roles for the same reason. The
-- handle_new_user_profile() trigger runs as SECURITY DEFINER (postgres) so it already
-- bypasses RLS, but this makes the contract explicit for any future service_role
-- driven role assignment from edge functions.
DROP POLICY IF EXISTS "Service role can manage roles" ON public.user_roles;
CREATE POLICY "Service role can manage roles"
  ON public.user_roles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
