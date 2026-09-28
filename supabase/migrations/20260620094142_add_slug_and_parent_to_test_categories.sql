-- Restored verbatim from supabase_migrations.schema_migrations (version 20260620094142, name add_slug_and_parent_to_test_categories).
-- md5 of the recorded statements: eeaa066ef793622b864d16b8d0c5a451
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.


-- Add slug column for reliable category_primary matching
ALTER TABLE test_categories 
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES test_categories(id),
  ADD COLUMN IF NOT EXISTS description text;

-- Add unique constraint on slug
CREATE UNIQUE INDEX IF NOT EXISTS test_categories_slug_unique ON test_categories(slug) WHERE slug IS NOT NULL;
