-- Marker migration — historical parity only. No-op.
--
-- Applied out-of-band 2026-06-19 11:03:47 UTC. Policy audit column additions.
-- Full DDL is preserved in supabase_migrations.schema_migrations.statements
-- for the row where version = '20260619110347'.
--
-- This file exists so `supabase db push` / repo↔remote parity checks see the
-- migration as present in both places. Do NOT put re-runnable SQL here.

SELECT 1 WHERE FALSE;
