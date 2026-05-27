-- =======================================================================
-- Security hardening migration
-- =======================================================================

-- -----------------------------------------------------------------------
-- 1. NEWSLETTER_SUBSCRIBERS: explicit deny INSERT/UPDATE/DELETE for
--    public roles. The newsletter-subscribe edge function uses the
--    service_role key, which bypasses RLS, so legitimate signups still
--    work. This makes the "no anon INSERT" guarantee explicit.
-- -----------------------------------------------------------------------

DROP POLICY IF EXISTS "Block public inserts on newsletter_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Block public inserts on newsletter_subscribers"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

-- -----------------------------------------------------------------------
-- 2. USER_ROLES: prevent admin-driven privilege escalation.
--    Remove the existing admin INSERT policy so role assignment can only
--    happen via service_role (e.g. database trigger handle_new_user_profile,
--    or a dedicated server-side edge function). Admins can no longer
--    promote arbitrary users to admin/moderator from the client.
-- -----------------------------------------------------------------------

DROP POLICY IF EXISTS "Only admins can insert user roles" ON public.user_roles;

-- Explicitly deny INSERT for all public roles (service_role still bypasses).
DROP POLICY IF EXISTS "Block public role inserts" ON public.user_roles;
CREATE POLICY "Block public role inserts"
  ON public.user_roles
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

-- -----------------------------------------------------------------------
-- 3. SCRAPING_JOBS: defensively sanitise error_message so credentials,
--    bearer tokens, or API keys that may appear in upstream errors are
--    redacted before being persisted and exposed to admin viewers.
-- -----------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.sanitize_scraping_job_error()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.error_message IS NOT NULL THEN
    -- Redact common secret patterns before storage
    NEW.error_message := regexp_replace(NEW.error_message, '(?i)(bearer\s+)[A-Za-z0-9._\-]+', '\1[REDACTED]', 'g');
    NEW.error_message := regexp_replace(NEW.error_message, '(?i)(api[_-]?key["'':\s=]+)[A-Za-z0-9._\-]+', '\1[REDACTED]', 'g');
    NEW.error_message := regexp_replace(NEW.error_message, '(?i)(authorization["'':\s=]+)[A-Za-z0-9._\-\s]+', '\1[REDACTED]', 'g');
    NEW.error_message := regexp_replace(NEW.error_message, '(?i)(password["'':\s=]+)[^\s,;}"'']+', '\1[REDACTED]', 'g');
    NEW.error_message := regexp_replace(NEW.error_message, '(?i)(token["'':\s=]+)[A-Za-z0-9._\-]+', '\1[REDACTED]', 'g');
    -- Cap length defensively
    IF length(NEW.error_message) > 2000 THEN
      NEW.error_message := substring(NEW.error_message FROM 1 FOR 2000) || '...[truncated]';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS sanitize_scraping_job_error_trigger ON public.scraping_jobs;
CREATE TRIGGER sanitize_scraping_job_error_trigger
  BEFORE INSERT OR UPDATE ON public.scraping_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.sanitize_scraping_job_error();