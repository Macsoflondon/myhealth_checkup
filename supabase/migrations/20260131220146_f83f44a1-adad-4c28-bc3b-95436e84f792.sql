-- Migrate array columns to text to support field-level encryption
-- The encryption service encrypts arrays as JSON strings, which can't be stored in text[] columns

-- Change allergies from text[] to text
ALTER TABLE public.user_profiles 
ALTER COLUMN allergies TYPE text 
USING CASE 
  WHEN allergies IS NULL THEN NULL
  WHEN array_length(allergies, 1) IS NULL THEN NULL
  ELSE array_to_json(allergies)::text
END;

-- Change medications from text[] to text
ALTER TABLE public.user_profiles 
ALTER COLUMN medications TYPE text 
USING CASE 
  WHEN medications IS NULL THEN NULL
  WHEN array_length(medications, 1) IS NULL THEN NULL
  ELSE array_to_json(medications)::text
END;

-- Change health_conditions from text[] to text
ALTER TABLE public.user_profiles 
ALTER COLUMN health_conditions TYPE text 
USING CASE 
  WHEN health_conditions IS NULL THEN NULL
  WHEN array_length(health_conditions, 1) IS NULL THEN NULL
  ELSE array_to_json(health_conditions)::text
END;

-- Add comments explaining the encryption
COMMENT ON COLUMN public.user_profiles.allergies IS 'Encrypted field - stores AES-256-GCM encrypted JSON array';
COMMENT ON COLUMN public.user_profiles.medications IS 'Encrypted field - stores AES-256-GCM encrypted JSON array';
COMMENT ON COLUMN public.user_profiles.health_conditions IS 'Encrypted field - stores AES-256-GCM encrypted JSON array';