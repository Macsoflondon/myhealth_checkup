// biomarkersChunk2.ts — Auto-generated chunk 2 of 15
// Part of the myhealth checkup Biomarker Library (610 biomarkers total)

export const biomarkersChunk2 = [
  {
    id: "total-protein", name: "Total Protein", abbr: "TP", category: "Liver & Metabolic",
    icon: "🫀",
    what: "Total protein measures the combined amount of all proteins in the blood — primarily albumin (produced by the liver) and globulins (produced by the immune system). The balance between these two is expressed as the albumin:globulin (A:G) ratio.",
    why: "High total protein may indicate dehydration, chronic infection, or elevated immunoglobulins (as in multiple myeloma or chronic inflammatory states). Low total protein reflects malnutrition, liver disease, or protein loss. The A:G ratio helps distinguish the cause of protein abnormalities.",
    unit: "g/L",
    ranges: {
      both: { low: { range: "< 60 g/L", label: "Low", meaning: "Malnutrition, severe liver disease, protein-losing enteropathy or nephropathy, or severe burns." },
               normal: { range: "60–83 g/L", label: "Normal" },
               high: { range: "> 83 g/L", label: "High", meaning: "Dehydration, chronic infection, multiple myeloma, or other immunoproliferative disorders." } }
    },
    tips: ["The A:G ratio is often more informative than total protein alone.", "A reversed A:G ratio (< 1.0) may indicate liver disease, malnutrition, or excessive immunoglobulin production.", "Total protein is one component of the standard LFT panel — always interpret alongside albumin, ALT, ALP, and GGT."],
    relatedTests: ["Liver Function Tests", "Albumin", "Serum Protein Electrophoresis", "Immunoglobulins"],
  },
  {
    id: "total-cholesterol", name: "Total Cholesterol", abbr: "TC", category: "Cholesterol & Heart",
    icon: "❤️",
    what: "Cholesterol is a fatty substance produced by the liver and found in food. It is essential for building cell membranes and producing hormones. Total cholesterol measures all cholesterol types together.",
    why: "Elevated total cholesterol, particularly LDL, increases the risk of coronary heart disease, heart attack, and stroke. Context is critical — HDL, LDL, and triglycerides must be assessed together.",
    unit: "mmol/L",
    ranges: {
      both: { low: { range: "< 3.0 mmol/L", label: "Low", meaning: "Rare. Can be associated with certain liver conditions, malnutrition, or hyperthyroidism." },
               normal: { range: "< 5.0 mmol/L", label: "Desirable" },
               borderline: { range: "5.0–6.4 mmol/L", label: "Borderline High", meaning: "Consider cardiovascular risk factors." },
               high: { range: "> 6.5 mmol/L", label: "High", meaning: "Significantly elevated cardiovascular risk. Dietary changes and possible statin therapy." } }
    },
    tips: ["Total cholesterol is only meaningful alongside HDL, LDL, and non-HDL cholesterol.", "Fasting is not required for a standard cholesterol test.", "Saturated fat raises LDL more than dietary cholesterol itself.", "Regular exercise raises HDL ('good') cholesterol."],
    relatedTests: ["Cholesterol Panel", "LDL", "HDL", "Triglycerides"],
  },
  {
    id: "ldl", name: "LDL Cholesterol", abbr: "LDL", category: "Cholesterol & Heart",
    icon: "❤️",
    what: "LDL (low-density lipoprotein) carries cholesterol from the liver to cells. Excess LDL can accumulate in artery walls as plaques, leading to atherosclerosis. It is commonly called 'bad' cholesterol.",
    why: "LDL is the primary target for cardiovascular risk reduction. The lower the LDL, the lower the risk.",
    unit: "mmol/L",
    ranges: {
      both: { low: { range: "< 1.4 mmol/L", label: "Very Low (Target for High Risk)", meaning: "Target for those with established cardiovascular disease, diabetes, or very high cardiovascular risk." },
               optimal: { range: "< 2.0 mmol/L", label: "Optimal (High Risk Target)" },
               normal: { range: "< 3.0 mmol/L", label: "Near Optimal" },
               borderline: { range: "3.0–4.9 mmol/L", label: "Borderline High", meaning: "Consider lifestyle modification and cardiovascular risk assessment." },
               high: { range: "> 5.0 mmol/L", label: "High", meaning: "Significantly elevated cardiovascular risk. Statin therapy is usually recommended. Familial hypercholesterolaemia should be excluded." } }
    },
    tips: ["Reducing saturated fats, processed foods, and increasing soluble fibre significantly lowers LDL.", "Familial hypercholesterolaemia causes very high LDL despite a healthy diet.", "Statins are highly effective at reducing LDL and cardiovascular events.", "ApoB is a more accurate predictor of cardiovascular risk than LDL in metabolic syndrome."],
    relatedTests: ["Cholesterol Panel", "Total Cholesterol", "HDL", "Triglycerides", "ApoB"],
  },
  {
    id: "hdl", name: "HDL Cholesterol", abbr: "HDL", category: "Cholesterol & Heart",
    icon: "❤️",
    what: "HDL (high-density lipoprotein) carries cholesterol from tissues back to the liver for removal. Higher HDL is associated with reduced cardiovascular disease risk.",
    why: "Low HDL is an independent cardiovascular risk factor. A high total cholesterol:HDL ratio is more predictive of heart disease risk than total cholesterol alone.",
    unit: "mmol/L",
    ranges: {
      male: { low: { range: "< 1.0 mmol/L", label: "Low", meaning: "Significant cardiovascular risk factor. Associated with metabolic syndrome, smoking, sedentary lifestyle." },
               normal: { range: "1.0–1.4 mmol/L", label: "Acceptable" },
               optimal: { range: "> 1.4 mmol/L", label: "Optimal" },
               high: { range: "> 2.5 mmol/L", label: "Very High", meaning: "Generally protective — very high HDL may occasionally be associated with dysfunctional HDL particles." } },
      female: { low: { range: "< 1.2 mmol/L", label: "Low", meaning: "Cardiovascular risk factor." },
                normal: { range: "1.2–1.7 mmol/L", label: "Acceptable" },
                optimal: { range: "> 1.7 mmol/L", label: "Optimal" } }
    },
    tips: ["Aerobic exercise is the most effective way to raise HDL.", "Smoking significantly lowers HDL — cessation raises it.", "Refined carbohydrates and trans fats lower HDL."],
    relatedTests: ["Cholesterol Panel", "Total Cholesterol", "LDL", "Triglycerides"],
  },
  {
    id: "triglycerides", name: "Triglycerides", abbr: "TG", category: "Cholesterol & Heart",
    icon: "🩺",
    what: "Triglycerides are the most common type of fat in the body. After eating, the body converts unused calories into triglycerides, which are stored in fat cells.",
    why: "High triglycerides are associated with cardiovascular disease, pancreatitis, and metabolic syndrome. They are strongly influenced by diet — particularly sugar, refined carbohydrates, and alcohol.",
    unit: "mmol/L",
    ranges: {
      both: { low: { range: "< 0.5 mmol/L", label: "Low", meaning: "Rare. May indicate malnutrition or hyperthyroidism." },
               normal: { range: "< 1.7 mmol/L", label: "Desirable" },
               borderline: { range: "1.7–5.6 mmol/L", label: "Elevated", meaning: "Associated with metabolic syndrome, insulin resistance, and cardiovascular risk." },
               high: { range: "> 5.6 mmol/L", label: "Very High", meaning: "High risk of pancreatitis. Requires urgent assessment and medication alongside lifestyle change." } }
    },
    tips: ["Triglycerides should be measured fasting (12 hours) for accurate results.", "Cutting sugar and refined carbohydrates is the fastest way to reduce triglycerides.", "Even moderate alcohol consumption raises triglycerides significantly.", "Omega-3 fatty acids (oily fish, flaxseed) actively lower triglycerides."],
    relatedTests: ["Cholesterol Panel", "Fasting Glucose", "HbA1c", "Insulin"],
  },
  {
    id: "apob", name: "Apolipoprotein B", abbr: "ApoB", category: "Cholesterol & Heart",
    icon: "❤️",
    what: "Apolipoprotein B (ApoB) is the primary structural protein of LDL, VLDL, and other atherogenic (artery-clogging) lipoproteins. Each atherogenic lipoprotein particle carries exactly one ApoB molecule — making ApoB count a direct measure of the total number of atherogenic particles in circulation, regardless of their cholesterol content.",
    why: "ApoB is increasingly recognised as a superior predictor of cardiovascular risk compared to LDL cholesterol, especially in people with metabolic syndrome, diabetes, or hypertriglyceridaemia. In these individuals, LDL cholesterol can appear normal while ApoB (and thus particle count) is high — a pattern called discordance that standard LDL testing misses.",
    unit: "g/L",
    ranges: {
      both: { low: { range: "< 0.6 g/L", label: "Low (Target for High Risk)", meaning: "Target level for very high cardiovascular risk. Achieved with high-intensity statin therapy." },
               optimal: { range: "< 0.8 g/L", label: "Optimal" },
               normal: { range: "0.6–1.0 g/L", label: "Near Optimal" },
               borderline: { range: "1.0–1.2 g/L", label: "Borderline High", meaning: "Consider cardiovascular risk context and lifestyle optimisation." },
               high: { range: "> 1.2 g/L", label: "High", meaning: "High atherogenic particle burden — significant cardiovascular risk. Discuss with clinician." } }
    },
    tips: ["ApoB is the most accurate lipid marker for cardiovascular risk in insulin-resistant individuals.", "Guidelines from ESC/EAS now recommend ApoB as a primary treatment target alongside LDL.", "Fasting is not required for ApoB testing.", "ApoB discordance from LDL is common in metabolic syndrome, PCOS, and type 2 diabetes."],
    relatedTests: ["Cholesterol Panel", "LDL", "Non-HDL Cholesterol", "Lp(a)"],
  },
  {
    id: "lpa", name: "Lipoprotein(a)", abbr: "Lp(a)", category: "Cholesterol & Heart",
    icon: "❤️",
    what: "Lipoprotein(a) — Lp(a) — is a unique lipoprotein particle consisting of an LDL-like core with an additional protein called apolipoprotein(a) attached. It is almost entirely genetically determined, with over 90% of the variation between individuals attributed to the LPA gene. Lp(a) levels remain remarkably stable throughout life.",
    why: "Elevated Lp(a) is one of the most common inherited risk factors for cardiovascular disease, affecting approximately 20% of the population. It increases the risk of heart attack, stroke, and aortic valve stenosis independently of LDL. Unlike LDL, Lp(a) does not respond meaningfully to diet or exercise — and standard statins do not reduce it. It should be measured once in all adults.",
    unit: "nmol/L (or mg/dL)",
    ranges: {
      both: { low: { range: "< 75 nmol/L (< 30 mg/dL)", label: "Low Risk", meaning: "Low cardiovascular risk from Lp(a)." },
               normal: { range: "75–125 nmol/L (30–50 mg/dL)", label: "Intermediate", meaning: "Moderate Lp(a)-related risk. Consider in overall cardiovascular risk assessment." },
               high: { range: "> 125 nmol/L (> 50 mg/dL)", label: "High", meaning: "Elevated cardiovascular risk from Lp(a) independent of other factors. Discuss with cardiologist." },
               veryHigh: { range: "> 200 nmol/L (> 80 mg/dL)", label: "Very High", meaning: "High lifetime cardiovascular risk. PCSK9 inhibitors and novel Lp(a)-lowering drugs (under development) are relevant." } }
    },
    tips: ["Test Lp(a) once in your lifetime — levels are genetically set and barely change.", "A family history of premature heart disease or stroke warrants Lp(a) testing even with normal LDL.", "Novel drugs (olpasiran, pelacarsen) specifically targeting Lp(a) are in late-stage clinical trials.", "Niacin can modestly lower Lp(a) but its cardiovascular benefit is debated.", "Lp(a) is reported in different units (nmol/L vs mg/dL) — check which your lab uses."],
    relatedTests: ["Cholesterol Panel", "ApoB", "LDL", "Cardiac Risk Assessment"],
  },
  {
    id: "hba1c", name: "HbA1c (Glycated Haemoglobin)", abbr: "HbA1c", category: "Diabetes & Metabolic",
    icon: "📊",
    what: "HbA1c measures the percentage of haemoglobin coated with glucose. Because red blood cells live for about 3 months, HbA1c reflects your average blood sugar over the past 2–3 months.",
    why: "HbA1c is the gold standard for diagnosing diabetes and pre-diabetes, and for monitoring blood sugar control in people already diagnosed.",
    unit: "mmol/mol (or %)",
    ranges: {
      both: { low: { range: "< 39 mmol/mol (< 5.7%)", label: "Low / Optimal", meaning: "Excellent blood sugar control. Risk of hypoglycaemia if on insulin or medication." },
               normal: { range: "39–47 mmol/mol (5.7–6.4%)", label: "Normal" },
               prediabetes: { range: "48–57 mmol/mol (6.5–7.4%)", label: "Pre-diabetes / At Risk", meaning: "Impaired glucose regulation — significant risk of progressing to Type 2 diabetes. Lifestyle intervention can reverse this." },
               diabetes: { range: "≥ 48 mmol/mol (≥ 6.5%)", label: "Diabetes Diagnostic Threshold", meaning: "A single HbA1c ≥ 48 in the presence of symptoms is diagnostic." } }
    },
    tips: ["Weight loss of even 5–10% of body weight can significantly lower HbA1c.", "Regular physical activity improves insulin sensitivity and lowers HbA1c.", "Haemoglobin variants (e.g. sickle cell trait) can interfere with HbA1c results.", "Fasting is not required for HbA1c testing."],
    relatedTests: ["HbA1c Test", "Fasting Glucose", "Insulin", "Cholesterol Panel"],
  },
  {
    id: "fasting-glucose", name: "Fasting Glucose", abbr: "FBG", category: "Diabetes & Metabolic",
    icon: "📊",
    what: "Fasting blood glucose measures the level of glucose in your blood after a minimum 8-hour fast. It reflects how well the body maintains blood sugar overnight.",
    why: "Elevated fasting glucose is the earliest clinical sign of insulin resistance and pre-diabetes. It is used alongside HbA1c to assess diabetes risk and monitor treatment.",
    unit: "mmol/L",
    ranges: {
      both: { low: { range: "< 3.5 mmol/L", label: "Low (Hypoglycaemia)", meaning: "Can cause shakiness, sweating, confusion. Requires investigation for cause." },
               normal: { range: "3.5–5.5 mmol/L", label: "Normal" },
               prediabetes: { range: "5.6–6.9 mmol/L", label: "Impaired Fasting Glucose", meaning: "Pre-diabetes — high risk of progression to Type 2 diabetes." },
               diabetes: { range: "≥ 7.0 mmol/L", label: "Diabetes Range", meaning: "On two separate occasions, fasting glucose ≥ 7.0 mmol/L is diagnostic of Type 2 diabetes." } }
    },
    tips: ["Test after a minimum 8-hour fast, water only.", "Coffee (even black) can raise fasting glucose.", "Stress and poor sleep both raise fasting glucose.", "Combine with HbA1c for the most comprehensive picture."],
    relatedTests: ["HbA1c Test", "Insulin", "Fasting Lipids"],
  },
  {
    id: "fasting-insulin", name: "Fasting Insulin", abbr: "INS", category: "Diabetes & Metabolic",
    icon: "📊",
    what: "Insulin is the hormone produced by the pancreatic beta cells that enables glucose to enter cells for energy. Fasting insulin measures the baseline level of insulin after an overnight fast — reflecting how hard the pancreas is working to keep fasting glucose in range.",
    why: "Elevated fasting insulin (hyperinsulinaemia) is the hallmark of insulin resistance — the earliest stage of type 2 diabetes development, typically decades before glucose levels rise. Insulin resistance is the underlying driver of metabolic syndrome, PCOS, fatty liver, and cardiovascular disease. It is commonly missed because fasting glucose and HbA1c remain normal until late.",
    unit: "pmol/L",
    ranges: {
      both: { low: { range: "< 18 pmol/L", label: "Low", meaning: "Possible Type 1 diabetes or pancreatic insufficiency if glucose is high. Benign if glucose is normal." },
               normal: { range: "18–60 pmol/L", label: "Normal" },
               borderline: { range: "60–100 pmol/L", label: "Borderline Elevated", meaning: "Possible early insulin resistance — assess with HOMA-IR, fasting glucose, lipids, and BMI." },
               high: { range: "> 100 pmol/L", label: "High — Insulin Resistance", meaning: "Significant insulin resistance — often present decades before type 2 diabetes diagnosis. Lifestyle intervention is essential." } }
    },
    tips: ["Fasting insulin is one of the most underused but informative metabolic tests.", "Always test fasting (minimum 12 hours, no calories) for accurate results.", "Calculate HOMA-IR (Homeostatic Model Assessment of Insulin Resistance) using glucose and insulin together.", "Weight loss, particularly reduction in visceral fat, dramatically improves insulin sensitivity.", "Low-carbohydrate diets and regular resistance exercise are the most effective interventions."],
    relatedTests: ["Insulin Test", "Fasting Glucose", "HbA1c", "HOMA-IR", "Cholesterol Panel"],
  },
  {
    id: "creatinine", name: "Creatinine", abbr: "CREAT", category: "Kidney Function",
    icon: "💧",
    what: "Creatinine is a waste product of muscle metabolism, filtered by the kidneys and excreted in urine. Blood creatinine levels rise when the kidneys are not filtering effectively.",
    why: "Elevated creatinine signals reduced kidney filtration. It is used alongside eGFR to stage chronic kidney disease (CKD).",
    unit: "µmol/L",
    ranges: {
      male: { low: { range: "< 60 µmol/L", label: "Low", meaning: "Low muscle mass, malnutrition, or pregnancy." },
               normal: { range: "60–110 µmol/L", label: "Normal" },
               high: { range: "> 110 µmol/L", label: "High", meaning: "Reduced kidney function, dehydration, high meat intake, rhabdomyolysis, or certain medications." } },
      female: { low: { range: "< 50 µmol/L", label: "Low", meaning: "Low muscle mass or pregnancy." },
                normal: { range: "50–90 µmol/L", label: "Normal" },
                high: { range: "> 90 µmol/L", label: "High", meaning: "Reduced kidney function, dehydration, or excessive protein intake." } }
    },
    tips: ["Creatinine rises after vigorous exercise and high meat meals — avoid the day before testing.", "Always look at eGFR alongside creatinine.", "Creatine supplements raise creatinine — disclose to your clinician."],
    relatedTests: ["Kidney Function Tests", "eGFR", "Urea", "Electrolytes"],
  },
  {
    id: "egfr", name: "eGFR (Estimated GFR)", abbr: "eGFR", category: "Kidney Function",
    icon: "💧",
    what: "eGFR (estimated glomerular filtration rate) is calculated from creatinine, age, and sex to estimate how well the kidneys are filtering waste from the blood. It is the primary tool for diagnosing and staging chronic kidney disease.",
    why: "A declining eGFR indicates worsening kidney function. Kidney disease is silent in early stages.",
    unit: "mL/min/1.73m²",
    ranges: {
      both: {
        note: "eGFR decreases naturally with age — context is important.",
        stages: [
          { stage: "G1 (Normal)", range: "≥ 90", meaning: "Normal or high — may still indicate kidney damage if protein in urine." },
          { stage: "G2 (Mildly decreased)", range: "60–89", meaning: "Mild reduction — monitor annually if stable." },
          { stage: "G3a", range: "45–59", meaning: "Mildly to moderately decreased — CKD Stage 3a." },
          { stage: "G3b", range: "30–44", meaning: "Moderately to severely decreased — nephrology referral may be appropriate." },
          { stage: "G4 (Severely decreased)", range: "15–29", meaning: "Severe CKD — nephrology follow-up essential." },
          { stage: "G5 (Kidney failure)", range: "< 15", meaning: "Kidney failure — dialysis or transplant consideration." },
        ]
      }
    },
    tips: ["eGFR > 60 with no other kidney markers is generally not concerning.", "Protein (albumin) in urine alongside low eGFR significantly increases CKD risk.", "Control blood pressure and blood sugar to slow kidney disease progression.", "NSAIDs (ibuprofen, naproxen) can worsen kidney function — use with caution."],
    relatedTests: ["Kidney Function Tests", "Creatinine", "Urea", "Urine ACR"],
  },
  {
    id: "urea", name: "Urea (BUN)", abbr: "UREA", category: "Kidney Function",
    icon: "💧",
    what: "Urea is the main nitrogen-containing waste product of protein metabolism, formed in the liver from ammonia. It is filtered by the kidneys and excreted in urine. Blood urea levels reflect both kidney filtration capacity and protein intake/metabolism.",
    why: "High urea combined with high creatinine confirms reduced kidney function (uraemia). However, urea can also rise from dehydration, a high protein diet, gastrointestinal bleeding (digested blood provides protein), or steroid use — without kidney impairment. The urea:creatinine ratio helps distinguish these causes.",
    unit: "mmol/L",
    ranges: {
      both: { low: { range: "< 2.5 mmol/L", label: "Low", meaning: "Low protein intake, malnutrition, liver disease (impaired urea synthesis), or overhydration." },
               normal: { range: "2.5–7.8 mmol/L", label: "Normal" },
               high: { range: "> 7.8 mmol/L", label: "High", meaning: "Kidney impairment, dehydration, high protein diet, gastrointestinal bleeding, or steroid use." } }
    },
    tips: ["Urea rises rapidly with dehydration — drink well before testing.", "A urea:creatinine ratio > 100 suggests dehydration or GI bleeding rather than true kidney disease.", "A high protein diet (especially high meat intake) raises urea without kidney disease.", "In chronic kidney disease, protein restriction may be recommended to reduce urea production."],
    relatedTests: ["Kidney Function Tests", "Creatinine", "eGFR", "Urea:Creatinine Ratio"],
  },
  {
    id: "sodium", name: "Sodium", abbr: "Na⁺", category: "Electrolytes",
    icon: "🧂",
    what: "Sodium is the primary electrolyte in the fluid surrounding cells (extracellular fluid) and the main determinant of blood osmolality. It is essential for nerve transmission, muscle contraction, and fluid balance. The kidneys tightly regulate sodium through hormones including aldosterone and ADH (vasopressin).",
    why: "Low sodium (hyponatraemia) is the most common electrolyte disorder. It causes nausea, headache, confusion, and in severe cases seizures and coma — it can be life-threatening. High sodium (hypernatraemia) indicates dehydration or excess sodium intake and causes neurological symptoms.",
    unit: "mmol/L",
    ranges: {
      both: { low: { range: "< 135 mmol/L", label: "Low (Hyponatraemia)", meaning: "Overhydration, heart failure, liver cirrhosis, kidney disease, SIADH, hypothyroidism, Addison's disease, or excessive sweating with hypotonic fluid replacement." },
               normal: { range: "135–145 mmol/L", label: "Normal" },
               high: { range: "> 145 mmol/L", label: "High (Hypernatraemia)", meaning: "Dehydration, diabetes insipidus, excessive sweating without water replacement. Causes neurological symptoms." } }
    },
    tips: ["Most adults consume far more sodium than the recommended 2.3g/day.", "Sodium derangements require careful correction — rapid correction of hyponatraemia can cause osmotic demyelination syndrome.", "SIADH (syndrome of inappropriate ADH secretion) is a common cause of hyponatraemia in hospitalised patients.", "Diuretics are a frequent cause of both hyponatraemia and hypokalaemia."],
    relatedTests: ["Electrolyte Panel", "Potassium", "Urea & Electrolytes", "Osmolality"],
  },
  {
    id: "potassium", name: "Potassium", abbr: "K⁺", category: "Electrolytes",
    icon: "🧂",
    what: "Potassium is the main electrolyte inside cells (intracellular) and is critical for the electrical potential of cell membranes, particularly in heart muscle and nerve cells. Even small changes in blood potassium can have profound effects on heart rhythm.",
    why: "Low potassium (hypokalaemia) causes muscle weakness, cramps, constipation, fatigue, and — critically — cardiac arrhythmias including ventricular fibrillation. High potassium (hyperkalaemia) is potentially more dangerous, causing progressive cardiac conduction abnormalities and cardiac arrest at severe levels.",
    unit: "mmol/L",
    ranges: {
      both: { low: { range: "< 3.5 mmol/L", label: "Low (Hypokalaemia)", meaning: "Cardiac arrhythmia risk, muscle weakness, cramps, constipation. Causes: diuretics, vomiting, diarrhoea, magnesium deficiency, hyperaldosteronism." },
               normal: { range: "3.5–5.0 mmol/L", label: "Normal" },
               high: { range: "> 5.0 mmol/L", label: "High (Hyperkalaemia)", meaning: "Cardiac arrest risk at very high levels. Causes: kidney failure, ACE inhibitors/ARBs, potassium-sparing diuretics, Addison's disease, acidosis." } }
    },
    tips: ["Hypokalaemia and hypomagnesaemia frequently coexist — correct both simultaneously.", "ACE inhibitors and ARBs raise potassium — monitor in those on these medications.", "Licorice root extracts can cause hypokalaemia by mimicking aldosterone.", "Rich dietary potassium sources: bananas, avocados, leafy greens, sweet potatoes, dairy."],
    relatedTests: ["Electrolyte Panel", "Sodium", "Magnesium", "ECG (if arrhythmia suspected)"],
  },
  {
    id: "calcium", name: "Calcium", abbr: "Ca²⁺", category: "Electrolytes",
    icon: "🦴",
    what: "Calcium is the most abundant mineral in the body, with 99% stored in bones and teeth. The remaining 1% in blood and soft tissues plays critical roles in muscle contraction (including the heart), nerve transmission, blood clotting, and hormone secretion. Blood calcium is tightly regulated by PTH and vitamin D.",
    why: "Low calcium (hypocalcaemia) causes muscle cramps, tingling, tetany, and cardiac arrhythmias. High calcium (hypercalcaemia) — commonly caused by primary hyperparathyroidism or cancer — causes fatigue, constipation, kidney stones, confusion, and in severe cases cardiac arrest (the 'bones, stones, groans, and moans' syndrome).",
    unit: "mmol/L",
    ranges: {
      both: { low: { range: "< 2.1 mmol/L", label: "Low (Hypocalcaemia)", meaning: "Vitamin D deficiency, hypoparathyroidism, hypomagnesaemia, malabsorption, or pancreatitis." },
               normal: { range: "2.1–2.6 mmol/L", label: "Normal" },
               high: { range: "> 2.6 mmol/L", label: "High (Hypercalcaemia)", meaning: "Primary hyperparathyroidism (most common), malignancy (bone metastases, PTH-related peptide secretion), sarcoidosis, excess vitamin D, or thyrotoxicosis." } }
    },
    tips: ["Always check albumin alongside calcium — low albumin gives a falsely low calcium reading. Corrected calcium = Ca + 0.02 × (40 – albumin).", "Calcium > 3.0 mmol/L is a medical emergency requiring urgent treatment.", "Asymptomatic mild hypercalcaemia in an otherwise well patient is most commonly primary hyperparathyroidism — a very common, often benign condition.", "Vitamin D toxicity from excessive supplementation is a correctable cause of hypercalcaemia."],
    relatedTests: ["Bone Profile", "PTH", "Vitamin D", "Albumin", "Phosphate"],
  },
  {
    id: "phosphate", name: "Phosphate", abbr: "PO₄³⁻", category: "Electrolytes",
    icon: "🦴",
    what: "Phosphate is the second most abundant mineral in the body after calcium. It forms the structural backbone of DNA and RNA, is a component of ATP (the body's energy currency), and combines with calcium to form hydroxyapatite — the mineral that gives bone its strength. Phosphate balance is regulated by PTH, vitamin D, and FGF-23.",
    why: "Low phosphate (hypophosphataemia) causes muscle weakness, bone pain, and impaired energy production. Very low phosphate (< 0.3 mmol/L) can cause severe muscle weakness, respiratory failure, and haemolysis. High phosphate (hyperphosphataemia) is most commonly due to kidney failure and is a significant cardiovascular risk factor — it contributes to vascular calcification.",
    unit: "mmol/L",
    ranges: {
      both: { low: { range: "< 0.8 mmol/L", label: "Low (Hypophosphataemia)", meaning: "Malnutrition, malabsorption, vitamin D deficiency, hyperparathyroidism, refeeding syndrome, or excess antacid use." },
               normal: { range: "0.8–1.5 mmol/L", label: "Normal" },
               high: { range: "> 1.5 mmol/L", label: "High (Hyperphosphataemia)", meaning: "Kidney failure (most common), hypoparathyroidism, excess vitamin D/calcium supplementation, or rhabdomyolysis." } }
    },
    tips: ["Refeeding syndrome causes severe acute hypophosphataemia — careful nutritional rehabilitation is essential in severely malnourished patients.", "In chronic kidney disease, phosphate binders with meals are prescribed to prevent hyperphosphataemia.", "Phosphate is elevated transiently after eating — test fasting for accurate results.", "Rickets and osteomalacia can cause low phosphate through renal wasting (phosphate diabetes)."],
    relatedTests: ["Bone Profile", "Calcium", "PTH", "Vitamin D", "Kidney Function Tests"],
  },
  {
    id: "pth", name: "Parathyroid Hormone", abbr: "PTH", category: "Bone Health",
    icon: "🦴",
    what: "PTH (parathyroid hormone) is produced by the four tiny parathyroid glands behind the thyroid. It is the primary regulator of blood calcium — when calcium falls, PTH rises, mobilising calcium from bone, increasing kidney calcium reabsorption, and stimulating vitamin D activation to increase gut calcium absorption.",
    why: "High PTH (hyperparathyroidism) — commonly from a benign parathyroid adenoma — causes elevated calcium, kidney stones, bone disease, fatigue, and cognitive symptoms. Low PTH (hypoparathyroidism) — often after neck surgery — causes low calcium with tetany, seizures, and cardiac effects.",
    unit: "pmol/L",
    ranges: {
      both: { low: { range: "< 1.6 pmol/L", label: "Low (Hypoparathyroidism)", meaning: "Post-surgical (thyroid/parathyroid surgery), autoimmune, or genetic. Causes hypocalcaemia and tetany." },
               normal: { range: "1.6–6.9 pmol/L", label: "Normal" },
               high: { range: "> 6.9 pmol/L", label: "High", meaning: "Primary hyperparathyroidism (usually a benign adenoma) causing hypercalcaemia, or secondary hyperparathyroidism from vitamin D deficiency or kidney disease causing low calcium." } }
    },
    tips: ["PTH must always be interpreted alongside serum calcium — the combination defines the diagnosis.", "Secondary hyperparathyroidism from vitamin D deficiency is extremely common in the UK — PTH rises to restore calcium.", "Primary hyperparathyroidism is surprisingly common (up to 0.1–0.3% of the population) and often asymptomatic.", "PTH should be tested fasting for the most accurate result."],
    relatedTests: ["Bone Profile", "Calcium", "Vitamin D", "Phosphate", "24hr Urine Calcium"],
  },
  {
    id: "crp", name: "C-Reactive Protein", abbr: "CRP", category: "Inflammation",
    icon: "🔥",
    what: "CRP is a protein produced by the liver in response to inflammation anywhere in the body. It is a non-specific but highly sensitive marker for acute infection, injury, or chronic inflammatory conditions.",
    why: "Elevated CRP indicates active inflammation but does not pinpoint the cause. High-sensitivity CRP (hs-CRP) at lower levels is a valuable cardiovascular risk marker.",
    unit: "mg/L",
    ranges: {
      both: { normal: { range: "< 5 mg/L", label: "Normal (Standard CRP)" },
               lowRisk: { range: "< 1 mg/L", label: "Low CV Risk (hs-CRP)" },
               avgRisk: { range: "1–3 mg/L", label: "Average CV Risk (hs-CRP)", meaning: "Mild chronic inflammation — associated with metabolic syndrome, cardiovascular risk." },
               elevated: { range: "> 3 mg/L", label: "Elevated Cardiovascular Risk (hs-CRP)", meaning: "High chronic inflammatory state — cardiovascular risk factor if persistent." },
               high: { range: "> 10 mg/L", label: "Significant Inflammation", meaning: "Active infection, autoimmune flare, tissue damage. > 100 mg/L suggests serious bacterial infection." } }
    },
    tips: ["CRP normalises within days to weeks of resolving infection.", "Obesity, smoking, and gum disease chronically elevate CRP.", "Test at a time of wellness for meaningful cardiovascular risk assessment.", "Statin therapy lowers CRP independently of cholesterol effects."],
    relatedTests: ["Inflammation Screen", "ESR", "Full Blood Count", "Ferritin"],
  },
  {
    id: "homocysteine", name: "Homocysteine", abbr: "HCY", category: "Inflammation",
    icon: "🔥",
    what: "Homocysteine is an amino acid produced during the metabolism of methionine from dietary protein. It is normally converted back to useful compounds by enzymes requiring vitamins B6, B12, and folate. When these nutrients are deficient, homocysteine accumulates in the blood.",
    why: "Elevated homocysteine is a cardiovascular risk factor — it damages the endothelium (blood vessel lining), promotes clotting, and accelerates atherosclerosis. It is also associated with stroke, dementia (particularly Alzheimer's disease), venous thromboembolism, and pregnancy complications. Importantly, it is correctable with B vitamin supplementation.",
    unit: "µmol/L",
    ranges: {
      both: { normal: { range: "< 10 µmol/L", label: "Optimal" },
               borderline: { range: "10–15 µmol/L", label: "Borderline", meaning: "Mildly elevated risk. B12, folate, and B6 status should be investigated and optimised." },
               high: { range: "15–30 µmol/L", label: "High", meaning: "Significant cardiovascular and neurological risk. B vitamin deficiency is common cause." },
               veryHigh: { range: "> 30 µmol/L", label: "Very High", meaning: "Severe deficiency or homocystinuria (rare genetic disorder). Thrombosis risk markedly elevated." } }
    },
    tips: ["B12, folate, and B6 supplementation reliably lowers elevated homocysteine.", "Betaine (trimethylglycine) is an alternative remethylation donor that also lowers homocysteine.", "High homocysteine is modifiable — unlike other cardiovascular risk factors, it responds to vitamins.", "Smoking, excessive coffee, and hypothyroidism raise homocysteine.", "MTHFR gene mutations impair folate metabolism and raise homocysteine — methylfolate (5-MTHF) is more effective than folic acid in these individuals."],
    relatedTests: ["Cardiovascular Risk Panel", "B12 & Folate", "CRP", "Cholesterol Panel"],
  },
  {
    id: "troponin", name: "Troponin (hsTnI/hsTnT)", abbr: "TROP", category: "Cardiac Markers",
    icon: "💓",
    what: "Troponins (Troponin I and Troponin T) are structural proteins found in heart muscle cells that are released into the bloodstream when heart muscle is damaged. High-sensitivity troponin assays (hsTnI or hsTnT) can detect even tiny amounts of heart muscle injury.",
    why: "Troponin is the definitive blood test for diagnosing a heart attack (myocardial infarction). A rising troponin level on serial testing (over 3–6 hours) confirms acute cardiac injury. It can also be elevated in other cardiac conditions including myocarditis, heart failure, pulmonary embolism, and sepsis.",
    unit: "ng/L (assay-dependent)",
    ranges: {
      both: { normal: { range: "< 14–19 ng/L (assay-specific)", label: "Normal", meaning: "Below the 99th percentile for the assay — no significant myocardial damage detected." },
               elevated: { range: "Above assay 99th percentile", label: "Elevated", meaning: "Myocardial injury — serial testing over 3h is required to distinguish acute MI from chronic elevation (chronic heart failure, CKD)." },
               high: { range: "Significantly elevated and rising", label: "Acute MI Likely", meaning: "Rising troponin on serial tests strongly indicates acute myocardial infarction — emergency assessment required." } }
    },
    tips: ["A single troponin result is insufficient — serial testing at 0, 3, and 6 hours is standard for suspected MI.", "Troponin can be chronically mildly elevated in kidney disease, heart failure, and myocarditis without an acute MI.", "High-sensitivity assays detect heart damage long before symptoms in some cases.", "If you have chest pain, call emergency services (999) — do not wait for blood test results."],
    relatedTests: ["Cardiac Panel", "BNP/NT-proBNP", "D-Dimer", "ECG"],
  },
  {
    id: "bnp", name: "BNP / NT-proBNP", abbr: "BNP", category: "Cardiac Markers",
    icon: "💓",
    what: "BNP (brain natriuretic peptide) and NT-proBNP (N-terminal pro-BNP) are hormones secreted by the heart ventricles in response to increased wall stress — when the heart is being overloaded or is failing. NT-proBNP is the inactive fragment that remains in circulation longer and is the preferred marker in most UK laboratories.",
    why: "BNP/NT-proBNP is the gold-standard blood test for diagnosing and monitoring heart failure. It distinguishes cardiac causes of breathlessness from respiratory causes (such as asthma or COPD) with high accuracy. It is also used to risk-stratify patients with heart failure and guide treatment intensity.",
    unit: "ng/L (BNP) or pg/mL (NT-proBNP)",
    ranges: {
      both: {
        note: "NT-proBNP reference ranges are age-dependent.",
        stages: [
          { stage: "Low risk / No HF", range: "< 125 pg/mL (NT-proBNP)", meaning: "Heart failure unlikely." },
          { stage: "Intermediate", range: "125–600 pg/mL (NT-proBNP)", meaning: "Consider echocardiogram and clinical assessment." },
          { stage: "Heart failure likely", range: "> 600 pg/mL (NT-proBNP)", meaning: "Heart failure diagnosis likely — echocardiogram required for confirmation and assessment of function." },
          { stage: "Very high risk", range: "> 1000 pg/mL (NT-proBNP)", meaning: "Advanced heart failure with significant morbidity and mortality risk." },
        ]
      }
    },
    tips: ["BNP/NT-proBNP rises with obesity, kidney disease, and atrial fibrillation even without heart failure — adjust interpretation.", "NT-proBNP levels rise with age — age-specific thresholds are used in some guidelines.", "Trending BNP over time is more useful than a single measurement — a falling BNP on treatment indicates a positive response.", "A normal BNP/NT-proBNP makes acute heart failure very unlikely as a cause of breathlessness."],
    relatedTests: ["Cardiac Panel", "Troponin", "Echocardiogram", "Renal Function"],
  },
  {
    id: "psa", name: "Prostate-Specific Antigen", abbr: "PSA", category: "Cancer Screening",
    icon: "🔵",
    what: "PSA is a protein produced by both normal and cancerous prostate cells. Elevated PSA can indicate prostate cancer, but also benign prostate enlargement (BPH), prostatitis, or urinary tract infection.",
    why: "PSA is used as a screening tool for prostate cancer in men aged 50 and over. It is not definitive — further investigation (MRI, biopsy) is needed to confirm cancer.",
    unit: "µg/L (ng/mL)",
    ranges: {
      male: {
        ageRanges: [
          { range: "Age 40–49", normal: "< 2.5 µg/L", borderline: "2.5–4.0 µg/L", high: "> 4.0 µg/L" },
          { range: "Age 50–59", normal: "< 3.5 µg/L", borderline: "3.5–5.0 µg/L", high: "> 5.0 µg/L" },
          { range: "Age 60–69", normal: "< 4.5 µg/L", borderline: "4.5–6.5 µg/L", high: "> 6.5 µg/L" },
          { range: "Age 70+", normal: "< 6.5 µg/L", borderline: "6.5–8.0 µg/L", high: "> 8.0 µg/L" },
        ],
        note: "PSA rises with age. Borderline results warrant repeat testing and specialist referral."
      }
    },
    tips: ["Avoid ejaculation, vigorous cycling, and prostate massage for 48 hours before testing.", "A UTI or catheter can temporarily elevate PSA — delay testing until resolved.", "PSA velocity (rate of rise over time) is as important as a single reading.", "Discuss with your GP before testing."],
    relatedTests: ["PSA Test", "Free PSA", "PSA Density"],
  },
  {
    id: "cea", name: "Carcinoembryonic Antigen", abbr: "CEA", category: "Cancer Screening",
    icon: "🔵",
    what: "CEA (carcinoembryonic antigen) is a glycoprotein normally present at low levels in adults. It can be elevated in certain cancers — particularly colorectal, lung, breast, gastric, and pancreatic cancers — and in non-malignant conditions such as smoking, cirrhosis, and inflammatory bowel disease.",
    why: "CEA is not a primary screening tool for cancer (it lacks sufficient specificity and sensitivity for that purpose). Its main clinical use is monitoring treatment response and detecting recurrence in patients already diagnosed with colorectal or other cancers. A rising CEA after treatment suggests disease recurrence before it is clinically apparent.",
    unit: "µg/L",
    ranges: {
      both: { normal: { range: "< 3.0 µg/L (non-smokers)", label: "Normal" },
               borderline: { range: "3.0–5.0 µg/L", label: "Borderline", meaning: "Mildly elevated. Smoking is a common benign cause. Investigate in context of symptoms and risk factors." },
               high: { range: "> 5.0 µg/L (non-smokers) / > 10 µg/L (smokers)", label: "Elevated", meaning: "Possible malignancy (particularly colorectal cancer) or significant benign disease. Clinical correlation and further investigation required." } }
    },
    tips: ["Smoking significantly raises CEA — smokers have naturally higher baseline CEA levels.", "A normal CEA does not rule out colorectal cancer — CEA is normal in approximately 30% of early-stage colorectal cancers.", "CEA is most useful for monitoring known colorectal cancer — regular testing every 3–6 months post-surgery detects recurrence early.", "Other causes of elevated CEA: cirrhosis, pancreatitis, IBD, hypothyroidism."],
    relatedTests: ["Cancer Screening Panel", "CA 19-9", "CA-125", "Colonoscopy"],
  },
  {
    id: "ana", name: "Antinuclear Antibodies", abbr: "ANA", category: "Autoimmune & Immunology",
    icon: "🧪",
    what: "ANAs (antinuclear antibodies) are a group of autoantibodies that attack the body's own cell nuclei. Their detection in blood is an important screening test for systemic autoimmune diseases. ANAs are reported as a titre (1:40, 1:80, 1:160, etc.) indicating the concentration at which they are still detected on dilution.",
    why: "A positive ANA is the hallmark finding in systemic lupus erythematosus (SLE). It is also positive in other autoimmune conditions including Sjögren's syndrome, systemic sclerosis (scleroderma), mixed connective tissue disease, polymyositis, and drug-induced lupus. Importantly, low-titre ANAs are positive in up to 20% of healthy individuals and are not necessarily clinically significant.",
    unit: "Titre",
    ranges: {
      both: { normal: { range: "< 1:40 or Negative", label: "Negative" },
               borderline: { range: "1:40 to 1:80", label: "Low Positive", meaning: "Clinically significant only in context of symptoms. Present in up to 20% of healthy adults." },
               high: { range: "≥ 1:160", label: "Positive", meaning: "Clinically significant — associated with systemic lupus, Sjögren's, scleroderma, MCTD. ANA subtype testing (anti-dsDNA, anti-Sm, anti-Ro/La, anti-Scl-70, anti-Jo-1) helps identify the specific disease." } }
    },
    tips: ["A positive ANA without symptoms does not indicate disease — 20% of the normal population can test positive.", "The ANA pattern (homogeneous, speckled, nucleolar) provides clues to the specific autoimmune condition.", "If ANA is positive, ANA subtype antibodies (ENA panel, anti-dsDNA) should be tested to identify the specific diagnosis.", "Drug-induced lupus (from hydralazine, procainamide, isoniazid) causes ANA positivity that resolves on stopping the medication."],
    relatedTests: ["Autoimmune Screen", "Anti-dsDNA", "ENA Panel", "CRP", "ESR", "Complement C3/C4"],
  },
  {
    id: "hiv", name: "HIV 1 & 2 Antibody/Antigen", abbr: "HIV Ag/Ab", category: "Infectious Disease",
    icon: "🦠",
    what: "The 4th generation HIV combined antigen/antibody test detects both HIV p24 antigen (a viral protein) and antibodies to HIV-1 and HIV-2. The p24 antigen appears early in infection (within 2–4 weeks), before antibodies develop, making this test the gold standard for HIV screening.",
    why: "HIV (Human Immunodeficiency Virus) causes progressive immune system damage, leading to AIDS (Acquired Immunodeficiency Syndrome) if untreated. Early diagnosis enables life-saving antiretroviral therapy (ART), which suppresses the virus to undetectable levels, prevents AIDS, and means people with HIV now have near-normal life expectancy. Undetectable = Untransmittable (U=U) — those on effective ART cannot transmit HIV sexually.",
    unit: "Positive / Negative",
    ranges: {
      both: { normal: { range: "Negative", label: "HIV Not Detected" },
               high: { range: "Reactive / Positive", label: "Reactive — Requires Confirmatory Testing", meaning: "A reactive result requires confirmatory testing (HIV-1/2 differentiation, HIV RNA PCR). Not all reactive results are true positives — confirmatory testing is essential before diagnosis." } }
    },
    tips: ["The 4th generation test has a 45-day window period — a negative result > 45 days after the last potential exposure is conclusively negative.", "Test every 3–6 months if having regular unprotected sex with new partners.", "PEP (post-exposure prophylaxis) within 72 hours of potential exposure can prevent HIV infection.", "PrEP (pre-exposure prophylaxis) taken daily reduces HIV transmission risk by > 99%.", "HIV testing is now recommended routinely in all healthcare settings in high-prevalence areas."],
    relatedTests: ["Sexual Health Screen", "Hepatitis B", "Hepatitis C", "Syphilis", "STI Screen"],
  },
];
