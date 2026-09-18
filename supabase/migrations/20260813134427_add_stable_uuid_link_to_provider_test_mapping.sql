
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
