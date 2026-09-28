-- Restored verbatim from supabase_migrations.schema_migrations (version 20260828161906, name create_image_audit_results).
-- md5 of the recorded statements: 506817c94908445926207460a30e45c0
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

create table if not exists image_audit_results (
  id uuid primary key default gen_random_uuid(),
  provider_test_id uuid not null references provider_tests(id) on delete cascade,
  provider_id text not null,
  test_name text not null,
  checked_at timestamptz not null default now(),
  url_status text not null,
  http_status int,
  final_url text,
  name_match boolean,
  name_match_ratio numeric,
  image_check text not null,
  notes text,
  unique(provider_test_id)
);

alter table image_audit_results enable row level security;

drop policy if exists "Service role manage image_audit_results" on image_audit_results;
create policy "Service role manage image_audit_results"
  on image_audit_results for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Public read image_audit_results" on image_audit_results;
create policy "Public read image_audit_results"
  on image_audit_results for select
  using (true);
