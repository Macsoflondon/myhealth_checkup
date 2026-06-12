
CREATE TABLE public.live_comparison_panels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  panel_name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  rows JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.live_comparison_panels TO anon, authenticated;
GRANT ALL ON public.live_comparison_panels TO service_role;

ALTER TABLE public.live_comparison_panels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view live comparison panels"
  ON public.live_comparison_panels FOR SELECT
  USING (true);

CREATE TRIGGER update_live_comparison_panels_updated_at
  BEFORE UPDATE ON public.live_comparison_panels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.live_comparison_panels (slug, panel_name, display_order, rows) VALUES
('full-blood-count', 'Full Blood Count Panel', 0, '[
  {"name":"Medichecks","bio":"At-home kit · UKAS · 24–48h","badge":"UKAS","variant":"teal","price":"£29","url":"https://www.medichecks.com/products/full-blood-count-blood-test"},
  {"name":"Thriva","bio":"At-home kit · Subscription option","badge":"AT-HOME","variant":"neutral","price":"£39","url":"https://thriva.co/products/full-blood-count"},
  {"name":"Randox Health","bio":"Clinic-based · UKAS · 48–72h","badge":"POPULAR","variant":"pink","price":"£49","url":"https://www.randoxhealth.com/everyman-everywoman"},
  {"name":"Goodbody Health","bio":"Walk-in UK clinics · CQC","badge":"WALK-IN","variant":"neutral","price":"£55","url":"https://www.goodbodyclinic.com/test/full-blood-count-test"},
  {"name":"London Medical Laboratory","bio":"Walk-in London · ISO 15189","badge":"UKAS","variant":"teal","price":"£65","url":"https://www.londonmedicallaboratory.com/product/full-blood-count"}
]'::jsonb),
('thyroid-health', 'Thyroid Health Panel', 1, '[
  {"name":"Medichecks","bio":"At-home kit · UKAS · 24–48h","badge":"UKAS","variant":"teal","price":"£39","url":"https://www.medichecks.com/products/thyroid-function-blood-test"},
  {"name":"Thriva","bio":"At-home kit · Subscription option","badge":"AT-HOME","variant":"neutral","price":"£45","url":"https://thriva.co/products/thyroid"},
  {"name":"Randox Health","bio":"Clinic-based · UKAS · 48–72h","badge":"POPULAR","variant":"pink","price":"£59","url":"https://www.randoxhealth.com/thyroid-profile"},
  {"name":"Goodbody Health","bio":"Walk-in UK clinics · CQC","badge":"WALK-IN","variant":"neutral","price":"£69","url":"https://www.goodbodyclinic.com/test/thyroid-function-test"},
  {"name":"London Medical Laboratory","bio":"Walk-in London · ISO 15189","badge":"UKAS","variant":"teal","price":"£79","url":"https://www.londonmedicallaboratory.com/product/thyroid-function-test"}
]'::jsonb),
('testosterone-check', 'Testosterone Check Panel', 2, '[
  {"name":"Medichecks","bio":"At-home kit · UKAS · 24–48h","badge":"UKAS","variant":"teal","price":"£39","url":"https://www.medichecks.com/products/testosterone-blood-test"},
  {"name":"Thriva","bio":"At-home kit · Subscription option","badge":"AT-HOME","variant":"neutral","price":"£49","url":"https://thriva.co/products/testosterone"},
  {"name":"Randox Health","bio":"Clinic-based · UKAS · 48–72h","badge":"POPULAR","variant":"pink","price":"£65","url":"https://www.randoxhealth.com/male-hormone-profile"},
  {"name":"Goodbody Health","bio":"Walk-in UK clinics · CQC","badge":"WALK-IN","variant":"neutral","price":"£75","url":"https://www.goodbodyclinic.com/test/testosterone-test"},
  {"name":"London Medical Laboratory","bio":"Walk-in London · ISO 15189","badge":"UKAS","variant":"teal","price":"£85","url":"https://www.londonmedicallaboratory.com/product/testosterone-blood-test"}
]'::jsonb);
