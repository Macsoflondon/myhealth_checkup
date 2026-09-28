-- Restored verbatim from supabase_migrations.schema_migrations (version 20260806010300, name lhc_turnaround_batch1).
-- md5 of the recorded statements: 34915590ac0d304ecc54f94aefe0eff0
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


update provider_tests set turnaround_days=2, turnaround_raw='24-48 hours', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 '8d14e075-f049-4caf-9ab2-a4f2e05729f9', -- Cholesterol blood test, "24-48 hours"
 'ac5ef97f-c614-4a6b-b351-cde20ff5e536'  -- Essential Health MOT, "24-48 hours"
);
update provider_tests set turnaround_days=3, turnaround_raw='1-3 working days', turnaround_unit='days', turnaround_not_stated=false, last_validated_at=now()
where id in (
 '960316a0-0163-41b9-85cd-ecf9dab17e01', -- Kidney Function, "1-3 days of lab receipt"
 'dfe8369f-a6f4-47db-9127-45fbf027198e', -- Male Hormone Panel, "1-3 days"
 '21bae3dd-ded2-4c54-861e-163c8e1f2e75'  -- PSA, "1 to 3 working days"
);
