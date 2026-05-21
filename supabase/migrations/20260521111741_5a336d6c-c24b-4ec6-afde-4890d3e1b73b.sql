
-- Helper: set common review fields plus rich content per biomarker name
-- All ranges are educational only; "optimal" reflects published preventative-health literature.

-- Vitamin D (25-OH)
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['25(OH)D','25-Hydroxyvitamin D','Calcidiol','Vit D'],
  alternate_units = '[{"unit":"nmol/L","conversion_factor":1},{"unit":"ng/mL","conversion_factor":0.4}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"nmol/L","normal_min":50,"normal_max":125,"optimal_min":75,"optimal_max":125,"critical_low":25,"critical_high":250}]'::jsonb,
  what_it_measures = 'The amount of 25-hydroxyvitamin D circulating in the blood, the storage form produced when the liver processes vitamin D from sunlight, food, and supplements.',
  why_it_matters = 'Vitamin D supports calcium absorption, bone strength, immune regulation, and mood. Deficiency is linked to osteoporosis, fatigue, low mood, and reduced immune resilience.',
  what_affects_it = 'Sunlight exposure, latitude and season, skin pigmentation, age, body fat, kidney and liver function, malabsorption conditions, and supplement intake.',
  when_to_retest = 'Typically 12 weeks after starting supplementation, then annually. UK winter months commonly show lower readings.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'Vitamin D';

-- Ferritin
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Serum ferritin','Iron stores'],
  alternate_units = '[{"unit":"µg/L","conversion_factor":1},{"unit":"ng/mL","conversion_factor":1}]'::jsonb,
  reference_ranges = '[
    {"sex":"male","age_min":18,"age_max":120,"unit":"µg/L","normal_min":30,"normal_max":400,"optimal_min":80,"optimal_max":200,"critical_low":15,"critical_high":1000},
    {"sex":"female","age_min":18,"age_max":50,"unit":"µg/L","normal_min":15,"normal_max":200,"optimal_min":50,"optimal_max":150,"critical_low":12,"critical_high":1000},
    {"sex":"female","age_min":51,"age_max":120,"unit":"µg/L","normal_min":30,"normal_max":300,"optimal_min":60,"optimal_max":180,"critical_low":15,"critical_high":1000}
  ]'::jsonb,
  what_it_measures = 'The amount of ferritin, the body''s main iron-storage protein, present in the bloodstream. It reflects total iron reserves.',
  why_it_matters = 'Low ferritin is the earliest sign of iron deficiency, often before haemoglobin drops. High ferritin can indicate inflammation, liver disease, or iron overload.',
  what_affects_it = 'Diet (red meat, leafy greens), menstrual loss, pregnancy, intense endurance training, gastrointestinal bleeding, infection, and inflammatory conditions.',
  when_to_retest = 'Recheck 8–12 weeks after starting iron supplementation, or sooner if symptoms persist.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'Ferritin';

-- Vitamin B12
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Cobalamin','Active B12','Holotranscobalamin'],
  alternate_units = '[{"unit":"pmol/L","conversion_factor":1},{"unit":"pg/mL","conversion_factor":1.355}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"pmol/L","normal_min":150,"normal_max":700,"optimal_min":400,"optimal_max":700,"critical_low":100,"critical_high":1500}]'::jsonb,
  what_it_measures = 'The level of vitamin B12 in serum, essential for red blood cell formation, nerve function, and DNA synthesis.',
  why_it_matters = 'Low B12 causes fatigue, anaemia, tingling in hands and feet, and cognitive symptoms. Vegetarians, vegans, and over-60s are at higher risk.',
  what_affects_it = 'Diet (animal foods), absorption (gastric acid, intrinsic factor), metformin and PPI use, and gastrointestinal conditions such as coeliac or Crohn''s.',
  when_to_retest = 'Recheck 3 months after starting supplementation or treatment, then annually if at risk.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'Vitamin B12';

-- Folate
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Vitamin B9','Folic acid','Serum folate'],
  alternate_units = '[{"unit":"nmol/L","conversion_factor":1},{"unit":"ng/mL","conversion_factor":0.4413}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"nmol/L","normal_min":7,"normal_max":45,"optimal_min":15,"optimal_max":45,"critical_low":3,"critical_high":80}]'::jsonb,
  what_it_measures = 'Folate concentration in serum, a B-vitamin needed for cell division, red blood cell production, and DNA repair.',
  why_it_matters = 'Deficiency causes megaloblastic anaemia and, in pregnancy, increases the risk of neural tube defects.',
  what_affects_it = 'Diet (leafy greens, legumes, fortified cereals), alcohol intake, malabsorption, methotrexate and certain anti-epileptic medications.',
  when_to_retest = 'Recheck 8–12 weeks after supplementation. Women planning pregnancy benefit from earlier confirmation.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name IN ('Folate','Folate (Vitamin B9)');

