-- Health Data Integration Tables

-- User health data from various sources
CREATE TABLE public.user_health_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data_source text NOT NULL, -- 'manual', 'google_fit', 'apple_health', 'upload'
  metric_type text NOT NULL, -- 'heart_rate', 'steps', 'sleep', 'blood_pressure', etc.
  value numeric NOT NULL,
  unit text,
  recorded_at timestamptz NOT NULL,
  synced_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Uploaded test results
CREATE TABLE public.uploaded_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_name text NOT NULL,
  provider_id text,
  test_date date NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  file_url text,
  parsed_data jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Individual biomarker readings from uploaded tests
CREATE TABLE public.biomarker_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_test_result_id uuid REFERENCES public.uploaded_test_results(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  biomarker_name text NOT NULL,
  value numeric NOT NULL,
  unit text,
  reference_range_min numeric,
  reference_range_max numeric,
  status text CHECK (status IN ('low', 'normal', 'high', 'critical')),
  recorded_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Wearable device connections
CREATE TABLE public.wearable_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL, -- 'google_fit', 'fitbit', 'apple_health'
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  connected_at timestamptz DEFAULT now(),
  last_sync_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Health scores tracking
CREATE TABLE public.user_health_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  overall_score int CHECK (overall_score >= 0 AND overall_score <= 100),
  heart_score int CHECK (heart_score >= 0 AND heart_score <= 100),
  metabolic_score int CHECK (metabolic_score >= 0 AND metabolic_score <= 100),
  hormonal_score int CHECK (hormonal_score >= 0 AND hormonal_score <= 100),
  nutritional_score int CHECK (nutritional_score >= 0 AND nutritional_score <= 100),
  calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biomarker_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_health_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_health_data
CREATE POLICY "Users can view their own health data"
  ON public.user_health_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health data"
  ON public.user_health_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health data"
  ON public.user_health_data FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health data"
  ON public.user_health_data FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for uploaded_test_results
CREATE POLICY "Users can view their own uploaded results"
  ON public.uploaded_test_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploaded results"
  ON public.uploaded_test_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploaded results"
  ON public.uploaded_test_results FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploaded results"
  ON public.uploaded_test_results FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for biomarker_readings
CREATE POLICY "Users can view their own biomarker readings"
  ON public.biomarker_readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own biomarker readings"
  ON public.biomarker_readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own biomarker readings"
  ON public.biomarker_readings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own biomarker readings"
  ON public.biomarker_readings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for wearable_connections
CREATE POLICY "Users can view their own wearable connections"
  ON public.wearable_connections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wearable connections"
  ON public.wearable_connections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wearable connections"
  ON public.wearable_connections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wearable connections"
  ON public.wearable_connections FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user_health_scores
CREATE POLICY "Users can view their own health scores"
  ON public.user_health_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health scores"
  ON public.user_health_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_health_data_user_id ON public.user_health_data(user_id);
CREATE INDEX idx_user_health_data_recorded_at ON public.user_health_data(recorded_at DESC);
CREATE INDEX idx_uploaded_test_results_user_id ON public.uploaded_test_results(user_id);
CREATE INDEX idx_uploaded_test_results_test_date ON public.uploaded_test_results(test_date DESC);
CREATE INDEX idx_biomarker_readings_user_id ON public.biomarker_readings(user_id);
CREATE INDEX idx_biomarker_readings_recorded_at ON public.biomarker_readings(recorded_at DESC);
CREATE INDEX idx_wearable_connections_user_id ON public.wearable_connections(user_id);
CREATE INDEX idx_user_health_scores_user_id ON public.user_health_scores(user_id);
CREATE INDEX idx_user_health_scores_calculated_at ON public.user_health_scores(calculated_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_uploaded_test_results_updated_at
  BEFORE UPDATE ON public.uploaded_test_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wearable_connections_updated_at
  BEFORE UPDATE ON public.wearable_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();