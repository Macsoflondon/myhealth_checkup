
-- Rewrite descriptions for Lola Health popular tests so the modal explains the test
-- (the biomarker chips below already list the markers).
UPDATE public.provider_tests SET description =
  'A comprehensive head-to-toe blood test for adults who want a single, in-depth view of their general health, hormones, vitamins and metabolic function. Includes an at-home phlebotomist visit and clinician-reviewed results.'
WHERE provider_id = 'lola-health' AND test_name = 'Peak Insights 70';

UPDATE public.provider_tests SET description =
  'An extended general health screen covering the core systems most people want to monitor — heart, liver, kidney, thyroid, blood sugar, hormones, vitamins and inflammation. Suited to adults who want a thorough annual check-up.'
WHERE provider_id = 'lola-health' AND test_name = 'Vital Check 56';

UPDATE public.provider_tests SET description =
  'A focused panel for anyone investigating fatigue, weight changes, low mood or temperature sensitivity. Looks at thyroid function alongside the adrenal hormones that influence energy and stress response.'
WHERE provider_id = 'lola-health' AND test_name = 'Thyroid & Hormonal Function';

UPDATE public.provider_tests SET description =
  'A men''s wellness panel covering male hormones, lipids, liver, kidney, thyroid, vitamins and inflammation markers. Designed for active men who want a clear picture of performance, recovery and long-term health.'
WHERE provider_id = 'lola-health' AND test_name = 'Male Active Boost 36';

UPDATE public.provider_tests SET description =
  'An in-depth female hormone profile aimed at women tracking cycle health, fertility considerations or perimenopausal changes. Looks at reproductive hormones alongside thyroid and adrenal markers.'
WHERE provider_id = 'lola-health' AND test_name = 'Female Hormones Clarity 31';

UPDATE public.provider_tests SET description =
  'A detailed review of male hormonal balance, including testosterone status, the binding proteins that govern its availability, and supporting thyroid and metabolic markers. Useful for men investigating libido, mood or recovery.'
WHERE provider_id = 'lola-health' AND test_name = 'Male Hormones Clarity 14';

UPDATE public.provider_tests SET description =
  'A foundational female hormone panel covering the key reproductive hormones across the cycle. A practical first step for women exploring cycle irregularity or planning ahead.'
WHERE provider_id = 'lola-health' AND test_name = 'Female Hormones 7';

UPDATE public.provider_tests SET description =
  'An assessment of liver and kidney function for adults monitoring lifestyle factors, medication impact or general organ health. Includes the standard enzyme and filtration markers used in routine clinical review.'
WHERE provider_id = 'lola-health' AND test_name = 'Liver & Kidney Function';

UPDATE public.provider_tests SET description =
  'A standard urinalysis screen looking for early signs of urinary tract infection, kidney stress and metabolic changes. Useful as a quick check alongside a wider blood test or on its own.'
WHERE provider_id = 'lola-health' AND test_name = 'Urinalysis';

UPDATE public.provider_tests SET description =
  'A 6-marker check focused on red and white blood cells — the building blocks reviewed in a typical full blood count. A fast way to spot anaemia, infection or other haematological changes.'
WHERE provider_id = 'lola-health' AND test_name = 'Blood Health Test — 6 Biomarkers | Lola Health';

UPDATE public.provider_tests SET description =
  'A focused cardiovascular risk panel including advanced markers such as ApoB and Lp(a) alongside the standard cholesterol profile. Suited to adults wanting a clearer picture of long-term heart health.'
WHERE provider_id = 'lola-health' AND test_name = 'Cardiovascular Health Blood Test | Lola Health';

UPDATE public.provider_tests SET description =
  'A balanced general health panel covering the most commonly tracked organ, metabolic and nutritional markers. A good annual baseline for adults without specific symptoms.'
WHERE provider_id = 'lola-health' AND test_name = 'Core Health Blood Test — 45 Biomarkers | Lola Health';

