-- Create table for persistent rate limiting
CREATE TABLE public.api_rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  client_key TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for efficient lookups
CREATE INDEX idx_rate_limits_lookup 
  ON public.api_rate_limits(endpoint, client_key, window_start);

-- Enable RLS (public table for edge function access)
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow edge functions to manage rate limits (using service role)
-- No user-facing policies needed as this is internal

-- Add cleanup function for old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  DELETE FROM public.api_rate_limits
  WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$;