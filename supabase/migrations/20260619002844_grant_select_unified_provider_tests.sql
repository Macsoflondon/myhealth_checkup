-- Marker migration — historical parity only. No-op.
--
-- Applied out-of-band 2026-06-19 00:28:44 UTC. Grants SELECT on unified_provider_tests.
-- Full DDL is preserved in supabase_migrations.schema_migrations.statements
-- for the row where version = '20260619002844'.
--
-- This file exists so `supabase db push` / repo↔remote parity checks see the
-- migration as present in both places. Do NOT put re-runnable SQL here.

SELECT 1 WHERE FALSE;
