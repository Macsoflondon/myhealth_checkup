-- Create price alert preferences table
CREATE TABLE IF NOT EXISTS public.price_alert_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  test_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  threshold_percentage INTEGER NOT NULL DEFAULT 10,
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_alerted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, test_id, provider)
);

-- Enable RLS
ALTER TABLE public.price_alert_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own alert preferences"
  ON public.price_alert_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alert preferences"
  ON public.price_alert_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alert preferences"
  ON public.price_alert_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alert preferences"
  ON public.price_alert_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_price_alerts_user_enabled ON public.price_alert_preferences(user_id, enabled);
CREATE INDEX idx_price_alerts_test_provider ON public.price_alert_preferences(test_id, provider);

-- Trigger for updated_at
CREATE TRIGGER update_price_alert_preferences_updated_at
  BEFORE UPDATE ON public.price_alert_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();