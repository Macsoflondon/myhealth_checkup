-- Restored from supabase_migrations.schema_migrations (version 20261026140150, name randox_kit_images_schedule).
-- md5 of the recorded statements: 2262dcec083cf7ca606390dddc1ea096
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.
--
-- Replay adaptation (2026-10-27): the recorded file ended with two one-off
-- net.http_get calls that started production's scrapers immediately. Their URL
-- includes the Vault secret mhc_sync_secret, which no migration creates, so on a
-- fresh database the URL is null and pg_net rejects it ("null value in column url
-- of relation http_request_queue violates not-null constraint"). The calls now run
-- only when that secret exists, and report a notice otherwise. A fresh database has
-- no reason to trigger production's scrapers. The cron job is unchanged. Production
-- ran the original calls.

select cron.unschedule('randox-kit-images') where exists (select 1 from cron.job where jobname='randox-kit-images');
select cron.schedule('randox-kit-images', '34 */6 * * *', $$select net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/randox-kit-images?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret'), timeout_milliseconds:=120000)$$);
-- run now: scrape the 18 product pages the old job never reached, and assign kit boxes to current rows
do $replay$ begin
  if exists (select 1 from vault.decrypted_secrets where name='mhc_sync_secret') then
    perform net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/mhc-randox-scrape?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret') || '&limit=40', timeout_milliseconds:=150000);
    perform net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/randox-kit-images?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret'), timeout_milliseconds:=120000);
  else
    raise notice 'mhc_sync_secret not in Vault: skipped the one-off Randox scrape and kit image runs';
  end if;
end $replay$;
