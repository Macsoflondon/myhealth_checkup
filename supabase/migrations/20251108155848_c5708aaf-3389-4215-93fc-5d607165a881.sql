-- Add granular SMS notification preferences to user_preferences table
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS notification_sms_results boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_sms_appointments boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_sms_urgent boolean DEFAULT true;