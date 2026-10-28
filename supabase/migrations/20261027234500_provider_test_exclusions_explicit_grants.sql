-- provider_test_exclusions: set explicit table privileges.
--
-- WHY
--   20261026124821 created public.provider_test_exclusions with RLS and an
--   admin-only SELECT policy, but no GRANT. Supabase's default privileges in
--   schema public therefore gave anon and authenticated every privilege on it.
--   A live check on 27 October 2026 found anon and authenticated holding
--   SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES and TRIGGER. Row level
--   security blocks row access, but it does not apply to TRUNCATE, and it was
--   the only control. On a fresh database (preview branches), defaults differ,
--   so privileges also differed from production.
--
-- WHO USES THE TABLE
--   mhc-randox-scrape and randox-scraper read it with the service role. The
--   block_excluded_provider_tests trigger reads it as SECURITY DEFINER. Admins
--   read it through the "admins read exclusions" policy, which needs SELECT for
--   authenticated. Nothing in the browser writes to it. Rows are added by
--   migration.
--
-- WHAT
--   Revoke everything from PUBLIC, anon and authenticated. Grant SELECT back to
--   authenticated (RLS still limits it to admins). service_role keeps ALL. No
--   policy, trigger, function or data change. A check at the end raises an
--   exception, and so rolls the migration back, if the table does not end in
--   the intended state.
--
-- ROLLBACK (restores the previous broad state, not recommended)
--   GRANT ALL ON TABLE public.provider_test_exclusions TO anon, authenticated;

revoke all on table public.provider_test_exclusions from public, anon, authenticated;
grant select on table public.provider_test_exclusions to authenticated;
grant all on table public.provider_test_exclusions to service_role;

do $check$
declare
  priv text;
begin
  foreach priv in array array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'] loop
    if has_table_privilege('anon', 'public.provider_test_exclusions', priv) then
      raise exception 'provider_test_exclusions: anon still has %', priv;
    end if;
    if priv <> 'SELECT' and has_table_privilege('authenticated', 'public.provider_test_exclusions', priv) then
      raise exception 'provider_test_exclusions: authenticated still has %', priv;
    end if;
    if not has_table_privilege('service_role', 'public.provider_test_exclusions', priv) then
      raise exception 'provider_test_exclusions: service_role lacks %', priv;
    end if;
  end loop;
  if not has_table_privilege('authenticated', 'public.provider_test_exclusions', 'SELECT') then
    raise exception 'provider_test_exclusions: authenticated lacks SELECT';
  end if;
end
$check$;
