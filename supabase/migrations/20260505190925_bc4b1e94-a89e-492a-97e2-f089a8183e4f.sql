
-- 1. Fix health_insights SELECT policy: allow admins/moderators to see all insights
DROP POLICY IF EXISTS "Users view own insights, admins/mods view created" ON public.health_insights;
DROP POLICY IF EXISTS "Users can view their own health insights" ON public.health_insights;

CREATE POLICY "Users view own insights, admins and moderators view all"
ON public.health_insights
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'moderator')
);

-- 2. Tighten user_roles UPDATE: admins cannot modify other admins, cannot modify self
DROP POLICY IF EXISTS "Admins can only update to user role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update non-admin users to user role" ON public.user_roles;

CREATE POLICY "Admins can demote non-admin users only"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  AND user_id <> auth.uid()
  AND role <> 'admin'
)
WITH CHECK (
  role = 'user'
  AND user_id <> auth.uid()
);
