-- 1) Block non-admin INSERTs into user_roles via RESTRICTIVE policy
-- This ensures NO authenticated user can insert role rows unless they're already admin,
-- preventing self-escalation to 'moderator' or any other role.
CREATE POLICY "Restrict role inserts to admins only"
ON public.user_roles
AS RESTRICTIVE
FOR INSERT
TO authenticated, anon
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) Tighten notification_history SELECT policy
-- Remove the cross-table phone_number join that could leak existence of phone numbers.
-- Restrict access strictly to rows where the authenticated user is the owner (user_id match).
DROP POLICY IF EXISTS "Users can view their own notification history" ON public.notification_history;

CREATE POLICY "Users can view their own notification history"
ON public.notification_history
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);