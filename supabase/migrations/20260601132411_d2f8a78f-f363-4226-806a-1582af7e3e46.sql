-- Enforce AAL2 (MFA-verified session) for admin role checks.
-- Defence-in-depth: previously MFA was only enforced in the React AdminRoute
-- component. Now any RLS policy or RPC using has_role(..., 'admin') will also
-- require the caller's JWT to be AAL2.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
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

  -- For admin role, additionally require an AAL2 (MFA-verified) session.
  -- auth.jwt() returns NULL when called outside an authenticated request
  -- (e.g. background jobs running as service_role); those contexts bypass
  -- RLS entirely so this branch is never reached for them.
  IF _role = 'admin'::app_role THEN
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

-- Preserve previous grants
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;