-- TSH
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Thyroid Stimulating Hormone','Thyrotropin'],
  alternate_units = '[{"unit":"mIU/L","conversion_factor":1},{"unit":"µIU/mL","conversion_factor":1}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"mIU/L","normal_min":0.4,"normal_max":4.0,"optimal_min":1.0,"optimal_max":2.5,"critical_low":0.1,"critical_high":10}]'::jsonb,
  what_it_measures = 'The pituitary hormone that signals the thyroid to produce T4 and T3.',
  why_it_matters = 'TSH is the most sensitive first-line indicator of thyroid function. High TSH suggests an underactive thyroid; low TSH suggests an overactive thyroid.',
  what_affects_it = 'Time of day (highest overnight), illness, pregnancy, biotin supplements, thyroid medication, and iodine status.',
  when_to_retest = '6–8 weeks after a dose change. Annually for stable treated patients.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'TSH';

-- Free T4
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['fT4','Free thyroxine'],
  alternate_units = '[{"unit":"pmol/L","conversion_factor":1},{"unit":"ng/dL","conversion_factor":0.0777}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"pmol/L","normal_min":9,"normal_max":25,"optimal_min":15,"optimal_max":21,"critical_low":5,"critical_high":40}]'::jsonb,
  what_it_measures = 'The unbound, biologically active fraction of thyroxine circulating in blood.',
  why_it_matters = 'Confirms thyroid function alongside TSH. Useful for diagnosing hyperthyroidism, hypothyroidism, and titrating thyroid medication.',
  what_affects_it = 'Thyroid disease, pregnancy, severe illness, oestrogen and biotin supplements.',
  when_to_retest = '6–8 weeks after starting or adjusting levothyroxine.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'Free T4';

-- Free T3
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['fT3','Free triiodothyronine'],
  alternate_units = '[{"unit":"pmol/L","conversion_factor":1},{"unit":"pg/mL","conversion_factor":0.651}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"pmol/L","normal_min":3.5,"normal_max":6.5,"optimal_min":5.0,"optimal_max":6.5,"critical_low":2.0,"critical_high":10}]'::jsonb,
  what_it_measures = 'The unbound, active form of triiodothyronine, the most metabolically potent thyroid hormone.',
  why_it_matters = 'Useful in suspected hyperthyroidism and in monitoring conversion of T4 to T3.',
  what_affects_it = 'Severe illness, fasting, selenium and zinc status, and certain medications.',
  when_to_retest = '6–8 weeks after a medication change or when symptoms warrant it.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'Free T3';

-- HbA1c
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Glycated haemoglobin','A1c','Glycohaemoglobin'],
  alternate_units = '[{"unit":"mmol/mol","conversion_factor":1},{"unit":"%","conversion_factor":0.0915}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"mmol/mol","normal_min":20,"normal_max":41,"optimal_min":20,"optimal_max":35,"critical_low":null,"critical_high":86}]'::jsonb,
  what_it_measures = 'Average blood glucose over the previous 8–12 weeks, expressed as the percentage of haemoglobin bound to glucose.',
  why_it_matters = 'Primary marker for diagnosing and monitoring prediabetes and type 2 diabetes. 42–47 mmol/mol indicates prediabetes; ≥48 mmol/mol indicates diabetes.',
  what_affects_it = 'Carbohydrate intake, physical activity, body composition, sleep, stress, anaemia, haemoglobin variants, and recent blood loss.',
  when_to_retest = 'Every 3–6 months if abnormal, annually if optimal and risk factors present.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'HbA1c';

-- Total Cholesterol
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['TC','Serum cholesterol'],
  alternate_units = '[{"unit":"mmol/L","conversion_factor":1},{"unit":"mg/dL","conversion_factor":38.67}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"mmol/L","normal_min":0,"normal_max":5.0,"optimal_min":3.0,"optimal_max":4.5,"critical_low":null,"critical_high":7.5}]'::jsonb,
  what_it_measures = 'Total cholesterol carried in all lipoprotein particles in the blood.',
  why_it_matters = 'A broad cardiovascular risk indicator. Best interpreted alongside HDL, LDL, ApoB, and triglycerides.',
  what_affects_it = 'Diet (saturated fat), genetics, body weight, physical activity, thyroid status, and statin therapy.',
  when_to_retest = 'Every 1–3 years for healthy adults; every 3 months after starting therapy.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'Total Cholesterol';

