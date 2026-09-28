-- Restored verbatim from supabase_migrations.schema_migrations (version 20260813134427, name add_stable_uuid_link_to_provider_test_mapping).
-- md5 of the recorded statements: 2000165d76bec6e789f21caf786ee24b
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- The existing provider_test_mapping table joins to provider_tests via a text
-- provider_test_id slug. In practice only 1 of its 70 rows currently joins
-- successfully that way (the slug convention drifted from what the live
-- scraper pipeline writes, and 71 per cent of active provider_tests rows
-- have no provider_test_id at all). Add a direct uuid reference to the
-- stable primary key so mapping rows keep working regardless of whether a
-- text slug was captured.
alter table provider_test_mapping
  add column if not exists provider_test_uuid uuid references provider_tests(id) on delete cascade;

create index if not exists idx_provider_test_mapping_uuid on provider_test_mapping(provider_test_uuid);
