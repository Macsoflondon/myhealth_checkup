-- Restored verbatim from supabase_migrations.schema_migrations (version 20261127031539, name biomarker_audit_20261127_01_backup).
-- md5 of the recorded statements: f1093e5d8e9afc58638b0e720413457e
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

do $$
declare k text;
begin
  select decrypted_secret into k from vault.decrypted_secrets where name = 'biomarker_lock_key' limit 1;
  if k is null or k = '' then
    raise exception 'Biomarker unlock key unavailable; aborting';
  end if;
  perform set_config('app.biomarker_unlock', k, true);
end $$;

create table if not exists public.biomarker_hub_backup_20261127 as table public.biomarker_hub;
alter table public.biomarker_hub_backup_20261127 enable row level security;
revoke all on table public.biomarker_hub_backup_20261127 from public, anon, authenticated;
comment on table public.biomarker_hub_backup_20261127 is 'Snapshot of biomarker_hub taken 2026-11-27 before the biomarker library audit. Service role only. Drop once the audit is signed off.';
create table if not exists public.provider_test_biomarkers_backup_20261127 as table public.provider_test_biomarkers;
alter table public.provider_test_biomarkers_backup_20261127 enable row level security;
revoke all on table public.provider_test_biomarkers_backup_20261127 from public, anon, authenticated;
comment on table public.provider_test_biomarkers_backup_20261127 is 'Snapshot of provider_test_biomarkers taken 2026-11-27 before the biomarker library audit. Service role only. Drop once the audit is signed off.';
create table if not exists public.clinical_loinc_mappings_backup_20261127 as table public.clinical_loinc_mappings;
alter table public.clinical_loinc_mappings_backup_20261127 enable row level security;
revoke all on table public.clinical_loinc_mappings_backup_20261127 from public, anon, authenticated;
comment on table public.clinical_loinc_mappings_backup_20261127 is 'Snapshot of clinical_loinc_mappings taken 2026-11-27 before the biomarker library audit. Service role only. Drop once the audit is signed off.';
create table if not exists public.clinical_snomed_mappings_backup_20261127 as table public.clinical_snomed_mappings;
alter table public.clinical_snomed_mappings_backup_20261127 enable row level security;
revoke all on table public.clinical_snomed_mappings_backup_20261127 from public, anon, authenticated;
comment on table public.clinical_snomed_mappings_backup_20261127 is 'Snapshot of clinical_snomed_mappings taken 2026-11-27 before the biomarker library audit. Service role only. Drop once the audit is signed off.';
create table if not exists public.biomarker_category_map_backup_20261127 as table public.biomarker_category_map;
alter table public.biomarker_category_map_backup_20261127 enable row level security;
revoke all on table public.biomarker_category_map_backup_20261127 from public, anon, authenticated;
comment on table public.biomarker_category_map_backup_20261127 is 'Snapshot of biomarker_category_map taken 2026-11-27 before the biomarker library audit. Service role only. Drop once the audit is signed off.';
create table if not exists public.known_scrape_junk_labels_backup_20261127 as table public.known_scrape_junk_labels;
alter table public.known_scrape_junk_labels_backup_20261127 enable row level security;
revoke all on table public.known_scrape_junk_labels_backup_20261127 from public, anon, authenticated;
comment on table public.known_scrape_junk_labels_backup_20261127 is 'Snapshot of known_scrape_junk_labels taken 2026-11-27 before the biomarker library audit. Service role only. Drop once the audit is signed off.';
select set_config('app.biomarker_unlock', '', true);