UPDATE public.provider_tests SET description =
  'A women''s wellness panel combining hormone profiling with the lipid, liver, kidney, thyroid and vitamin markers used in a thorough annual check-up. Designed for women who want both vitality and baseline organ insight in one test.'
WHERE provider_id = 'lola-health' AND test_name = 'Female Active Boost Blood Test — 39 Biomarkers | Lola Health';

-- Goodbody — counts that were clearly wrong. Set unverifiable counts to NULL so the badge is hidden.
UPDATE public.provider_tests SET biomarker_count = 47
  WHERE provider_id = 'goodbody-clinic' AND test_name = 'Advanced Well Man Blood Test';
UPDATE public.provider_tests SET biomarker_count = 47
  WHERE provider_id = 'goodbody-clinic' AND test_name = 'Advanced Well Woman Blood Test';
UPDATE public.provider_tests SET biomarker_count = 60
  WHERE provider_id = 'goodbody-clinic' AND test_name = 'Premium Complete Blood Test | Book Online today';
UPDATE public.provider_tests SET biomarker_count = 1, description =
  'A simple at-home stool test that detects hidden blood in a sample — an early warning sign for bowel cancer and other lower-gut conditions. Recommended as a regular screen for adults over 50 or those with relevant symptoms.'
  WHERE provider_id = 'goodbody-clinic' AND test_name = 'Bowel Cancer FIT Test - Early Detection';
UPDATE public.provider_tests SET biomarker_count = NULL, description =
  'An advanced multi-cancer early-detection blood test that screens for circulating tumour cells associated with a wide range of cancers. Aimed at adults who want proactive screening alongside their usual health checks.'
  WHERE provider_id = 'goodbody-clinic' AND test_name = 'TruCheck™ - Early Cancer Screening Blood Test';

-- Randox — the placeholder 150 is wrong on most popular tests. Use realistic counts where known
-- and NULL where the public count varies.
UPDATE public.provider_tests SET biomarker_count = 1, description =
  'Measures circulating vitamin D (25-OH) — the form used clinically to assess vitamin D status. Useful for adults monitoring bone health, immunity or low mood, especially in autumn and winter.'
  WHERE provider_id = 'randox' AND test_name = 'Vitamin D Test';

UPDATE public.provider_tests SET biomarker_count = 5, description =
  'A focused thyroid panel covering the key markers used to assess thyroid function and autoimmunity. Helpful when investigating fatigue, weight change or temperature sensitivity.'
  WHERE provider_id = 'randox' AND test_name = 'Thyroid Blood Test';

UPDATE public.provider_tests SET biomarker_count = NULL, description =
  'A male hormone profile delivered via Randox''s rapid finger-prick collection. Looks at testosterone status alongside supporting markers used to interpret hormonal balance.'
  WHERE provider_id = 'randox' AND test_name = 'Male Hormone Quickdraw';

UPDATE public.provider_tests SET biomarker_count = NULL, description =
  'A female hormone profile delivered via Randox''s rapid finger-prick collection. Covers the cycle and fertility markers most commonly reviewed in private practice.'
  WHERE provider_id = 'randox' AND test_name = 'Female Hormone QuickDraw';

UPDATE public.provider_tests SET description =
  'A general health check covering the core organ, metabolic and nutritional markers used in routine annual reviews. Suited to adults wanting a baseline picture of their health.'
  WHERE provider_id = 'randox' AND test_name = 'General Health Test';

-- Medichecks — fill in counts taken from the test names / official descriptions.
UPDATE public.provider_tests SET biomarker_count = 47
  WHERE provider_id = 'medichecks' AND test_name = 'Advanced Well Woman Blood Test';

UPDATE public.provider_tests SET biomarker_count = 47
  WHERE provider_id = 'medichecks' AND test_name = 'Advanced Well Man Blood Test - A Comprehensive Blood Test';

UPDATE public.provider_tests SET biomarker_count = 1
  WHERE provider_id = 'medichecks' AND test_name = 'Cholesterol Blood Test';
