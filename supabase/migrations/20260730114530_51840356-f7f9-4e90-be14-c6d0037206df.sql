-- 1. user_sessions: remove cross-visitor tampering
DROP POLICY IF EXISTS "anon_update_user_sessions" ON public.user_sessions;

CREATE POLICY "users_update_own_user_sessions"
ON public.user_sessions
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

REVOKE UPDATE ON public.user_sessions FROM anon;

-- 2. Move SECURITY DEFINER bodies out of the exposed API schema
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.get_registered_user_count()
RETURNS bigint
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
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

REVOKE ALL ON FUNCTION private.get_registered_user_count() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.get_registered_user_count() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.get_registered_user_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public', 'private'
AS $$
  SELECT private.get_registered_user_count();
$$;

REVOKE ALL ON FUNCTION public.get_registered_user_count() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_registered_user_count() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.regenerate_mfa_backup_codes()
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
declare
  v_uid      uuid := auth.uid();
  v_aal      text := coalesce(auth.jwt() ->> 'aal', '');
  v_alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_codes    text[] := '{}';
  v_raw      text;
  i int;
  j int;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  if v_aal <> 'aal2' then
    raise exception 'Two-step verification must be completed before backup codes can be issued'
      using errcode = '42501';
  end if;

  delete from public.mfa_backup_codes where user_id = v_uid;

  for i in 1..10 loop
    v_raw := '';
    for j in 1..10 loop
      v_raw := v_raw || substr(v_alphabet, 1 + (get_byte(gen_random_bytes(1), 0) % 32), 1);
    end loop;

    insert into public.mfa_backup_codes (user_id, code_hash)
    values (v_uid, encode(digest(v_raw, 'sha256'), 'hex'));

    v_codes := array_append(v_codes, substr(v_raw, 1, 5) || '-' || substr(v_raw, 6, 5));
  end loop;

  return v_codes;
end;
$$;

REVOKE ALL ON FUNCTION private.regenerate_mfa_backup_codes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.regenerate_mfa_backup_codes() TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.regenerate_mfa_backup_codes()
RETURNS text[]
LANGUAGE sql
SECURITY INVOKER
SET search_path TO 'public', 'private'
AS $$
  SELECT private.regenerate_mfa_backup_codes();
$$;

REVOKE ALL ON FUNCTION public.regenerate_mfa_backup_codes() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.regenerate_mfa_backup_codes() TO authenticated;