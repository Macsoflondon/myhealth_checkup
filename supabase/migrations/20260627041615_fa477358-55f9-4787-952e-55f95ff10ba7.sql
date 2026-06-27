-- Revoke GraphQL schema discovery from anon and authenticated.
-- The application uses PostgREST (Data API), not pg_graphql, so removing
-- GraphQL access closes lints 0026/0027 without affecting normal queries.
REVOKE USAGE ON SCHEMA graphql FROM anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA graphql FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA graphql FROM anon, authenticated;

-- Also revoke from the graphql_public schema (the public-facing wrapper).
REVOKE USAGE ON SCHEMA graphql_public FROM anon, authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA graphql_public FROM anon, authenticated;