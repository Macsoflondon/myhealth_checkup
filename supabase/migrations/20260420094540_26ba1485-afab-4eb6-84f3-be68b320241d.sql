-- 1) Tighten notification_history SELECT: drop reversible base64 comparison
DROP POLICY IF EXISTS "Users can view their own notification history" ON public.notification_history;

CREATE POLICY "Users can view their own notification history"
ON public.notification_history
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  AND (
    recipient = (SELECT email FROM auth.users WHERE id = auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.user_id = auth.uid()
        AND up.phone_number = notification_history.recipient
    )
  )
);

-- 2) Harden user_roles UPDATE: admins can only set role to 'user'
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;

CREATE POLICY "Admins can only update to user role"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
  AND role = 'user'::app_role
);