-- Restored verbatim from supabase_migrations.schema_migrations (version 20260828063118, name create_provider_test_images_bucket).
-- md5 of the recorded statements: d2f88e91586c120e910aa4ec42169c91
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


insert into storage.buckets (id, name, public)
values ('provider-test-images', 'provider-test-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read provider-test-images" on storage.objects;
create policy "Public read provider-test-images"
  on storage.objects for select
  using (bucket_id = 'provider-test-images');

drop policy if exists "Service role manage provider-test-images" on storage.objects;
create policy "Service role manage provider-test-images"
  on storage.objects for all
  using (bucket_id = 'provider-test-images' and auth.role() = 'service_role')
  with check (bucket_id = 'provider-test-images' and auth.role() = 'service_role');
