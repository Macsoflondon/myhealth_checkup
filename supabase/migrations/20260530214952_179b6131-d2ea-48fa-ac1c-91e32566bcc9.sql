
CREATE OR REPLACE FUNCTION public.sanitize_popular_provider_tests()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row_rec RECORD;
  cleaned_name TEXT;
BEGIN
  FOR row_rec IN
    SELECT id, provider_id, test_name
    FROM public.provider_tests
    WHERE test_name ~* '\|\s*Book Online today|\|\s*Lola Health|[—-]\s*\d+\s*Biomarkers|-\s*A Comprehensive Blood Test'
  LOOP
    cleaned_name := btrim(regexp_replace(
      row_rec.test_name,
      '(\s*\|\s*Book Online today.*$)|(\s*\|\s*Lola Health.*$)|(\s*[—-]\s*\d+\s*Biomarkers.*$)|(\s*-\s*A Comprehensive Blood Test.*$)',
      '', 'gi'));

    IF cleaned_name = row_rec.test_name OR cleaned_name = '' THEN
      CONTINUE;
    END IF;

    IF EXISTS (
      SELECT 1 FROM public.provider_tests
      WHERE provider_id = row_rec.provider_id
        AND test_name = cleaned_name
        AND is_active = true
        AND id <> row_rec.id
    ) THEN
      UPDATE public.provider_tests
      SET is_active = false, is_popular = false, popularity_rank = NULL
      WHERE id = row_rec.id;
    ELSE
      UPDATE public.provider_tests
      SET test_name = cleaned_name
      WHERE id = row_rec.id;
    END IF;
  END LOOP;

  WITH cleaned AS (
    SELECT id, provider_id, popularity_rank,
           lower(btrim(regexp_replace(test_name, '\s+Blood Test$', '', 'i'))) AS norm_name
    FROM public.provider_tests
    WHERE is_popular = true
  ),
  ranked AS (
    SELECT id,
           row_number() OVER (
             PARTITION BY provider_id, norm_name
             ORDER BY COALESCE(popularity_rank, 999), id
           ) AS rn
    FROM cleaned
  )
  UPDATE public.provider_tests pt
  SET is_popular = false, popularity_rank = NULL
  FROM ranked rk
  WHERE pt.id = rk.id AND rk.rn > 1;

  WITH ranked AS (
    SELECT id,
           row_number() OVER (
             PARTITION BY provider_id
             ORDER BY COALESCE(popularity_rank, 999), id
           ) AS rn
    FROM public.provider_tests
    WHERE is_popular = true
  )
  UPDATE public.provider_tests pt
  SET is_popular = false, popularity_rank = NULL
  FROM ranked rk
  WHERE pt.id = rk.id AND rk.rn > 5;
END;
$$;

SELECT public.sanitize_popular_provider_tests();

SELECT cron.schedule(
  'sanitize-popular-tests-hourly',
  '20 * * * *',
  $$SELECT public.sanitize_popular_provider_tests();$$
);

SELECT cron.schedule(
  'refresh-popular-tests-daily',
  '30 4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/scrape-popular-tests',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM"}'::jsonb,
    body := jsonb_build_object('scheduled', true, 'time', now())
  );
  $$
);
