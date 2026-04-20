-- Consolidate user_roles INSERT policies to a single restrictive policy.
-- Drops the dual-policy structure (PERMISSIVE + RESTRICTIVE) which was fragile,
-- and replaces with a single PERMISSIVE policy gated by has_role() + auth.uid() existence.

DROP POLICY IF EXISTS "Admins can only assign user role" ON public.user_roles;
DROP POLICY IF EXISTS "Restrict role inserts to admins only" ON public.user_roles;

CREATE POLICY "Only admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  AND EXISTS (SELECT 1 FROM auth.users WHERE id = user_id)
);