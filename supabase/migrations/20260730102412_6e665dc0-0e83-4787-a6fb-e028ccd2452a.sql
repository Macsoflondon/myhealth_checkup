CREATE OR REPLACE FUNCTION public.get_registered_user_count()
RETURNS bigint
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count bigint;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'insufficient_privilege' USING ERRCODE = '42501';
  END IF;
  SELECT count(*) INTO v_count FROM auth.users;
  RETURN v_count;
END;
$$;

REVOKE ALL ON FUNCTION public.get_registered_user_count() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_registered_user_count() TO authenticated;