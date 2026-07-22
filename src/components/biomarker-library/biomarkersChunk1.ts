// biomarkersChunk1.ts — Auto-generated chunk 1 of 15
// Part of the myhealth checkup Biomarker Library (610 biomarkers total)

export const biomarkersChunk1 = [
  {
    id: "haemoglobin", name: "Haemoglobin", abbr: "Hb", category: "Full Blood Count",
    icon: "🩸", what: "Haemoglobin is the iron-containing protein in red blood cells that carries oxygen from the lungs to every cell in the body and returns carbon dioxide for exhalation. It gives blood its red colour.", why: "Haemoglobin is the primary measure of anaemia — one of the most common conditions globally, affecting energy, cognitive function, exercise capacity, and immune health. It is also elevated in polycythaemia (too many red cells), which increases clotting risk.",
    unit: "g/L",
    ranges: {
      male: { low: { min: null, max: 129, label: "Low / Anaemia", range: "< 130 g/L", meaning: "Anaemia in men. Investigate cause: iron deficiency, B12/folate, chronic disease, haemolysis, or bone marrow problem." }, optimal: { min: 130, max: 170, label: "Normal", range: "130–170 g/L" }, high: { min: 171, max: 185, label: "High", range: "171–185 g/L", meaning: "Above normal — dehydration, sleep apnoea, or polycythaemia vera. Investigate if persistent." }, veryHigh: { min: 186, max: null, label: "Very High", range: "> 185 g/L", meaning: "Polycythaemia — increased clotting and stroke risk. Haematology referral needed." } },
      female: { low: { min: null, max: 119, label: "Low / Anaemia", range: "< 120 g/L", meaning: "Anaemia in women. Most common cause: iron deficiency from menstruation. Also consider B12, folate, chronic disease." }, optimal: { min: 120, max: 155, label: "Normal", range: "120–155 g/L" }, high: { min: 156, max: 165, label: "High", range: "156–165 g/L", meaning: "Above normal for women — check haematocrit and EPO." }, veryHigh: { min: 166, max: null, label: "Very High", range: "> 165 g/L", meaning: "Polycythaemia — refer to haematology." } }
    },
    tips: ["Haemoglobin naturally varies by altitude — people living at high altitude have higher Hb due to reduced oxygen availability.", "Haemoglobin below 80 g/L usually causes symptoms at rest and may require blood transfusion.", "Always check ferritin alongside haemoglobin — iron deficiency can cause symptoms even before haemoglobin falls.", "Haemoglobin may be normal in early iron deficiency — look at MCV (small red cells) and ferritin for early detection."],
    relatedTests: ["Ferritin", "MCV", "MCH", "MCHC", "Reticulocytes", "Vitamin B12", "Folate"],
  },
  {
    id: "rbc", name: "Red Blood Cell Count", abbr: "RBC", category: "Full Blood Count",
    icon: "🩸", what: "Measures the total number of red blood cells (erythrocytes) per litre of blood. Red blood cells are the primary carriers of oxygen throughout the body.", why: "Reduced RBC contributes to anaemia; elevated RBC (erythrocytosis/polycythaemia) increases blood viscosity and thrombotic risk. Used alongside haemoglobin and haematocrit to characterise anaemia type.",
    unit: "×10¹²/L",
    ranges: {
      male: { low: { min: null, max: 4.4, label: "Low", range: "< 4.4 ×10¹²/L", meaning: "Low red cell count — anaemia likely. Investigate underlying cause." }, optimal: { min: 4.4, max: 5.9, label: "Normal", range: "4.4–5.9 ×10¹²/L" }, high: { min: 5.9, max: null, label: "High", range: "> 5.9 ×10¹²/L", meaning: "Erythrocytosis — dehydration, polycythaemia vera, or chronic hypoxia (smoking, sleep apnoea)." } },
      female: { low: { min: null, max: 3.9, label: "Low", range: "< 3.9 ×10¹²/L", meaning: "Low — anaemia likely." }, optimal: { min: 3.9, max: 5.2, label: "Normal", range: "3.9–5.2 ×10¹²/L" }, high: { min: 5.2, max: null, label: "High", range: "> 5.2 ×10¹²/L", meaning: "Erythrocytosis — investigate." } }
    },
    tips: ["RBC alone rarely changes clinical management — always interpret with Hb, MCV, and MCH.", "High RBC with normal Hb suggests microcytic anaemia (iron deficiency or thalassaemia).", "Low RBC with high MCV (large red cells) suggests B12 or folate deficiency.", "Dehydration artificially raises RBC, Hb, and haematocrit — hydration status matters."],
    relatedTests: ["Haemoglobin", "Haematocrit", "MCV", "MCH", "MCHC", "Ferritin"],
  },
  {
    id: "haematocrit", name: "Haematocrit", abbr: "HCT", category: "Full Blood Count",
    icon: "🩸", what: "The proportion of blood volume occupied by red blood cells, expressed as a percentage or fraction. Calculated from RBC count × MCV, or measured directly by centrifugation.", why: "Used alongside haemoglobin to diagnose anaemia and polycythaemia. An elevated haematocrit increases blood viscosity, raising the risk of stroke and deep vein thrombosis.",
    unit: "%",
    ranges: {
      male: { low: { min: null, max: 40, label: "Low", range: "< 40%", meaning: "Anaemia — haemoglobin and RBC likely also low. Investigate cause." }, optimal: { min: 40, max: 52, label: "Normal", range: "40–52%" }, high: { min: 52, max: null, label: "High", range: "> 52%", meaning: "Polycythaemia or dehydration — increased viscosity and clot risk." } },
      female: { low: { min: null, max: 36, label: "Low", range: "< 36%", meaning: "Anaemia." }, optimal: { min: 36, max: 47, label: "Normal", range: "36–47%" }, high: { min: 47, max: null, label: "High", range: "> 47%", meaning: "Elevated — investigate erythrocytosis." } }
    },
    tips: ["Haematocrit >52% in men or >47% in women warrants investigation for polycythaemia vera (JAK2 mutation testing).", "Venesection (phlebotomy) is used to reduce haematocrit in polycythaemia vera — target <45%.", "Haematocrit is used to calculate mean corpuscular volume: MCV = (Hct/RBC) × 10.", "Athletes at altitude may have physiologically elevated haematocrit — EPO testing in sports medicine."],
    relatedTests: ["Haemoglobin", "RBC", "MCV", "EPO", "JAK2 Mutation"],
  },
  {
    id: "wbc", name: "White Blood Cells (Total)", abbr: "WBC", category: "Full Blood Count",
    icon: "🩸", what: "The total count of all white blood cells (leucocytes) — the immune cells that defend against infection and foreign substances. Includes neutrophils, lymphocytes, monocytes, eosinophils, and basophils.", why: "Elevated WBC (leucocytosis) indicates infection, inflammation, stress, or leukaemia. Low WBC (leucopenia) signals immunosuppression from drugs, bone marrow failure, or severe infection.",
    unit: "×10⁹/L",
    ranges: {
      both: { low: { min: null, max: 4.0, label: "Low", range: "< 4.0 ×10⁹/L", meaning: "Leucopenia — infection risk. Check differential. Common causes: viral illness, drug side effect, bone marrow suppression, autoimmune disease." }, optimal: { min: 4.0, max: 11.0, label: "Normal", range: "4.0–11.0 ×10⁹/L" }, high: { min: 11.0, max: 30.0, label: "High", range: "11.0–30.0 ×10⁹/L", meaning: "Leucocytosis — infection, inflammation, steroid use, or stress. Values >30 may suggest leukaemia." }, veryHigh: { min: 30.0, max: null, label: "Very High", range: "> 30 ×10⁹/L", meaning: "Marked leucocytosis — haematology referral needed to exclude leukaemia or leukaemoid reaction." } }
    },
    tips: ["Never interpret WBC in isolation — always review the differential (neutrophils, lymphocytes, etc.) for the full picture.", "Corticosteroids (prednisolone, dexamethasone) cause neutrophilia and leucocytosis within hours — always note steroid use.", "Leucocytosis after exercise is physiological and transient — avoid exercising vigorously before blood tests.", "WBC >100 ×10⁹/L (hyperleucostasis) is a medical emergency in acute leukaemia."],
    relatedTests: ["Neutrophils", "Lymphocytes", "Monocytes", "Eosinophils", "Basophils", "CRP", "Procalcitonin"],
  },
  {
    id: "neutrophils", name: "Neutrophils", abbr: "NEUT", category: "Full Blood Count",
    icon: "🩸", what: "Neutrophils are the most abundant white blood cells (50–75% of WBC), forming the frontline rapid response to bacterial and fungal infection. They engulf and destroy pathogens through phagocytosis and release of antimicrobial enzymes.", why: "Low neutrophils (neutropenia) dramatically increases infection risk. High neutrophils (neutrophilia) indicate bacterial infection, inflammation, or steroid use. Critical monitoring target in chemotherapy patients.",
    unit: "×10⁹/L",
    ranges: {
      both: { low: { min: null, max: 1.8, label: "Low (Neutropenia)", range: "< 1.8 ×10⁹/L", meaning: "Increased infection risk. Below 1.0 = severe neutropenia; below 0.5 = life-threatening." }, optimal: { min: 1.8, max: 7.5, label: "Normal", range: "1.8–7.5 ×10⁹/L" }, high: { min: 7.5, max: null, label: "High (Neutrophilia)", range: "> 7.5 ×10⁹/L", meaning: "Bacterial infection, steroid use, acute inflammation, stress, or myeloproliferative disease." } }
    },
    tips: ["Neutropenia < 0.5 ×10⁹/L is severe and requires immediate medical attention.", "Chemotherapy commonly causes neutropenia — granulocyte colony-stimulating factor (G-CSF) can stimulate recovery.", "Ethnically, individuals of African descent naturally have slightly lower neutrophil counts — this is benign (ethnic neutropenia).", "Left shift (immature neutrophils in blood) during infection indicates the bone marrow is working harder to meet demand."],
    relatedTests: ["WBC", "CRP", "Procalcitonin", "Blood Culture", "Immature Granulocytes"],
  },
  {
    id: "lymphocytes", name: "Lymphocytes", abbr: "LYMPH", category: "Full Blood Count",
    icon: "🩸", what: "Lymphocytes are white blood cells involved in adaptive immunity — B-cells produce antibodies, T-cells coordinate immune responses and directly kill infected cells, and NK cells provide innate cytotoxic defence.", why: "Lymphocytosis (elevated lymphocytes) occurs in viral infections, chronic lymphocytic leukaemia (CLL), and some autoimmune conditions. Lymphopenia is seen in HIV infection, corticosteroid use, and some primary immunodeficiencies.",
    unit: "×10⁹/L",
    ranges: {
      both: { low: { min: null, max: 1.0, label: "Low (Lymphopenia)", range: "< 1.0 ×10⁹/L", meaning: "Reduced lymphocytes — immunosuppressed. Check for HIV, corticosteroid use, or lymphoma." }, optimal: { min: 1.0, max: 4.5, label: "Normal", range: "1.0–4.5 ×10⁹/L" }, high: { min: 4.5, max: null, label: "High (Lymphocytosis)", range: "> 4.5 ×10⁹/L", meaning: "Viral infection (EBV/CMV), pertussis, or haematological malignancy (CLL if persistent)." } }
    },
    tips: ["Persistent lymphocytosis (> 5 ×10⁹/L for > 3 months) requires haematology review.", "Reactive lymphocytes on blood film are common in glandular fever.", "Children naturally have higher lymphocyte counts than adults.", "CD4 lymphocyte count (a subset) specifically monitors HIV treatment response."],
    relatedTests: ["WBC", "Monocytes", "HIV Test", "EBV Serology", "Blood Film"],
  },
  {
    id: "monocytes", name: "Monocytes", abbr: "MONO", category: "Full Blood Count",
    icon: "🩸", what: "Monocytes are large white blood cells that circulate in the blood before migrating into tissues where they differentiate into macrophages and dendritic cells — key components of the innate immune system.", why: "Monocytosis (elevated monocytes) occurs in chronic infections (tuberculosis, subacute bacterial endocarditis), autoimmune diseases, inflammatory bowel disease, and some leukaemias. Monocytopenia is less clinically significant.",
    unit: "×10⁹/L",
    ranges: {
      both: { low: null, optimal: { min: 0.2, max: 1.0, label: "Normal", range: "0.2–1.0 ×10⁹/L" }, high: { min: 1.0, max: null, label: "High (Monocytosis)", range: "> 1.0 ×10⁹/L", meaning: "Chronic infection, autoimmune disease, inflammatory bowel disease, recovery from neutropenia, or rarely monocytic leukaemia." } }
    },
    tips: ["Monocytosis in a well patient is most commonly a normal variant or recovery from recent illness.", "Persistent monocytosis >1.0 ×10⁹/L should prompt review for chronic infection (TB, fungal), IBD, or CMML (chronic myelomonocytic leukaemia).", "Monocyte count rises physiologically in the morning and falls in the afternoon.", "Monocytes are the primary producers of pro-inflammatory cytokines (TNF-α, IL-1, IL-6) — their activation drives systemic inflammation."],
    relatedTests: ["WBC", "CRP", "Neutrophils", "Lymphocytes", "Ferritin"],
  },
  {
    id: "eosinophils", name: "Eosinophils", abbr: "EOS", category: "Full Blood Count",
    icon: "🩸", what: "Eosinophils are white blood cells involved in allergic responses, asthma, and defence against parasitic infections. They are characterised by bright pink granules on blood film staining.", why: "Eosinophilia (elevated eosinophils) is a marker of allergic disease, asthma, drug reactions, parasitic infection, and eosinophilic conditions. Severe eosinophilia can cause organ damage (heart, lungs, nervous system).",
    unit: "×10⁹/L",
    ranges: {
      both: { low: null, optimal: { min: 0.05, max: 0.5, label: "Normal", range: "0.05–0.5 ×10⁹/L" }, high: { min: 0.5, max: 1.5, label: "Mild Eosinophilia", range: "0.5–1.5 ×10⁹/L", meaning: "Allergic disease, drug reaction, or mild parasitic infection." }, veryHigh: { min: 1.5, max: null, label: "Moderate-Severe", range: "> 1.5 ×10⁹/L", meaning: "Significant eosinophilia — investigate for parasites, eosinophilic granulomatosis, Churg-Strauss, HES, or haematological malignancy." } }
    },
    tips: ["Blood eosinophil count > 300/µL qualifies for anti-IL-5 biologic therapy (mepolizumab/benralizumab) in severe asthma.", "Hypereosinophilic syndrome (HES): eosinophils > 1.5 ×10⁹/L with end-organ damage — rare but serious.", "Helminth parasites (toxocara, strongyloides, filaria) classically cause eosinophilia — travel history is essential.", "Eosinophilia is notably absent during acute bacterial infections — useful differentiator from viral/parasitic causes."],
    relatedTests: ["Total IgE", "Specific IgE Panel", "Parasitology Screen", "IL-5", "FeNO"],
  },
  {
    id: "basophils", name: "Basophils", abbr: "BASO", category: "Full Blood Count",
    icon: "🩸", what: "Basophils are the rarest circulating white blood cells (<1% of total WBC), playing key roles in allergic reactions and inflammation. They contain large granules of histamine and heparin, released during IgE-mediated hypersensitivity reactions.", why: "Basophilia (elevated basophils) is uncommon but is a classic feature of chronic myeloid leukaemia (CML) and some myeloproliferative disorders. Mild elevation occurs in allergic conditions and hypothyroidism.",
    unit: "×10⁹/L",
    ranges: {
      both: { low: null, optimal: { min: 0.02, max: 0.1, label: "Normal", range: "0.02–0.1 ×10⁹/L" }, high: { min: 0.1, max: null, label: "Basophilia", range: "> 0.1 ×10⁹/L", meaning: "CML, myeloproliferative disease, hypothyroidism, or allergic reaction. Very high basophils (>1.0) in CML are a bad prognostic sign." } }
    },
    tips: ["Basophilia is a red flag for CML — always check BCR-ABL1 gene if basophils are persistently elevated.", "Basophils and mast cells share developmental origins and both release histamine in allergic responses.", "Basophil count fluctuates significantly during the day — not useful for serial monitoring in isolation.", "Basophilia in hypothyroidism resolves with thyroxine treatment."],
    relatedTests: ["WBC", "BCR-ABL1 PCR (CML)", "Neutrophils", "TSH", "IgE"],
  },
  {
    id: "platelets", name: "Platelet Count", abbr: "PLT", category: "Full Blood Count",
    icon: "🩸", what: "Platelets (thrombocytes) are small, anucleate cell fragments produced by megakaryocytes in the bone marrow. They are the first responders to vascular injury, forming the initial platelet plug to stop bleeding.", why: "Low platelets (thrombocytopenia) cause bleeding; high platelets (thrombocytosis) can cause clotting or rarely bleeding. Both extremes require investigation and may indicate serious haematological, autoimmune, or malignant conditions.",
    unit: "×10⁹/L",
    ranges: {
      both: { low: { min: null, max: 150, label: "Low (Thrombocytopenia)", range: "< 150 ×10⁹/L", meaning: "Low platelets. Below 50 = significant bleeding risk; below 20 = major spontaneous bleeding risk." }, optimal: { min: 150, max: 400, label: "Normal", range: "150–400 ×10⁹/L" }, high: { min: 400, max: 600, label: "Reactive Thrombocytosis", range: "400–600 ×10⁹/L", meaning: "Often reactive (infection, iron deficiency, post-splenectomy). Rarely thrombotic at this level." }, veryHigh: { min: 600, max: null, label: "Very High", range: "> 600 ×10⁹/L", meaning: "Investigate for essential thrombocythaemia or other myeloproliferative disorder. Clotting risk." } }
    },
    tips: ["Platelet count can be falsely low due to EDTA-induced platelet clumping — repeat in citrate tube if in doubt.", "ITP (immune thrombocytopenic purpura): autoimmune destruction of platelets. Treatment: steroids, IVIG, thrombopoietin agonists.", "Thrombocytopenia in a critically ill patient: always consider TTP/HUS, DIC, or HIT (heparin-induced).", "Extreme thrombocytosis (>1000 ×10⁹/L) paradoxically causes bleeding by consuming vWF multimers."],
    relatedTests: ["D-Dimer", "Fibrinogen", "Blood Film", "PT/INR", "APTT"],
  },
  {
    id: "mcv", name: "Mean Corpuscular Volume", abbr: "MCV", category: "Full Blood Count",
    icon: "🩸", what: "MCV is the average volume of a red blood cell, expressed in femtolitres (fL). It is the key measurement for classifying anaemia into microcytic (small cells), normocytic (normal cells), or macrocytic (large cells).", why: "MCV determines the type of anaemia, which in turn directs the diagnostic workup. It is one of the most clinically useful indices in the full blood count.",
    unit: "fL",
    ranges: {
      both: { low: { min: null, max: 80, label: "Microcytic", range: "< 80 fL", meaning: "Small red cells — iron deficiency anaemia, thalassaemia, anaemia of chronic disease, or sideroblastic anaemia." }, optimal: { min: 80, max: 100, label: "Normal (Normocytic)", range: "80–100 fL" }, high: { min: 100, max: null, label: "Macrocytic", range: "> 100 fL", meaning: "Large red cells — B12/folate deficiency, alcohol excess, hypothyroidism, liver disease, or drug effect (methotrexate, hydroxyurea)." } }
    },
    tips: ["Iron deficiency is the most common cause of microcytic anaemia worldwide — check ferritin.", "B12 or folate deficiency causes megaloblastic anaemia with large oval red cells (macro-ovalocytes) on blood film.", "Thalassaemia trait: MCV very low but patient often asymptomatic and ferritin normal — check Hb electrophoresis.", "Mixed deficiency (iron + B12/folate) can produce a normal MCV despite significant anaemia — a diagnostic pitfall."],
    relatedTests: ["MCH", "MCHC", "Ferritin", "Vitamin B12", "Folate", "Haemoglobin Electrophoresis"],
  },
  {
    id: "mch", name: "Mean Corpuscular Haemoglobin", abbr: "MCH", category: "Full Blood Count",
    icon: "🩸", what: "MCH is the average amount (mass) of haemoglobin per red blood cell. It closely parallels MCV — low in microcytic anaemia, high in macrocytic anaemia — and is reported as part of the full blood count.", why: "MCH helps characterise the type of anaemia and monitor response to treatment. It rises as B12/folate therapy is effective and falls as iron deficiency worsens.",
    unit: "pg",
    ranges: {
      both: { low: { min: null, max: 27, label: "Low (Hypochromic)", range: "< 27 pg", meaning: "Low haemoglobin content per cell — iron deficiency, thalassaemia." }, optimal: { min: 27, max: 32, label: "Normal", range: "27–32 pg" }, high: { min: 32, max: null, label: "High (Hyperchromic)", range: "> 32 pg", meaning: "Large cells with excess haemoglobin — B12/folate deficiency, alcohol excess." } }
    },
    tips: ["MCH and MCV move together in most anaemias — divergence (low MCV, high MCH) rarely occurs but can indicate specific haemoglobin variants.", "MCH responds to iron therapy within 2–4 weeks, before haemoglobin fully recovers.", "Reticulocyte haemoglobin content (CHr) is a more sensitive early marker of iron-deficient erythropoiesis than MCH.", "MCH is calculated: MCH (pg) = Hb (g/L) ÷ RBC count."],
    relatedTests: ["MCV", "MCHC", "Haemoglobin", "Ferritin", "Reticulocyte Count"],
  },
  {
    id: "mchc", name: "Mean Corpuscular Haemoglobin Concentration", abbr: "MCHC", category: "Full Blood Count",
    icon: "🩸", what: "MCHC is the average concentration of haemoglobin within red blood cells — how densely packed the haemoglobin is. A low MCHC indicates pale, poorly haemoglobinised cells (hypochromia); a high MCHC indicates very dense cells.", why: "MCHC is particularly useful for diagnosing hereditary spherocytosis (characteristically elevated MCHC). Low MCHC confirms hypochromic anaemia (most commonly iron deficiency).",
    unit: "g/L",
    ranges: {
      both: { low: { min: null, max: 315, label: "Low (Hypochromic)", range: "< 315 g/L", meaning: "Cells are poorly filled with haemoglobin — iron deficiency, thalassaemia." }, optimal: { min: 315, max: 365, label: "Normal", range: "315–365 g/L" }, high: { min: 365, max: null, label: "High", range: "> 365 g/L", meaning: "Hereditary spherocytosis (characteristically elevated MCHC), severe dehydration, or sample artefact." } }
    },
    tips: ["MCHC > 370 g/L in a patient with haemolytic anaemia and jaundice strongly suggests hereditary spherocytosis — check osmotic fragility or EMA binding.", "Falsely high MCHC occurs with lipaemia, haemolysis of the sample, or very high WBC.", "MCHC rarely falls below 280 g/L even in severe iron deficiency — lower values suggest artefact.", "MCHC does not vary much with nutritional status making it useful for quality control of the FBC analyser."],
    relatedTests: ["MCV", "MCH", "Haemoglobin", "Blood Film", "Osmotic Fragility", "EMA Binding"],
  },
  {
    id: "rdw", name: "Red Cell Distribution Width", abbr: "RDW", category: "Full Blood Count",
    icon: "🩸", what: "RDW measures the variability in size (volume) of red blood cells — a high RDW means cells vary widely in size (anisocytosis). It is automatically calculated by modern blood count analysers from the red cell volume histogram.", why: "RDW is valuable for distinguishing types of anaemia: elevated in iron deficiency and B12/folate deficiency (variable-sized cells), normal in thalassaemia trait (uniformly small cells). Also an independent cardiovascular risk marker.",
    unit: "%",
    ranges: {
      both: { low: null, optimal: { min: 11.5, max: 14.5, label: "Normal", range: "11.5–14.5%" }, high: { min: 14.5, max: null, label: "High (Anisocytosis)", range: "> 14.5%", meaning: "Variable cell sizes — iron deficiency, B12/folate deficiency, mixed deficiency, haemolysis, or recent transfusion." } }
    },
    tips: ["RDW + MCV combination: Low MCV + High RDW = iron deficiency (most likely). Low MCV + Normal RDW = thalassaemia trait.", "RDW elevation predicts all-cause mortality independently of anaemia — a non-specific marker of cellular stress.", "Mixed iron and B12/folate deficiency: both micro and macrocytes → MCV may be normal but RDW is markedly elevated.", "RDW rises early in iron deficiency before MCV falls — useful as an early marker of developing deficiency."],
    relatedTests: ["MCV", "MCH", "Ferritin", "Vitamin B12", "Folate"],
  },
  {
    id: "reticulocytes", name: "Reticulocyte Count", abbr: "RETIC", category: "Full Blood Count",
    icon: "🩸", what: "Reticulocytes are immature red blood cells that have just left the bone marrow and still contain remnant RNA. They mature into fully functional red blood cells within 1–2 days. The reticulocyte count reflects how actively the bone marrow is producing new red cells.", why: "Essential for distinguishing between anaemias with adequate marrow response (haemolysis or blood loss — high reticulocytes) and those with impaired production (B12/folate deficiency, aplastic anaemia — low reticulocytes).",
    unit: "%",
    ranges: {
      both: { low: { min: null, max: 0.5, label: "Low", range: "< 0.5%", meaning: "Bone marrow not responding adequately — consider aplastic anaemia, nutritional deficiency (B12/folate/iron), or infiltrative marrow disease." }, optimal: { min: 0.5, max: 2.5, label: "Normal", range: "0.5–2.5%" }, high: { min: 2.5, max: null, label: "High (Active Production)", range: "> 2.5%", meaning: "Active red cell production — haemolytic anaemia, recovery from blood loss, or response to iron/B12 therapy." } }
    },
    tips: ["Reticulocyte count should rise within 3–5 days of starting iron or B12/folate therapy — a useful treatment response marker.", "Reticulocyte production index (RPI) = Reticulocyte % × (Patient Hb / Normal Hb) ÷ Maturation time — adjusts for degree of anaemia.", "High reticulocytes + elevated bilirubin + reduced haptoglobin = haemolysis until proven otherwise.", "Reticulocyte count from modern analysers is now absolute (×10⁹/L) rather than percentage — more reliable for serial monitoring."],
    relatedTests: ["Haemoglobin", "Bilirubin", "LDH", "Haptoglobin", "Ferritin", "Vitamin B12"],
  },
  {
    id: "mpv", name: "Mean Platelet Volume", abbr: "MPV", category: "Full Blood Count",
    icon: "🩸", what: "Mean platelet volume (MPV) measures the average size of platelets in the blood. Larger platelets are younger and more metabolically active, releasing more clotting factors and inflammatory mediators. MPV is reported automatically on most full blood count analysers alongside platelet count and is a simple indicator of platelet production activity.", why: "MPV helps distinguish the cause of thrombocytopenia: high MPV (large platelets) suggests peripheral destruction of platelets (ITP, DIC) — the bone marrow is producing more large immature platelets. Low MPV with thrombocytopenia suggests impaired bone marrow production (aplastic anaemia, chemotherapy).",
    unit: "fL",
    ranges: {
      both: { low: { min: null, max: 7.5, label: "Low MPV", range: "< 7.5 fL", meaning: "Small platelets — suggests reduced production (aplastic anaemia, chemotherapy suppression, Wiskott-Aldrich syndrome)." }, optimal: { min: 7.5, max: 12.5, label: "Normal", range: "7.5–12.5 fL" }, high: { min: 12.5, max: null, label: "High MPV", range: "> 12.5 fL", meaning: "Large platelets — active platelet production. Peripheral destruction (ITP), essential thrombocythaemia, or cardiovascular risk marker." } }
    },
    tips: ["MPV > 12 fL combined with low platelet count strongly suggests ITP (immune thrombocytopenia) — bone marrow producing compensatory large platelets.", "Elevated MPV is an independent cardiovascular risk factor — associated with MI and stroke, even in individuals with normal platelet counts.", "MPV varies with EDTA storage time — standardise time from collection to analysis for reproducible results.", "MPV and platelet count have an inverse relationship: as platelet count rises in recovery, MPV falls."],
    relatedTests: ["Platelet Count", "PDW", "IPF", "FBC", "D-Dimer"],
  },
  {
    id: "nlr", name: "Neutrophil-to-Lymphocyte Ratio", abbr: "NLR", category: "Full Blood Count",
    icon: "🩸", what: "A calculated ratio from the full blood count (neutrophil count ÷ lymphocyte count) that reflects the balance between innate and adaptive immunity. NLR is a composite marker of systemic inflammatory and immune status.", why: "NLR is a powerful and accessible predictor of outcomes across many clinical contexts: severity of infection/sepsis, cancer prognosis, major surgery outcomes, and risk of cardiovascular events. No additional cost beyond a standard FBC.",
    unit: "ratio",
    ranges: {
      both: { low: null, optimal: { min: 1, max: 3, label: "Normal", range: "1–3" }, borderline: { min: 3, max: 5, label: "Mildly Elevated", range: "3–5", meaning: "Mild stress response, early infection, or low-grade chronic inflammation." }, high: { min: 5, max: null, label: "Elevated", range: "> 5", meaning: "Significant systemic inflammation, severe infection, or major physiological stress. In cancer patients, predicts worse prognosis." } }
    },
    tips: ["NLR rises transiently with acute illness, surgery, or steroid use — interpret in clinical context.", "NLR > 5 in a cancer patient before treatment is associated with worse prognosis across many tumour types.", "Chronic NLR elevation between 3–5 may indicate occult inflammation, metabolic syndrome, or psychological stress.", "NLR can be calculated from any full blood count report — no extra test required."],
    relatedTests: ["Neutrophils", "Lymphocytes", "CRP", "Platelet-Lymphocyte Ratio", "WBC"],
  },
  {
    id: "ldh", name: "Lactate Dehydrogenase", abbr: "LDH", category: "Full Blood Count",
    icon: "🩸", what: "LDH (lactate dehydrogenase) is an enzyme found in almost every cell in the body, converting lactate to pyruvate in cellular energy metabolism. When cells are damaged or die, LDH leaks into the bloodstream. It is a non-specific marker of cell damage — present in red blood cells, liver, heart, skeletal muscle, kidneys, and lungs.", why: "LDH is elevated in haemolysis (red cell destruction), myocardial infarction, pulmonary embolism, hepatitis, cancer (particularly haematological malignancies and testicular cancer), and sepsis. Also used to monitor cancer treatment response.",
    unit: "U/L",
    ranges: {
      both: { low: null, optimal: { min: 135, max: 225, label: "Normal", range: "135–225 U/L" }, high: { min: 225, max: 400, label: "Mildly Elevated", range: "226–400 U/L", meaning: "Non-specific elevation — liver disease, haemolysis, muscle injury, pulmonary infarction." }, veryHigh: { min: 400, max: null, label: "Significantly Elevated", range: "> 400 U/L", meaning: "Significant cell destruction — haematological malignancy, massive haemolysis, severe hepatitis, PE, or cardiac damage." } }
    },
    tips: ["LDH is always elevated when blood is haemolysed in the tube — pre-analytical artefact must be excluded before diagnosing haemolysis.", "In lymphoma and leukaemia, LDH correlates with tumour burden and is used for staging (International Prognostic Index).", "LDH > 600 U/L in PCP pneumonia (HIV) predicts severe disease and poor prognosis.", "LDH isoenzymes: LDH-1 and LDH-2 (heart and RBC), LDH-4 and LDH-5 (liver and skeletal muscle) — rarely ordered now as troponin is more specific for cardiac damage."],
    relatedTests: ["Bilirubin", "Haptoglobin", "Reticulocytes", "Haemoglobin", "Uric Acid", "Troponin"],
  },
  {
    id: "blood-group-rh", name: "Blood Group & Rh Factor (ABO/Rh)", abbr: "ABO/Rh", category: "Full Blood Count",
    icon: "🩸", what: "ABO blood group typing identifies whether red cells carry A antigens, B antigens, both (AB), or neither (O). Rh (Rhesus) typing identifies the D antigen — Rh positive (D present) or Rh negative (D absent). These are the two most clinically important blood group systems.", why: "ABO/Rh compatibility is mandatory before blood transfusion to prevent life-threatening acute haemolytic transfusion reactions. Rh type is critical in obstetrics — an Rh-negative mother carrying an Rh-positive foetus can develop anti-D antibodies causing haemolytic disease of the newborn (HDN).",
    unit: "Qualitative (A/B/AB/O + Rh pos/neg)",
    ranges: {
      both: { stages: [
        { stage: "Group O Rh negative (universal donor)", range: "O Rh(D) negative", meaning: "Universal red cell donor — can donate to any ABO/Rh group in emergencies. Only 7% of UK population." },
        { stage: "Group O Rh positive", range: "O Rh(D) positive", meaning: "Most common UK blood group (37%). Universal donor for Rh-positive recipients." },
        { stage: "Group A", range: "A Rh(D) positive or negative", meaning: "Second most common UK group. Incompatible with group B blood." },
        { stage: "Group B", range: "B Rh(D) positive or negative", meaning: "Less common. Anti-A antibodies present." },
        { stage: "Group AB Rh positive (universal recipient)", range: "AB Rh(D) positive", meaning: "Universal recipient — accepts any blood type. Rarest common group." },
      ] }
    },
    tips: ["Rh-negative women: anti-D immunoglobulin (Rhesus prophylaxis) given at 28 weeks and after delivery if baby is Rh-positive — prevents sensitisation.", "Blood group is fixed for life but ABO subgroup typing can change very rarely after bone marrow transplant.", "Group O-negative blood is given in major haemorrhage when there is no time for full cross-match.", "Emergency obstetric bleeding: always know the mother's blood group — Rh-negative mothers need anti-D after any haemorrhage."],
    relatedTests: ["Atypical Antibody Screen", "Direct Coombs Test", "Cross-Match", "Anti-D Levels", "Foetal Rh Typing"],
  },
  {
    id: "sickle-solubility", name: "Sickle Cell Solubility Test (Sickledex)", abbr: "SICKLE", category: "Full Blood Count",
    icon: "🩸", what: "A rapid, qualitative screening test for the presence of haemoglobin S (sickle haemoglobin). HbS becomes insoluble in a high-phosphate buffer under reducing conditions, causing turbidity. The test distinguishes HbS-containing samples from those without.", why: "Used as a rapid screen for sickle cell disease (HbSS) and sickle cell trait (HbAS) in emergency settings, newborn screening programmes, and pre-operative assessment. A positive result requires confirmation by HPLC/electrophoresis.",
    unit: "Qualitative (Positive / Negative)",
    ranges: {
      both: { stages: [
        { stage: "Negative", range: "Solution remains clear", meaning: "No significant HbS detected — sickle cell disease excluded (in this sample). Does not exclude other haemoglobin variants." },
        { stage: "Positive", range: "Solution becomes turbid/opaque", meaning: "HbS present — could be sickle trait (HbAS), sickle cell disease (HbSS), or compound heterozygous states (HbSC, HbS/β-thal). Requires HPLC/electrophoresis for full characterisation." },
      ] }
    },
    tips: ["The Sickledex test is a screen only — it cannot distinguish sickle trait (HbAS, clinically mild) from sickle cell disease (HbSS, severe).", "False negatives occur in neonates (high HbF) and in severe anaemia (Hb < 70 g/L) — always confirm with HPLC.", "HPLC (high-performance liquid chromatography) is the definitive diagnostic test — provides full quantitative haemoglobin characterisation.", "Pre-operatively: sickle trait does not usually require special measures; sickle cell disease requires careful anaesthetic planning."],
    relatedTests: ["Haemoglobin Electrophoresis (HPLC)", "HbA2", "HbF", "FBC", "Ferritin"],
  },
  {
    id: "homa-ir", name: "HOMA-IR (Insulin Resistance Index)", abbr: "HOMA-IR", category: "Full Blood Count",
    icon: "🩸", what: "HOMA-IR (Homeostatic Model Assessment of Insulin Resistance) is a calculated index derived from fasting glucose and fasting insulin: HOMA-IR = (Fasting Glucose mmol/L × Fasting Insulin µIU/mL) ÷ 22.5. It quantifies the degree of insulin resistance.", why: "HOMA-IR is the most widely used clinical tool for quantifying insulin resistance — the metabolic state where cells require increasingly more insulin to take up glucose. Insulin resistance is the root driver of type 2 diabetes, PCOS, non-alcoholic fatty liver disease, metabolic syndrome, cardiovascular disease, and certain cancers. It is often present for 10–20 years before blood glucose rises, making HOMA-IR a valuable early warning marker.",
    unit: "index",
    ranges: {
      both: { stages: [
        { stage: "Sensitive (low)", range: "< 1.0", meaning: "Excellent insulin sensitivity — cells respond well to insulin signalling." },
        { stage: "Normal", range: "1.0–1.9", meaning: "Normal insulin sensitivity for most healthy adults." },
        { stage: "Early insulin resistance", range: "2.0–2.9", meaning: "Mild insulin resistance — lifestyle intervention (diet, exercise) is effective at this stage." },
        { stage: "Insulin resistant", range: "3.0–5.0", meaning: "Established insulin resistance — metabolic syndrome likely. Risk of T2D, NAFLD, and CVD elevated." },
        { stage: "Severe insulin resistance", range: "> 5.0", meaning: "Severe insulin resistance — high T2D and cardiovascular risk. Medical review essential." },
      ] }
    },
    tips: ["HOMA-IR must be calculated from a fasting sample — eating within 8–12 hours artificially raises insulin and inflates the score.", "A normal fasting glucose with elevated HOMA-IR (2.5–4.0) is the hallmark of pre-diabetes/insulin resistance before the glucose becomes abnormal.", "Exercise and weight loss reduce HOMA-IR — more sensitive measure of metabolic improvement than fasting glucose alone.", "HOMA-IR ethnic variation: South Asians and some other populations have insulin resistance at lower BMI — reference ranges may differ."],
    relatedTests: ["Fasting Insulin", "Fasting Glucose", "HbA1c", "Triglycerides", "HDL Cholesterol"],
  },
  {
    id: "aptt", name: "Activated Partial Thromboplastin Time", abbr: "APTT", category: "Full Blood Count",
    icon: "🩸", what: "Measures the time for blood to clot via the intrinsic coagulation pathway (factors XII, XI, IX, VIII) and the common pathway (X, V, II, fibrinogen). A phospholipid reagent (partial thromboplastin) and activator are added to citrated plasma.", why: "Used to detect clotting factor deficiencies (haemophilia A — FVIII, haemophilia B — FIX), lupus anticoagulant, and to monitor unfractionated heparin therapy. Unexpectedly prolonged APTT triggers further investigation.",
    unit: "seconds",
    ranges: {
      both: { stages: [
        { stage: "Normal", range: "25–38 seconds (lab-dependent)", meaning: "Adequate function of intrinsic and common coagulation pathways." },
        { stage: "Prolonged (ratio > 1.5×)", range: "> 50–55 seconds", meaning: "Significant prolongation — factor deficiency, lupus anticoagulant, heparin, or inhibitor (antibody to a factor)." },
        { stage: "Therapeutic heparin", range: "60–100 seconds (ratio 1.5–2.5×)", meaning: "Target range for unfractionated heparin anticoagulation." },
      ] }
    },
    tips: ["APTT only prolongs when factor levels drop below ~30% of normal — mild deficiencies may be missed.", "APTT prolonged, PT normal: FVIII, FIX, FXI, FXII deficiency, or lupus anticoagulant (intrinsic pathway only).", "APTT + PT both prolonged: common pathway problem (FX, FV, FII, fibrinogen), liver disease, or DIC.", "DOACs (rivaroxaban, apixaban, dabigatran) prolong APTT to varying degrees — not suitable for monitoring their anticoagulant effect.", "Mixing study: if prolonged APTT corrects with normal plasma, it's a deficiency; if it doesn't correct, it's an inhibitor."],
    relatedTests: ["PT/INR", "Fibrinogen", "Factor VIII", "Factor IX", "Lupus Anticoagulant", "Mixing Study"],
  },
  {
    id: "total-protein", name: "Total Protein", abbr: "TP", category: "Full Blood Count",
    icon: "🩸", what: "Measures the total concentration of all proteins in serum — primarily albumin (~60%) and globulins (~40%). Proteins serve as carriers, enzymes, buffers, immune molecules, and structural scaffolds.", why: "Total protein helps evaluate nutritional status, liver synthetic function, and detect paraproteinaemia (monoclonal protein production in myeloma or MGUS). Separating albumin from total protein gives the globulin fraction.",
    unit: "g/L",
    ranges: {
      both: { low: { min: null, max: 60, label: "Low", range: "< 60 g/L", meaning: "Hypoproteinaemia — malnutrition, liver failure, protein-losing enteropathy, nephrotic syndrome, or severe burns." }, optimal: { min: 60, max: 80, label: "Normal", range: "60–80 g/L" }, high: { min: 80, max: null, label: "High", range: "> 80 g/L", meaning: "Hyperproteinaemia — dehydration, paraproteinaemia (myeloma, MGUS), chronic infection, or sarcoidosis." } }
    },
    tips: ["Total protein >90 g/L with low albumin and normal LFTs should prompt serum protein electrophoresis (SPEP) to detect a paraprotein.", "Globulin fraction = Total protein − Albumin. Elevated globulins >40 g/L: check SPEP and immunoglobulins (IgG, IgA, IgM).", "Total protein is affected by posture — values are ~10% higher in standing than lying down due to fluid redistribution.", "In pregnancy, total protein falls by ~5–10 g/L due to haemodilution — physiologically normal."],
    relatedTests: ["Albumin", "Serum Protein Electrophoresis (SPEP)", "Immunoglobulins", "Urine PCR", "LFTs"],
  },
  {
    id: "esr", name: "Erythrocyte Sedimentation Rate", abbr: "ESR", category: "Full Blood Count",
    icon: "🩸", what: "ESR measures the rate at which red blood cells settle to the bottom of a tube over one hour. Acute-phase proteins (fibrinogen, immunoglobulins) coat red cells and promote rouleaux formation, accelerating sedimentation.", why: "A non-specific marker of inflammation, infection, and autoimmune disease. Markedly elevated ESR (>100 mm/hr) is a red flag for serious conditions including giant cell arteritis, multiple myeloma, and severe infection.",
    unit: "mm/hr",
    ranges: {
      male: { low: null, optimal: { min: 0, max: 15, label: "Normal", range: "< 15 mm/hr (age × 0.5 for males)" }, borderline: { min: 15, max: 30, label: "Mildly Elevated", range: "15–30 mm/hr", meaning: "Non-specific mild inflammation — correlate clinically." }, high: { min: 30, max: 100, label: "Elevated", range: "30–100 mm/hr", meaning: "Significant inflammation — autoimmune, infection, malignancy, or temporal arteritis." }, veryHigh: { min: 100, max: null, label: "Very High", range: "> 100 mm/hr", meaning: "Red flag — investigate urgently for GCA, myeloma, endocarditis, or severe systemic infection." } },
      female: { low: null, optimal: { min: 0, max: 20, label: "Normal", range: "< 20 mm/hr (age × 0.5 for females)" }, borderline: { min: 20, max: 40, label: "Mildly Elevated", range: "20–40 mm/hr", meaning: "Non-specific — correlate clinically." }, high: { min: 40, max: 100, label: "Elevated", range: "40–100 mm/hr" }, veryHigh: { min: 100, max: null, label: "Very High", range: "> 100 mm/hr" } }
    },
    tips: ["Age-adjusted upper limit: males = age ÷ 2; females = (age + 10) ÷ 2 (Westergren method).", "ESR responds slowly (days to weeks) compared to CRP (hours) — useful for monitoring chronic inflammatory diseases.", "A very high ESR (>100) with headache, jaw claudication, and scalp tenderness: urgent giant cell arteritis investigation (prednisolone + temporal artery biopsy).", "ESR is elevated in pregnancy, anaemia, and multiple myeloma without necessarily indicating active infection."],
    relatedTests: ["CRP", "PV (Plasma Viscosity)", "Fibrinogen", "Serum Protein Electrophoresis", "Immunoglobulins"],
  },
  {
    id: "creatine-kinase", name: "Creatine Kinase (Total CK)", abbr: "CK", category: "Full Blood Count",
    icon: "🩸", what: "Creatine kinase (CK) is an enzyme found predominantly in skeletal muscle, cardiac muscle, and brain. It catalyses the conversion of creatine to phosphocreatine for rapid energy regeneration in muscle cells. When muscle cells are damaged, CK leaks into the bloodstream.", why: "Total CK is elevated in muscle damage from any cause: myocardial infarction (though troponin is now preferred), skeletal muscle injury, myopathies, rhabdomyolysis, statin-induced myositis, and inflammatory muscle disease (polymyositis, dermatomyositis).",
    unit: "U/L",
    ranges: {
      male: { low: null, optimal: { min: 39, max: 308, label: "Normal", range: "39–308 U/L" }, high: { min: 308, max: 1000, label: "Mildly Elevated", range: "308–1000 U/L", meaning: "Muscle stress, statin myopathy, or vigorous exercise. Consider stopping statins if symptomatic." }, veryHigh: { min: 1000, max: null, label: "Significantly Elevated", range: "> 1000 U/L", meaning: "Rhabdomyolysis, inflammatory myopathy, or severe muscle injury. IV fluids urgently if rhabdomyolysis." } },
      female: { low: null, optimal: { min: 26, max: 192, label: "Normal", range: "26–192 U/L" }, high: { min: 192, max: 600, label: "Mildly Elevated", range: "192–600 U/L", meaning: "Muscle stress, exercise, statin effect." }, veryHigh: { min: 600, max: null, label: "Significantly Elevated", range: "> 600 U/L", meaning: "Rhabdomyolysis or inflammatory myopathy — urgent review." } }
    },
    tips: ["CK naturally varies: significantly higher after intense exercise, in people of African ancestry, and in those with greater muscle mass.", "Statin myopathy: CK > 10× ULN = stop statin immediately; < 5× ULN = reassess at 6 weeks.", "Rhabdomyolysis (CK > 10,000 U/L): risk of acute kidney injury from myoglobin — aggressive IV fluid resuscitation is life-saving.", "CK isoforms: CK-MB (cardiac), CK-MM (skeletal muscle), CK-BB (brain) — CK-MB ratio >3% of total suggests cardiac origin."],
    relatedTests: ["CK-MB", "Troponin", "Myoglobin", "ALT", "LDH", "Aldolase"],
  },
  {
    id: "globulin", name: "Serum Globulin (Calculated)", abbr: "GLOB", category: "Full Blood Count",
    icon: "🩸", what: "Globulins are a family of plasma proteins including immunoglobulins (antibodies), complement proteins, acute-phase proteins, and transport proteins. The globulin fraction is calculated: Globulin = Total Protein − Albumin.", why: "Elevated globulins (hyperglobulinaemia) can indicate chronic infection, autoimmune disease, chronic liver disease, or paraproteinaemia (myeloma, MGUS). Low globulins suggest protein loss or immunodeficiency.",
    unit: "g/L",
    ranges: {
      both: { low: { min: null, max: 15, label: "Low", range: "< 15 g/L", meaning: "Low globulins — primary or secondary immunodeficiency, protein-losing conditions, or severe malnutrition." }, optimal: { min: 15, max: 35, label: "Normal", range: "15–35 g/L" }, high: { min: 35, max: 45, label: "Elevated", range: "35–45 g/L", meaning: "Mild hyperglobulinaemia — chronic infection, autoimmune disease, chronic liver disease." }, veryHigh: { min: 45, max: null, label: "Very High", range: "> 45 g/L", meaning: "Significant hyperglobulinaemia — myeloma, MGUS, chronic infection (TB, HIV, hepatitis), or sarcoidosis. Serum protein electrophoresis essential." } }
    },
    tips: ["Globulin = Total protein − Albumin. An A:G ratio (albumin:globulin) <1.0 strongly suggests chronic liver disease or paraproteinaemia.", "Always request serum protein electrophoresis (SPEP) if globulins >40 g/L — to detect or exclude a monoclonal band (M-protein).", "Polyclonal hyperglobulinaemia (diffuse rise): chronic infection, autoimmune disease, chronic active hepatitis.", "Monoclonal hyperglobulinaemia (narrow M-spike on SPEP): myeloma, MGUS, Waldenström's macroglobulinaemia."],
    relatedTests: ["Albumin", "Total Protein", "SPEP", "IgG/IgA/IgM", "Serum Free Light Chains"],
  },
];
