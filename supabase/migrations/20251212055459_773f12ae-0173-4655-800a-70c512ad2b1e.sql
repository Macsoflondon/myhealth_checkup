-- Add additional cost and feature tracking columns to provider_tests
ALTER TABLE provider_tests ADD COLUMN IF NOT EXISTS gp_consultation_included boolean DEFAULT false;
ALTER TABLE provider_tests ADD COLUMN IF NOT EXISTS gp_consultation_cost numeric;
ALTER TABLE provider_tests ADD COLUMN IF NOT EXISTS phlebotomy_included boolean DEFAULT false;
ALTER TABLE provider_tests ADD COLUMN IF NOT EXISTS phlebotomy_cost numeric;
ALTER TABLE provider_tests ADD COLUMN IF NOT EXISTS home_kit_available boolean DEFAULT true;
ALTER TABLE provider_tests ADD COLUMN IF NOT EXISTS clinic_visit_available boolean DEFAULT false;
ALTER TABLE provider_tests ADD COLUMN IF NOT EXISTS sample_type text;
ALTER TABLE provider_tests ADD COLUMN IF NOT EXISTS biomarker_count integer;
ALTER TABLE provider_tests ADD COLUMN IF NOT EXISTS biomarkers_list jsonb;

-- Create saved_comparisons table for users to save their comparisons
CREATE TABLE IF NOT EXISTS saved_comparisons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  comparison_name text NOT NULL,
  test_ids text[] NOT NULL,
  category text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE saved_comparisons ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_comparisons
CREATE POLICY "Users can view their own saved comparisons"
  ON saved_comparisons FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved comparisons"
  ON saved_comparisons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved comparisons"
  ON saved_comparisons FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved comparisons"
  ON saved_comparisons FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_saved_comparisons_updated_at
  BEFORE UPDATE ON saved_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();