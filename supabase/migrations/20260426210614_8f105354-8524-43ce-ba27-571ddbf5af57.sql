
CREATE OR REPLACE FUNCTION public.lov_tables_without_policies()
RETURNS TABLE(schemaname text, tablename text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT t.schemaname::text, t.tablename::text
  FROM pg_tables t
  WHERE t.schemaname = 'public'
    AND t.rowsecurity = true
    AND NOT EXISTS (
      SELECT 1 FROM pg_policies p
      WHERE p.schemaname = t.schemaname
        AND p.tablename = t.tablename
    );
$$;

REVOKE ALL ON FUNCTION public.lov_tables_without_policies() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lov_tables_without_policies() TO service_role;
