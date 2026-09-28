-- Restored verbatim from supabase_migrations.schema_migrations (version 20260521121016).
-- md5 of the recorded statements: 3e2bc4abb48506ee6cacc45681e9118e
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

UPDATE public.provider_tests
SET image_url = NULL, updated_at = now()
WHERE provider_id = 'randox'
  AND (
    lower(image_url) LIKE '%/gb.png'
    OR (lower(image_url) LIKE '%rdxhealthfrontdoor%' AND lower(image_url) LIKE '%/image/gb%')
  );
