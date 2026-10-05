-- Fix: the aggregate-provider-blogs cron job has been rejected (401) since
-- src/routes/api/public/blog-aggregate.ts switched from accepting the
-- publishable `apikey` header to requiring a dedicated `x-cron-secret`
-- scheduler secret (BLOG_AGGREGATE_SECRET, min 32 chars). The job still
-- called public.call_with_publishable_key, which sends only an apikey
-- header, so every scheduled run was turned away and blog aggregation
-- never ran.

-- 1. Vault secret holding the scheduler secret. The value MUST match the
--    BLOG_AGGREGATE_SECRET environment variable configured on the app.
--    This is a placeholder: after applying this migration, set the real
--    value with:
--      select vault.update_secret(
--        (select id from vault.secrets where name = 'blog_aggregate_secret'),
--        '<the BLOG_AGGREGATE_SECRET value>'
--      );
--    The helper below refuses to run while the placeholder is in place, so
--    the job cannot fire with a mismatched secret.
select vault.create_secret(
  'REPLACE_WITH_BLOG_AGGREGATE_SECRET_VALUE',
  'blog_aggregate_secret',
  'Scheduler secret sent as the x-cron-secret header to the Lovable-hosted blog-aggregate route. Must match the app BLOG_AGGREGATE_SECRET environment variable.'
);

-- 2. Helper mirroring call_with_publishable_key's shape, but sends the
--    vault-backed scheduler secret as x-cron-secret instead of the public
--    anon key. Used for endpoints outside *.supabase.co that require the
--    cron secret rather than a Supabase key.
create or replace function public.call_with_cron_secret(
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
  v_secret text;
  v_request_id bigint;
begin
  select decrypted_secret
    into v_secret
  from vault.decrypted_secrets
  where name = 'blog_aggregate_secret'
  limit 1;

  if v_secret is null or length(v_secret) < 32
     or v_secret like 'REPLACE_WITH_%' then
    raise exception 'Missing or placeholder Vault secret: blog_aggregate_secret';
  end if;

  select net.http_post(
    url := p_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', v_secret
    ),
    body := coalesce(p_body, '{}'::jsonb),
    timeout_milliseconds := p_timeout_ms
  )
  into v_request_id;

  return v_request_id;
end;
$function$;

-- 3. Re-point the blog aggregation job at the new helper. URL, body and
--    timeout preserved exactly as before.
select cron.alter_job(
  job_id := j.jobid,
  command := $cmd$
    select public.call_with_cron_secret(
      'https://project--37e227e1-0d67-4515-b064-99c243036534.lovable.app/api/public/blog-aggregate',
      '{"source": "pg_cron"}'::jsonb,
      300000
    );
  $cmd$
)
from cron.job j
where j.jobname = 'aggregate-provider-blogs';