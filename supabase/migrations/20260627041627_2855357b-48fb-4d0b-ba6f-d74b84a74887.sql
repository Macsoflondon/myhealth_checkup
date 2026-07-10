-- The app uses PostgREST (Data API) exclusively. pg_graphql is unused and
-- its introspection exposes every table that has SELECT to anon/authenticated.
-- Dropping the extension removes the GraphQL schema and resolves lints 0026/0027.
DROP EXTENSION IF EXISTS pg_graphql CASCADE;