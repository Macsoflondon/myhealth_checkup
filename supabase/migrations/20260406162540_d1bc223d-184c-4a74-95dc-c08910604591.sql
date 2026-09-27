-- Wrapped 2026-09-27: realtime.messages is owned by supabase_realtime_admin.
-- Production (already applied) is unaffected. A fresh database built from these
-- migrations (Supabase Preview branches, local `supabase db reset`) cannot alter
-- it and previously aborted the whole replay; there these statements are skipped
-- with a NOTICE instead.
DO $rt$
BEGIN
  EXECUTE $sql$
-- Enable RLS on realtime.messages to authorize channel subscriptions
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read realtime messages
-- All published tables are public catalogue data only (no PII)
CREATE POLICY "Authenticated users can receive realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);

-- Deny anonymous/public access to realtime messages
CREATE POLICY "Anonymous users cannot access realtime messages"
ON realtime.messages
FOR SELECT
TO anon
USING (false);
  $sql$;
EXCEPTION WHEN insufficient_privilege THEN
  RAISE NOTICE 'Skipping realtime.messages RLS setup: insufficient privilege (expected outside production)';
END
$rt$;
