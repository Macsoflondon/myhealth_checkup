-- Reconcile +1s CLI drift for the two migrations added since the 2026-07-05 reconciliation.
-- Metadata-only: updates supabase_migrations.schema_migrations.version to match repo filenames.
-- No schema DDL/DML is re-executed.

-- Fresh snapshot for one-shot rollback.
DROP TABLE IF EXISTS supabase_migrations.schema_migrations_backup_20260705_v2;
CREATE TABLE supabase_migrations.schema_migrations_backup_20260705_v2 AS
  SELECT * FROM supabase_migrations.schema_migrations;

-- Align remote versions with repo filenames.
UPDATE supabase_migrations.schema_migrations SET version = '20260705221137' WHERE version = '20260705221138';
UPDATE supabase_migrations.schema_migrations SET version = '20260705221555' WHERE version = '20260705221556';