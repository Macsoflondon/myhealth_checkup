-- Revoke EXECUTE from anon/authenticated on SECURITY DEFINER functions that should not be publicly callable
REVOKE EXECUTE ON FUNCTION public.restrict_health_insights_update() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_audit_log_user_id() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.audit_health_insights_insert() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_health_queries() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_rate_limits() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.log_data_access() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.lov_tables_without_policies() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.sanitize_scraping_job_error() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.log_sensitive_data_access() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_health_insight_creator() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.validate_encrypted_fields() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;

-- has_role and is_current_user_admin are referenced in RLS policies; RLS evaluation works regardless of EXECUTE grants.
-- Keep them callable by authenticated users since the app uses supabase.rpc('has_role', ...) for client-side admin checks.
-- Revoke from anon to prevent unauthenticated probing.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_current_user_admin() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;