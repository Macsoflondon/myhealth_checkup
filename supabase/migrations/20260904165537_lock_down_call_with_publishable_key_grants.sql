-- Restored verbatim from supabase_migrations.schema_migrations (version 20260904165537, name lock_down_call_with_publishable_key_grants).
-- md5 of the recorded statements: 0dc9282ae69410e8e416fa50f93ce9a0
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

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
