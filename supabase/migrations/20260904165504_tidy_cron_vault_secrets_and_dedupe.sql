-- Restored from supabase_migrations.schema_migrations (version 20260904165504, name tidy_cron_vault_secrets_and_dedupe).
-- md5 of the recorded statements: ca8097745b46c02811c9b520b7887e87
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.
--
-- Replay adaptation: the recorded statements address cron jobs by their production
-- job IDs (14, 44 and 4). Job IDs are assigned per database, so on a fresh
-- database ID 14 silently rewrote an unrelated job and ID 44 did not exist. Each
-- call now resolves the job by the name production gave it
-- (verify-provider-images-weekly, aggregate-provider-blogs,
-- check-price-alerts-every-6-hours). Result in production is identical.

-- 1. Vault secret for the legacy anon/publishable key. This key is meant to
--    be public (it ships in every client bundle of the site), so vaulting it
--    is about removing hardcoded literals from cron.job.command, not about
--    guarding a secret. It exists specifically for jobs that must call
--    endpoints outside *.supabase.co, where call_edge_with_automations is
--    not usable because it enforces a supabase.co-only destination.
select vault.create_secret(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsdnVpb2Fnc2dmYWR5bnV2b2RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MDQ1MDcsImV4cCI6MjA2ODA4MDUwN30.N_ddGrc6YhEYnINwofAI-SNOtsxZr5D-dLVuA5TZEBM',
  'legacy_anon_key',
  'Legacy anon JWT (publishable/public by design). Used by cron jobs that call endpoints outside *.supabase.co (e.g. the Lovable-hosted blog-aggregate route) where call_edge_with_automations cannot be used due to its supabase.co-only domain restriction.'
);

-- 2. Minimal helper mirroring call_edge_with_service_role's shape, but reads
--    the public anon key from Vault rather than the domain-restricted
--    automations key or the high-privilege service-role key, so it is safe
--    to point at non-Supabase hosts.
create or replace function public.call_with_publishable_key(
  p_url text,
  p_body jsonb default '{}'::jsonb,
  p_timeout_ms integer default 120000
)
returns bigint
language plpgsql
security definer
set search_path to 'public', 'vault'
as $function$
declare
  v_key text;
  v_request_id bigint;
begin
  select decrypted_secret
    into v_key
  from vault.decrypted_secrets
  where name = 'legacy_anon_key'
  limit 1;

  if v_key is null or length(v_key) = 0 then
    raise exception 'Missing Vault secret: legacy_anon_key';
  end if;

  select net.http_post(
    url := p_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', v_key
    ),
    body := coalesce(p_body, '{}'::jsonb),
    timeout_milliseconds := p_timeout_ms
  )
  into v_request_id;

  return v_request_id;
end;
$function$;

-- 3. Job 14 (verify-provider-images-weekly) calls one of our own edge
--    functions, exactly like jobs 8/10/16 already do — bring it in line with
--    that established convention (vault-backed automations key, no domain
--    restriction issue since this target is *.supabase.co) instead of the
--    hand-rolled net.http_post with a hardcoded anon JWT it had before.
select cron.alter_job(
  job_id := j.jobid,
  command := $cmd$
    select public.call_edge_with_automations(
      'https://clvuioagsgfadynuvodj.supabase.co/functions/v1/verify-provider-images',
      '{}'::jsonb
    );
  $cmd$
)
from cron.job j
where j.jobname = 'verify-provider-images-weekly';

-- 4. Job 44 (aggregate-provider-blogs) targets an external Lovable-hosted
--    endpoint, so it needs the new domain-unrestricted, publishable-key-only
--    helper instead. Body and timeout preserved exactly as before.
select cron.alter_job(
  job_id := j.jobid,
  command := $cmd$
    select public.call_with_publishable_key(
      'https://project--37e227e1-0d67-4515-b064-99c243036534.lovable.app/api/public/blog-aggregate',
      '{"source": "pg_cron"}'::jsonb,
      300000
    );
  $cmd$
)
from cron.job j
where j.jobname = 'aggregate-provider-blogs';

-- 5. Remove the stale, already-disabled duplicate price-alert job. Job 25
--    (check-price-alerts-every-6-hours-v2) is the live, active replacement
--    with the identical schedule and command.
select cron.unschedule(j.jobid)
from cron.job j
where j.jobname = 'check-price-alerts-every-6-hours';
