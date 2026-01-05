-- Create storage bucket for test results
INSERT INTO storage.buckets (id, name, public)
VALUES ('test-results', 'test-results', false);

-- RLS policies for test-results bucket
CREATE POLICY "Users can view their own test results"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'test-results' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own test results"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'test-results' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own test results"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'test-results' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own test results"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'test-results' AND auth.uid()::text = (storage.foldername(name))[1]);