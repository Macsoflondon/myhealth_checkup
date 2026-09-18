
create or replace view comparison_test_groups as
with cleaned as (
  select
    pt.id as provider_test_id,
    pt.provider_id,
    pt.test_name,
    pt.category,
    regexp_replace(
      regexp_replace(
        lower(pt.test_name),
        '\y(blood test|home test|test kit|to take at home|at home|in clinic|blood|test|kit|profile|panel|screen|screening|check|with doctor review|doctor reviewed|and pdf report included|pdf report|included|diagnosis and monitoring|diagnosis|monitoring|comprehensive|advanced|premium|essential|essentials|basic|standard|complete|ultimate)\y',
        '', 'g'
      ),
      '[^a-z0-9 ]', '', 'g'
    ) as cleaned_name
  from provider_tests pt
  where pt.is_active = true
    and coalesce(pt.is_addon, false) = false
),
normed as (
  select
    provider_test_id, provider_id, test_name, category,
    nullif(
      array_to_string(
        (select array_agg(w order by w)
         from unnest(string_to_array(trim(regexp_replace(cleaned_name, '\s+', ' ', 'g')), ' ')) w
         where w <> ''),
        ' '
      ),
      ''
    ) as group_key
  from cleaned
),
group_stats as (
  select group_key, count(*) as group_size, count(distinct provider_id) as group_provider_count
  from normed
  where group_key is not null and length(group_key) >= 3
  group by group_key
)
select
  n.provider_test_id,
  n.provider_id,
  n.test_name,
  n.category,
  n.group_key,
  gs.group_size,
  gs.group_provider_count
from normed n
join group_stats gs on gs.group_key = n.group_key
where n.group_key is not null and length(n.group_key) >= 3;

comment on view comparison_test_groups is
  'Deterministic (non-fuzzy) grouping of active provider_tests rows likely to be the same underlying test, for the side by side comparison pages. group_key is stopword-stripped and word-sorted so word order and marketing tier words (Advanced/Premium/etc) do not split a real match, while clinically distinguishing words (vitamin letter, hormone name, gender) are preserved so unrelated tests never collide. Rows with group_provider_count >= 2 are the ones actually useful for a cross-provider comparison row.';
