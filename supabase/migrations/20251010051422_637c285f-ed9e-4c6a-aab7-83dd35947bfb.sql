-- Create table for Lola Health products if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lola_health_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  price_gbp NUMERIC(10, 2),
  product_url TEXT,
  areas_covered TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lola_health_products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Lola Health products are viewable by everyone"
ON public.lola_health_products
FOR SELECT
USING (true);

-- Only admins can manage products
CREATE POLICY "Only admins can manage Lola Health products"
ON public.lola_health_products
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_lola_health_products_updated_at
BEFORE UPDATE ON public.lola_health_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();