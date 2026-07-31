CREATE TABLE public.apify_provider_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id text NOT NULL UNIQUE,
  start_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  page_function text NOT NULL,
  link_selector text,
  globs jsonb NOT NULL DEFAULT '[]'::jsonb,
  max_pages_per_crawl integer NOT NULL DEFAULT 300,
  max_concurrency integer NOT NULL DEFAULT 5,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT apify_max_pages_positive CHECK (max_pages_per_crawl > 0 AND max_pages_per_crawl <= 5000),
  CONSTRAINT apify_max_concurrency_positive CHECK (max_concurrency > 0 AND max_concurrency <= 20)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.apify_provider_configs TO authenticated;
GRANT ALL ON public.apify_provider_configs TO service_role;

ALTER TABLE public.apify_provider_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage apify provider configs"
ON public.apify_provider_configs
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_apify_provider_configs_updated_at
BEFORE UPDATE ON public.apify_provider_configs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.apify_provider_configs
  (provider_id, start_urls, link_selector, globs, max_pages_per_crawl, max_concurrency, page_function)
VALUES
(
  'medichecks',
  '[{"url":"https://www.medichecks.com/collections/all"}]'::jsonb,
  'a[href*="/products/"]',
  '["https://www.medichecks.com/products/*","https://www.medichecks.com/collections/*"]'::jsonb,
  600,
  4,
  $pf$async function pageFunction(context) {
  const { $, request } = context;
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
  if (!/\/products\//.test(request.url)) return null;
  const name = clean($('h1').first().text());
  if (!name) return null;
  const priceText = clean($('[class*="price"]').first().text());
  const priceMatch = priceText.match(/([0-9]+(?:\.[0-9]{2})?)/);
  const biomarkers = [];
  $('[class*="biomarker"] li, [id*="biomarker"] li').each(function () {
    const t = clean($(this).text());
    if (t && t.length > 1 && t.length < 80) biomarkers.push(t);
  });
  const body = clean($('body').text());
  const turn = body.match(/results?\s+(?:in|within)\s+([^.,;]{1,40})/i);
  return {
    test_name: name,
    url: request.url,
    base_price: priceMatch ? parseFloat(priceMatch[1]) : null,
    biomarkers_list: biomarkers.length ? biomarkers : null,
    turnaround_raw: turn ? clean(turn[1]) : null,
  };
}$pf$
),
(
  'medical-diagnosis',
  '[{"url":"https://www.medicaldiagnosis.co.uk/collections/all"}]'::jsonb,
  'a[href*="/products/"]',
  '["https://www.medicaldiagnosis.co.uk/products/*","https://www.medicaldiagnosis.co.uk/collections/*"]'::jsonb,
  500,
  4,
  $pf$async function pageFunction(context) {
  const { $, request } = context;
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
  if (!/\/products\//.test(request.url)) return null;
  const name = clean($('h1').first().text());
  if (!name) return null;
  const priceText = clean($('[class*="price"]').first().text());
  const priceMatch = priceText.match(/([0-9]+(?:\.[0-9]{2})?)/);
  const biomarkers = [];
  $('.product__description li, [class*="accordion"] li').each(function () {
    const t = clean($(this).text());
    if (t && t.length > 1 && t.length < 80) biomarkers.push(t);
  });
  const body = clean($('body').text());
  const turn = body.match(/(?:turnaround|results?)\s*(?:time)?\s*(?:in|within|:)?\s*([0-9]{1,2}\s*(?:-|to)?\s*[0-9]{0,2}\s*(?:working\s+)?(?:day|hour)s?)/i);
  return {
    test_name: name,
    url: request.url,
    base_price: priceMatch ? parseFloat(priceMatch[1]) : null,
    biomarkers_list: biomarkers.length ? biomarkers : null,
    turnaround_raw: turn ? clean(turn[1]) : null,
  };
}$pf$
),
(
  'clinilabs',
  '[{"url":"https://www.clinilabs.co.uk/collections/all"}]'::jsonb,
  'a[href*="/products/"]',
  '["https://www.clinilabs.co.uk/products/*","https://www.clinilabs.co.uk/collections/*"]'::jsonb,
  400,
  4,
  $pf$async function pageFunction(context) {
  const { $, request } = context;
  const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
  if (!/\/products\//.test(request.url)) return null;
  const name = clean($('h1').first().text());
  if (!name) return null;
  const priceText = clean($('[class*="price"]').first().text());
  const priceMatch = priceText.match(/([0-9]+(?:\.[0-9]{2})?)/);
  const biomarkers = [];
  $('.product__description li, [class*="tab"] li, [class*="accordion"] li').each(function () {
    const t = clean($(this).text());
    if (t && t.length > 1 && t.length < 80) biomarkers.push(t);
  });
  const body = clean($('body').text());
  const turn = body.match(/(?:turnaround|results?)\s*(?:time)?\s*(?:in|within|:)?\s*([0-9]{1,2}\s*(?:-|to)?\s*[0-9]{0,2}\s*(?:working\s+)?(?:day|hour)s?)/i);
  return {
    test_name: name,
    url: request.url,
    base_price: priceMatch ? parseFloat(priceMatch[1]) : null,
    biomarkers_list: biomarkers.length ? biomarkers : null,
    turnaround_raw: turn ? clean(turn[1]) : null,
  };
}$pf$
);