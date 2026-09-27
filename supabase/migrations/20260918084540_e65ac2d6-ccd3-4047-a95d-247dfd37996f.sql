-- lovable-cron-fallback-reviewed: 96 runs/day; genuinely time-based continuous security monitoring (DB-only RLS/bucket/function checks, no external calls), 15-minute cadence explicitly required and consistent with the existing 5-minute soc-cluster pg_cron pattern
SELECT cron.schedule(
  'security-scan-snapshot-15min',
  '*/15 * * * *',
  $$
  SELECT public.call_edge_with_service_role(
    'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/security-scan-snapshot',
    jsonb_build_object('trigger', 'cron')
  );
  $$
);