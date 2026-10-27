-- Restored verbatim from supabase_migrations.schema_migrations (version 20261025203717, name provider_tests_gallery_image_urls).
-- md5 of the recorded statements: f20023939ca6b476caf1133e8b6a2c9d
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

alter table public.provider_tests
  add column if not exists gallery_image_urls text[] not null default '{}'::text[];

comment on column public.provider_tests.gallery_image_urls is
  'Ordered product images for the test detail page gallery. Index 0 is the box shot (matches image_url, used on cards). Index 1, when present, is the provider''s factual biomarker breakdown image. Self-hosted copies in the provider-test-images bucket only. Never provider marketing images (reviews, lifestyle, claims).';

alter table public.provider_tests
  add constraint provider_tests_gallery_image_urls_max2 check (cardinality(gallery_image_urls) <= 2);
