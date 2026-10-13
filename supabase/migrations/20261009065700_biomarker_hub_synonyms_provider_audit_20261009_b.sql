-- Restored verbatim from supabase_migrations.schema_migrations (version 20261009065700, name biomarker_hub_synonyms_provider_audit_20261009_b).
-- md5 of the recorded statements: 8c7134ac80eef80c1b8c72d5bbf73993
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

update public.biomarker_hub
   set synonyms = (select array_agg(distinct s order by s) from unnest(coalesce(synonyms, '{}'::text[]) || array['IgE (Total)']) s), last_updated = now()
 where name = 'Total IgE';
update public.biomarker_hub
   set synonyms = (select array_agg(distinct s order by s) from unnest(coalesce(synonyms, '{}'::text[]) || array['Urine Analysis']) s), last_updated = now()
 where name = 'Urine examination';
select public.refresh_provider_test_biomarkers();
