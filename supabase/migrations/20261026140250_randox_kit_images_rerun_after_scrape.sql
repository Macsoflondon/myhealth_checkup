-- Restored from supabase_migrations.schema_migrations (version 20261026140250, name randox_kit_images_rerun_after_scrape).
-- md5 of the recorded statements: 0e1c9ecbd70533e9758395ef888f2148
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.
--
-- Replay adaptation (2026-10-27): the recorded one-off net.http_get call builds its
-- URL from the Vault secret mhc_sync_secret, which no migration creates. On a fresh
-- database the URL is null and pg_net rejects it. The call now runs only when that
-- secret exists, and reports a notice otherwise. Production ran the original call.

do $replay$ begin
  if exists (select 1 from vault.decrypted_secrets where name='mhc_sync_secret') then
    perform net.http_get(url:='https://clvuioagsgfadynuvodj.supabase.co/functions/v1/randox-kit-images?secret=' || (select decrypted_secret from vault.decrypted_secrets where name='mhc_sync_secret'), timeout_milliseconds:=120000);
  else
    raise notice 'mhc_sync_secret not in Vault: skipped the one-off kit image run';
  end if;
end $replay$;
