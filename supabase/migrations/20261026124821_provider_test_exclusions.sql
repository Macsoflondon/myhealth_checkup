-- Restored verbatim from supabase_migrations.schema_migrations (version 20261026124821, name provider_test_exclusions).
-- md5 of the recorded statements: dfeb77d1a66748a63ea62c34b8842c42
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

create table if not exists public.provider_test_exclusions (
  provider_id text not null,
  product_path text not null,
  reason text not null,
  excluded_by text not null default 'admin',
  created_at timestamptz not null default now(),
  primary key (provider_id, product_path)
);
comment on table public.provider_test_exclusions is 'Provider products removed from the platform on purpose. Any insert into provider_tests whose URL matches a row here is dropped, so no scraper can bring it back.';
alter table public.provider_test_exclusions enable row level security;
create policy "admins read exclusions" on public.provider_test_exclusions for select using (public.has_role(auth.uid(), 'admin'));

create or replace function public.provider_test_product_path(u text)
returns text language sql immutable as $$
  select lower(regexp_replace(regexp_replace(coalesce(u,''), '[?#].*$', ''), '^.*?/product/|/+$', '', 'g'))
$$;

create or replace function public.block_excluded_provider_tests()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.provider_test_exclusions e
             where e.provider_id = new.provider_id
               and e.product_path = public.provider_test_product_path(new.url)) then
    return null;
  end if;
  return new;
end $$;

drop trigger if exists trg_block_excluded_provider_tests on public.provider_tests;
create trigger trg_block_excluded_provider_tests before insert on public.provider_tests
for each row execute function public.block_excluded_provider_tests();

insert into public.provider_test_exclusions (provider_id, product_path, reason, excluded_by) values
 ('randox','clinic/ecg','Not a blood test (ECG). Removed by Nathanial 25 Oct 2026','nathanial'),
 ('randox','clinic/mole-scanning','Not a blood test (mole screening). Removed by Nathanial 25 Oct 2026','nathanial'),
 ('randox','clinic/h-pylori-test','Not a blood test (breath test). Removed by Nathanial 25 Oct 2026','nathanial'),
 ('randox','clinic/phlebotomy-course','Training course, not a test. Removed by Nathanial 25 Oct 2026','nathanial'),
 ('randox','clinic/uti-test','Not a blood test (urine UTI test). Removed by Nathanial 25 Oct 2026','nathanial')
on conflict do nothing;
