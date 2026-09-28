-- Restored verbatim from supabase_migrations.schema_migrations (version 20260828123559, name add_image_is_stock_flag).
-- md5 of the recorded statements: 3f5f2724d03241d9ee3ae7b53ddc9f5b
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

alter table provider_tests
  add column if not exists image_is_stock boolean not null default false;

comment on column provider_tests.image_is_stock is
  'true when image_url points at a generic on-brand stock photo (no real per-test photo was available from the provider), so a future real-image sync can tell these apart and prefer a real photo once one becomes available.';
