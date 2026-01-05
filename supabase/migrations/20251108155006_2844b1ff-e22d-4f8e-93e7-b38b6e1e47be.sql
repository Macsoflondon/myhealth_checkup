-- Add recommendation preference columns to user_preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS recommendation_price_weight integer DEFAULT 3 CHECK (recommendation_price_weight >= 1 AND recommendation_price_weight <= 5),
ADD COLUMN IF NOT EXISTS recommendation_speed_weight integer DEFAULT 3 CHECK (recommendation_speed_weight >= 1 AND recommendation_speed_weight <= 5),
ADD COLUMN IF NOT EXISTS recommendation_comprehensiveness_weight integer DEFAULT 3 CHECK (recommendation_comprehensiveness_weight >= 1 AND recommendation_comprehensiveness_weight <= 5);

-- Add helpful comment
COMMENT ON COLUMN public.user_preferences.recommendation_price_weight IS 'User preference weight for price importance in test recommendations (1-5 scale)';
COMMENT ON COLUMN public.user_preferences.recommendation_speed_weight IS 'User preference weight for speed importance in test recommendations (1-5 scale)';
COMMENT ON COLUMN public.user_preferences.recommendation_comprehensiveness_weight IS 'User preference weight for comprehensiveness importance in test recommendations (1-5 scale)';