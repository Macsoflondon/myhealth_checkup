-- Fix 1: notification_history INSERT — restrict to service_role only
DROP POLICY IF EXISTS "Users can insert their own notification history" ON public.notification_history;
DROP POLICY IF EXISTS "System can insert notification history" ON public.notification_history;
CREATE POLICY "Service role can insert notification history"
  ON public.notification_history FOR INSERT TO service_role
  WITH CHECK (true);

-- Fix 2a: audit_logs — remove client INSERT
DROP POLICY IF EXISTS "System can insert audit logs via triggers" ON public.audit_logs;

-- Fix 2b: audit_logs — add admin SELECT
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));