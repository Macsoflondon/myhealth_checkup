-- Add unique constraint for Lola Health integration
-- This ensures we can use ON CONFLICT for upserts

ALTER TABLE provider_tests 
ADD CONSTRAINT provider_tests_provider_test_unique 
UNIQUE (provider_id, provider_test_id);

-- Insert all Lola Health products into provider_tests table
INSERT INTO provider_tests (
  test_name,
  provider_id,
  category,
  price,
  description,
  url,
  provider_test_id,
  is_active,
  scraped_at
) VALUES
  -- Comprehensive Panels
  ('Core Health 45', 'lola-health', 'General Health', 140.00, 
   'Comprehensive 45-biomarker health panel including blood analysis, cardiovascular health, kidney function, inflammation markers, vitamins and minerals, liver function, thyroid function, diabetes screening, and full blood count. Includes doctor-reviewed results and at-home phlebotomy service.',
   'https://lolahealth.com/products/core-health', 'core-health', true, now()),
  
  ('Core Health 45 Membership', 'lola-health', 'General Health', 165.00,
   'Premium membership version of Core Health 45 with ongoing monitoring. 45 essential biomarkers covering all major health systems with regular testing and continuous health tracking.',
   'https://lolahealth.com/products/core-health-membership', 'core-health-membership', true, now()),

  -- Liver Function Tests
  ('Albumin', 'lola-health', 'Liver Function', 11.88,
   'Albumin blood test measures protein levels in your blood, important for liver and kidney function assessment.',
   'https://lolahealth.com/products/albumin', 'albumin', true, now()),
   
  ('ALP - Alkaline Phosphatase', 'lola-health', 'Liver Function', 11.88,
   'Alkaline Phosphatase test checks liver and bone health. Elevated levels may indicate liver or bone disorders.',
   'https://lolahealth.com/products/alp-alkaline-phosphatase', 'alp-alkaline-phosphatase', true, now()),
   
  ('ALT - Alanine Aminotransferase', 'lola-health', 'Liver Function', 11.88,
   'ALT blood test measures liver enzyme levels. Elevated ALT can indicate liver damage or disease.',
   'https://lolahealth.com/products/alt-alanine-aminotransferase', 'alt-alanine-aminotransferase', true, now()),
   
  ('AST - Aspartate Transaminase', 'lola-health', 'Liver Function', 11.88,
   'AST enzyme test evaluates liver health. Used to diagnose liver conditions and monitor liver function.',
   'https://lolahealth.com/products/ast-aspartate-trasaminase', 'ast-aspartate-trasaminase', true, now()),
   
  ('Bilirubin, Total', 'lola-health', 'Liver Function', 11.88,
   'Total bilirubin test measures bile pigment levels, important for diagnosing liver and gallbladder conditions.',
   'https://lolahealth.com/products/bilirubin-total', 'bilirubin-total', true, now()),
   
  ('Bilirubin T F C', 'lola-health', 'Liver Function', 19.80,
   'Comprehensive bilirubin panel measuring total, free, and conjugated bilirubin for detailed liver assessment.',
   'https://lolahealth.com/products/bilirubin-t-f-c', 'bilirubin-t-f-c', true, now()),
   
  ('Caeruloplasmin', 'lola-health', 'Liver Function', 12.87,
   'Caeruloplasmin test measures copper-carrying protein, useful for diagnosing Wilson''s disease and liver disorders.',
   'https://lolahealth.com/products/caeruloplasmin', 'caeruloplasmin', true, now()),

  -- Cardiovascular Health Tests
  ('Apolipoprotein A1', 'lola-health', 'Heart Health', 29.70,
   'Apolipoprotein A1 test measures "good" HDL protein levels, important for cardiovascular risk assessment.',
   'https://lolahealth.com/products/apolipoprotein-a1', 'apolipoprotein-a1', true, now()),
   
  ('Apolipoprotein B', 'lola-health', 'Heart Health', 29.70,
   'Apolipoprotein B test measures "bad" LDL protein, key marker for heart disease and stroke risk.',
   'https://lolahealth.com/products/apolipoprotein-b', 'apolipoprotein-b', true, now()),
   
  ('Chol:HDL Ratio', 'lola-health', 'Heart Health', 11.88,
   'Cholesterol to HDL ratio calculation provides cardiovascular risk assessment using cholesterol and HDL levels.',
   'https://lolahealth.com/products/chol-hdl-ratio', 'chol-hdl-ratio', true, now()),

  -- Reproductive Hormones & Fertility
  ('Antimullerian Hormone (AMH)', 'lola-health', 'Fertility', 59.40,
   'AMH test assesses ovarian reserve and fertility potential. Essential for women planning pregnancy or evaluating reproductive health.',
   'https://lolahealth.com/products/ovarian-reserve-assessment', 'antimullerian-hormone', true, now()),
   
  ('CA125', 'lola-health', 'Women''s Health', 28.70,
   'CA125 marker test used for ovarian health monitoring and screening. Often used in conjunction with other tests.',
   'https://lolahealth.com/products/ca125', 'ca125', true, now()),
   
  ('Beta-HCG', 'lola-health', 'Pregnancy', 11.88,
   'Beta-HCG pregnancy hormone test for early pregnancy detection and monitoring.',
   'https://lolahealth.com/products/beta-hcg', 'beta-hcg', true, now()),

  -- Inflammation & Immune Tests
  ('Anti-CCP', 'lola-health', 'Inflammation', 34.65,
   'Anti-CCP antibody test for rheumatoid arthritis diagnosis and monitoring.',
   'https://lolahealth.com/products/anti-ccp', 'anti-ccp', true, now()),
   
  ('Arthritis Screen', 'lola-health', 'Inflammation', 49.50,
   'Comprehensive arthritis screening panel including inflammation markers and antibody testing.',
   'https://lolahealth.com/products/arthritis-screen', 'arthritis-screen', true, now()),
   
  ('Candida Albicans IgA/IgG/IgM', 'lola-health', 'Inflammation', 124.00,
   'Comprehensive candida antibody panel measuring immune response to fungal infections.',
   'https://lolahealth.com/products/candida-albicans-iga-igg-igm', 'candida-albicans', true, now()),

  -- Digestive Health
  ('Amylase', 'lola-health', 'Digestive Health', 11.88,
   'Amylase enzyme test for pancreatic function and digestive health assessment.',
   'https://lolahealth.com/products/amylase', 'amylase', true, now()),

  -- Bone Health
  ('Calcium', 'lola-health', 'Bone Health', 11.88,
   'Blood calcium test for bone health, muscle function, and metabolic assessment.',
   'https://lolahealth.com/products/calcium', 'calcium', true, now()),
   
  ('Corrected Calcium', 'lola-health', 'Bone Health', 11.88,
   'Corrected calcium measurement accounting for albumin levels for accurate assessment.',
   'https://lolahealth.com/products/corrected-calcium', 'corrected-calcium', true, now()),

  -- Blood Analysis
  ('Blood Group', 'lola-health', 'General Health', 26.73,
   'ABO blood group typing test to determine your blood type.',
   'https://lolahealth.com/products/abo-blood-group', 'blood-group', true, now()),
   
  ('Blood Group & RH Phenotype Profile', 'lola-health', 'General Health', 147.54,
   'Comprehensive blood typing including ABO group, RH factor, and extended phenotype analysis.',
   'https://lolahealth.com/products/blood-group-rh-phenotype-profile', 'blood-group-rh-phenotype', true, now()),

  -- Hormones & Stress
  ('Cortisol', 'lola-health', 'Hormones', 14.85,
   'Cortisol stress hormone test for adrenal function and stress response assessment.',
   'https://lolahealth.com/products/cortisol', 'cortisol', true, now()),

  -- Sports & Muscle Health
  ('Creatine Kinase', 'lola-health', 'Sports Performance', 11.88,
   'CK enzyme test for muscle damage assessment, important for athletes and exercise monitoring.',
   'https://lolahealth.com/products/creatine-kinase', 'creatine-kinase', true, now()),

  -- Electrolytes & Minerals
  ('Copper (Serum)', 'lola-health', 'Vitamins & Minerals', 14.85,
   'Serum copper test for mineral balance and metabolic function assessment.',
   'https://lolahealth.com/products/copper-serum', 'copper-serum', true, now()),
   
  ('Aluminium', 'lola-health', 'Toxicology', 88.11,
   'Aluminium level testing for environmental exposure and toxicity screening.',
   'https://lolahealth.com/products/aluminium', 'aluminium', true, now())

ON CONFLICT (provider_id, provider_test_id) 
DO UPDATE SET
  test_name = EXCLUDED.test_name,
  price = EXCLUDED.price,
  description = EXCLUDED.description,
  url = EXCLUDED.url,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Update existing lola_health_products table with correct URLs
UPDATE lola_health_products 
SET product_url = REPLACE(product_url, 'lolahealth.co.uk', 'lolahealth.com')
WHERE product_url LIKE '%lolahealth.co.uk%';

-- Add index for faster Lola Health queries
CREATE INDEX IF NOT EXISTS idx_provider_tests_lola_health 
ON provider_tests(provider_id, is_active) 
WHERE provider_id = 'lola-health';