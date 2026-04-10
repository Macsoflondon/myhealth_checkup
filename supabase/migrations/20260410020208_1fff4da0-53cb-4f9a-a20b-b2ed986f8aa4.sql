
UPDATE public.biomarkers_library SET normal_range_female = 'Age dependent: ~13–54 pmol/L (20–29y), 7–48 pmol/L (30–34y), 1–21 pmol/L (40–44y); use lab''s age-specific range' WHERE biomarker_code = 'AMH';

UPDATE public.biomarkers_library SET normal_range_male = 'Age, sex and assay dependent; interpret against lab''s specific reference interval', normal_range_female = 'Age, cycle stage and assay dependent; interpret against lab''s specific reference interval' WHERE biomarker_code = 'INHB';

UPDATE public.biomarkers_library SET normal_range_male = 'Upper limit often ~100–150 µg/L; local cut-offs and units vary', normal_range_female = 'Upper limit often ~100–150 µg/L; local cut-offs and units vary' WHERE biomarker_code = 'CGA';

UPDATE public.biomarkers_library SET normal_range_male = 'Fasting: typically <100 pg/mL (~50 pmol/L); exact limits vary by lab', normal_range_female = 'Fasting: typically <100 pg/mL (~50 pmol/L); exact limits vary by lab' WHERE biomarker_code = 'GAST';

UPDATE public.biomarkers_library SET normal_range_male = 'Upper limit roughly ≤18 pg/mL; follow range on report', normal_range_female = 'Upper limit roughly ≤10 pg/mL; follow range on report' WHERE biomarker_code = 'CALC';

UPDATE public.biomarkers_library SET normal_range_male = 'Seated: metanephrine <510 pmol/L, normetanephrine <1180 pmol/L, 3-methoxytyramine <180 pmol/L', normal_range_female = 'Seated: metanephrine <510 pmol/L, normetanephrine <1180 pmol/L, 3-methoxytyramine <180 pmol/L' WHERE biomarker_code = 'METAN';

UPDATE public.biomarkers_library SET normal_range_male = '<1.5 IU/L generally negative; thresholds are assay specific', normal_range_female = '<1.5 IU/L generally negative; thresholds are assay specific' WHERE biomarker_code = 'TRAB';

UPDATE public.biomarkers_library SET normal_range_male = '3–30 µg/mL (typically lower in men); assay specific', normal_range_female = '3–30 µg/mL (typically higher in women); assay specific' WHERE biomarker_code = 'ADPN';

UPDATE public.biomarkers_library SET normal_range_male = '~4–20 ng/mL; varies by population and assay', normal_range_female = '~4–20 ng/mL; varies by population and assay' WHERE biomarker_code = 'RSTN';

UPDATE public.biomarkers_library SET normal_range_male = 'Research marker; ~1–10 ng/mL depending on assay', normal_range_female = 'Research marker; ~1–10 ng/mL depending on assay' WHERE biomarker_code = 'VISF';

UPDATE public.biomarkers_library SET normal_range_male = 'Research only; fasting ~1–10 ng/mL; no standard clinical range', normal_range_female = 'Research only; fasting ~1–10 ng/mL; no standard clinical range' WHERE biomarker_code = 'ADRP';

UPDATE public.biomarkers_library SET normal_range_male = '<0.6 mmol/L normal; 0.6–1.5 mild ketosis; >3.0 ketoacidosis', normal_range_female = '<0.6 mmol/L normal; 0.6–1.5 mild ketosis; >3.0 ketoacidosis' WHERE biomarker_code = 'BHB';

UPDATE public.biomarkers_library SET normal_range_male = '<0.3 mmol/L; urine dipstick negative in non-ketotic states', normal_range_female = '<0.3 mmol/L; urine dipstick negative in non-ketotic states' WHERE biomarker_code = 'ACAC';

UPDATE public.biomarkers_library SET normal_range_male = 'LDH-2 slightly higher than LDH-1 in normal pattern; interpretation based on isoenzyme distribution', normal_range_female = 'LDH-2 slightly higher than LDH-1 in normal pattern; interpretation based on isoenzyme distribution' WHERE biomarker_code = 'LDH1';

UPDATE public.biomarkers_library SET normal_range_male = '>50 mg/dL (~125 nmol/L) considered high-risk; interpret against lab cut-offs', normal_range_female = '>50 mg/dL (~125 nmol/L) considered high-risk; interpret against lab cut-offs' WHERE biomarker_code = 'APO_A';

UPDATE public.biomarkers_library SET normal_range_male = '~3.3–19.4 mg/L; lab specific', normal_range_female = '~3.3–19.4 mg/L; lab specific' WHERE biomarker_code = 'FLC_K';

UPDATE public.biomarkers_library SET normal_range_male = '~5.7–26.3 mg/L; some assay variation', normal_range_female = '~5.7–26.3 mg/L; some assay variation' WHERE biomarker_code = 'FLC_L';

UPDATE public.biomarkers_library SET normal_range_male = '~0.26–1.65; renal function and assay can shift range', normal_range_female = '~0.26–1.65; renal function and assay can shift range' WHERE biomarker_code = 'FLC_RATIO';

UPDATE public.biomarkers_library SET normal_range_male = '<7.8 mmol/L normal; 7.8–11.0 impaired glucose tolerance; ≥11.1 diabetes', normal_range_female = '<7.8 mmol/L normal; 7.8–11.0 impaired glucose tolerance; ≥11.1 diabetes' WHERE biomarker_code = 'OGTT_2H';

UPDATE public.biomarkers_library SET normal_range_male = 'Negative: anticardiolipin/anti-β2-GPI often <10 GPL/MPL; lupus anticoagulant qualitative with method-specific cut-offs', normal_range_female = 'Negative: anticardiolipin/anti-β2-GPI often <10 GPL/MPL; lupus anticoagulant qualitative with method-specific cut-offs' WHERE biomarker_code = 'APL';
