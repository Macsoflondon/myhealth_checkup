-- Security: the subscriber SELECT policy matched the JWT email claim without proof of
-- mailbox ownership, so an account created with someone else's unconfirmed address could
-- read that subscriber's record. No app or user-facing code reads own subscriber rows
-- (sign-up and unsubscribe run server-side), so restrict SELECT to admins only.
-- Draft for Claude to apply; not run by Lovable.

DROP POLICY IF EXISTS "Admins or subscriber can view subscriber record" ON public.newsletter_subscribers;

CREATE POLICY "Admins can view subscriber records" ON public.newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (has_role((select auth.uid()), 'admin'::app_role));

-- Rollback:
-- DROP POLICY IF EXISTS "Admins can view subscriber records" ON public.newsletter_subscribers;
-- CREATE POLICY "Admins or subscriber can view subscriber record" ON public.newsletter_subscribers
--   FOR SELECT TO authenticated
--   USING (has_role((select auth.uid()), 'admin'::app_role)
--          OR lower(email) = lower(coalesce((select auth.jwt()) ->> 'email', ''::text)));
