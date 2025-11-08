-- Add granular email notification preferences to user_preferences table
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS notification_order_updates boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_health_insights boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_promotions boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_test_reminders boolean DEFAULT true;