-- LDL Cholesterol
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['LDL-C','Low-density lipoprotein cholesterol','Bad cholesterol'],
  alternate_units = '[{"unit":"mmol/L","conversion_factor":1},{"unit":"mg/dL","conversion_factor":38.67}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"mmol/L","normal_min":0,"normal_max":3.0,"optimal_min":1.5,"optimal_max":2.6,"critical_low":null,"critical_high":4.9}]'::jsonb,
  what_it_measures = 'Cholesterol carried in low-density lipoprotein particles, the main driver of atherosclerotic plaque.',
  why_it_matters = 'Primary modifiable cardiovascular risk marker. Lower is better, especially with existing risk factors.',
  what_affects_it = 'Saturated and trans fats, dietary fibre, weight, exercise, genetics (familial hypercholesterolaemia), and statin therapy.',
  when_to_retest = 'Every 1–3 years; 6–12 weeks after starting or adjusting lipid-lowering therapy.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'LDL Cholesterol';

-- HDL Cholesterol
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['HDL-C','High-density lipoprotein cholesterol','Good cholesterol'],
  alternate_units = '[{"unit":"mmol/L","conversion_factor":1},{"unit":"mg/dL","conversion_factor":38.67}]'::jsonb,
  reference_ranges = '[
    {"sex":"male","age_min":18,"age_max":120,"unit":"mmol/L","normal_min":1.0,"normal_max":2.3,"optimal_min":1.2,"optimal_max":1.8,"critical_low":0.8,"critical_high":null},
    {"sex":"female","age_min":18,"age_max":120,"unit":"mmol/L","normal_min":1.2,"normal_max":2.5,"optimal_min":1.4,"optimal_max":2.0,"critical_low":1.0,"critical_high":null}
  ]'::jsonb,
  what_it_measures = 'Cholesterol carried in high-density lipoprotein particles, which transport excess cholesterol back to the liver.',
  why_it_matters = 'Higher HDL is generally protective against cardiovascular disease, though very high values do not provide additional benefit.',
  what_affects_it = 'Aerobic exercise, weight, alcohol intake, smoking, oestrogen, and genetics.',
  when_to_retest = 'Every 1–3 years as part of a lipid profile.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'HDL Cholesterol';

-- Triglycerides
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['TG','Triacylglycerols'],
  alternate_units = '[{"unit":"mmol/L","conversion_factor":1},{"unit":"mg/dL","conversion_factor":88.57}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"mmol/L","normal_min":0,"normal_max":1.7,"optimal_min":0.5,"optimal_max":1.0,"critical_low":null,"critical_high":5.6}]'::jsonb,
  what_it_measures = 'Fasting triglycerides in serum, the main storage form of dietary fat.',
  why_it_matters = 'Elevated triglycerides increase cardiovascular and pancreatitis risk and often track with insulin resistance.',
  what_affects_it = 'Refined carbohydrates, alcohol, weight, recent meals, thyroid status, and uncontrolled diabetes.',
  when_to_retest = 'Every 1–3 years; fasting samples preferred.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'Triglycerides';

-- hs-CRP
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['hsCRP','High-sensitivity C-reactive protein'],
  alternate_units = '[{"unit":"mg/L","conversion_factor":1}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"mg/L","normal_min":0,"normal_max":3.0,"optimal_min":0,"optimal_max":1.0,"critical_low":null,"critical_high":10}]'::jsonb,
  what_it_measures = 'Low-grade systemic inflammation, measured at higher sensitivity than standard CRP.',
  why_it_matters = 'A persistent reading above 2 mg/L indicates higher cardiovascular and metabolic risk independent of cholesterol.',
  what_affects_it = 'Acute infection, recent injury or surgery, smoking, obesity, periodontal disease, and chronic inflammatory conditions.',
  when_to_retest = 'Repeat after 2–4 weeks if elevated to rule out acute infection.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'High-Sensitivity CRP (hs-CRP)';

