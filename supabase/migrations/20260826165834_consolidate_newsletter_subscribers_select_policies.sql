-- Performance advisor: multiple_permissive_policies on newsletter_subscribers (authenticated, SELECT).
-- "Admins can view all subscribers" and "Subscribers can view own record" are both permissive
-- SELECT policies for the same role, so Postgres evaluates both on every row of every query.
-- Merge into a single policy with the same OR semantics (admin OR own record) — no access change.

DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Subscribers can view own record" ON public.newsletter_subscribers;

CREATE POLICY "Admins or subscriber can view subscriber record" ON public.newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (
    has_role((select auth.uid()), 'admin'::app_role)
    OR lower(email) = lower(coalesce((select auth.jwt()) ->> 'email', ''::text))
  );