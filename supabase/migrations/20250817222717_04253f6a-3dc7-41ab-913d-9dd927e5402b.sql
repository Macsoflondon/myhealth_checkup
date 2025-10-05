-- Create provider_tests table to store scraped test data
CREATE TABLE public.provider_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id TEXT NOT NULL,
  test_name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  category TEXT,
  url TEXT,
  image_url TEXT,
  provider_test_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  scraped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create test_categories table for organizing tests
CREATE TABLE public.test_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scraping_jobs table to track scraping status
CREATE TABLE public.scraping_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  last_scraped TIMESTAMP WITH TIME ZONE,
  next_scrape TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.provider_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraping_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to test data
CREATE POLICY "Provider tests are viewable by everyone" 
ON public.provider_tests 
FOR SELECT 
USING (true);

CREATE POLICY "Test categories are viewable by everyone" 
ON public.test_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only service can manage scraping jobs" 
ON public.scraping_jobs 
FOR ALL 
USING (false);

-- Create indexes for better performance
CREATE INDEX idx_provider_tests_provider_id ON public.provider_tests(provider_id);
CREATE INDEX idx_provider_tests_category ON public.provider_tests(category);
CREATE INDEX idx_provider_tests_active ON public.provider_tests(is_active);
CREATE INDEX idx_test_categories_provider_id ON public.test_categories(provider_id);
CREATE INDEX idx_scraping_jobs_provider_id ON public.scraping_jobs(provider_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_provider_tests_updated_at
BEFORE UPDATE ON public.provider_tests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scraping_jobs_updated_at
BEFORE UPDATE ON public.scraping_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();