// biomarkersChunk3.ts — Auto-generated chunk 3 of 15
// Part of the myhealth checkup Biomarker Library (610 biomarkers total)

export const biomarkersChunk3 = [
  {
    id: "hepatitis-b", name: "Hepatitis B Surface Antigen", abbr: "HBsAg", category: "Infectious Disease",
    icon: "🦠",
    what: "The Hepatitis B Surface Antigen (HBsAg) test detects whether the hepatitis B virus (HBV) is currently present in the blood. A positive result indicates an active hepatitis B infection — either acute (recently acquired) or chronic (persisting > 6 months). HBV is a major cause of cirrhosis and liver cancer worldwide.",
    why: "Hepatitis B is a leading cause of chronic liver disease. Approximately 350 million people worldwide have chronic HBV infection. Chronic infection leads to cirrhosis in ~20% and hepatocellular carcinoma (liver cancer) in those with cirrhosis. Effective antiviral treatment (tenofovir, entecavir) and vaccination are available. The complete HBV screen includes surface antigen, core antibody, and surface antibody to determine infection status, immunity, and need for vaccination.",
    unit: "Positive / Negative",
    ranges: {
      both: { normal: { range: "Negative (HBsAg)", label: "No Active Hepatitis B" },
               high: { range: "Positive (HBsAg)", label: "Active Hepatitis B Infection", meaning: "Hepatitis B virus is present. Assess for acute vs chronic infection with HBe antigen, HBV DNA, and liver function tests." } }
    },
    tips: ["The Hepatitis B vaccine is highly effective (> 95% protection) — check immune status (anti-HBs > 10 IU/L confirms immunity).", "All individuals born in HBV-endemic countries should be tested — HBV is particularly prevalent in Asia and sub-Saharan Africa.", "Blood-to-blood contact, sexual transmission, and mother-to-child transmission are the main routes.", "Annual surveillance with AFP and ultrasound is recommended for all those with chronic HBV to detect liver cancer early."],
    relatedTests: ["Liver Screen", "HBcAb", "HBeAg", "HBV DNA", "HIV", "Hepatitis C"],
  },
  {
    id: "hepatitis-c-ab", name: "Hepatitis C Antibody", abbr: "HCV Ab", category: "Infectious Disease",
    icon: "🦠",
    what: "The Hepatitis C antibody test detects antibodies produced by the immune system in response to hepatitis C virus (HCV) infection. A positive result means the person has been exposed to HCV. Importantly, antibodies can persist after the infection has resolved — a positive antibody test must be followed by HCV RNA PCR to confirm active infection.",
    why: "Hepatitis C is a major cause of chronic liver disease, cirrhosis, and liver cancer. Unlike hepatitis B, there is no vaccine. However, direct-acting antiviral (DAA) medications now cure over 95% of chronic HCV infections in 8–12 weeks — making it one of the most curable chronic viral infections. Millions remain undiagnosed — testing is recommended for those with risk factors.",
    unit: "Positive / Negative",
    ranges: {
      both: { normal: { range: "Non-Reactive", label: "No HCV Antibodies Detected" },
               high: { range: "Reactive", label: "HCV Antibodies Detected", meaning: "Either current or previous HCV infection. HCV RNA PCR is required to confirm active infection (PCR positive = active infection; PCR negative = cleared infection)." } }
    },
    tips: ["A positive HCV antibody test alone does not confirm active infection — always follow up with HCV RNA PCR.", "People who inject drugs (PWID) — past or present — should be tested for HCV.", "People who received blood transfusions or organ transplants before 1992 in the UK should be tested.", "HCV is curable — if diagnosed, seek specialist referral for DAA treatment."],
    relatedTests: ["Liver Screen", "HCV RNA PCR", "HCV Genotype", "HIV", "Hepatitis B"],
  },
  {
    id: "calprotectin", name: "Faecal Calprotectin", abbr: "F-CAL", category: "Gut Health",
    icon: "🦠",
    what: "Faecal calprotectin is a protein released from neutrophils (white blood cells) when there is inflammation in the lining of the gut. It is measured in a stool sample and is a highly sensitive marker that distinguishes inflammatory bowel disease (IBD) from irritable bowel syndrome (IBS) — conditions that can present very similarly.",
    why: "Raised faecal calprotectin indicates active gut inflammation. It is the primary non-invasive test for investigating possible IBD (Crohn's disease or ulcerative colitis). A normal calprotectin makes significant gut inflammation very unlikely, reducing unnecessary colonoscopy referrals. It is also used to monitor IBD disease activity and treatment response.",
    unit: "µg/g",
    ranges: {
      both: { normal: { range: "< 50 µg/g", label: "Normal", meaning: "Gut inflammation unlikely. IBS or functional bowel symptoms are more probable than IBD." },
               borderline: { range: "50–200 µg/g", label: "Borderline", meaning: "Mild inflammation — could be IBD, infection, NSAID use, or other causes. Reassess with repeat testing or further investigation." },
               high: { range: "> 200 µg/g", label: "Elevated", meaning: "Significant gut inflammation — IBD (Crohn's, ulcerative colitis), bowel infection, or bowel cancer. Colonoscopy indicated." } }
    },
    tips: ["Calprotectin is a stool test — instructions for collection must be followed carefully.", "Proton pump inhibitors (PPIs), NSAIDs, and bowel infections can temporarily raise calprotectin without IBD.", "Calprotectin > 250 µg/g strongly predicts active IBD and requires urgent colonoscopy referral.", "Normal calprotectin in a patient with bowel symptoms supports a diagnosis of IBS over IBD — offering significant reassurance."],
    relatedTests: ["Gut Health Panel", "CRP", "ESR", "Full Blood Count", "Colonoscopy Referral"],
  },
  {
    id: "h-pylori", name: "Helicobacter pylori", abbr: "H. pylori", category: "Gut Health",
    icon: "🦠",
    what: "Helicobacter pylori (H. pylori) is a bacterium that infects the stomach lining. It is the most common bacterial infection in humans, affecting approximately 50% of the world's population. H. pylori is the primary cause of peptic ulcers and chronic gastritis, and a major risk factor for stomach cancer.",
    why: "H. pylori causes chronic gastric inflammation that can progress to peptic ulcers (in ~15% of infected people), gastric cancer (in ~1–3%), and a rare type of stomach lymphoma (MALT lymphoma). Testing and treatment (a 1–2 week antibiotic course) leads to permanent eradication in > 90%, healing ulcers and dramatically reducing cancer risk.",
    unit: "Positive / Negative",
    ranges: {
      both: { normal: { range: "Negative", label: "H. pylori Not Detected" },
               high: { range: "Positive", label: "H. pylori Detected", meaning: "H. pylori infection confirmed. First-line treatment is triple therapy (PPI + two antibiotics for 7–14 days). Test for eradication 4–6 weeks after treatment completion." } }
    },
    tips: ["Stop PPIs (omeprazole) for 2 weeks and antibiotics for 4 weeks before testing — they can cause false negatives.", "The urea breath test (UBT) and stool antigen test are preferred for detecting active infection.", "After successful eradication of H. pylori, peptic ulcers rarely recur.", "Test for eradication success 4–6 weeks after finishing treatment — do not assume treatment has worked."],
    relatedTests: ["Gut Health Panel", "Full Blood Count", "Ferritin", "Endoscopy if indicated"],
  },
  {
    id: "vitamin-a", name: "Vitamin A (Retinol)", abbr: "VIT A", category: "Iron & Nutrients",
    icon: "🥕",
    what: "Vitamin A is a fat-soluble vitamin essential for vision (particularly night vision), immune function, skin integrity, epithelial cell differentiation, and foetal development. It exists as retinol (preformed vitamin A, found in animal products) and provitamin A carotenoids (found in orange and yellow plants, such as beta-carotene).",
    why: "Vitamin A deficiency is the leading cause of preventable childhood blindness worldwide. It causes night blindness (one of the earliest symptoms), dry eyes (xerophthalmia), increased susceptibility to infection, and poor wound healing. Toxicity from excess supplementation causes liver damage, headaches, bone pain, and is teratogenic in pregnancy.",
    unit: "µmol/L",
    ranges: {
      both: { low: { range: "< 0.7 µmol/L", label: "Deficient", meaning: "Night blindness, xerophthalmia (dry eyes), impaired immunity, and poor skin integrity. Risk of infection." },
               borderline: { range: "0.7–1.0 µmol/L", label: "Borderline", meaning: "Suboptimal — consider dietary review and supplementation in vulnerable groups." },
               normal: { range: "1.0–3.5 µmol/L", label: "Normal" },
               high: { range: "> 3.5 µmol/L", label: "Elevated (Toxicity Risk)", meaning: "Vitamin A toxicity (hypervitaminosis A) — liver damage, headaches, bone abnormalities, teratogenicity in pregnancy." } }
    },
    tips: ["Liver is the richest dietary source of vitamin A — one serving of liver per week can easily meet requirements.", "Vitamin A supplements in pregnancy must not exceed 3,000 µg/day — toxicity causes birth defects.", "Beta-carotene (from vegetables) does not cause toxicity — the body regulates its conversion to retinol.", "Fat malabsorption conditions (Crohn's disease, cystic fibrosis) increase deficiency risk."],
    relatedTests: ["Fat-Soluble Vitamin Panel", "Vitamin D", "Vitamin E", "Liver Function Tests"],
  },
  {
    id: "vitamin-c", name: "Vitamin C (Ascorbic Acid)", abbr: "VIT C", category: "Iron & Nutrients",
    icon: "🍊",
    what: "Vitamin C (ascorbic acid) is a water-soluble vitamin and potent antioxidant. It is essential for collagen synthesis (and therefore wound healing), immune function, iron absorption, and the regeneration of other antioxidants including vitamin E. Humans cannot synthesise vitamin C and must obtain it entirely from diet.",
    why: "Severe vitamin C deficiency causes scurvy — a condition characterised by bleeding gums, easy bruising, corkscrew hairs, perifollicular haemorrhage, and impaired wound healing. While classical scurvy is rare in the UK, subclinical deficiency is more common than appreciated — particularly in smokers, the elderly, and those with poor diets.",
    unit: "µmol/L",
    ranges: {
      both: { low: { range: "< 11 µmol/L", label: "Deficient (Scurvy Range)", meaning: "Scurvy risk — bleeding gums, easy bruising, corkscrew hairs, fatigue, impaired wound healing." },
               borderline: { range: "11–28 µmol/L", label: "Borderline", meaning: "Subclinical deficiency — increased oxidative stress, impaired collagen synthesis, reduced iron absorption." },
               normal: { range: "28–85 µmol/L", label: "Normal" },
               high: { range: "> 85 µmol/L", label: "High", meaning: "Generally safe from dietary sources. Very high supplementation (> 1g/day) may cause kidney stones (oxalate) in susceptible individuals." } }
    },
    tips: ["Smokers require at least 35 mg/day extra vitamin C — smoking destroys ascorbic acid significantly.", "Vitamin C degrades rapidly during cooking, storage, and exposure to air — raw fruits and vegetables retain the most.", "Rich sources: bell peppers, kiwi fruit, strawberries, broccoli, citrus fruits.", "Taking vitamin C with iron supplements doubles non-haem iron absorption — important in iron deficiency anaemia."],
    relatedTests: ["Vitamin Panel", "Ferritin", "Full Blood Count", "Inflammatory Markers"],
  },
  {
    id: "vitamin-e", name: "Vitamin E (Alpha-Tocopherol)", abbr: "VIT E", category: "Iron & Nutrients",
    icon: "🌿",
    what: "Vitamin E is a group of fat-soluble compounds, of which alpha-tocopherol is the most biologically active form. It is the body's primary fat-soluble antioxidant, protecting cell membranes and lipoproteins from oxidative damage. It also modulates immune function and has anti-inflammatory properties.",
    why: "Vitamin E deficiency is uncommon in otherwise healthy people with normal fat absorption, but occurs in fat malabsorption disorders (cystic fibrosis, Crohn's, cholestatic liver disease) and in premature infants. Deficiency causes peripheral neuropathy, muscle weakness (myopathy), ataxia, and haemolytic anaemia.",
    unit: "µmol/L",
    ranges: {
      both: { low: { range: "< 12 µmol/L", label: "Deficient", meaning: "Peripheral neuropathy, muscle weakness, ataxia, haemolytic anaemia, immune impairment." },
               normal: { range: "12–42 µmol/L", label: "Normal" },
               high: { range: "> 42 µmol/L", label: "Elevated", meaning: "Usually from high-dose supplementation. High-dose vitamin E supplements (> 400 IU/day) have shown increased all-cause mortality in trials." } }
    },
    tips: ["Vitamin E should be interpreted alongside serum lipids — it is lipid-soluble and levels vary with cholesterol.", "Best dietary sources: wheat germ oil, sunflower seeds, almonds, avocados, olive oil.", "Vitamin E interacts with anticoagulants (warfarin) at high doses — increases bleeding risk.", "Fat malabsorption conditions require fat-soluble vitamin monitoring including vitamins A, D, E, and K."],
    relatedTests: ["Fat-Soluble Vitamin Panel", "Vitamin A", "Vitamin D", "Liver Function Tests"],
  },
  {
    id: "vitamin-k1", name: "Vitamin K1 (Phylloquinone)", abbr: "VIT K1", category: "Iron & Nutrients",
    icon: "🥦",
    what: "Vitamin K1 (phylloquinone) is the primary dietary form of vitamin K, found in green leafy vegetables. It is essential for activating clotting factors (the coagulation cascade) and carboxylating bone proteins (osteocalcin). Vitamin K2 (menaquinone), produced by gut bacteria and found in fermented foods, plays a more specific role in directing calcium to bones rather than arteries.",
    why: "Vitamin K deficiency impairs blood clotting, causing abnormal bleeding and bruising — it is why newborns receive vitamin K injections at birth (as they have very low stores). Long-term antibiotic use kills gut bacteria that produce K2, compounding deficiency.",
    unit: "µg/L",
    ranges: {
      both: { low: { range: "< 0.2 µg/L", label: "Deficient", meaning: "Impaired clotting factor activation — bleeding risk. Seen in newborns, fat malabsorption, prolonged antibiotic use, or severe malnutrition." },
               normal: { range: "0.2–3.2 µg/L", label: "Normal (K1)" },
               high: { range: "> 3.2 µg/L", label: "Elevated", meaning: "Rare in the absence of supplementation. Vitamin K is generally not toxic at high dietary intakes." } }
    },
    tips: ["Vitamin K1 is most abundant in dark leafy greens: kale, spinach, broccoli, Brussels sprouts.", "Vitamin K2 (MK-7 form) is found in natto (fermented soya), aged cheeses, and egg yolks.", "Warfarin works by blocking vitamin K recycling — vitamin K-rich foods must be kept consistent, not avoided.", "All newborns in the UK are offered a vitamin K injection at birth to prevent haemorrhagic disease."],
    relatedTests: ["Fat-Soluble Vitamin Panel", "Clotting Screen (PT)", "Bone Profile", "Vitamin D"],
  },
  {
    id: "vitamin-k2", name: "Vitamin K2 (Menaquinone)", abbr: "VIT K2", category: "Iron & Nutrients",
    icon: "🥦",
    what: "Vitamin K2 (menaquinone, particularly MK-4 and MK-7) is the form of vitamin K produced by gut bacteria and found in fermented foods (natto, aged cheese, certain meats). While K1 is primarily used for coagulation, K2 preferentially activates matrix Gla protein (MGP) and osteocalcin — directing calcium into bones and preventing its deposition in arteries and soft tissues.",
    why: "Growing evidence suggests K2 deficiency contributes to arterial calcification, cardiovascular disease, and osteoporosis — independently of K1 levels. The Rotterdam Heart Study found high dietary K2 associated with 57% reduction in cardiovascular mortality. K2 supplementation is being investigated for improving bone density and reducing aortic calcification.",
    unit: "µg/L (or ng/mL)",
    ranges: {
      both: { low: { range: "< 0.2 ng/mL (MK-7)", label: "Low / Deficient", meaning: "Impaired MGP activation — risk of arterial calcification, reduced bone mineralisation." },
               normal: { range: "0.2–1.5 ng/mL", label: "Normal" },
               high: { range: "> 1.5 ng/mL", label: "Elevated", meaning: "Typically from supplementation. No established toxicity from K2 supplementation at usual doses." } }
    },
    tips: ["K2 testing is not routine in standard NHS practice but is available through specialist private labs.", "MK-7 (long-chain K2) has a half-life of ~72 hours vs MK-4 (~6 hours) — MK-7 supplements are generally preferred for sustained activity.", "Natto (Japanese fermented soya) is by far the richest K2 source — one 40g serving provides ~500 µg MK-7.", "K2 and K1 are both needed — they work synergistically. Deficiency in one is common despite adequacy in the other.", "K2 does not interfere with warfarin at usual dietary levels — unlike high K1."],
    relatedTests: ["Fat-Soluble Vitamin Panel", "Vitamin K1", "Bone Profile", "Calcium", "Cardiovascular Risk Panel"],
  },
  {
    id: "selenium", name: "Selenium", abbr: "Se", category: "Iron & Nutrients",
    icon: "⚗️",
    what: "Selenium is an essential trace mineral incorporated into selenoproteins — a family of proteins with critical roles in antioxidant defence (glutathione peroxidase), thyroid hormone metabolism (T4 to T3 conversion), immune function, fertility, and DNA synthesis. Selenium content in food varies enormously based on soil selenium levels, which are generally low in UK and European soils.",
    why: "UK adults commonly have suboptimal selenium status due to poor soil levels. Selenium deficiency impairs thyroid hormone conversion, reduces antioxidant defence, and has been linked to thyroid autoimmunity (Hashimoto's), reduced male fertility (poor sperm motility), and impaired immune function. In severe deficiency (Keshan disease) — a potentially fatal cardiomyopathy.",
    unit: "µmol/L",
    ranges: {
      both: { low: { range: "< 0.6 µmol/L", label: "Deficient", meaning: "Impaired antioxidant function, poor T4→T3 thyroid conversion, thyroid autoimmunity risk, impaired fertility and immunity." },
               borderline: { range: "0.6–0.9 µmol/L", label: "Suboptimal", meaning: "Below optimal for full selenoprotein expression — consider selenium-rich foods or supplementation." },
               normal: { range: "0.9–1.9 µmol/L", label: "Normal" },
               high: { range: "> 2.5 µmol/L", label: "Toxic (Selenosis)", meaning: "Hair loss, nail brittleness, garlic breath, nausea, peripheral neuropathy — most often from excess supplement use." } }
    },
    tips: ["Two Brazil nuts daily provides approximately 100–150 µg selenium — meeting the recommended daily intake.", "Selenium (200 µg/day) has clinical evidence for reducing TPO antibodies in Hashimoto's thyroiditis.", "UK selenium intake is significantly lower than optimal due to low-selenium European soils.", "Do not exceed 400 µg/day from supplements — selenosis risk."],
    relatedTests: ["Trace Element Panel", "Thyroid Antibodies (TPO)", "Free T3", "Glutathione Peroxidase"],
  },
  {
    id: "omega-3-index", name: "Omega-3 Index", abbr: "Ω-3", category: "Iron & Nutrients",
    icon: "🐟",
    what: "The Omega-3 Index measures the percentage of EPA (eicosapentaenoic acid) and DHA (docosahexaenoic acid) in red blood cell membranes — reflecting long-term omega-3 fatty acid status over the preceding 3 months. EPA and DHA are the biologically active marine omega-3 fatty acids with anti-inflammatory, cardiovascular, and neurological functions.",
    why: "A low Omega-3 Index is an independent cardiovascular risk factor comparable to smoking, hypertension, and high cholesterol. Low omega-3 status is associated with increased risk of heart attack, stroke, sudden cardiac death, depression, cognitive decline, and inflammatory conditions. Over 70% of the UK population has a low Omega-3 Index.",
    unit: "%",
    ranges: {
      both: { low: { range: "< 4%", label: "High Risk", meaning: "High cardiovascular and inflammatory risk zone — associated with increased heart attack risk, cognitive decline, and poor inflammatory control." },
               borderline: { range: "4–8%", label: "Intermediate Risk", meaning: "Room for improvement — target 8% or above for optimal cardiovascular protection." },
               normal: { range: "8–11%", label: "Target / Optimal", meaning: "Optimal cardiovascular and anti-inflammatory protection. The target range according to Omega-3 Index guidelines." },
               high: { range: "> 11%", label: "Very High", meaning: "Possible excessive supplementation. Generally safe but rarely achievable without very high fish intake or supplements." } }
    },
    tips: ["Two portions of oily fish per week (salmon, mackerel, sardines, herring) is the minimum recommendation.", "Omega-3 supplements: 2–4g EPA+DHA/day significantly raises the Omega-3 Index.", "ALA from flaxseed and walnuts converts to EPA/DHA poorly (< 5%) — marine sources are essential.", "High triglycerides respond particularly well to omega-3 supplementation (3–4g/day of EPA+DHA)."],
    relatedTests: ["Lipid Panel", "Triglycerides", "CRP", "Cardiovascular Risk Assessment"],
  },
  {
    id: "coq10", name: "Coenzyme Q10", abbr: "CoQ10", category: "Iron & Nutrients",
    icon: "⚡",
    what: "Coenzyme Q10 (ubiquinone/ubiquinol) is a fat-soluble compound found in virtually every cell. It plays an indispensable role in the mitochondrial electron transport chain — the process by which cells generate ATP (energy). It is also a powerful antioxidant protecting cell membranes and mitochondria from oxidative damage. CoQ10 is synthesised by the body but levels decline with age.",
    why: "CoQ10 deficiency causes fatigue, muscle weakness, exercise intolerance, and mitochondrial dysfunction. Statin drugs — among the most widely prescribed medications globally — inhibit the cholesterol synthesis pathway and simultaneously deplete CoQ10 production, which may contribute to statin-related muscle pain (myalgia). CoQ10 is also important in heart failure, where cardiac muscle CoQ10 levels are significantly reduced.",
    unit: "µmol/L",
    ranges: {
      both: { low: { range: "< 0.40 µmol/L", label: "Low", meaning: "Mitochondrial dysfunction risk — fatigue, muscle weakness, statin myopathy, cardiac dysfunction. Particularly significant on statin therapy." },
               borderline: { range: "0.40–0.60 µmol/L", label: "Borderline", meaning: "Suboptimal — consider supplementation if on statins or experiencing fatigue." },
               normal: { range: "0.60–1.50 µmol/L", label: "Normal" },
               high: { range: "> 1.50 µmol/L", label: "High", meaning: "Usually reflects recent supplementation — CoQ10 has no known toxicity at elevated levels." } }
    },
    tips: ["Statins reduce CoQ10 synthesis by up to 50% — supplementation (100–300 mg/day) is reasonable if on statin therapy.", "CoQ10 exists in two forms: ubiquinone (standard) and ubiquinol (reduced, active form). Ubiquinol may be better absorbed.", "CoQ10 declines with age — levels in an 80-year-old may be 50% lower than in a 20-year-old.", "Highest dietary sources: heart, kidney, liver, sardines, mackerel, beef."],
    relatedTests: ["Mitochondrial Function Panel", "Lactate", "CK (Creatine Kinase)", "Liver Function Tests"],
  },
  {
    id: "free-testosterone", name: "Free Testosterone", abbr: "FT", category: "Hormones",
    icon: "⚡",
    what: "Free testosterone is the small fraction of testosterone (~1–3% in men, ~1–2% in women) that circulates unbound to proteins (SHBG or albumin). Only free testosterone is biologically active — able to enter cells and exert its effects on muscle, libido, mood, energy, and bone density. Total testosterone includes all forms, most of which are protein-bound and inactive.",
    why: "Free testosterone provides a more accurate picture of androgen status than total testosterone alone — particularly when SHBG is abnormal. A man can have a 'normal' total testosterone but symptomatic androgen deficiency if SHBG is very high, because most testosterone is bound and unavailable.",
    unit: "pmol/L",
    ranges: {
      male: { low: { range: "< 180 pmol/L", label: "Low", meaning: "Androgen deficiency symptoms — fatigue, low libido, erectile dysfunction, mood changes, loss of muscle." },
               borderline: { range: "180–250 pmol/L", label: "Borderline", meaning: "Assess in context of symptoms, total testosterone, and SHBG." },
               normal: { range: "250–750 pmol/L", label: "Normal" },
               high: { range: "> 750 pmol/L", label: "High", meaning: "Exogenous androgen use (TRT/steroids) or low SHBG from metabolic syndrome." } },
      female: { low: { range: "< 5 pmol/L", label: "Low", meaning: "Low libido, fatigue, poor mood. More common post-menopause." },
                normal: { range: "5–25 pmol/L", label: "Normal" },
                high: { range: "> 25 pmol/L", label: "High", meaning: "PCOS, adrenal hyperplasia, or exogenous androgen use." } }
    },
    tips: ["Free testosterone should be calculated using the Vermeulen formula from total testosterone, SHBG, and albumin — or directly measured.", "Test in the morning (8–10am) alongside total testosterone and SHBG.", "The free androgen index (FAI = total T × 100 / SHBG) is an alternative calculation used in women.", "Obesity and insulin resistance lower SHBG and raise free testosterone in women — a contributor to PCOS."],
    relatedTests: ["Testosterone Test", "Total Testosterone", "SHBG", "Albumin", "LH", "FSH"],
  },
  {
    id: "oestrone", name: "Oestrone", abbr: "E1", category: "Hormones",
    icon: "🌸",
    what: "Oestrone (E1) is one of three naturally occurring oestrogens alongside oestradiol (E2) and oestriol (E3). After menopause, oestrone becomes the dominant circulating oestrogen, produced primarily by the conversion of androgens in adipose (fat) tissue via the enzyme aromatase. In pre-menopausal women, oestradiol dominates.",
    why: "Post-menopausal oestrone levels are relevant to breast cancer risk — oestrone can be converted to oestradiol in target tissues including breast. Higher oestrone levels (from greater adipose tissue aromatisation in overweight/obese post-menopausal women) are associated with increased breast cancer risk. Oestrone is also relevant in HRT monitoring.",
    unit: "pmol/L",
    ranges: {
      male: { normal: { range: "< 180 pmol/L", label: "Normal" },
               high: { range: "> 180 pmol/L", label: "Elevated", meaning: "Aromatisation from obesity or exogenous oestrogen exposure." } },
      female: {
        phases: [
          { phase: "Pre-menopausal (follicular)", range: "110–400 pmol/L" },
          { phase: "Pre-menopausal (luteal)", range: "370–1470 pmol/L" },
          { phase: "Post-menopausal", range: "< 180 pmol/L" },
        ],
        note: "Post-menopausal oestrone becomes the dominant oestrogen. Levels correlate with body fat percentage."
      }
    },
    tips: ["Oestrone is the 'weak' oestrogen — about 10× less potent than oestradiol at oestrogen receptors.", "Post-menopausal obesity raises oestrone through increased aromatase activity in fat tissue — a key breast cancer risk mechanism.", "Oestrone is rarely tested alone — usually part of a full oestrogen profile or cancer investigation.", "Aromatase inhibitors (anastrozole, letrozole) used in breast cancer treatment suppress oestrone production."],
    relatedTests: ["Oestrogen Profile", "Oestradiol", "Testosterone", "SHBG", "Aromatase Activity"],
  },
  {
    id: "ast-alt-ratio", name: "AST:ALT Ratio (De Ritis Ratio)", abbr: "AST:ALT", category: "Liver & Metabolic",
    icon: "🫀",
    what: "The AST:ALT ratio (De Ritis ratio) is calculated by dividing the AST level by the ALT level. Both enzymes are released during liver cell damage, but their ratio provides important diagnostic information about the type and likely cause of liver disease. The ratio is not a separate test but a calculated value from the standard LFT panel.",
    why: "In non-alcoholic fatty liver disease (NAFLD) — the most common liver condition in the UK — ALT is typically higher than AST (ratio < 1). In alcoholic liver disease (ALD), AST is typically at least twice ALT (ratio ≥ 2:1), reflecting the disproportionate mitochondrial injury of alcohol on AST-rich tissue.",
    unit: "Ratio",
    ranges: {
      both: { low: { range: "< 0.8", label: "Low", meaning: "NAFLD (fatty liver disease) pattern — ALT predominance. Most common pattern in metabolic liver disease." },
               normal: { range: "0.8–1.5", label: "Normal / Indeterminate", meaning: "Non-specific — further clinical context required." },
               high: { range: "> 2.0", label: "High (De Ritis Ratio)", meaning: "Alcoholic liver disease strongly suggested. Also elevated in cirrhosis (late stage), liver ischaemia, or Wilson's disease." } }
    },
    tips: ["An AST:ALT ratio ≥ 2 in the context of liver disease is a classic indicator of alcohol-related liver damage.", "In advanced cirrhosis from any cause, the ratio often rises above 1 as the liver loses ALT-producing cells.", "Muscle damage (rhabdomyolysis, intense exercise) also raises AST disproportionately to ALT.", "NAFLD is now the most common cause of incidentally raised ALT in the UK — ratio < 1 is characteristic."],
    relatedTests: ["Liver Function Tests", "ALT", "AST", "GGT", "Bilirubin"],
  },
  {
    id: "haptoglobin", name: "Haptoglobin", abbr: "HPT", category: "Liver & Metabolic",
    icon: "🫀",
    what: "Haptoglobin is a plasma protein produced by the liver that binds free haemoglobin released from damaged red blood cells. The haptoglobin-haemoglobin complex is then cleared by the liver, preventing haemoglobin from damaging the kidneys. When haemolysis occurs, free haemoglobin saturates haptoglobin, depleting its serum levels.",
    why: "Low haptoglobin is the most specific blood test for intravascular haemolysis (red cell destruction within blood vessels). Combined with elevated LDH, high bilirubin, and a falling haemoglobin, low haptoglobin confirms the haemolytic anaemia triad. Haptoglobin is also an acute-phase protein — it rises in inflammation.",
    unit: "g/L",
    ranges: {
      both: { low: { range: "< 0.3 g/L", label: "Low", meaning: "Active intravascular haemolysis — haemoglobin is consuming haptoglobin. Causes: autoimmune haemolytic anaemia, G6PD deficiency, TTP, sickle cell crisis, PNH." },
               normal: { range: "0.3–2.0 g/L", label: "Normal" },
               high: { range: "> 2.0 g/L", label: "Elevated", meaning: "Acute-phase response to inflammation, infection, trauma, or corticosteroid use. Can mask haemolysis if inflammation coexists." } }
    },
    tips: ["The haemolytic triad: high LDH + low haptoglobin + elevated unconjugated bilirubin confirms intravascular haemolysis.", "Haptoglobin rises in inflammation — a 'normal' haptoglobin in an inflamed patient does not rule out haemolysis.", "Approximately 1–4% of the population have a genetic deletion causing constitutively undetectable haptoglobin — clinically benign.", "Direct Coombs test (DAT) distinguishes autoimmune from non-immune haemolysis."],
    relatedTests: ["Haemolytic Screen", "LDH", "Full Blood Count", "Bilirubin", "Direct Coombs Test"],
  },
  {
    id: "leptin", name: "Leptin", abbr: "LEP", category: "Diabetes & Metabolic",
    icon: "📊",
    what: "Leptin is a hormone produced by adipose (fat) cells in proportion to fat mass. It signals satiety (fullness) to the hypothalamus, suppresses appetite, and increases energy expenditure. Leptin communicates the body's long-term energy stores — higher fat mass generates more leptin, theoretically reducing appetite. In obesity, however, leptin resistance develops — the brain stops responding to high leptin signals.",
    why: "Leptin resistance is a central driver of obesity maintenance — high circulating leptin fails to suppress appetite, creating a vicious cycle. Very low leptin (in severe malnutrition, anorexia nervosa, or congenital leptin deficiency) causes insatiable hunger and severe obesity from birth. Leptin is also important for reproductive function — very low leptin suppresses GnRH and can cause hypothalamic amenorrhoea.",
    unit: "ng/mL",
    ranges: {
      male: { low: { range: "< 2 ng/mL", label: "Low", meaning: "Severe malnutrition, anorexia nervosa, or congenital leptin deficiency. Causes hyperphagia, reproductive dysfunction." },
               normal: { range: "2–12 ng/mL", label: "Normal" },
               high: { range: "> 12 ng/mL", label: "High — Leptin Resistance", meaning: "Obesity, high fat mass, or leptin resistance. High leptin with high BMI indicates resistance — the signal is not being heard." } },
      female: { low: { range: "< 3 ng/mL", label: "Low", meaning: "Severe energy deficit — hypothalamic amenorrhoea, exercise-induced amenorrhoea, anorexia nervosa." },
                normal: { range: "3–18 ng/mL", label: "Normal" },
                high: { range: "> 18 ng/mL", label: "High — Leptin Resistance", meaning: "Obesity or leptin resistance — appetite regulation impaired." } }
    },
    tips: ["Women have 2–3× higher leptin than men at the same BMI — oestrogen stimulates leptin production.", "Sleep deprivation decreases leptin and increases ghrelin — driving appetite and weight gain.", "Very low leptin in female athletes (relative energy deficiency in sport — RED-S) causes loss of periods.", "High-fructose diets impair leptin sensitivity in the hypothalamus."],
    relatedTests: ["Metabolic Panel", "Adiponectin", "Fasting Insulin", "HOMA-IR"],
  },
  {
    id: "urine-acr", name: "Urine Albumin:Creatinine Ratio", abbr: "uACR", category: "Kidney Function",
    icon: "💧",
    what: "The urine albumin:creatinine ratio (uACR) measures the amount of albumin (a blood protein) leaking into urine relative to urine creatinine concentration. Healthy kidneys retain albumin. When the kidney's filtering apparatus (glomeruli) is damaged — from diabetes, hypertension, or other diseases — albumin leaks through. Even very small amounts of albumin in urine (microalbuminuria) are an early, sensitive warning sign of kidney and vascular damage.",
    why: "uACR is the most sensitive marker of early diabetic nephropathy and hypertensive kidney disease — it rises years before creatinine or eGFR deteriorate. It is also an independent cardiovascular risk marker — microalbuminuria indicates systemic endothelial dysfunction and predicts heart attack and stroke risk even in people without kidney disease.",
    unit: "mg/mmol",
    ranges: {
      both: { normal: { range: "< 3 mg/mmol", label: "Normal", meaning: "No significant albumin leakage — healthy kidney filtration barrier." },
               borderline: { range: "3–30 mg/mmol", label: "Microalbuminuria", meaning: "Early kidney damage signal. Indicates endothelial dysfunction — cardiovascular risk marker. Annual monitoring and risk factor optimisation essential." },
               high: { range: "> 30 mg/mmol", label: "Macroalbuminuria (Overt Nephropathy)", meaning: "Significant protein leak — established kidney disease. Requires specialist nephrology review and intensive management." } }
    },
    tips: ["A single elevated uACR should be confirmed on two separate occasions — exercise, infections, and fever transiently raise albumin excretion.", "Morning urine sample provides the most standardised result.", "ACE inhibitors and ARBs specifically reduce uACR and are first-line in diabetic nephropathy — even without hypertension.", "uACR is a better marker of early kidney disease than creatinine or eGFR, which remain normal for years."],
    relatedTests: ["Kidney Function Tests", "eGFR", "Creatinine", "HbA1c", "Blood Pressure"],
  },
  {
    id: "anion-gap", name: "Anion Gap", abbr: "AG", category: "Electrolytes",
    icon: "🧂",
    what: "The anion gap (AG) is a calculated value from the electrolyte panel: AG = Na⁺ – (Cl⁻ + HCO₃⁻). It represents the difference between the measured positive ions (cations) and negative ions (anions) in blood — reflecting the unmeasured anions (albumin, phosphate, sulphate, organic acids). A high anion gap indicates the presence of additional unmeasured acids.",
    why: "The anion gap is the essential first step in diagnosing and categorising metabolic acidosis. High anion gap acidosis (HAGMA) indicates accumulation of unmeasured organic acids — the MUDPILES mnemonic: Methanol, Uraemia, Diabetic ketoacidosis, Propylene glycol, Infection/Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates. Normal anion gap acidosis (NAGMA) suggests bicarbonate loss — from diarrhoea or renal tubular acidosis.",
    unit: "mmol/L",
    ranges: {
      both: { normal: { range: "8–16 mmol/L (albumin-corrected: 12±2)", label: "Normal", meaning: "No significant unmeasured acids present." },
               high: { range: "> 16 mmol/L", label: "High — HAGMA", meaning: "High anion gap metabolic acidosis — MUDPILES: DKA, lactic acidosis, uraemia, toxic ingestion (methanol, ethylene glycol, salicylates)." },
               low: { range: "< 8 mmol/L", label: "Low", meaning: "Hypoalbuminaemia (most common — low albumin reduces unmeasured anions), multiple myeloma (cationic paraproteins), or laboratory error." } }
    },
    tips: ["Always correct the anion gap for albumin: corrected AG = measured AG + 2.5 × (4.0 – albumin [g/dL]). Low albumin masks a high anion gap.", "Lactic acidosis is the most common cause of high anion gap acidosis in hospitalised patients.", "DKA typically presents with AG > 20 mmol/L — blood ketones confirm.", "Normal anion gap acidosis (NAGMA): the 'D' of diagnosis — Diarrhoea, or Renal tubular acidosis."],
    relatedTests: ["Electrolyte Panel", "Blood Gas Analysis", "Lactate", "Ketones", "Glucose"],
  },
];
