-- ============================================
-- IMMUTABLE RECORD PATTERNS FOR COMPLIANCE
-- Prevents tampering with audit trails and order history
-- ============================================

-- 1. AUDIT_LOGS - Make completely immutable (no user modifications)
-- Users can only SELECT their own logs, system can INSERT

-- Drop the overly permissive INSERT policy and replace with system-only
DROP POLICY IF EXISTS "Service can insert audit logs" ON public.audit_logs;

-- Audit logs can only be inserted by authenticated users (via triggers)
-- The trigger runs as SECURITY DEFINER so it can insert
CREATE POLICY "System can insert audit logs via triggers"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Explicitly deny UPDATE on audit_logs (immutable records)
CREATE POLICY "Audit logs cannot be updated"
ON public.audit_logs
FOR UPDATE
USING (false)
WITH CHECK (false);

-- Explicitly deny DELETE on audit_logs (immutable records)
CREATE POLICY "Audit logs cannot be deleted"
ON public.audit_logs
FOR DELETE
USING (false);

-- 2. NOTIFICATION_HISTORY - Users can view but not modify
-- Already has INSERT and SELECT policies, need to explicitly deny UPDATE/DELETE

-- Explicitly deny UPDATE on notification_history
CREATE POLICY "Notification history cannot be updated"
ON public.notification_history
FOR UPDATE
USING (false)
WITH CHECK (false);

-- Explicitly deny DELETE on notification_history
CREATE POLICY "Notification history cannot be deleted"
ON public.notification_history
FOR DELETE
USING (false);

-- 3. ORDERS - Users can create and view, only admins can update status
-- Add UPDATE policy for admins only

CREATE POLICY "Only admins can update orders"
ON public.orders
FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Explicitly deny DELETE on orders (immutable for audit trail)
CREATE POLICY "Orders cannot be deleted"
ON public.orders
FOR DELETE
USING (false);

-- 4. DATA_ACCESS_REQUESTS - Only admins can update request status
CREATE POLICY "Only admins can update data access requests"
ON public.data_access_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Explicitly deny DELETE on data_access_requests
CREATE POLICY "Data access requests cannot be deleted"
ON public.data_access_requests
FOR DELETE
USING (false);

-- 5. HEALTH_INSIGHTS - Only system/admins can create insights
-- Remove ability for users to insert fake insights

CREATE POLICY "Only admins can insert health insights"
ON public.health_insights
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'moderator'));

-- 6. Add comments documenting immutability requirements
COMMENT ON POLICY "Audit logs cannot be updated" ON public.audit_logs IS 'COMPLIANCE: Audit logs are immutable to prevent evidence tampering';
COMMENT ON POLICY "Audit logs cannot be deleted" ON public.audit_logs IS 'COMPLIANCE: Audit logs are immutable to prevent evidence tampering';
COMMENT ON POLICY "Notification history cannot be updated" ON public.notification_history IS 'COMPLIANCE: Notification records are immutable for audit trail';
COMMENT ON POLICY "Notification history cannot be deleted" ON public.notification_history IS 'COMPLIANCE: Notification records are immutable for audit trail';
COMMENT ON POLICY "Orders cannot be deleted" ON public.orders IS 'COMPLIANCE: Order records are immutable for financial audit trail';
COMMENT ON POLICY "Data access requests cannot be deleted" ON public.data_access_requests IS 'COMPLIANCE: GDPR requests are immutable for regulatory compliance';