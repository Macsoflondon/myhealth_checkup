-- Add public SELECT policy for lola_health_products (product catalog should be publicly readable)
CREATE POLICY "Anyone can view lola health products"
  ON public.lola_health_products FOR SELECT TO public
  USING (true);