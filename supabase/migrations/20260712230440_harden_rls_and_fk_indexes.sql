
-- Silence RLS-enabled-no-policy advisories with admin-only read.
-- These tables are populated/consumed by service-role edge functions (which bypass RLS),
-- and no browser reads them, so admin-only adds zero anon exposure.
create policy "admin_read_provider_metadata" on public.provider_metadata
  for select to authenticated using (has_role((select auth.uid()), 'admin'::app_role));
create policy "admin_read_popular_test_enrichment_cache" on public.popular_test_enrichment_cache
  for select to authenticated using (has_role((select auth.uid()), 'admin'::app_role));
create policy "admin_read_sync_heartbeat" on public.sync_heartbeat
  for select to authenticated using (has_role((select auth.uid()), 'admin'::app_role));

-- Covering indexes for the 4 unindexed foreign keys flagged by the performance advisor
create index if not exists idx_engine_audit_log_run_id on public.engine_audit_log(run_id);
create index if not exists idx_soc_incident_events_actor_id on public.soc_incident_events(actor_id);
create index if not exists idx_soc_incidents_acknowledged_by on public.soc_incidents(acknowledged_by);
create index if not exists idx_soc_incidents_resolved_by on public.soc_incidents(resolved_by);
