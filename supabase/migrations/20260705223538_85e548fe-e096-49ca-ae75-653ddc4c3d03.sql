-- Metadata-only fix for the trailing +1s drift introduced by the previous reconcile migration.
UPDATE supabase_migrations.schema_migrations
   SET version = '20260705223442'
 WHERE version = '20260705223443';