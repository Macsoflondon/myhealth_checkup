create table if not exists public.provider_ratings (
  provider_id text primary key,
  source text not null default 'trustpilot',
  source_url text,
  rating numeric(2,1) check (rating is null or (rating >= 0 and rating <= 5)),
  review_count integer check (review_count is null or review_count >= 0),
  checked_at timestamptz,
  last_attempt_at timestamptz,
  last_status text,
  last_error text,
  updated_at timestamptz not null default now()
);
comment on table public.provider_ratings is 'One row per provider: star rating and review count scraped from the public review source. Written only by refresh-trustpilot-ratings (service role). checked_at is the last successful scrape.';
alter table public.provider_ratings enable row level security;
revoke all on public.provider_ratings from anon, authenticated;
grant select on public.provider_ratings to anon, authenticated;
drop policy if exists "Public can read verified provider ratings" on public.provider_ratings;
create policy "Public can read verified provider ratings" on public.provider_ratings
  for select to anon, authenticated using (rating is not null);
