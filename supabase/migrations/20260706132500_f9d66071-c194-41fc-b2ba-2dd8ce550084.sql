DO $$
DECLARE r bigint;
BEGIN
  SELECT public.call_edge_with_service_role(
    'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/run-all-scrapers',
    '{"scheduled": false, "providers": ["medichecks","clinilabs","lola-health"]}'::jsonb
  ) INTO r;
  RAISE NOTICE 'run-all-scrapers request_id: %', r;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'run-all-scrapers skipped (preview/migration context): %', SQLERRM;
END $$;
