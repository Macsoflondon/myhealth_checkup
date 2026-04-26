-- Phase 1: GDPR-Compliant Database Architecture

-- Extended user profiles with GDPR compliance
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  phone_number TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'United Kingdom',
  nhs_number TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  health_conditions TEXT[], -- Array of conditions
  medications TEXT[], -- Current medications
  allergies TEXT[], -- Known allergies
  lifestyle_factors JSONB, -- Diet, exercise, smoking, alcohol
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deleted'))
);

-- GDPR Consent Management
CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('marketing', 'data_processing', 'data_sharing', 'research', 'communications')),
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  consent_withdrawn_date TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  version TEXT NOT NULL, -- Version of privacy policy/terms
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit Trail for GDPR Compliance
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'view', 'create', 'update', 'delete', 'export', 'download'
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Data Access Requests (GDPR Right to Access)
CREATE TABLE IF NOT EXISTS public.data_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'deletion', 'rectification', 'restriction')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  data_package_url TEXT, -- Secure URL for data export
  notes TEXT
);

-- Enhanced Test Master Database
CREATE TABLE IF NOT EXISTS public.tests_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL,
  test_code TEXT UNIQUE,
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT NOT NULL,
  detailed_description TEXT,
  clinical_significance TEXT,
  who_should_take TEXT,
  preparation_instructions TEXT,
  sample_type TEXT CHECK (sample_type IN ('blood', 'urine', 'saliva', 'swab', 'stool', 'hair')),
  fasting_required BOOLEAN DEFAULT false,
  biomarkers JSONB NOT NULL, -- Array of biomarker objects with details
  typical_turnaround_days INTEGER,
  popularity_score INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Biomarker Library
CREATE TABLE IF NOT EXISTS public.biomarkers_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  biomarker_code TEXT UNIQUE NOT NULL,
  biomarker_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'cardiovascular', 'metabolic', 'hormonal', etc.
  description TEXT NOT NULL,
  clinical_significance TEXT,
  normal_range_male TEXT,
  normal_range_female TEXT,
  unit_of_measurement TEXT,
  interpretation_guide JSONB, -- Low, normal, high interpretations
  related_conditions TEXT[],
  lifestyle_factors TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Provider Test Mapping (cross-reference)
CREATE TABLE IF NOT EXISTS public.provider_test_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_master_id UUID NOT NULL REFERENCES public.tests_master(id) ON DELETE CASCADE,
  provider_id TEXT NOT NULL,
  provider_test_id TEXT NOT NULL,
  provider_test_name TEXT NOT NULL,
  provider_url TEXT,
  current_price NUMERIC(10, 2),
  original_price NUMERIC(10, 2),
  discount_percentage INTEGER,
  availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'out_of_stock', 'discontinued')),
  turnaround_time_days INTEGER,
  sample_collection_method TEXT, -- 'at-home', 'clinic', 'both'
  accreditations TEXT[],
  last_scraped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(test_master_id, provider_id)
);

-- Appointments & Bookings
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_master_id UUID REFERENCES public.tests_master(id) ON DELETE SET NULL,
  provider_id TEXT NOT NULL,
  appointment_type TEXT CHECK (appointment_type IN ('clinic', 'at-home', 'postal')),
  appointment_date TIMESTAMP WITH TIME ZONE,
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no-show')),
  booking_reference TEXT UNIQUE,
  price_paid NUMERIC(10, 2),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  sample_collected_at TIMESTAMP WITH TIME ZONE,
  results_expected_at TIMESTAMP WITH TIME ZONE,
  results_available_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Test Results (Encrypted)
CREATE TABLE IF NOT EXISTS public.test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  test_master_id UUID REFERENCES public.tests_master(id) ON DELETE SET NULL,
  result_date TIMESTAMP WITH TIME ZONE NOT NULL,
  biomarker_results JSONB NOT NULL, -- Encrypted biomarker values
  pdf_url TEXT, -- Encrypted storage URL
  interpretation TEXT,
  flagged_markers TEXT[], -- Out-of-range markers
  provider_id TEXT,
  reviewed_by_professional BOOLEAN DEFAULT false,
  professional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Health Insights (AI-Generated)
