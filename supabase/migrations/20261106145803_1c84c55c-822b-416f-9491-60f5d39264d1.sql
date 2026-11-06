DO $$ DECLARE t text; BEGIN
FOREACH t IN ARRAY ARRAY['test_results','user_sessions','funnel_events'] LOOP
  EXECUTE format('DROP POLICY IF EXISTS admin_writes_require_mfa_ins ON public.%I', t);
  EXECUTE format('DROP POLICY IF EXISTS admin_writes_require_mfa_upd ON public.%I', t);
  EXECUTE format('DROP POLICY IF EXISTS admin_writes_require_mfa_del ON public.%I', t);
END LOOP; END $$;
-- These tables also allow signed-in users to write their own rows, so the admin two-factor gate must not apply to them.