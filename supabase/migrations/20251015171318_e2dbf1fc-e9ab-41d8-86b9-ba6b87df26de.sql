-- Fix video storage bucket: Make it private and add proper RLS policies
UPDATE storage.buckets 
SET public = false 
WHERE id = 'videos';

-- Drop existing public access policies
DROP POLICY IF EXISTS "Videos are publicly accessible" ON storage.objects;

-- Create policy for users to view their own videos via signed URLs
CREATE POLICY "Users can view their own videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for users to upload their own videos
CREATE POLICY "Users can upload their own videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'videos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Keep existing update/delete policies (they already check ownership)
-- No changes needed to those

-- Add automatic cleanup function for old health queries (90 day retention)
CREATE OR REPLACE FUNCTION public.cleanup_old_health_queries()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.health_queries
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;

-- Create a scheduled job trigger placeholder
-- Note: Actual scheduling should be done via pg_cron or external cron job
COMMENT ON FUNCTION public.cleanup_old_health_queries() IS 
'Deletes health queries older than 90 days for data privacy compliance. Should be scheduled to run daily via pg_cron or external scheduler.';