-- Dedupe scraping_jobs: keep only most recent row per provider_id
WITH ranked AS (
  SELECT id,
         provider_id,
         ROW_NUMBER() OVER (
           PARTITION BY provider_id
           ORDER BY COALESCE(last_scraped, created_at) DESC, created_at DESC
         ) AS rn
  FROM public.scraping_jobs
)
DELETE FROM public.scraping_jobs sj
USING ranked r
WHERE sj.id = r.id
  AND r.rn > 1;

ALTER TABLE public.scraping_jobs
  ADD CONSTRAINT scraping_jobs_provider_id_key UNIQUE (provider_id);

ALTER TABLE public.scraping_jobs
  ADD COLUMN IF NOT EXISTS expected_min_tests integer,
  ADD COLUMN IF NOT EXISTS last_test_count integer;

INSERT INTO public.scraping_jobs (provider_id, status, expected_min_tests)
VALUES
  ('medichecks', 'pending', 80),
  ('medichecks-firecrawl', 'pending', 80),
  ('thriva', 'pending', 10),
  ('randox', 'pending', 50),
  ('london-medical-laboratory', 'pending', 25),
  ('lola-health', 'pending', 70),
  ('goodbody-clinic', 'pending', 50),
  ('goodbody', 'pending', 50),
  ('london-health-company', 'pending', 15),
  ('clinilabs', 'pending', 30),
  ('medical-diagnosis', 'pending', 50)
ON CONFLICT (provider_id) DO UPDATE
  SET expected_min_tests = COALESCE(public.scraping_jobs.expected_min_tests, EXCLUDED.expected_min_tests);

CREATE TABLE IF NOT EXISTS public.scraper_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id text NOT NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('below_floor','sudden_drop','scrape_failed','no_data')),
  severity text NOT NULL DEFAULT 'warning' CHECK (severity IN ('info','warning','critical')),
  message text NOT NULL,
  current_count integer,
  previous_count integer,
  expected_min integer,
  acknowledged boolean NOT NULL DEFAULT false,
  acknowledged_by uuid,
  acknowledged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.scraper_alerts ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_scraper_alerts_unack
  ON public.scraper_alerts (created_at DESC)
  WHERE acknowledged = false;

CREATE INDEX IF NOT EXISTS idx_scraper_alerts_provider
  ON public.scraper_alerts (provider_id, created_at DESC);

CREATE POLICY "Admins can view scraper alerts"
ON public.scraper_alerts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can acknowledge alerts"
ON public.scraper_alerts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Block client-side inserts on scraper alerts"
ON public.scraper_alerts
FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Block deletes on scraper alerts"
ON public.scraper_alerts
FOR DELETE
TO authenticated
USING (false);

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;