-- Creatinine
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Serum creatinine','Cr'],
  alternate_units = '[{"unit":"µmol/L","conversion_factor":1},{"unit":"mg/dL","conversion_factor":0.0113}]'::jsonb,
  reference_ranges = '[
    {"sex":"male","age_min":18,"age_max":120,"unit":"µmol/L","normal_min":59,"normal_max":104,"optimal_min":70,"optimal_max":100,"critical_low":null,"critical_high":200},
    {"sex":"female","age_min":18,"age_max":120,"unit":"µmol/L","normal_min":45,"normal_max":84,"optimal_min":55,"optimal_max":80,"critical_low":null,"critical_high":200}
  ]'::jsonb,
  what_it_measures = 'A waste product of muscle metabolism cleared by the kidneys, used to estimate kidney filtration.',
  why_it_matters = 'Rising creatinine indicates reduced kidney function. Reported alongside eGFR for context.',
  what_affects_it = 'Muscle mass, intense exercise, high-protein diets, dehydration, and certain medications (NSAIDs, ACE inhibitors).',
  when_to_retest = 'Annually for healthy adults; more frequently with hypertension, diabetes, or kidney disease.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'Creatinine';

-- eGFR
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Estimated glomerular filtration rate','GFR'],
  alternate_units = '[{"unit":"mL/min/1.73m²","conversion_factor":1}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"mL/min/1.73m²","normal_min":60,"normal_max":120,"optimal_min":90,"optimal_max":120,"critical_low":30,"critical_high":null}]'::jsonb,
  what_it_measures = 'A calculated estimate of how much blood the kidneys filter per minute, based on creatinine, age, sex, and ethnicity.',
  why_it_matters = 'The standard measure of kidney function. Persistent values below 60 indicate chronic kidney disease.',
  what_affects_it = 'Hydration, muscle mass, blood pressure, diabetes control, nephrotoxic medications, and age.',
  when_to_retest = 'Annually; every 3 months if eGFR is below 60.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'eGFR';

-- ALT
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Alanine aminotransferase','SGPT','ALAT'],
  alternate_units = '[{"unit":"U/L","conversion_factor":1},{"unit":"IU/L","conversion_factor":1}]'::jsonb,
  reference_ranges = '[
    {"sex":"male","age_min":18,"age_max":120,"unit":"U/L","normal_min":10,"normal_max":50,"optimal_min":10,"optimal_max":30,"critical_low":null,"critical_high":200},
    {"sex":"female","age_min":18,"age_max":120,"unit":"U/L","normal_min":10,"normal_max":35,"optimal_min":10,"optimal_max":25,"critical_low":null,"critical_high":200}
  ]'::jsonb,
  what_it_measures = 'A liver enzyme released into the bloodstream when liver cells are damaged.',
  why_it_matters = 'The most specific routine marker of liver-cell injury, including fatty liver, hepatitis, and drug toxicity.',
  what_affects_it = 'Alcohol, paracetamol and statin use, fatty liver, viral hepatitis, intense exercise, and obesity.',
  when_to_retest = 'Repeat in 4–8 weeks if mildly elevated; sooner if symptoms or risk factors are present.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name IN ('ALT','ALT (Alanine Aminotransferase)');

-- AST
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Aspartate aminotransferase','SGOT','ASAT'],
  alternate_units = '[{"unit":"U/L","conversion_factor":1}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"U/L","normal_min":10,"normal_max":40,"optimal_min":10,"optimal_max":30,"critical_low":null,"critical_high":200}]'::jsonb,
  what_it_measures = 'An enzyme present in liver, heart, and muscle tissue, released when these cells are damaged.',
  why_it_matters = 'Used alongside ALT to assess liver health. AST/ALT ratio above 2 can suggest alcohol-related liver disease.',
  what_affects_it = 'Alcohol, intense exercise, muscle injury, statins, and liver disease.',
  when_to_retest = 'Repeat with ALT in 4–8 weeks if elevated.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name IN ('AST','AST (Aspartate Aminotransferase)');

-- Sodium
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Na','Serum sodium'],
  alternate_units = '[{"unit":"mmol/L","conversion_factor":1}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"mmol/L","normal_min":135,"normal_max":145,"optimal_min":138,"optimal_max":142,"critical_low":125,"critical_high":155}]'::jsonb,
  what_it_measures = 'The concentration of sodium in serum, the principal electrolyte regulating fluid balance.',
  why_it_matters = 'Abnormal sodium can cause confusion, weakness, and seizures. Often reflects hydration, kidney, or hormonal issues.',
  what_affects_it = 'Hydration, diuretics, vomiting and diarrhoea, heart failure, and adrenal disorders.',
  when_to_retest = 'Annually for healthy adults; more frequently if taking diuretics or with kidney disease.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'Sodium';

