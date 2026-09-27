-- Wrapped 2026-09-27: realtime.messages is owned by supabase_realtime_admin.
-- Production (already applied) is unaffected. A fresh database built from these
-- migrations (Supabase Preview branches, local `supabase db reset`) cannot alter
-- it and previously aborted the whole replay; there these statements are skipped
-- with a NOTICE instead.
DO $rt$
BEGIN
  EXECUTE $sql$
-- Drop the overly broad authenticated SELECT policy on realtime.messages
DROP POLICY IF EXISTS "Authenticated users can receive realtime messages" ON realtime.messages;

-- Create a scoped policy that restricts authenticated users to public catalogue channels only
-- Users can only subscribe to channels for public data tables (prices, clinics, tests, biomarkers)
CREATE POLICY "Authenticated users can receive scoped realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  -- Allow access only to public catalogue table channels
  -- Realtime channels use the format: realtime:schema:table
  extension = 'presence'
  OR (
    extension = 'postgres_changes'
    AND (
      topic LIKE '%:public:price_updates%'
      OR topic LIKE '%:public:price_history%'
      OR topic LIKE '%:public:provider_tests%'
      OR topic LIKE '%:public:provider_test_mapping%'
      OR topic LIKE '%:public:clinics%'
      OR topic LIKE '%:public:tests_master%'
      OR topic LIKE '%:public:biomarkers_library%'
      OR topic LIKE '%:public:test_categories%'
      OR topic LIKE '%:public:lola_health_products%'
    )
  )
);
  $sql$;
EXCEPTION WHEN insufficient_privilege THEN
  RAISE NOTICE 'Skipping realtime.messages RLS setup: insufficient privilege (expected outside production)';
END
$rt$;
