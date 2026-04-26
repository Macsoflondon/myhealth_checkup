-- CRITICAL: Remove policies that allow users to self-assign roles (privilege escalation)
DROP POLICY IF EXISTS "user_roles_owner_insert" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_owner_update" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_owner_delete" ON public.user_roles;

-- Only admins can manage roles (handle_new_user_profile trigger handles default role via SECURITY DEFINER)
CREATE POLICY "Only admins can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
  ON public.user_roles FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));