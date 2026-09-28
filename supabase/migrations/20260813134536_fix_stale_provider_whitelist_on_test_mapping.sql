-- Restored verbatim from supabase_migrations.schema_migrations (version 20260813134536, name fix_stale_provider_whitelist_on_test_mapping).
-- md5 of the recorded statements: c6ba673849daab53322d379c7170a89e
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- provider_test_mapping_valid_provider_id was last updated before
-- clinilabs, london-health-company and medical-diagnosis were onboarded.
-- Together those three providers are 315 of 729 active listings (43 per
-- cent of the live catalogue), and this constraint has been silently
-- blocking any canonical mapping row for them ever since. It also still
-- allows 'tuli-health', a provider with zero rows in provider_tests today.
-- Replace it with the current live provider set.
alter table provider_test_mapping
  drop constraint provider_test_mapping_valid_provider_id;

alter table provider_test_mapping
  add constraint provider_test_mapping_valid_provider_id
  check (provider_id = ANY (ARRAY[
    'medichecks'::text,
    'thriva'::text,
    'randox'::text,
    'london-medical-laboratory'::text,
    'lola-health'::text,
    'goodbody-clinic'::text,
    'clinilabs'::text,
    'london-health-company'::text,
    'medical-diagnosis'::text
  ]));
