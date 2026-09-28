-- Restored verbatim from supabase_migrations.schema_migrations (version 20260831112009, name fix_security_scan_snapshot_cron_auth).
-- md5 of the recorded statements: 9fee4008f113bd5617a5c2653fdee7a7
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- security-scan-snapshot-hourly has been failing authentication silently for
-- at least 32 days (last successful write: 29 Jul 2026). pg_cron reported
-- "succeeded" every hour because the SQL call itself never errored — only
-- the HTTP response inside it was a 401, which cron does not surface. Root
-- cause: the function only accepts the real service-role key or an admin
-- user JWT; the job was calling it through call_edge_with_automations,
-- which sends a different secret meant for a different auth scheme.
-- Switched to call_edge_with_service_role, the same helper already used
-- successfully by promote-provider-tests-6h and refresh-live-comparison-panels-6h.

SELECT cron.unschedule('security-scan-snapshot-hourly');

SELECT cron.schedule(
  'security-scan-snapshot-hourly',
  '7 * * * *',
  $$
    SELECT public.call_edge_with_service_role(
      'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/security-scan-snapshot',
      jsonb_build_object('trigger', 'cron')
    );
  $$
);
