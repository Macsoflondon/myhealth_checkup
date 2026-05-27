-- 1. Add UPDATE policy for health_queries (owner-scoped)
CREATE POLICY "Users can update their own health queries"
ON public.health_queries
FOR UPDATE
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

-- 2. Harden user_roles INSERT policy to prevent bootstrap self-escalation
-- Drop the existing insert policy and recreate it to explicitly require an existing admin.
-- has_role() returns false when no admin exists, so this blocks the empty-table bootstrap risk.
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

CREATE POLICY "Only existing admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin'::app_role)
);