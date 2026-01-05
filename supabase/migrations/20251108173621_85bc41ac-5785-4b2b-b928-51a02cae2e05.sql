-- Create notification_history table
CREATE TABLE public.notification_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'sms')),
  notification_category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('sent', 'failed', 'pending')),
  recipient TEXT NOT NULL,
  subject TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notification history"
ON public.notification_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification history"
ON public.notification_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_notification_history_user_id ON public.notification_history(user_id);
CREATE INDEX idx_notification_history_created_at ON public.notification_history(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_notification_history_updated_at
BEFORE UPDATE ON public.notification_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();