-- Potassium
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['K','Serum potassium'],
  alternate_units = '[{"unit":"mmol/L","conversion_factor":1}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"mmol/L","normal_min":3.5,"normal_max":5.1,"optimal_min":4.0,"optimal_max":4.7,"critical_low":2.8,"critical_high":6.0}]'::jsonb,
  what_it_measures = 'The concentration of potassium in serum, critical for nerve and heart muscle function.',
  why_it_matters = 'Both low and high potassium can cause dangerous heart rhythm problems.',
  what_affects_it = 'Kidney function, ACE inhibitors and ARBs, diuretics, severe vomiting or diarrhoea, and haemolysis of the blood sample.',
  when_to_retest = 'As clinically indicated; annually for healthy adults.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'Potassium';

-- Testosterone
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Total testosterone','T'],
  alternate_units = '[{"unit":"nmol/L","conversion_factor":1},{"unit":"ng/dL","conversion_factor":28.84}]'::jsonb,
  reference_ranges = '[
    {"sex":"male","age_min":18,"age_max":49,"unit":"nmol/L","normal_min":10,"normal_max":35,"optimal_min":18,"optimal_max":30,"critical_low":7,"critical_high":50},
    {"sex":"male","age_min":50,"age_max":120,"unit":"nmol/L","normal_min":8,"normal_max":30,"optimal_min":15,"optimal_max":25,"critical_low":6,"critical_high":50},
    {"sex":"female","age_min":18,"age_max":120,"unit":"nmol/L","normal_min":0.3,"normal_max":1.7,"optimal_min":0.6,"optimal_max":1.4,"critical_low":null,"critical_high":3.0}
  ]'::jsonb,
  what_it_measures = 'Total testosterone concentration in serum, the primary androgen in men and a minor sex hormone in women.',
  why_it_matters = 'Affects energy, mood, libido, muscle mass, bone density, and metabolic health. Should be sampled before 10 am.',
  what_affects_it = 'Age, sleep quality, body composition, training load, alcohol, opioids, glucocorticoids, and chronic stress.',
  when_to_retest = 'Repeat low or high readings on a second morning sample 2–4 weeks later.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name IN ('Testosterone','Total Testosterone');

-- SHBG
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Sex hormone binding globulin'],
  alternate_units = '[{"unit":"nmol/L","conversion_factor":1}]'::jsonb,
  reference_ranges = '[
    {"sex":"male","age_min":18,"age_max":120,"unit":"nmol/L","normal_min":18,"normal_max":54,"optimal_min":20,"optimal_max":45,"critical_low":null,"critical_high":null},
    {"sex":"female","age_min":18,"age_max":120,"unit":"nmol/L","normal_min":32,"normal_max":128,"optimal_min":40,"optimal_max":100,"critical_low":null,"critical_high":null}
  ]'::jsonb,
  what_it_measures = 'The protein that binds sex hormones in the blood and regulates how much testosterone and oestradiol is biologically active.',
  why_it_matters = 'Needed to calculate free and bioavailable testosterone. Low SHBG often co-occurs with insulin resistance and fatty liver.',
  what_affects_it = 'Insulin resistance, obesity, thyroid status, oestrogen, anabolic steroids, and ageing.',
  when_to_retest = 'Annually if abnormal; with testosterone profile.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'SHBG';

-- Oestradiol
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['E2','17-beta-estradiol','Estradiol'],
  alternate_units = '[{"unit":"pmol/L","conversion_factor":1},{"unit":"pg/mL","conversion_factor":0.272}]'::jsonb,
  reference_ranges = '[
    {"sex":"female","age_min":18,"age_max":50,"unit":"pmol/L","normal_min":110,"normal_max":1600,"optimal_min":150,"optimal_max":1200,"critical_low":null,"critical_high":null},
    {"sex":"female","age_min":51,"age_max":120,"unit":"pmol/L","normal_min":0,"normal_max":150,"optimal_min":50,"optimal_max":150,"critical_low":null,"critical_high":null},
    {"sex":"male","age_min":18,"age_max":120,"unit":"pmol/L","normal_min":40,"normal_max":160,"optimal_min":60,"optimal_max":140,"critical_low":null,"critical_high":null}
  ]'::jsonb,
  what_it_measures = 'The principal oestrogen, central to female reproductive cycles, bone strength, and cardiovascular health.',
  why_it_matters = 'Varies sharply across the menstrual cycle; key marker for fertility assessment, menopause, and HRT monitoring.',
  what_affects_it = 'Menstrual cycle phase, pregnancy, menopause, HRT and contraception, body composition, and aromatase activity in men.',
  when_to_retest = 'Time to cycle day for premenopausal women. After HRT changes, retest in 6–12 weeks.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name = 'Oestradiol';

