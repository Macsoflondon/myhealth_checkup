DROP POLICY IF EXISTS "Anyone can read cached translations" ON public.translations_cache;
REVOKE SELECT ON public.translations_cache FROM anon, authenticated;
-- Rollback:
-- GRANT SELECT ON public.translations_cache TO anon, authenticated;
-- CREATE POLICY "Anyone can read cached translations" ON public.translations_cache FOR SELECT USING (true);