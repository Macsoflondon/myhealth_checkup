-- The advisor caught that CREATE FUNCTION left call_with_publishable_key
-- executable by PUBLIC/anon/authenticated via PostgREST RPC — i.e. any
-- unauthenticated caller could have used it as an open HTTP relay
-- (arbitrary URL + body, sent from our infrastructure). Match the grant
-- pattern already used by call_edge_with_service_role: only postgres (which
-- is what pg_cron executes jobs as) and service_role may call it.
revoke all on function public.call_with_publishable_key(text, jsonb, integer) from public;
revoke all on function public.call_with_publishable_key(text, jsonb, integer) from anon;
revoke all on function public.call_with_publishable_key(text, jsonb, integer) from authenticated;
grant execute on function public.call_with_publishable_key(text, jsonb, integer) to postgres, service_role;
