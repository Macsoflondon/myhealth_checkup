-- Platform screening, 27 Nov 2026: a dedicated secret for the Apify webhook.
--
-- apify-scrape-provider gives Apify a webhook that calls apify-ingest with a
-- shared secret. The secret came from the SCRAPER_CRON_SECRET environment
-- variable and fell back to the service role key when that variable was
-- missing, so a third party could have been handed the service role key.
-- This migration stores a dedicated random secret in Vault and exposes it to
-- the service role only, in the same way as public.mhc_sync_secret(). Both
-- functions read it from here and refuse to run without it. Nobody needs to
-- see the value: it is generated inside the database.

do $$
begin
  if not exists (select 1 from vault.secrets where name = 'apify_ingest_secret') then
    perform vault.create_secret(
      encode(extensions.gen_random_bytes(32), 'hex'),
      'apify_ingest_secret',
      'Shared secret for the Apify webhook to apify-ingest. Read through public.apify_ingest_secret(). Created 27 Nov 2026.'
    );
  end if;
end;
$$;

create or replace function public.apify_ingest_secret()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select s.decrypted_secret
    from vault.decrypted_secrets s
   where s.name = 'apify_ingest_secret'
   order by s.created_at desc
   limit 1;
$$;

revoke all on function public.apify_ingest_secret() from public, anon, authenticated;
grant execute on function public.apify_ingest_secret() to service_role;
