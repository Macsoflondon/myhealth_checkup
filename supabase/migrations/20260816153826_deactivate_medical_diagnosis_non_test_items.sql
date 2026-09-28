-- Restored verbatim from supabase_migrations.schema_migrations (version 20260816153826, name deactivate_medical_diagnosis_non_test_items).
-- md5 of the recorded statements: 26da3581b5833731da6eadef87e429de
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


UPDATE provider_tests
SET is_active = false, updated_at = now()
WHERE id IN (
  '6872dffd-3086-48a8-9a51-851272a9744b', -- Deposit 100
  'e27efbe4-f885-446f-a32f-2e5a6587bf04', -- Deposit 50
  '9bdaeb91-01e6-4c75-a20b-da9b9a31a856'  -- Vitamin B12 shots
);
