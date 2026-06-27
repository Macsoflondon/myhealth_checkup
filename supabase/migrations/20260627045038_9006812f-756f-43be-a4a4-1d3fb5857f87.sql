REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM anon;
-- Keep the targeted grants that admin login / RLS need:
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated, service_role;