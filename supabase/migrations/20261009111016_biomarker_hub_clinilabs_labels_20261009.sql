-- Restored verbatim from supabase_migrations.schema_migrations (version 20261009111016, name biomarker_hub_clinilabs_labels_20261009).
-- md5 of the recorded statements: 3085beed8aadef9d286a406e70aefe84
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

select set_config('app.biomarker_unlock', (select decrypted_secret from vault.decrypted_secrets where name = 'biomarker_lock_key'), true);

update public.biomarker_hub set synonyms = (select array_agg(distinct s order by s) from unnest(coalesce(synonyms,'{}'::text[]) || array['Hepatitis B Core Antibody (IgM)']) s), last_updated = now() where name = 'Hepatitis B: HB Core IgM (HBc IgM)';
update public.biomarker_hub set synonyms = (select array_agg(distinct s order by s) from unnest(coalesce(synonyms,'{}'::text[]) || array['Thyroid peroxidase (TPO) antibodies']) s), last_updated = now() where name = 'TPO Antibodies';

insert into public.biomarker_hub (name, category, category_clinical, category_consumer, description_what, what_it_measures, synonyms, status, source_systems, last_updated)
values
('LH:FSH Ratio','Hormones','endocrinology','Hormones','Ratio of luteinising hormone to follicle stimulating hormone. Listed in Clinilabs PCOS Blood Test.','Ratio of luteinising hormone to follicle stimulating hormone. Listed in Clinilabs PCOS Blood Test.', array['LH:FSH Ratio'],'active', array['provider_test_audit_2026-10-09'], now()),
('Herpes Simplex Virus 1 and 2 IgM','Infectious Disease','infectious_disease','Infectious Disease','Combined IgM antibody result for herpes simplex virus types 1 and 2. Listed in Clinilabs Herpes Simplex 1 and 2 IgM Blood Test.','Combined IgM antibody result for herpes simplex virus types 1 and 2. Listed in Clinilabs Herpes Simplex 1 and 2 IgM Blood Test.', array['Herpes Simplex Virus 1 and 2 IgM'],'active', array['provider_test_audit_2026-10-09'], now());

select public.refresh_provider_test_biomarkers();
