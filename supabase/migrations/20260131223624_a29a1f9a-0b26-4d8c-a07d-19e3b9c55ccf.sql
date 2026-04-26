-- Remove NHS Number and Health Information columns from user_profiles
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS nhs_number,
DROP COLUMN IF EXISTS allergies,
DROP COLUMN IF EXISTS medications,
DROP COLUMN IF EXISTS health_conditions,
DROP COLUMN IF EXISTS lifestyle_factors;

-- Remove Email Notification columns from user_preferences
ALTER TABLE public.user_preferences
DROP COLUMN IF EXISTS notification_email,
DROP COLUMN IF EXISTS notification_order_updates,
DROP COLUMN IF EXISTS notification_health_insights,
DROP COLUMN IF EXISTS notification_promotions,
DROP COLUMN IF EXISTS notification_test_reminders;

-- Remove SMS Notification columns from user_preferences
ALTER TABLE public.user_preferences
DROP COLUMN IF EXISTS notification_sms,
DROP COLUMN IF EXISTS notification_sms_results,
DROP COLUMN IF EXISTS notification_sms_appointments,
DROP COLUMN IF EXISTS notification_sms_urgent;