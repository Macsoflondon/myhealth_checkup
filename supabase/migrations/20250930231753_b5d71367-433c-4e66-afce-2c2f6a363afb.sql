-- Create table for storing user health queries and AI recommendations
CREATE TABLE public.health_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query_text TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  ai_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for GDPR compliance
ALTER TABLE public.health_queries ENABLE ROW LEVEL SECURITY;

-- Users can only view their own health queries
CREATE POLICY "Users can view their own health queries"
ON public.health_queries
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own health queries
CREATE POLICY "Users can create their own health queries"
ON public.health_queries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own health queries (GDPR right to deletion)
CREATE POLICY "Users can delete their own health queries"
ON public.health_queries
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_health_queries_user_id ON public.health_queries(user_id);
CREATE INDEX idx_health_queries_created_at ON public.health_queries(created_at DESC);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_health_queries_updated_at
BEFORE UPDATE ON public.health_queries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment for GDPR compliance documentation
COMMENT ON TABLE public.health_queries IS 'Stores user health queries and AI recommendations. GDPR compliant with RLS policies ensuring users can only access their own data. Users have full control to delete their data.';