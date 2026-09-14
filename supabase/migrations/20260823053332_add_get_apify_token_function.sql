create or replace function public.get_apify_token()
returns text
language plpgsql
security definer
set search_path = 'public', 'vault'
as $$
declare
  v_token text;
begin
  select decrypted_secret into v_token
  from vault.decrypted_secrets
  where name = 'apify_api_token'
  limit 1;
  return v_token;
end;
$$;

revoke all on function public.get_apify_token() from public;
revoke all on function public.get_apify_token() from anon;
revoke all on function public.get_apify_token() from authenticated;
grant execute on function public.get_apify_token() to service_role;