-- Restored verbatim from supabase_migrations.schema_migrations (version 20250823054849).
-- md5 of the recorded statements: 9cdfaa25da6959b6459b52c2bc8e7826
-- Production already records this version as applied, so the migration runner never
-- re-runs it there. It runs only when a database is built from scratch (preview
-- branches, local development). See docs/MIGRATION_RECONCILIATION.md.

-- Insert Lola Health test catalog data
INSERT INTO provider_tests (provider_id, test_name, description, price, category, url, is_active, created_at, updated_at) VALUES
('Lola', 'Albumin', 'Liver function test measuring albumin protein levels', 11.88, 'Liver Function', 'https://lolahealth.com/products/albumin', true, now(), now()),
('Lola', 'ALP - Alkaline Phosphatase', 'Liver enzyme test for liver function assessment', 11.88, 'Liver Function', 'https://lolahealth.com/products/alp-alkaline-phosphatase', true, now(), now()),
('Lola', 'ALT - Alanine Aminotransferase', 'Liver enzyme test for liver damage detection', 11.88, 'Liver Function', 'https://lolahealth.com/products/alt-alanine-aminotransferase', true, now(), now()),
('Lola', 'Aluminium', 'Heavy metal testing for aluminium levels', 88.11, 'Heavy Metals', 'https://lolahealth.com/products/abo-blood-group', true, now(), now()),
('Lola', 'Amylase', 'Digestive enzyme test for pancreatic function', 11.88, 'Digestive Health', 'https://lolahealth.com/products/amylase', true, now(), now()),
('Lola', 'Anti-CCP', 'Rheumatoid arthritis antibody test', 34.65, 'Inflammation', 'https://lolahealth.com/products/anti-ccp', true, now(), now()),
('Lola', 'Antimullerian Hormone', 'Ovarian reserve assessment for fertility', 59.40, 'Reproductive Hormones', 'https://lolahealth.com/products/ovarian-reserve-assessment', true, now(), now()),
('Lola', 'Apolipoprotein A1', 'Cardiovascular risk assessment protein', 29.70, 'Cardiovascular Health', 'https://lolahealth.com/products/anti-nuclear-antibodies-ana', true, now(), now()),
('Lola', 'Apolipoprotein B', 'Cardiovascular risk assessment protein', 29.70, 'Cardiovascular Health', 'https://lolahealth.com/products/apolipoprotein-b', true, now(), now()),
('Lola', 'Arthritis Screen', 'Comprehensive arthritis and inflammation testing', 49.50, 'Inflammation', 'https://lolahealth.com/products/arthritis-screen', true, now(), now()),
('Lola', 'AST - Aspartate Transaminase', 'Liver enzyme test for liver function', 11.88, 'Liver Function', 'https://lolahealth.com/products/ast-aspartate-trasaminase', true, now(), now()),
('Lola', 'Beta-HCG', 'Pregnancy hormone test', 11.88, 'Pregnancy', 'https://lolahealth.com/products/beta-hcg', true, now(), now()),
('Lola', 'Bilirubin, Total', 'Liver function and breakdown product test', 11.88, 'Liver Function', 'https://lolahealth.com/products/bilirubin-total', true, now(), now()),
('Lola', 'Bilirubin T F C', 'Comprehensive bilirubin analysis', 19.80, 'Liver Function', 'https://lolahealth.com/products/bilirubin-t-f-c', true, now(), now()),
('Lola', 'Blood Group', 'ABO blood group determination', 26.73, 'Blood Analysis', 'https://lolahealth.com/products/abo-blood-group', true, now(), now()),
('Lola', 'Blood Group & RH Phenotype Profile', 'Comprehensive blood typing and phenotype analysis', 147.54, 'Blood Analysis', 'https://lolahealth.com/products/blood-group-rh-phenotype-profile', true, now(), now()),
('Lola', 'CA125', 'Ovarian cancer marker test', 28.70, 'Reproductive Hormones', 'https://lolahealth.com/products/ca125', true, now(), now()),
('Lola', 'Caeruloplasmin', 'Copper-binding protein for liver function', 12.87, 'Liver Function', 'https://lolahealth.com/products/caeruloplasmin', true, now(), now()),
('Lola', 'Calcium', 'Essential mineral for bone health', 11.88, 'Bone Health', 'https://lolahealth.com/products/caeruloplasmin', true, now(), now()),
('Lola', 'Candida Albicans IgA/IgG/IgM', 'Comprehensive candida antibody testing', 124.00, 'Inflammation', 'https://lolahealth.com/products/candida-albicans-iga-igg-igm', true, now(), now()),
('Lola', 'Chol:HDL (Calculation using Cholesterol & HDL Chol)', 'Cardiovascular risk ratio calculation', 11.88, 'Cardiovascular Health', 'https://lolahealth.com/products/chol-hdl-calculation-using-cholesterol-hdl-chol', true, now(), now()),
('Lola', 'Copper (Serum)', 'Essential trace mineral testing', 14.85, 'Electrolytes', 'https://lolahealth.com/products/copper-serum', true, now(), now()),
('Lola', 'Core Health 45', 'Comprehensive health screening panel', 140.00, 'Full Health Screening', 'https://lolahealth.com/products/core-health', true, now(), now()),
('Lola', 'Core Health 45 Membership', 'Comprehensive health screening with membership benefits', 165.00, 'Full Health Screening', 'https://lolahealth.com/products/core-health-membership', true, now(), now()),
('Lola', 'Corrected Calcium', 'Adjusted calcium levels for accurate assessment', 11.88, 'Bone Health', 'https://lolahealth.com/products/corrected-calcium', true, now(), now()),
('Lola', 'Cortisol', 'Stress hormone testing', 14.85, 'Stress Hormones', 'https://lolahealth.com/products/cortisol', true, now(), now()),
('Lola', 'Creatine Kinase', 'Muscle damage and function assessment', 11.88, 'Muscle Health', 'https://lolahealth.com/products/creatine-kinase', true, now(), now());
