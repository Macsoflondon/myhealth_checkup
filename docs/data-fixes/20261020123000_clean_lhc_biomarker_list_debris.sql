-- Remove page debris from London Health Company biomarker lists.
--
-- The london-health-scraper read Firecrawl markdown and kept any line that
-- mentioned a marker term, so headings ("# Male Hormone Blood Test Panel ..."),
-- links, URLs, footer lines ("London Health Company (LHC) Ltd"), product
-- titles and marketing sentences landed in provider_tests.biomarkers_list.
-- The scraper now filters these through
-- supabase/functions/_shared/scrape/sanitiseBiomarkerEntries.ts; this file
-- applies the same rejection rules to rows already stored.
--
-- Scope: provider_id = 'london-health-company' only. Debris entries are
-- removed (kept entries are left exactly as stored) and biomarker_count is
-- reset to the cleaned list length, only on rows whose list changes.
--
-- Not applied. Review before running.

with entries as (
  select
    p.id,
    p.biomarkers_list as old_list,
    e.value as v,
    e.ord,
    btrim(regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(e.value, '\\([.\-|*_#\[\]()])', '\1', 'g'),
          '^\s*\d+[.)]\s+', ''),
        '\*\*|__', '', 'g'),
      '\s+', ' ', 'g')) as s
  from public.provider_tests p
  cross join lateral jsonb_array_elements_text(p.biomarkers_list)
    with ordinality as e(value, ord)
  where p.provider_id = 'london-health-company'
    and jsonb_typeof(p.biomarkers_list) = 'array'
),
judged as (
  select *,
    (
      btrim(v) ~ '^#'                                             -- markdown heading
      or v ~ '\]\('                                               -- markdown link
      or v ~* 'https?://|www\.'                                   -- URL
      or v ~* '[a-z0-9-]+\.(co\.uk|com|org|net|uk|io)\M'          -- bare domain
      or s = ''
      or s ~* '\m(ltd|limited|plc|llp|united kingdom)\M'          -- footer/address
      or s ~* '\m(blood test|test kit)\M'                         -- product title
      or s ~* '\(\d+\s+(biomarkers?|parameters?|markers?|tests?)\M'
      or strpos(s, '|') > 0                                       -- page title
      or s ~ '[?!:]$'                                             -- question/lead-in
      or s ~ '\.(\s|$)'                                           -- sentence
      or length(s) > 60
      or coalesce(array_length(regexp_split_to_array(
           btrim(regexp_replace(s, '\([^)]*\)', ' ', 'g')), '\s+'), 1), 0) > 6
    ) as debris
  from entries
),
cleaned as (
  select
    id,
    old_list,
    coalesce(
      jsonb_agg(to_jsonb(v) order by ord) filter (where not debris),
      '[]'::jsonb
    ) as new_list
  from judged
  group by id, old_list
)
update public.provider_tests t
set biomarkers_list = c.new_list,
    biomarker_count = jsonb_array_length(c.new_list),
    updated_at = now()
from cleaned c
where t.id = c.id
  and c.new_list <> c.old_list;

-- Rollback
-- Not reversible from this file alone. Before running it, snapshot the rows:
--   create table public._lhc_biomarker_backup_20261020 as
--     select id, biomarkers_list, biomarker_count, updated_at
--     from public.provider_tests where provider_id = 'london-health-company';
-- To roll back:
--   update public.provider_tests t
--   set biomarkers_list = b.biomarkers_list,
--       biomarker_count = b.biomarker_count,
--       updated_at = b.updated_at
--   from public._lhc_biomarker_backup_20261020 b
--   where t.id = b.id;
