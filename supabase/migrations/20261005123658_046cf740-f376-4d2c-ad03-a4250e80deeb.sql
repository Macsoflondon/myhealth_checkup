-- The call_with_cron_secret helper is SECURITY DEFINER and only ever
-- invoked by pg_cron inside the database. Revoke API access so neither
-- anonymous nor signed-in callers can execute it via PostgREST.
revoke execute on function public.call_with_cron_secret(text, jsonb, integer) from public, anon, authenticated;