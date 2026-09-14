-- comparison_test_groups was flagged by the Supabase security linter as
-- SECURITY DEFINER (it runs with the view creator's privileges rather than
-- the querying user's, so it can silently bypass RLS on the underlying
-- table). In practice provider_tests already has a fully public SELECT
-- policy ("Provider tests are viewable by everyone", qual: true), so this
-- was not an active data exposure -- but it is still bad practice, since a
-- future tightening of that policy would not automatically apply to this
-- view. Switch it to security_invoker so it always respects the querying
-- user's own RLS, with no behavioural change today.
ALTER VIEW public.comparison_test_groups SET (security_invoker = true);