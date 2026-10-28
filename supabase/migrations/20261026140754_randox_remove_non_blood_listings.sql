-- Restored from supabase_migrations.schema_migrations (version 20261026140754, name randox_remove_non_blood_listings).
-- md5 of the recorded statements: 1ad38939109df0a1f69ba289fbf2b823
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.
--
-- Replay adaptation (2026-10-27): the recorded one-off net.http_get call builds its
-- URL from the Vault secret mhc_sync_secret, which no migration creates. On a fresh
-- database the URL is null and pg_net rejects it. The call now runs only when that
-- secret exists, and reports a notice otherwise. The update runs unchanged.
-- Production ran the original call.

update provider_tests pt set is_active=false, updated_at=now()
from provider_test_exclusions e
where pt.provider_id=e.provider_id and public.provider_test_product_path(pt.url)=e.product_path;
do $replay$ begin
  if exists (select 1 from vault.decrypted_secrets where name='mhc_sync_secret') then
    perform net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/randox-kit-images?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret'), timeout_milliseconds:=120000);
  else
    raise notice 'mhc_sync_secret not in Vault: skipped the one-off kit image run';
  end if;
end $replay$;
