
CREATE TABLE public.popular_test_enrichment_cache (
  test_id uuid PRIMARY KEY,
  provider_id text NOT NULL,
  url text NOT NULL,
  title text,
  description text,
  image_url text,
  price numeric,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.popular_test_enrichment_cache TO service_role;

ALTER TABLE public.popular_test_enrichment_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only"
  ON public.popular_test_enrichment_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_popular_test_enrichment_cache_fetched_at
  ON public.popular_test_enrichment_cache (fetched_at);

CREATE TRIGGER trg_popular_test_enrichment_cache_updated_at
  BEFORE UPDATE ON public.popular_test_enrichment_cache
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
