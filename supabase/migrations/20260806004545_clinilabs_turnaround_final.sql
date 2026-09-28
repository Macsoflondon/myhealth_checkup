-- Restored verbatim from supabase_migrations.schema_migrations (version 20260806004545, name clinilabs_turnaround_final).
-- md5 of the recorded statements: ed7baf8c7c732511a02552dea122281d
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update provider_tests set turnaround_days=1, turnaround_raw='Same Day', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 '81a218c6-b7de-4316-9979-d3320ac25aec', -- C Reactive Protein (CRP), confirmed p2 "1 Biomarker Same Day" £35
 '45bfcadf-cc61-4639-ae0f-5068075c2bc7'  -- GGT, confirmed p3 "1 Biomarker Same Day" £25
);
