
-- Create a private schema not exposed by the Data API
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- Move has_role into private schema (true SECURITY DEFINER body)
CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _has boolean;
  _aal text;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  ) INTO _has;

  IF NOT _has THEN
    RETURN false;
  END IF;

  IF _role = 'admin'::public.app_role THEN
    BEGIN
      _aal := (auth.jwt() ->> 'aal');
    EXCEPTION WHEN OTHERS THEN
      _aal := NULL;
    END;
    IF _aal IS DISTINCT FROM 'aal2' THEN
      RETURN false;
    END IF;
  END IF;

  RETURN true;
END;
$function$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = (SELECT auth.uid())
      AND ur.role = 'admin'
  );
$function$;

REVOKE ALL ON FUNCTION private.is_current_user_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_current_user_admin() TO authenticated, service_role;

-- Replace the public-schema versions with SECURITY INVOKER wrappers so they
-- are no longer flagged as SECURITY DEFINER functions executable by signed-in users.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY INVOKER
SET search_path TO 'public', 'private'
AS $function$
  SELECT private.has_role(_user_id, _role);
$function$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY INVOKER
SET search_path TO 'public', 'private'
AS $function$
  SELECT private.is_current_user_admin();
$function$;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated, service_role;
