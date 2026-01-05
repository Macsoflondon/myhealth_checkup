-- Create saved_providers table
CREATE TABLE public.saved_providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  provider_id TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider_id)
);

-- Enable Row Level Security
ALTER TABLE public.saved_providers ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saved providers" 
ON public.saved_providers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can save providers" 
ON public.saved_providers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved providers" 
ON public.saved_providers 
FOR DELETE 
USING (auth.uid() = user_id);