-- Enable realtime for provider_tests table
ALTER TABLE provider_tests REPLICA IDENTITY FULL;

-- Add table to realtime publication if not already there
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'provider_tests'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE provider_tests;
  END IF;
END $$;