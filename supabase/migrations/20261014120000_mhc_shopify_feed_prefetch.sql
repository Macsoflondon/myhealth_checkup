-- mhc-* Shopify feeds: fetch them from the database as well as the edge.
--
-- On 14 October 2026 Shopify answered 429 Too Many Requests to every
-- products.json request made from the Supabase edge functions (Lola Health,
-- Clinilabs, Medichecks, Goodbody Clinic, London Health Company), with any
-- user agent and with one request at a time. The same requests made from
-- the database through pg_net answered 200. The block follows the edge
-- network's shared addresses, not this platform's traffic: each feed is read
-- once every six hours.
--
-- This migration has the database request each feed page two minutes before
-- the sync jobs run (they start at minute 0 of hours 0, 6, 12 and 18), using
-- the same identifying user agent as the edge functions. The functions still
-- try Shopify directly first and read the database copy only when that fails,
-- through public.mhc_feed_page(), which returns a page fetched within the last
-- two hours with status 200 and nothing else.
--
-- pg_net keeps responses in net._http_response for six hours by default, so
-- this table only records which request holds each page.

create table if not exists public.mhc_feed_requests (
  feed_url text primary key,
  request_id bigint not null,
  requested_at timestamptz not null default now(),
  constraint mhc_feed_requests_url_chk
    check (feed_url ~ '^https://[a-z0-9.-]+/products\.json\?limit=250&page=[0-9]+$')
);

alter table public.mhc_feed_requests enable row level security;
revoke all on public.mhc_feed_requests from anon, authenticated;
grant all on public.mhc_feed_requests to service_role;

comment on table public.mhc_feed_requests is
  'pg_net request id holding the latest database fetch of each Shopify feed page the mhc-* syncs read. Written by mhc_prefetch_shopify_feeds(), read by mhc_feed_page().';

-- The feed pages the six-hourly sync jobs read. Medichecks has about 585
-- products (three pages); every other store fits in one page, and a second
-- page is fetched for the two rich-sync stores in case they grow.
create or replace function public.mhc_prefetch_shopify_feeds()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_url text;
  v_id bigint;
  v_count integer := 0;
begin
  foreach v_url in array array[
    'https://lolahealth.com/products.json?limit=250&page=1',
    'https://www.clinilabs.co.uk/products.json?limit=250&page=1',
    'https://www.medichecks.com/products.json?limit=250&page=1',
    'https://www.medichecks.com/products.json?limit=250&page=2',
    'https://www.medichecks.com/products.json?limit=250&page=3',
    'https://goodbodyclinic.com/products.json?limit=250&page=1',
    'https://goodbodyclinic.com/products.json?limit=250&page=2',
    'https://londonhealthcompany.co.uk/products.json?limit=250&page=1',
    'https://londonhealthcompany.co.uk/products.json?limit=250&page=2'
  ]
  loop
    v_id := net.http_get(
      url := v_url,
      headers := jsonb_build_object(
        'User-Agent', 'myhealthcheckup-comparison-bot/1.0 (+https://myhealthcheckup.co.uk)',
        'Accept', 'application/json'
      ),
      timeout_milliseconds := 60000
    );
    insert into public.mhc_feed_requests (feed_url, request_id, requested_at)
    values (v_url, v_id, now())
    on conflict (feed_url) do update
      set request_id = excluded.request_id, requested_at = excluded.requested_at;
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

revoke all on function public.mhc_prefetch_shopify_feeds() from public, anon, authenticated;
grant execute on function public.mhc_prefetch_shopify_feeds() to service_role;

-- The database copy of one feed page, or null when there is no successful
-- fetch from the last two hours.
create or replace function public.mhc_feed_page(p_url text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select r.content::jsonb
  from public.mhc_feed_requests f
  join net._http_response r on r.id = f.request_id
  where f.feed_url = p_url
    and f.requested_at > now() - interval '2 hours'
    and r.status_code = 200
    and r.content is not null
    and left(ltrim(r.content), 1) = '{'
$$;

revoke all on function public.mhc_feed_page(text) from public, anon, authenticated;
grant execute on function public.mhc_feed_page(text) to service_role;

-- lovable-cron-fallback-reviewed: 4 runs/day, nine GET requests each, two
-- minutes before the mhc-* sync jobs that read the results.
select cron.unschedule('mhc-shopify-prefetch')
where exists (select 1 from cron.job where jobname = 'mhc-shopify-prefetch');

select cron.schedule(
  'mhc-shopify-prefetch',
  '58 5,11,17,23 * * *',
  $$select public.mhc_prefetch_shopify_feeds()$$
);