-- Cortisol (morning)
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Morning cortisol','AM cortisol','Hydrocortisone'],
  alternate_units = '[{"unit":"nmol/L","conversion_factor":1},{"unit":"µg/dL","conversion_factor":0.0363}]'::jsonb,
  reference_ranges = '[{"sex":"all","age_min":18,"age_max":120,"unit":"nmol/L","normal_min":166,"normal_max":507,"optimal_min":250,"optimal_max":450,"critical_low":80,"critical_high":700}]'::jsonb,
  what_it_measures = 'Cortisol concentration in serum, sampled between 7 and 10 am when levels normally peak.',
  why_it_matters = 'Screens for adrenal insufficiency (low) and Cushing''s syndrome (persistently high). Mid-range morning values are reassuring.',
  what_affects_it = 'Sleep, acute stress, shift work, exogenous steroids, severe illness, and oestrogen-containing contraception.',
  when_to_retest = 'If abnormal, repeat as part of a dynamic test (synacthen or dexamethasone suppression).',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name IN ('Cortisol','Cortisol (Morning)');

-- PSA
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Prostate Specific Antigen','Total PSA'],
  alternate_units = '[{"unit":"µg/L","conversion_factor":1},{"unit":"ng/mL","conversion_factor":1}]'::jsonb,
  reference_ranges = '[
    {"sex":"male","age_min":40,"age_max":49,"unit":"µg/L","normal_min":0,"normal_max":2.5,"optimal_min":0,"optimal_max":1.5,"critical_low":null,"critical_high":10},
    {"sex":"male","age_min":50,"age_max":59,"unit":"µg/L","normal_min":0,"normal_max":3.5,"optimal_min":0,"optimal_max":2.0,"critical_low":null,"critical_high":10},
    {"sex":"male","age_min":60,"age_max":69,"unit":"µg/L","normal_min":0,"normal_max":4.5,"optimal_min":0,"optimal_max":3.0,"critical_low":null,"critical_high":10},
    {"sex":"male","age_min":70,"age_max":120,"unit":"µg/L","normal_min":0,"normal_max":6.5,"optimal_min":0,"optimal_max":4.0,"critical_low":null,"critical_high":10}
  ]'::jsonb,
  what_it_measures = 'A protein produced by the prostate, present in low concentrations in healthy men.',
  why_it_matters = 'Elevated levels can indicate benign enlargement, prostatitis, or prostate cancer. Trend over time is more useful than a single reading.',
  what_affects_it = 'Age, recent ejaculation, cycling, prostate examination, urinary infection, and finasteride or dutasteride therapy.',
  when_to_retest = 'Repeat in 4–6 weeks if elevated, avoiding recent ejaculation or cycling for 48 hours before the test.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name IN ('PSA','PSA (Prostate-Specific Antigen)');

-- Haemoglobin
UPDATE public.biomarkers_library SET
  synonyms = ARRAY['Hb','HGB','Hemoglobin'],
  alternate_units = '[{"unit":"g/L","conversion_factor":1},{"unit":"g/dL","conversion_factor":0.1}]'::jsonb,
  reference_ranges = '[
    {"sex":"male","age_min":18,"age_max":120,"unit":"g/L","normal_min":130,"normal_max":170,"optimal_min":140,"optimal_max":160,"critical_low":80,"critical_high":200},
    {"sex":"female","age_min":18,"age_max":120,"unit":"g/L","normal_min":120,"normal_max":150,"optimal_min":130,"optimal_max":145,"critical_low":80,"critical_high":180}
  ]'::jsonb,
  what_it_measures = 'The oxygen-carrying protein in red blood cells.',
  why_it_matters = 'Low values cause anaemia and fatigue. High values can reflect dehydration, smoking, or rarer marrow conditions.',
  what_affects_it = 'Iron, B12 and folate status, blood loss, altitude, smoking, hydration, and kidney function (via erythropoietin).',
  when_to_retest = 'Annually for healthy adults; 4–8 weeks after starting iron therapy.',
  last_reviewed_at = CURRENT_DATE, reviewed_by = 'myhealth checkup editorial'
WHERE biomarker_name IN ('Haemoglobin');
