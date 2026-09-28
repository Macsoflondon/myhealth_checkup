-- Restored verbatim from supabase_migrations.schema_migrations (version 20260823053332, name add_get_apify_token_function).
-- md5 of the recorded statements: b24e9cfcaed79196f97c7b22ecb46970
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

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
