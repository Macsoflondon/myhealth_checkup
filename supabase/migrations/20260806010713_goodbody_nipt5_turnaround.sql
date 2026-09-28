-- Restored verbatim from supabase_migrations.schema_migrations (version 20260806010713, name goodbody_nipt5_turnaround).
-- md5 of the recorded statements: bb89d2d96062fc5331b7aba33a76e877
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update provider_tests set turnaround_days=7, turnaround_raw='within a week', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id = '31859aa9-1fd6-4d1f-a44f-e8a912b94567'; -- PrenatalSAFE 5 NIPT
