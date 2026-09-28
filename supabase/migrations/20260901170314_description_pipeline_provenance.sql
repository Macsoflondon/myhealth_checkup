-- Restored verbatim from supabase_migrations.schema_migrations (version 20260901170314, name description_pipeline_provenance).
-- md5 of the recorded statements: d775c6d82e1d2b3cb46a4eaa40ab4e0d
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Supports the new description pipeline: description_scraped will hold the
-- real raw content captured from each provider's page at scrape time
-- (already fetched into memory by every scraper today, just never saved).
-- description will hold the compliant, editorially-written summary
-- generated from it. These two columns track when/how that summary was made.

ALTER TABLE public.provider_tests
  ADD COLUMN IF NOT EXISTS description_generated_at timestamptz,
  ADD COLUMN IF NOT EXISTS description_source text;

COMMENT ON COLUMN public.provider_tests.description_scraped IS
  'Raw content captured from the provider''s own page/feed at scrape time (Shopify body_html, or extracted page text for non-Shopify providers). Source material only — never shown to customers directly.';
COMMENT ON COLUMN public.provider_tests.description IS
  'Customer-facing test card summary. Generated from description_scraped per myhealth checkup content rules (plain factual English, no marketing hype or outcome claims). See description_source for provenance.';
