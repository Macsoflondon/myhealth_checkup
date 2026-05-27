-- 1) Harden user_roles INSERT policy: admins can only grant 'user' role via the app
-- Promotion to admin/moderator must be done manually by a DB superuser
DROP POLICY IF EXISTS "Only existing admins can insert roles" ON public.user_roles;

CREATE POLICY "Admins can only assign user role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
  AND role = 'user'::app_role
);

-- 2) Tighten notification_history SELECT: ensure recipient belongs to the user
-- Drop existing permissive policy and replace with stricter version
DROP POLICY IF EXISTS "Users can view their own notification history" ON public.notification_history;

CREATE POLICY "Users can view their own notification history"
ON public.notification_history
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  AND (
    -- Recipient must match an email/phone tied to the authenticated user
    recipient = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.user_id = auth.uid()
        AND (
          up.phone_number = notification_history.recipient
          OR 'enc:' || encode(notification_history.recipient::bytea, 'base64') = up.phone_number
        )
    )
  )
);

-- Add admin override for support/audit purposes
CREATE POLICY "Admins can view all notification history"
ON public.notification_history
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));