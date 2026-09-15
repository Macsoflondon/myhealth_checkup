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