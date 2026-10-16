-- Restored from supabase_migrations.schema_migrations (version 20261016122323, name create_landing_signups).
-- md5 of the recorded statements: edc09f038af2e3f540fd0e9dbeb16aff
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

create table if not exists public.landing_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null check (char_length(first_name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 254),
  interests text[] not null check (
    cardinality(interests) between 1 and 10
    and interests <@ array['blood-panels','cancer','heart','hormones','vitamins','thyroid','womens','mens','longevity','not-sure']::text[]
  ),
  consent_given boolean not null check (consent_given = true),
  consent_text_version text not null,
  consent_ip inet,
  consent_user_agent text,
  page_source text not null default 'landing',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer_host text,
  unsubscribed_at timestamptz
);

create unique index if not exists landing_signups_email_key on public.landing_signups (lower(email));
create index if not exists landing_signups_created_at_idx on public.landing_signups (created_at desc);

alter table public.landing_signups enable row level security;

revoke all on public.landing_signups from anon;

create policy "Admins can view landing signups" on public.landing_signups
  for select to authenticated
  using (has_role((select auth.uid()), 'admin'::app_role));

create policy "Admins can update landing signups" on public.landing_signups
  for update to authenticated
  using (has_role((select auth.uid()), 'admin'::app_role))
  with check (has_role((select auth.uid()), 'admin'::app_role));

create policy "Admins can delete landing signups" on public.landing_signups
  for delete to authenticated
  using (has_role((select auth.uid()), 'admin'::app_role));

comment on table public.landing_signups is 'Landing page signups. Name, email and chosen test categories only. No health data. Written only by the landing-signup edge function (service role). Anonymous inserts are blocked by design.';
