CREATE TABLE IF NOT EXISTS public.translations_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_hash TEXT NOT NULL,
  language TEXT NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  namespace TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_hash, language)
);

CREATE INDEX IF NOT EXISTS translations_cache_lang_idx
  ON public.translations_cache (language, source_hash);

GRANT SELECT ON public.translations_cache TO anon, authenticated;
GRANT ALL ON public.translations_cache TO service_role;

ALTER TABLE public.translations_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cached translations"
  ON public.translations_cache
  FOR SELECT
  USING (true);

CREATE POLICY "Service role manages translations"
  ON public.translations_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);