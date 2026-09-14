
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