CREATE TABLE IF NOT EXISTS public.health_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('recommendation', 'trend', 'risk', 'achievement')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  related_biomarkers TEXT[],
  related_test_results UUID[], -- Array of test_results IDs
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  action_items TEXT[],
  is_read BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_email BOOLEAN DEFAULT true,
  notification_sms BOOLEAN DEFAULT false,
  notification_push BOOLEAN DEFAULT true,
  preferred_language TEXT DEFAULT 'en',
  preferred_units TEXT DEFAULT 'metric' CHECK (preferred_units IN ('metric', 'imperial')),
  dashboard_layout JSONB,
  saved_filters JSONB,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biomarkers_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_test_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_consents
CREATE POLICY "Users can view their own consents" ON public.user_consents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consents" ON public.user_consents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for audit_logs (read-only for users)
CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for data_access_requests
CREATE POLICY "Users can view their own requests" ON public.data_access_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests" ON public.data_access_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for tests_master (public read)
CREATE POLICY "Tests are viewable by everyone" ON public.tests_master
  FOR SELECT USING (is_active = true);

-- RLS Policies for biomarkers_library (public read)
CREATE POLICY "Biomarkers are viewable by everyone" ON public.biomarkers_library
  FOR SELECT USING (true);

-- RLS Policies for provider_test_mapping (public read)
CREATE POLICY "Provider tests are viewable by everyone" ON public.provider_test_mapping
  FOR SELECT USING (availability_status = 'available');

-- RLS Policies for appointments
CREATE POLICY "Users can view their own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for test_results
CREATE POLICY "Users can view their own results" ON public.test_results
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for health_insights
CREATE POLICY "Users can view their own insights" ON public.health_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights" ON public.health_insights
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tests_master_updated_at
  BEFORE UPDATE ON public.tests_master
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_biomarkers_library_updated_at
  BEFORE UPDATE ON public.biomarkers_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_provider_test_mapping_updated_at
  BEFORE UPDATE ON public.provider_test_mapping
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_test_results_updated_at
  BEFORE UPDATE ON public.test_results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- Function to log data access (GDPR audit)
CREATE OR REPLACE FUNCTION public.log_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, new_data)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$;

-- Indexes for performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX idx_tests_master_category ON public.tests_master(category);
CREATE INDEX idx_tests_master_test_code ON public.tests_master(test_code);
CREATE INDEX idx_biomarkers_library_code ON public.biomarkers_library(biomarker_code);
CREATE INDEX idx_provider_test_mapping_test_id ON public.provider_test_mapping(test_master_id);
CREATE INDEX idx_provider_test_mapping_provider ON public.provider_test_mapping(provider_id);
CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_test_results_user_id ON public.test_results(user_id);
CREATE INDEX idx_test_results_date ON public.test_results(result_date);
CREATE INDEX idx_health_insights_user_id ON public.health_insights(user_id);

-- Comments for documentation
COMMENT ON TABLE public.user_profiles IS 'Extended user profile information with GDPR compliance';
COMMENT ON TABLE public.user_consents IS 'GDPR consent management and tracking';
COMMENT ON TABLE public.audit_logs IS 'Complete audit trail for GDPR compliance';
COMMENT ON TABLE public.data_access_requests IS 'GDPR data subject access requests';
COMMENT ON TABLE public.tests_master IS 'Master catalog of all available health tests';
COMMENT ON TABLE public.biomarkers_library IS 'Comprehensive biomarker information database';
COMMENT ON TABLE public.provider_test_mapping IS 'Maps tests across different providers';
COMMENT ON TABLE public.appointments IS 'User appointments and bookings';
COMMENT ON TABLE public.test_results IS 'Encrypted test results storage';
COMMENT ON TABLE public.health_insights IS 'AI-generated health insights and recommendations';
COMMENT ON TABLE public.user_preferences IS 'User preferences and settings';