-- Create clinics table for storing clinic locations
CREATE TABLE IF NOT EXISTS public.clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  full_address TEXT,
  postal_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  access_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- Allow public read access (this is a public-facing directory)
DROP POLICY IF EXISTS "Clinics are viewable by everyone" ON public.clinics;
CREATE POLICY "Clinics are viewable by everyone"
ON public.clinics
FOR SELECT
USING (true);

-- No INSERT/UPDATE/DELETE policies defined (blocked by default)

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_clinics_postal_code ON public.clinics (postal_code);

-- Seed initial data from existing local JSON
INSERT INTO public.clinics (name, full_address, postal_code, latitude, longitude)
VALUES
  ('London Medical Laboratory - Battersea', '62-64 Falcon Rd, Battersea, London', 'SW11 2LR', 51.469, -0.167),
  ('London Medical Laboratory - Putney', '262 Upper Richmond Rd, London', 'SW15 6TQ', 51.460, -0.214),
  ('London Medical Laboratory - Marylebone', '1 Harley St, London', 'W1G 9QD', 51.516, -0.146)
ON CONFLICT DO NOTHING;