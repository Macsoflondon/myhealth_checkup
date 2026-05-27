-- 1. Revoke EXECUTE from anon/authenticated/public on internal SECURITY DEFINER
--    functions. Triggers and cron-invoked functions don't need direct callability.
DO $$
DECLARE
  fn text;
  internal_fns text[] := ARRAY[
    'set_audit_log_user_id()',
    'audit_health_insights_insert()',
    'handle_new_user_profile()',
    'cleanup_old_health_queries()',
    'cleanup_old_rate_limits()',
    'log_data_access()',
    'detect_protected_call_abuse()',
    'log_role_change()',
    'sanitize_scraping_job_error()',
    'lov_tables_without_policies()',
    'cleanup_protected_call_log()',
    'log_sensitive_data_access()',
    'set_health_insight_creator()',
    'cleanup_role_audit_log()',
    'update_updated_at_column()',
    'sanitize_protected_call_log()',
    'restrict_health_insights_update()',
    'validate_encrypted_fields()'
  ];
BEGIN
  FOREACH fn IN ARRAY internal_fns LOOP
    BEGIN
      EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', fn);
    EXCEPTION WHEN undefined_function THEN
      RAISE NOTICE 'skip missing function %', fn;
    END;
  END LOOP;
END $$;

-- 2. user_profiles: explicit admin SELECT policy.
CREATE POLICY "Admins can view all user profiles"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. notification_history: explicit block for authenticated INSERT (defence in depth).
CREATE POLICY "Block authenticated write on notification_history"
  ON public.notification_history
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- 4. test_categories: hide internal infra columns from public SELECT by revoking
--    column-level privileges. Service role retains full access.
REVOKE SELECT (realtime_enabled, price_check_frequency_hours)
  ON public.test_categories FROM PUBLIC, anon, authenticated;