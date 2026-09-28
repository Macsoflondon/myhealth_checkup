-- Restored verbatim from supabase_migrations.schema_migrations (version 20260806010648, name goodbody_turnaround_final).
-- md5 of the recorded statements: bc27a0f29374a218353c791443ed968f
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update provider_tests set turnaround_days=5, turnaround_raw='3-5 working days (general wellness default)', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 '5505c35e-ac6b-4057-bc0d-1ef6e5d04073', -- Erectile Dysfunction
 '4ae4ae7c-015d-4e82-81a8-583d2da89a59', -- Full Blood Count
 '7607388f-dd18-4b5c-a8c7-1e5bfc0d69a5', -- Male Hormone and Fertility
 '73846317-7ffc-4645-9dcd-df10e6697f68', -- Thyroid Function (plain)
 '193e931b-3ce8-4070-bc57-529aab2f28f0'  -- PCOS (URL already fixed earlier)
);
