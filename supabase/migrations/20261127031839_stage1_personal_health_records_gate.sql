-- Platform screening, 27 Nov 2026: stage 1 gate for personal health records.
--
-- The health data scope in the project rules (owner update, 29 Oct 2026)
-- says the platform does not yet store users' medical results in stage 1,
-- and that a DPIA, a documented Article 6 lawful basis and Article 9
-- condition, and explicit recorded consent come before production health
-- data use. The live account dashboard still let members upload result
-- files and save readings, and three AI features saved signed-in users'
-- health questions.
--
-- This migration keeps every table, policy, bucket and function for stage 2
-- and stops new or changed health records on every path, the service role
-- included, while public.personal_health_records_enabled() returns false.
-- Reading and deleting existing rows and files stays open, so members keep
-- their right to erasure.
--
-- Stage 2 launch: replace personal_health_records_enabled() in a reviewed
-- migration once those conditions are met, and switch the matching
-- PERSONAL_HEALTH_RECORDS_ENABLED constants in the site and edge functions.

create or replace function public.personal_health_records_enabled()
returns boolean
language sql
immutable
set search_path = ''
as $$
  select false
$$;

comment on function public.personal_health_records_enabled() is
  'Stage 1 gate (27 Nov 2026). Returns false until the DPIA, the Article 6 lawful basis and Article 9 condition, and consent records for stage 2 are in place.';

revoke all on function public.personal_health_records_enabled() from public;
grant execute on function public.personal_health_records_enabled() to anon, authenticated, service_role;

create or replace function private.block_personal_health_records()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if public.personal_health_records_enabled() then
    return new;
  end if;
  raise exception using
    errcode = 'P0001',
    message = 'Saving personal health records is not available yet.',
    detail = format('Stage 1 gate: %s on %I.%I refused.', tg_op, tg_table_schema, tg_table_name);
end;
$$;

revoke all on function private.block_personal_health_records() from public, anon, authenticated;

create trigger stage1_block_personal_health_records
  before insert or update on public.uploaded_test_results
  for each row execute function private.block_personal_health_records();
create trigger stage1_block_personal_health_records
  before insert or update on public.biomarker_readings
  for each row execute function private.block_personal_health_records();
create trigger stage1_block_personal_health_records
  before insert or update on public.user_health_data
  for each row execute function private.block_personal_health_records();
create trigger stage1_block_personal_health_records
  before insert or update on public.user_health_scores
  for each row execute function private.block_personal_health_records();
create trigger stage1_block_personal_health_records
  before insert or update on public.health_queries
  for each row execute function private.block_personal_health_records();
create trigger stage1_block_personal_health_records
  before insert or update on public.test_results
  for each row execute function private.block_personal_health_records();
create trigger stage1_block_personal_health_records
  before insert or update on public.source_documents
  for each row execute function private.block_personal_health_records();
create trigger stage1_block_personal_health_records
  before insert or update on public.health_profiles
  for each row execute function private.block_personal_health_records();

-- Result files: restrictive policies add the gate to the existing per-user
-- policies on the test-results bucket. Other buckets are unaffected.
create policy "Stage 1: no new test result files"
  on storage.objects as restrictive for insert to public
  with check (bucket_id <> 'test-results' or public.personal_health_records_enabled());
create policy "Stage 1: no changed test result files"
  on storage.objects as restrictive for update to public
  using (bucket_id <> 'test-results' or public.personal_health_records_enabled())
  with check (bucket_id <> 'test-results' or public.personal_health_records_enabled());
