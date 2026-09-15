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