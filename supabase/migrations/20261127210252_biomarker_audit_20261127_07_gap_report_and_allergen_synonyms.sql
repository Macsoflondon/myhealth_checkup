-- Restored verbatim from supabase_migrations.schema_migrations (version 20261127210252, name biomarker_audit_20261127_07_gap_report_and_allergen_synonyms).
-- md5 of the recorded statements: 544d5e626fd504dbd18180730018bae1
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

do $$
declare k text;
begin
  select decrypted_secret into k from vault.decrypted_secrets where name = 'biomarker_lock_key' limit 1;
  if k is null or k = '' then raise exception 'Biomarker unlock key unavailable; aborting'; end if;
  perform set_config('app.biomarker_unlock', k, true);
end $$;

create or replace function bioaudit.gaps(p_cat text default null) returns table(name text, cat text, missing text[])
language sql stable as $f$
  select h.name, h.category_consumer,
    array_remove(array[
      case when coalesce(cardinality(h.synonyms), 0) = 0 then 'sy' end,
      case when bioaudit.blank(h.unit) then 'u' end,
      case when bioaudit.blank(h.biomaterial) then 'b' end,
      case when bioaudit.blank(h.body_system) then 'bs' end,
      case when bioaudit.blank(h.what_it_measures) and bioaudit.blank(h.description_what) then 'w' end,
      case when bioaudit.blank(h.why_it_matters) and bioaudit.blank(h.description_why) then 'y' end,
      case when bioaudit.blank(h.what_affects_it) then 'a' end,
      case when bioaudit.blank(h.when_to_retest) then 'r' end,
      case when bioaudit.blank(h.clinical_significance) then 's' end,
      case when h.reference_ranges is null or jsonb_typeof(h.reference_ranges) <> 'object' or h.reference_ranges = '{}'::jsonb then 'rr' end,
      case when h.interpretation_guide is null or jsonb_typeof(h.interpretation_guide) <> 'object' or not (h.interpretation_guide ? 'high') then 'ig' end,
      case when coalesce(cardinality(h.related_conditions), 0) = 0 then 'c' end,
      case when coalesce(cardinality(h.lifestyle_factors), 0) = 0 then 'f' end,
      case when coalesce(cardinality(h.symptoms_linked), 0) = 0 then 'x' end,
      case when coalesce(cardinality(h.clinical_tips), 0) = 0 then 't' end,
      case when coalesce(cardinality(h.related_tests), 0) = 0 then 'z' end,
      case when h.last_reviewed_at is null then 'lr' end,
      case when h.what_it_measures ~ 'Listed in ' or h.description_what ~ 'Listed in ' then 'ph' end
    ], null)
  from public.biomarker_hub h
  where h.status = 'active' and h.entity_type = 'biomarker' and (p_cat is null or h.category_consumer = p_cat)
$f$;
revoke all on function bioaudit.gaps(text) from public;

select bioaudit.fill($j$[
{"n":"Blueberry","sy":["Blueberry fruit"]},{"n":"Camel milk","sy":["Camel's milk"]},{"n":"Crab","sy":["Crab meat"]},
{"n":"Crayfish","sy":["Crawfish"]},{"n":"Egg white","sy":["Hen's egg white"]},{"n":"Egg yolk","sy":["Hen's egg yolk"]},
{"n":"Malassezia sympodialis","sy":["Malassezia","Pityrosporum"]},{"n":"Mare's milk","sy":["Horse milk"]},{"n":"Gluten","sy":["Wheat gluten"]},
{"n":"Helminthosporium halodes","sy":["Helminthosporium"]},{"n":"Rye flour","sy":["Rye (food)"]},{"n":"Goat milk","sy":["Goat's milk"]},
{"n":"Banana","sy":["Banana fruit"]},{"n":"Meadow Rye","sy":["Meadow rye grass"]},{"n":"Sheep milk","sy":["Sheep's milk","Ewe's milk"]},
{"n":"Squid","sy":["Calamari"]}
]$j$::jsonb);

select set_config('app.biomarker_unlock', '', true);
