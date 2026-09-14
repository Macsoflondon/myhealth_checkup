-- Close an MFA bypass: previously an AAL1 (password-only) session could INSERT
-- its own backup-code hash and then redeem it via the mfa-recovery edge
-- function, which unenrols all TOTP factors. Writes are now server-side only.

drop policy if exists "Users can insert their own backup codes" on public.mfa_backup_codes;
drop policy if exists "Users can update their own backup codes" on public.mfa_backup_codes;
drop policy if exists "Users can delete their own backup codes" on public.mfa_backup_codes;

revoke insert, update, delete on public.mfa_backup_codes from authenticated, anon;

-- Generation now requires a fully stepped-up (AAL2) session and runs in the
-- database, so the client never chooses its own code hashes.
create or replace function public.regenerate_mfa_backup_codes()
returns text[]
language plpgsql
security definer
set search_path = public, extensions
as $$
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
      -- 256 is an exact multiple of 32, so this modulo is unbiased
      v_raw := v_raw || substr(v_alphabet, 1 + (get_byte(gen_random_bytes(1), 0) % 32), 1);
    end loop;

    insert into public.mfa_backup_codes (user_id, code_hash)
    values (v_uid, encode(digest(v_raw, 'sha256'), 'hex'));

    v_codes := array_append(v_codes, substr(v_raw, 1, 5) || '-' || substr(v_raw, 6, 5));
  end loop;

  return v_codes;
end;
$$;

revoke all on function public.regenerate_mfa_backup_codes() from public, anon;
grant execute on function public.regenerate_mfa_backup_codes() to authenticated;