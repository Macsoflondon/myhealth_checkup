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