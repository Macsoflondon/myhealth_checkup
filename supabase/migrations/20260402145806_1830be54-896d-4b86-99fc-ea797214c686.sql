-- Block direct INSERT into audit_logs from any non-service role
-- Audit logs should only be created by database triggers and service_role
CREATE POLICY "Audit logs cannot be inserted directly"
  ON public.audit_logs
  FOR INSERT
  TO public
  WITH CHECK (false);
