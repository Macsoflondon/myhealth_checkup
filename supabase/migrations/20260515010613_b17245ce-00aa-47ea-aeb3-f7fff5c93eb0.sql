
-- 1. Restrict user_roles DELETE: admins cannot delete own row or any admin row
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  AND user_id <> auth.uid()
  AND role <> 'admin'::app_role
);

-- 2. Remove duplicate admin policies on lola_health_products; keep has_role()-based set
DROP POLICY IF EXISTS "admins_can_delete_lola_products" ON public.lola_health_products;
DROP POLICY IF EXISTS "admins_can_insert_lola_products" ON public.lola_health_products;
DROP POLICY IF EXISTS "admins_can_update_lola_products" ON public.lola_health_products;
DROP POLICY IF EXISTS "admins_can_select_all_lola_products" ON public.lola_health_products;
