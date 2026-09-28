-- Restored verbatim from supabase_migrations.schema_migrations (version 20260521113747).
-- md5 of the recorded statements: 66725848d828c4266f2a4e2944dab3a2
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

UPDATE public.provider_tests SET image_url = REPLACE(image_url, 'http://', 'https://') WHERE image_url LIKE 'http://%';
UPDATE public.provider_tests SET url = REPLACE(url, 'http://', 'https://') WHERE url LIKE 'http://%';
UPDATE public.provider_test_mapping SET provider_url = REPLACE(provider_url, 'http://', 'https://') WHERE provider_url LIKE 'http://%';
UPDATE public.scraper_alerts SET acknowledged = true, acknowledged_at = now() WHERE acknowledged = false;
