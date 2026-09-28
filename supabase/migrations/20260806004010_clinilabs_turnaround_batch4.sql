-- Restored verbatim from supabase_migrations.schema_migrations (version 20260806004010, name clinilabs_turnaround_batch4).
-- md5 of the recorded statements: c302f0d8b3280b06bfd7215a8b74a2ac
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update provider_tests set turnaround_days = 1, turnaround_raw = 'Same Day', turnaround_unit = 'days', turnaround_not_stated = false, last_validated_at = now()
where id = 'cb0bc4dc-9421-4e32-b9fe-887ceaae1853'; -- Albumin Blood Test, confirmed "Same Day" on page
