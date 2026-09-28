-- Restored verbatim from supabase_migrations.schema_migrations (version 20260619110347, name add_policy_audit_columns).
-- md5 of the recorded statements: a355e92d6aca28fcb84f15da978d3a23
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- Add missing policy audit columns to provider_tests
ALTER TABLE provider_tests
  ADD COLUMN IF NOT EXISTS clinical_review_professional text,
  ADD COLUMN IF NOT EXISTS policy_source_url text,
  ADD COLUMN IF NOT EXISTS collection_fee_verification text DEFAULT 'verified',
  ADD COLUMN IF NOT EXISTS clinical_review_verification text DEFAULT 'verified';

-- Add same columns to provider_test_mapping
ALTER TABLE provider_test_mapping
  ADD COLUMN IF NOT EXISTS clinical_review_professional text,
  ADD COLUMN IF NOT EXISTS policy_source_url text,
  ADD COLUMN IF NOT EXISTS collection_fee_verification text DEFAULT 'verified',
  ADD COLUMN IF NOT EXISTS clinical_review_verification text DEFAULT 'verified';
