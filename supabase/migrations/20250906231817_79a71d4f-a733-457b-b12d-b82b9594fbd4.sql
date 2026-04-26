-- Add provider_id column to clinics table for identifying which provider operates each clinic
ALTER TABLE public.clinics 
ADD COLUMN provider_id text;

-- Create index on provider_id for faster filtering
CREATE INDEX idx_clinics_provider_id ON public.clinics(provider_id);

-- Create spatial index on lat/lon for faster geographic queries
CREATE INDEX idx_clinics_location ON public.clinics USING GIST (
  POINT(longitude, latitude)
);

-- Create index on postal_code for faster postcode searches
CREATE INDEX idx_clinics_postal_code ON public.clinics(postal_code);

-- Update existing clinics with provider_id based on name patterns
UPDATE public.clinics 
SET provider_id = CASE 
  WHEN LOWER(name) LIKE '%london medical laboratory%' THEN 'london-medical-laboratory'
  WHEN LOWER(name) LIKE '%medichecks%' THEN 'medichecks'
  WHEN LOWER(name) LIKE '%goodbody%' THEN 'goodbody-clinic'
  WHEN LOWER(name) LIKE '%tuli health%' THEN 'tuli-health'
  WHEN LOWER(name) LIKE '%thriva%' THEN 'thriva'
  WHEN LOWER(name) LIKE '%randox%' THEN 'randox'
  WHEN LOWER(name) LIKE '%lola health%' THEN 'lola-health'
  ELSE 'unknown'
END;