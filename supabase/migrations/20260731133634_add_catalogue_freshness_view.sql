-- Source of truth for how old the catalogue data actually is, so the UI can state
-- a real figure instead of a hardcoded one. security_invoker keeps RLS applying
-- as the calling user rather than the view owner.
create or replace view public.catalogue_freshness
with (security_invoker = true) as
select
  provider_name,
  count(*)::int                                        as active_tests,
  max(scraped_at)                                      as last_scraped_at,
  floor(extract(epoch from (now() - max(scraped_at))) / 3600)::int as hours_since_scrape,
  count(*) filter (where biomarkers_list is null)::int  as missing_biomarkers,
  count(*) filter (where turnaround_days_text is null)::int as missing_turnaround,
  count(*) filter (where total_expected_cost is null)::int as missing_total_cost
from public.unified_provider_tests
group by provider_name;

comment on view public.catalogue_freshness is
  'Per-provider data age and completeness. Drives the honest "prices last checked" label on comparison surfaces. Never hardcode a freshness figure in the UI.';

grant select on public.catalogue_freshness to anon, authenticated;