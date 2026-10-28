-- Restored verbatim from supabase_migrations.schema_migrations (version 20261023005220, name clinilabs_single_marker_canonical_category).
-- md5 of the recorded statements: 7fd2e71a12688b2bc661423395c727c2
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

update public.provider_tests
set canonical_category = case id
  when '7cdd0039-0b56-403a-8154-d9ce3bdf926f' then 'vitamins'
  when '0bdd85b3-bfb8-47f9-ab35-5cc034ccb4d2' then 'hormones'
  when '767cc61c-61ea-4cb5-a50c-5111d8bfd980' then 'general-health'
  when '481a0a64-e267-45ec-bc35-f2af4ea98003' then 'general-health'
  when 'e65a0399-7104-4af0-9317-27acfa972f68' then 'sports-performance'
end
where provider_id = 'clinilabs'
  and canonical_category is null
  and id in (
    '7cdd0039-0b56-403a-8154-d9ce3bdf926f',
    '0bdd85b3-bfb8-47f9-ab35-5cc034ccb4d2',
    '767cc61c-61ea-4cb5-a50c-5111d8bfd980',
    '481a0a64-e267-45ec-bc35-f2af4ea98003',
    'e65a0399-7104-4af0-9317-27acfa972f68'
  );
