-- Restored verbatim from supabase_migrations.schema_migrations (version 20260806010838, name medichecks_hba1c_home_turnaround).
-- md5 of the recorded statements: d2300621a631b09c6ed968b1106903b0
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update provider_tests set turnaround_days=3, turnaround_not_stated=false, last_validated_at=now()
where id = '4ba80f5b-2a02-4573-85d6-15c228eed94c'; -- Diabetes (HbA1c) Blood Test To Take At Home, matches sibling medichecks SKU
