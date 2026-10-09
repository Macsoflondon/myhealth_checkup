-- funnel_events: stop visitor inserts depending on policy evaluation order.
--
-- admin_funnel (FOR ALL, no TO clause) applies to every role, anon included.
-- Evaluating it calls public.has_role -> private.has_role, and anon has no
-- USAGE on schema private, so for a visitor the check raises 42501
-- ("permission denied for schema private") instead of returning false.
--
-- Visitor inserts allowed by public_insert_funnel_events (20260930151340)
-- only succeed because Postgres evaluates that policy first and short-circuits
-- the OR of permissive policies. Verified on PostgreSQL 16 on 2026-10-09:
-- renaming either policy so the order flips makes every valid visitor insert
-- fail with 42501, and src/lib/funnelTracking.ts swallows that error, so the
-- funnel would go quiet with no sign of why.
--
-- Scoping the admin policy to authenticated means anon never evaluates
-- has_role. Admin access is unchanged (admins are always authenticated);
-- anon reads still return nothing because no SELECT policy applies to anon.

alter policy admin_funnel on public.funnel_events to authenticated;
