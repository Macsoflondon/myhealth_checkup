/**
 * Goodbody Clinic Test Details
 * Rich content for all Goodbody blood tests including descriptions,
 * biomarkers, preparation instructions, and booking URLs.
 */

export interface GoodbodyTestDetail {
  slug: string;
  name: string;
  headline: string;
  description: string;
  detailedDescription: string;
  biomarkers: string[];
  whoShouldTake: string[];
  preparation: string;
  sampleType: string;
  turnaround: string;
  category: string;
  goodbodyUrl: string;
  price: number;
}

export const goodbodyTestDetails: Record<string, GoodbodyTestDetail> = {
  "advanced-vitamins": {
    slug: "advanced-vitamins",
    name: "Advanced Vitamins",
    headline: "Comprehensive Vitamin & Mineral Analysis",
    description: "Our most advanced vitamins blood test checks for deficiencies in 10 of the most important vitamins and minerals essential for optimal health and wellbeing.",
    detailedDescription: "The Advanced Vitamins test provides an in-depth analysis of your body's vitamin and mineral levels. Deficiencies in these essential nutrients can lead to fatigue, poor immunity, skin problems, and long-term health issues. This comprehensive panel helps identify any imbalances so you can take targeted action to optimise your health.",
    biomarkers: ["Vitamin A", "Vitamin B6", "Vitamin B12", "Vitamin D", "Vitamin E", "Folate", "Beta Carotene", "Selenium", "Zinc", "Copper"],
    whoShouldTake: [
      "Those experiencing unexplained fatigue or low energy",
      "People with restrictive diets or poor nutrition",
      "Anyone concerned about vitamin deficiencies",
      "Those with malabsorption conditions",
      "Individuals over 50 years old"
    ],
    preparation: "Fasting for 8-12 hours recommended. Water is permitted.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Vitamins & Nutrition",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/advanced-vitamins-blood-test/",
    price: 649
  },
  "advanced-well-man": {
    slug: "advanced-well-man",
    name: "Advanced Well Man",
    headline: "Complete Male Health Assessment",
    description: "A comprehensive health check specifically designed for men, covering key areas including heart health, liver function, kidney function, diabetes risk, and hormone levels.",
    detailedDescription: "The Advanced Well Man test is our most thorough male health assessment. It analyses over 50 biomarkers to give you a complete picture of your health, from cardiovascular risk factors to testosterone levels. This test is ideal for men who want to take a proactive approach to their health and catch potential issues early.",
    biomarkers: ["Full Blood Count", "Liver Function (ALT, AST, GGT, Bilirubin)", "Kidney Function (Creatinine, eGFR, Urea)", "Lipid Profile", "HbA1c", "Testosterone", "PSA", "Thyroid Function", "Iron Studies", "Vitamin D", "Vitamin B12", "Folate"],
    whoShouldTake: [
      "Men over 40 seeking a comprehensive health check",
      "Those with a family history of heart disease or diabetes",
      "Men experiencing fatigue, low mood, or reduced libido",
      "Anyone wanting to establish baseline health markers",
      "Men concerned about prostate health"
    ],
    preparation: "Fasting for 8-12 hours recommended. Take blood sample before 10am for accurate hormone levels.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "General Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/advanced-well-man-test/",
    price: 175
  },
  "advanced-well-woman": {
    slug: "advanced-well-woman",
    name: "Advanced Well Woman",
    headline: "Complete Female Health Assessment",
    description: "A comprehensive health check designed specifically for women, covering hormones, thyroid function, iron levels, vitamins, and key organ function markers.",
    detailedDescription: "The Advanced Well Woman test provides a thorough overview of your health with over 50 biomarkers analysed. From hormone balance to cardiovascular risk, this test helps identify potential health issues before they become serious. It's particularly valuable for women experiencing symptoms like fatigue, weight changes, or mood fluctuations.",
    biomarkers: ["Full Blood Count", "Liver Function", "Kidney Function", "Lipid Profile", "HbA1c", "Oestradiol", "FSH", "LH", "Thyroid Function", "Iron Studies", "Vitamin D", "Vitamin B12", "Folate", "Ferritin"],
    whoShouldTake: [
      "Women over 35 seeking a comprehensive health check",
      "Those experiencing hormonal symptoms or irregularities",
      "Women with a family history of thyroid disease or diabetes",
      "Anyone wanting to understand their fertility status",
      "Women experiencing fatigue, weight changes, or mood swings"
    ],
    preparation: "Fasting for 8-12 hours recommended. For accurate hormone results, take blood sample on day 2-5 of menstrual cycle if possible.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "General Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/advanced-well-woman-test/",
    price: 175
  },
  "anaemia": {
    slug: "anaemia",
    name: "Anaemia",
    headline: "Comprehensive Anaemia Investigation",
    description: "A detailed blood test to investigate the causes of anaemia, checking iron levels, vitamin B12, folate, and red blood cell health.",
    detailedDescription: "Anaemia occurs when you don't have enough healthy red blood cells to carry adequate oxygen to your tissues. This comprehensive panel investigates the most common causes of anaemia including iron deficiency, vitamin B12 deficiency, and folate deficiency. Early detection allows for effective treatment and prevention of complications.",
    biomarkers: ["Full Blood Count", "Ferritin", "Iron", "TIBC", "Transferrin Saturation", "Vitamin B12", "Folate", "Reticulocytes"],
    whoShouldTake: [
      "Those experiencing fatigue, weakness, or pale skin",
      "People with shortness of breath or dizziness",
      "Women with heavy menstrual periods",
      "Vegetarians and vegans",
      "Anyone with a history of anaemia"
    ],
    preparation: "Fasting for 8-12 hours recommended for accurate iron studies.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Haematology",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/anaemia-blood-test/",
    price: 119
  },
  "anti-mullerian": {
    slug: "anti-mullerian",
    name: "Anti-Müllerian Hormone (AMH)",
    headline: "Ovarian Reserve Assessment",
    description: "The AMH test measures your ovarian reserve, giving insight into your remaining egg supply and fertility potential.",
    detailedDescription: "Anti-Müllerian Hormone (AMH) is produced by cells in developing egg sacs (follicles) in the ovaries. This test provides a snapshot of your ovarian reserve - essentially how many eggs you have remaining. AMH levels can help predict response to fertility treatment and give valuable insight into your reproductive timeline.",
    biomarkers: ["Anti-Müllerian Hormone (AMH)"],
    whoShouldTake: [
      "Women considering their fertility options",
      "Those planning to delay pregnancy",
      "Women undergoing fertility treatment",
      "Anyone wanting to understand their ovarian reserve",
      "Women with irregular periods or suspected PCOS"
    ],
    preparation: "No fasting required. Can be taken at any point in your menstrual cycle.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Fertility",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/anti-mullerian-hormone-amh-blood-test/",
    price: 109
  },
  "autoimmune-disease": {
    slug: "autoimmune-disease",
    name: "Autoimmune Disease",
    headline: "Autoimmune Marker Screening",
    description: "A comprehensive panel to screen for autoimmune conditions including rheumatoid arthritis, lupus, and other autoimmune disorders.",
    detailedDescription: "Autoimmune diseases occur when your immune system mistakenly attacks your own body's cells. This panel tests for key autoimmune markers that can indicate conditions such as rheumatoid arthritis, lupus, Sjögren's syndrome, and other autoimmune disorders. Early detection is crucial for managing these conditions effectively.",
    biomarkers: ["ANA (Antinuclear Antibodies)", "Rheumatoid Factor", "Anti-CCP", "ESR", "CRP", "Complement C3", "Complement C4"],
    whoShouldTake: [
      "Those with joint pain, swelling, or stiffness",
      "People experiencing unexplained fatigue",
      "Anyone with skin rashes or sensitivity to sunlight",
      "Those with a family history of autoimmune disease",
      "People with dry eyes or mouth"
    ],
    preparation: "No fasting required.",
    sampleType: "Venous blood sample",
    turnaround: "3-5 working days",
    category: "Autoimmune",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/autoimmune-disease-blood-test/",
    price: 229
  },
  "blood-group": {
    slug: "blood-group",
    name: "Blood Group",
    headline: "Blood Type & Rhesus Factor Test",
    description: "Determine your blood group (A, B, AB, or O) and Rhesus (Rh) factor status with this essential blood typing test.",
    detailedDescription: "Knowing your blood type is essential information for medical emergencies, blood transfusions, and pregnancy planning. This test identifies your ABO blood group and Rhesus (Rh) factor status. The Rh factor is particularly important for pregnant women as Rh incompatibility can affect future pregnancies.",
    biomarkers: ["ABO Blood Group", "Rhesus (Rh) Factor"],
    whoShouldTake: [
      "Anyone who doesn't know their blood type",
      "Women planning pregnancy",
      "Those preparing for surgery",
      "People considering blood donation",
      "Anyone wanting to know their blood type for medical records"
    ],
    preparation: "No fasting required.",
    sampleType: "Venous blood sample",
    turnaround: "1-2 working days",
    category: "Haematology",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/blood-group-blood-test/",
    price: 109
  },
  "cardiac-risk": {
    slug: "cardiac-risk",
    name: "Cardiac Risk",
    headline: "Heart Health Assessment",
    description: "A comprehensive cardiovascular risk assessment checking cholesterol, lipids, and key cardiac markers to evaluate your heart health.",
    detailedDescription: "Heart disease remains one of the leading causes of death in the UK. This cardiac risk panel analyses key markers that contribute to cardiovascular disease risk, including cholesterol levels, triglycerides, and inflammatory markers. Understanding these results can help you take proactive steps to protect your heart health.",
    biomarkers: ["Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "Triglycerides", "Total Cholesterol:HDL Ratio", "Non-HDL Cholesterol", "CRP (High Sensitivity)", "Lipoprotein(a)"],
    whoShouldTake: [
      "Those with a family history of heart disease",
      "People with high blood pressure",
      "Smokers or former smokers",
      "Those who are overweight or obese",
      "Anyone over 40 wanting to assess cardiovascular risk"
    ],
    preparation: "Fasting for 10-14 hours recommended for accurate lipid results.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Heart & Cardiovascular",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/cardiac-risk-blood-test/",
    price: 99
  },
  "cholesterol": {
    slug: "cholesterol",
    name: "Cholesterol",
    headline: "Lipid Profile Analysis",
    description: "A full lipid profile measuring total cholesterol, HDL, LDL, and triglycerides to assess your cardiovascular risk.",
    detailedDescription: "High cholesterol is a major risk factor for heart disease and stroke, yet it has no symptoms. This lipid profile provides a complete picture of your cholesterol levels, including 'good' HDL cholesterol and 'bad' LDL cholesterol. Regular monitoring helps you track the effectiveness of lifestyle changes or medication.",
    biomarkers: ["Total Cholesterol", "HDL Cholesterol", "LDL Cholesterol", "Triglycerides", "Total Cholesterol:HDL Ratio", "Non-HDL Cholesterol"],
    whoShouldTake: [
      "Adults over 40 (recommended every 5 years)",
      "Those with a family history of high cholesterol",
      "People with diabetes or high blood pressure",
      "Anyone taking cholesterol-lowering medication",
      "Those who want to monitor their heart health"
    ],
    preparation: "Fasting for 10-14 hours recommended for accurate results.",
    sampleType: "Venous blood sample",
    turnaround: "1-2 working days",
    category: "Cholesterol & Lipids",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/cholesterol-blood-test/",
    price: 79
  },
  "coeliac-disease": {
    slug: "coeliac-disease",
    name: "Coeliac Disease",
    headline: "Gluten Sensitivity Screening",
    description: "A blood test to screen for coeliac disease by measuring antibodies that indicate an immune reaction to gluten.",
    detailedDescription: "Coeliac disease is an autoimmune condition where the immune system attacks the small intestine when gluten is consumed. This test measures specific antibodies (tTG-IgA and Total IgA) that are elevated in people with coeliac disease. Early diagnosis is important to prevent long-term complications and improve quality of life.",
    biomarkers: ["Tissue Transglutaminase (tTG-IgA)", "Total IgA", "Endomysial Antibodies (if indicated)"],
    whoShouldTake: [
      "Those with digestive symptoms like bloating, diarrhoea, or constipation",
      "People with unexplained weight loss",
      "Anyone with a family history of coeliac disease",
      "Those with iron deficiency anaemia",
      "People with fatigue or vitamin deficiencies"
    ],
    preparation: "You must be eating gluten for at least 6 weeks before the test for accurate results.",
    sampleType: "Venous blood sample",
    turnaround: "3-5 working days",
    category: "Autoimmune",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/coeliac-disease-blood-test/",
    price: 179
  },
  "complete-allergy": {
    slug: "complete-allergy",
    name: "Complete Allergy",
    headline: "Comprehensive Allergy Panel",
    description: "An extensive allergy test screening for over 40 common allergens including foods, environmental triggers, and animal allergens.",
    detailedDescription: "This comprehensive allergy panel tests your blood for IgE antibodies to over 40 common allergens. It covers a wide range of potential triggers including common foods, grasses, trees, dust mites, moulds, and animal dander. Identifying your specific allergens can help you avoid triggers and manage symptoms effectively.",
    biomarkers: ["Total IgE", "Specific IgE to 40+ allergens including: Milk, Egg, Wheat, Peanut, Tree Nuts, Fish, Shellfish, Soya, Grass Pollens, Tree Pollens, Dust Mites, Cat, Dog, Moulds"],
    whoShouldTake: [
      "Those with suspected food allergies",
      "People with hay fever or seasonal symptoms",
      "Anyone with unexplained skin reactions",
      "Those with asthma or respiratory symptoms",
      "People wanting to identify their allergy triggers"
    ],
    preparation: "No fasting required. Antihistamines do not affect results.",
    sampleType: "Venous blood sample",
    turnaround: "5-7 working days",
    category: "Allergy",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/complete-allergy-blood-test/",
    price: 399
  },
  "complete-wellness": {
    slug: "complete-wellness",
    name: "Complete Wellness",
    headline: "Ultimate Health MOT",
    description: "Our most comprehensive health check covering over 60 biomarkers including organ function, vitamins, minerals, hormones, and disease risk markers.",
    detailedDescription: "The Complete Wellness test is our ultimate health assessment, providing a thorough analysis of your overall health. With over 60 biomarkers tested, it covers everything from basic organ function to hormone levels and nutritional status. This test gives you the most complete picture of your health and helps identify any areas that need attention.",
    biomarkers: ["Full Blood Count", "Liver Function", "Kidney Function", "Lipid Profile", "HbA1c", "Thyroid Function", "Iron Studies", "Vitamin D", "Vitamin B12", "Folate", "Magnesium", "Calcium", "CRP", "Uric Acid", "Testosterone/Oestradiol"],
    whoShouldTake: [
      "Anyone wanting a complete health overview",
      "Those with multiple health concerns",
      "People who haven't had a health check in years",
      "Anyone wanting to establish comprehensive baseline markers",
      "Those committed to optimising their health"
    ],
    preparation: "Fasting for 10-14 hours recommended. Take blood sample in the morning for accurate hormone levels.",
    sampleType: "Venous blood sample",
    turnaround: "3-5 working days",
    category: "General Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/complete-wellness-blood-test/",
    price: 249
  },
  "cortisol": {
    slug: "cortisol",
    name: "Cortisol",
    headline: "Stress Hormone Assessment",
    description: "Measure your cortisol levels to assess adrenal function and your body's stress response.",
    detailedDescription: "Cortisol is your body's primary stress hormone, produced by the adrenal glands. It plays a crucial role in metabolism, immune function, and the body's response to stress. Abnormal cortisol levels can cause symptoms like fatigue, weight changes, and mood disturbances. This test helps assess your adrenal function and stress response.",
    biomarkers: ["Cortisol (AM)"],
    whoShouldTake: [
      "Those experiencing chronic fatigue",
      "People with unexplained weight gain or loss",
      "Anyone with symptoms of adrenal dysfunction",
      "Those under prolonged stress",
      "People with sleep disturbances"
    ],
    preparation: "Blood sample must be taken between 8-10am for accurate results. Avoid strenuous exercise and stress before the test.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Hormones",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/cortisol-blood-test/",
    price: 16
  },
  "diabetes": {
    slug: "diabetes",
    name: "Diabetes",
    headline: "Diabetes Screening & Monitoring",
    description: "A comprehensive diabetes test including HbA1c and fasting glucose to screen for or monitor diabetes and pre-diabetes.",
    detailedDescription: "Diabetes affects millions of people in the UK, with many undiagnosed. This test measures your HbA1c (average blood sugar over 2-3 months) and fasting glucose to screen for diabetes and pre-diabetes. Early detection allows for lifestyle interventions that can prevent or delay the onset of type 2 diabetes.",
    biomarkers: ["HbA1c", "Fasting Glucose", "Fasting Insulin", "HOMA-IR (Insulin Resistance)"],
    whoShouldTake: [
      "Those with a family history of diabetes",
      "People who are overweight or obese",
      "Anyone over 40 (screening recommended)",
      "Those with symptoms like thirst, frequent urination, or fatigue",
      "People with gestational diabetes history"
    ],
    preparation: "Fasting for 8-12 hours required for accurate fasting glucose results.",
    sampleType: "Venous blood sample",
    turnaround: "1-2 working days",
    category: "Diabetes",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/diabetes-blood-test/",
    price: 79
  },
  "enhanced-well-woman": {
    slug: "enhanced-well-woman",
    name: "Enhanced Well Woman (Rachel's Test)",
    headline: "Premium Female Health Assessment",
    description: "An enhanced version of our Well Woman test with additional hormone markers and cancer screening biomarkers for comprehensive female health assessment.",
    detailedDescription: "Rachel's Test is our premium female health assessment, building on the Advanced Well Woman with additional markers for a more complete picture. It includes extra hormone markers and the CA-125 ovarian cancer marker. This test is ideal for women who want the most thorough health check available.",
    biomarkers: ["Full Blood Count", "Liver Function", "Kidney Function", "Lipid Profile", "HbA1c", "Full Hormone Panel", "Thyroid Function with Antibodies", "Iron Studies", "Vitamin D", "Vitamin B12", "Folate", "CA-125"],
    whoShouldTake: [
      "Women over 40 seeking comprehensive screening",
      "Those with complex hormonal symptoms",
      "Women with family history of ovarian cancer",
      "Anyone wanting the most thorough female health check",
      "Women approaching or experiencing menopause"
    ],
    preparation: "Fasting for 10-14 hours recommended. For hormone accuracy, test on day 2-5 of menstrual cycle if applicable.",
    sampleType: "Venous blood sample",
    turnaround: "3-5 working days",
    category: "General Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/enhanced-well-woman-rachels-test/",
    price: 175
  },
  "erectile-dysfunction": {
    slug: "erectile-dysfunction",
    name: "Erectile Dysfunction",
    headline: "Male Sexual Health Assessment",
    description: "A blood test to investigate the underlying causes of erectile dysfunction, including hormone levels and cardiovascular markers.",
    detailedDescription: "Erectile dysfunction can be caused by various factors including hormonal imbalances, cardiovascular issues, and diabetes. This test analyses key markers to help identify the underlying cause, enabling targeted treatment. ED can also be an early warning sign of cardiovascular disease, making this test important for overall health.",
    biomarkers: ["Testosterone", "Free Testosterone", "SHBG", "Prolactin", "LH", "FSH", "Lipid Profile", "HbA1c", "PSA"],
    whoShouldTake: [
      "Men experiencing erectile difficulties",
      "Those with reduced libido",
      "Men with symptoms of low testosterone",
      "Anyone wanting to check hormonal health",
      "Men with cardiovascular risk factors"
    ],
    preparation: "Fasting for 8-12 hours recommended. Blood sample should be taken between 8-10am for accurate testosterone levels.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Men's Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/erectile-dysfunction-blood-test/",
    price: 11
  },
  "female-hormone-fertility": {
    slug: "female-hormone-fertility",
    name: "Female Hormone & Fertility",
    headline: "Complete Female Hormone Panel",
    description: "A comprehensive female hormone test measuring key reproductive hormones to assess fertility, menstrual health, and hormonal balance.",
    detailedDescription: "This panel measures the key hormones that regulate your menstrual cycle and fertility. It provides valuable insights into your reproductive health, whether you're trying to conceive, investigating irregular periods, or experiencing symptoms of hormonal imbalance. Results can help guide treatment and lifestyle decisions.",
    biomarkers: ["FSH", "LH", "Oestradiol", "Prolactin", "Progesterone", "AMH", "Thyroid Function (TSH, FT4)"],
    whoShouldTake: [
      "Women trying to conceive",
      "Those with irregular or absent periods",
      "Women with symptoms of hormonal imbalance",
      "Anyone investigating fertility issues",
      "Women considering their reproductive timeline"
    ],
    preparation: "For best results, test on day 2-5 of your menstrual cycle (FSH, LH, Oestradiol) or day 21 (Progesterone). Discuss timing with your GP if unsure.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Women's Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/female-hormone-fertility-blood-test/",
    price: 119
  },
  "full-blood-count": {
    slug: "full-blood-count",
    name: "Full Blood Count",
    headline: "Complete Blood Cell Analysis",
    description: "A full blood count (FBC) measuring red cells, white cells, and platelets to assess overall blood health and detect various conditions.",
    detailedDescription: "The Full Blood Count is one of the most common blood tests and provides essential information about your blood cells. It measures red blood cells (oxygen carriers), white blood cells (immune function), and platelets (clotting). This test can help detect anaemia, infections, blood disorders, and many other conditions.",
    biomarkers: ["Red Blood Cells (RBC)", "Haemoglobin", "Haematocrit", "MCV", "MCH", "MCHC", "RDW", "White Blood Cells (WBC)", "Neutrophils", "Lymphocytes", "Monocytes", "Eosinophils", "Basophils", "Platelets"],
    whoShouldTake: [
      "Anyone wanting a basic health check",
      "Those with fatigue or weakness",
      "People with frequent infections",
      "Anyone with unexplained bruising or bleeding",
      "Those monitoring existing blood conditions"
    ],
    preparation: "No fasting required.",
    sampleType: "Venous blood sample",
    turnaround: "1-2 working days",
    category: "Haematology",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/full-blood-count-blood-test/",
    price: 69
  },
  "hepatitis-screening": {
    slug: "hepatitis-screening",
    name: "Hepatitis Screening",
    headline: "Hepatitis B & C Screening",
    description: "A screening test for Hepatitis B and C infections, including surface antigens and antibodies.",
    detailedDescription: "Hepatitis B and C are viral infections that affect the liver and can lead to serious long-term complications if untreated. Many people with hepatitis have no symptoms and are unaware they're infected. This screening test detects current infection and past exposure, enabling early treatment if needed.",
    biomarkers: ["Hepatitis B Surface Antigen (HBsAg)", "Hepatitis B Surface Antibody (Anti-HBs)", "Hepatitis B Core Antibody (Anti-HBc)", "Hepatitis C Antibody"],
    whoShouldTake: [
      "Anyone who may have been exposed to hepatitis",
      "Those with risk factors (e.g., needle exposure, blood transfusions before 1992)",
      "People with unexplained liver enzyme abnormalities",
      "Healthcare workers",
      "Anyone wanting peace of mind"
    ],
    preparation: "No fasting required.",
    sampleType: "Venous blood sample",
    turnaround: "3-5 working days",
    category: "Infectious Disease",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/hepatitis-screening-blood-test/",
    price: 129
  },
  "iron": {
    slug: "iron",
    name: "Iron",
    headline: "Iron Status Assessment",
    description: "A comprehensive iron panel measuring iron levels, ferritin, and transferrin to assess iron status and detect deficiency or overload.",
    detailedDescription: "Iron is essential for producing haemoglobin and carrying oxygen in the blood. Both iron deficiency and iron overload can cause health problems. This panel provides a complete picture of your iron status, helping to diagnose conditions like iron deficiency anaemia or haemochromatosis.",
    biomarkers: ["Serum Iron", "Ferritin", "TIBC (Total Iron Binding Capacity)", "Transferrin Saturation"],
    whoShouldTake: [
      "Those with fatigue, weakness, or shortness of breath",
      "Women with heavy periods",
      "Vegetarians and vegans",
      "People with digestive conditions affecting absorption",
      "Anyone with a family history of haemochromatosis"
    ],
    preparation: "Fasting for 8-12 hours recommended for accurate results.",
    sampleType: "Venous blood sample",
    turnaround: "1-2 working days",
    category: "Iron Studies",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/iron-blood-test/",
    price: 79
  },
  "kidney": {
    slug: "kidney",
    name: "Kidney",
    headline: "Kidney Function Assessment",
    description: "A kidney function test measuring creatinine, urea, and eGFR to assess how well your kidneys are working.",
    detailedDescription: "Your kidneys filter waste from your blood and regulate fluid balance. This test measures key markers of kidney function including creatinine, urea, and eGFR (estimated glomerular filtration rate). Early detection of kidney problems is important as kidney disease often has no symptoms in early stages.",
    biomarkers: ["Creatinine", "Urea", "eGFR", "Sodium", "Potassium", "Chloride", "Bicarbonate"],
    whoShouldTake: [
      "Those with diabetes or high blood pressure",
      "People taking medications that affect kidneys",
      "Anyone with a family history of kidney disease",
      "Those with symptoms like swelling or changes in urination",
      "Adults over 60 (regular screening recommended)"
    ],
    preparation: "No fasting required. Stay well hydrated.",
    sampleType: "Venous blood sample",
    turnaround: "1-2 working days",
    category: "Renal",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/kidney-function-blood-test/",
    price: 79
  },
  "liver": {
    slug: "liver",
    name: "Liver",
    headline: "Liver Function Assessment",
    description: "A comprehensive liver function test measuring enzymes and proteins to assess liver health and detect damage or disease.",
    detailedDescription: "Your liver performs over 500 vital functions including detoxification, protein synthesis, and bile production. This test measures key liver enzymes and proteins to assess how well your liver is functioning. It can detect liver damage, inflammation, or disease even before symptoms appear.",
    biomarkers: ["ALT (Alanine Aminotransferase)", "AST (Aspartate Aminotransferase)", "GGT (Gamma-GT)", "ALP (Alkaline Phosphatase)", "Bilirubin", "Total Protein", "Albumin", "Globulin"],
    whoShouldTake: [
      "Those who consume alcohol regularly",
      "People taking long-term medications",
      "Anyone with a family history of liver disease",
      "Those with symptoms like jaundice or abdominal pain",
      "People who are overweight or have fatty liver"
    ],
    preparation: "Fasting for 8-12 hours recommended. Avoid alcohol for 24 hours before the test.",
    sampleType: "Venous blood sample",
    turnaround: "1-2 working days",
    category: "Liver",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/liver-function-blood-test/",
    price: 79
  },
  "male-hormone-fertility": {
    slug: "male-hormone-fertility",
    name: "Male Hormone & Fertility",
    headline: "Complete Male Hormone Panel",
    description: "A comprehensive male hormone test measuring testosterone, FSH, LH, and other key hormones affecting fertility and wellbeing.",
    detailedDescription: "This panel measures the key hormones that regulate male fertility and overall wellbeing. Low testosterone can cause symptoms like fatigue, low mood, and reduced libido, while hormone imbalances can affect fertility. This test provides valuable insights for men concerned about their hormonal health.",
    biomarkers: ["Testosterone", "Free Testosterone", "SHBG", "FSH", "LH", "Prolactin", "Oestradiol"],
    whoShouldTake: [
      "Men trying to conceive",
      "Those with symptoms of low testosterone",
      "Men experiencing fertility issues",
      "Anyone with low energy or reduced libido",
      "Men wanting to optimise hormonal health"
    ],
    preparation: "Blood sample must be taken between 8-10am for accurate testosterone levels.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Men's Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/male-hormone-fertility-blood-test/",
    price: 79
  },
  "menopause": {
    slug: "menopause",
    name: "Menopause",
    headline: "Menopause Hormone Assessment",
    description: "A hormone test to assess menopausal status by measuring FSH, LH, and oestradiol levels.",
    detailedDescription: "Menopause marks the end of a woman's reproductive years, typically occurring between ages 45-55. This test measures the key hormones that change during menopause, helping to confirm menopausal status and guide treatment decisions. It's particularly useful for women experiencing symptoms like hot flushes, mood changes, or irregular periods.",
    biomarkers: ["FSH", "LH", "Oestradiol", "Thyroid Function (TSH)"],
    whoShouldTake: [
      "Women over 40 with menopausal symptoms",
      "Those with irregular or absent periods",
      "Women considering HRT",
      "Anyone wanting to confirm menopausal status",
      "Women with early menopause symptoms (under 45)"
    ],
    preparation: "No fasting required. If still menstruating, test on day 2-5 of cycle for most accurate results.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Women's Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/menopause-blood-test/",
    price: 119
  },
  "polycystic-ovary-syndrome": {
    slug: "polycystic-ovary-syndrome",
    name: "Polycystic Ovary Syndrome (PCOS)",
    headline: "PCOS Hormone Panel",
    description: "A comprehensive hormone test to investigate polycystic ovary syndrome, measuring androgens, insulin, and reproductive hormones.",
    detailedDescription: "PCOS is a common hormonal condition affecting up to 1 in 10 women. This panel measures the key hormones and markers associated with PCOS, including androgens (male hormones), insulin resistance markers, and reproductive hormones. Results help confirm diagnosis and guide treatment approaches.",
    biomarkers: ["Testosterone", "Free Androgen Index", "SHBG", "FSH", "LH", "Oestradiol", "Prolactin", "DHEA-S", "AMH", "HbA1c", "Fasting Insulin", "Fasting Glucose"],
    whoShouldTake: [
      "Women with irregular or absent periods",
      "Those with symptoms like acne, excess hair growth, or hair loss",
      "Women with difficulty losing weight",
      "Anyone with suspected PCOS",
      "Those with fertility concerns"
    ],
    preparation: "Fasting for 8-12 hours required. Test on day 2-5 of menstrual cycle if possible.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Women's Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/polycystic-ovary-syndrome-pcos-blood-test/",
    price: 129
  },
  "pregnancy": {
    slug: "pregnancy",
    name: "Pregnancy",
    headline: "Pregnancy Confirmation & Health Check",
    description: "A blood test to confirm pregnancy and check key health markers important during early pregnancy.",
    detailedDescription: "This test confirms pregnancy by measuring beta-hCG (human chorionic gonadotropin), which is more accurate than urine tests. It also checks important health markers for early pregnancy including blood group, rubella immunity, and iron levels. Early confirmation allows you to begin prenatal care promptly.",
    biomarkers: ["Beta-hCG (Pregnancy Hormone)", "Blood Group & Rhesus Factor", "Full Blood Count", "Ferritin", "Rubella Immunity"],
    whoShouldTake: [
      "Women wanting to confirm pregnancy",
      "Those with a positive home pregnancy test",
      "Women trying to conceive",
      "Anyone wanting early pregnancy health checks",
      "Women with irregular periods who may be pregnant"
    ],
    preparation: "No fasting required.",
    sampleType: "Venous blood sample",
    turnaround: "1-2 working days",
    category: "Women's Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/pregnancy-blood-test/",
    price: 79
  },
  "prostate-psa": {
    slug: "prostate-psa",
    name: "Prostate PSA",
    headline: "Prostate Health Screening",
    description: "A PSA (Prostate Specific Antigen) test to screen for prostate problems including prostate cancer.",
    detailedDescription: "PSA is a protein produced by the prostate gland. Elevated PSA levels can indicate prostate problems including prostate cancer, benign prostatic hyperplasia (BPH), or prostatitis. While not diagnostic on its own, PSA testing is an important screening tool, especially for men over 50 or those with risk factors.",
    biomarkers: ["Total PSA", "Free PSA", "Free:Total PSA Ratio"],
    whoShouldTake: [
      "Men over 50 (regular screening recommended)",
      "Men over 45 with family history of prostate cancer",
      "Black men over 45 (higher risk group)",
      "Men with urinary symptoms",
      "Anyone wanting to check prostate health"
    ],
    preparation: "Avoid ejaculation for 48 hours before the test. Avoid vigorous exercise and cycling for 48 hours. Do not test if you have a urinary infection.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Men's Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/prostate-psa-blood-test/",
    price: 119
  },
  "pylori": {
    slug: "pylori",
    name: "H. Pylori",
    headline: "Helicobacter Pylori Detection",
    description: "A blood test to detect H. pylori infection, a common cause of stomach ulcers and gastritis.",
    detailedDescription: "Helicobacter pylori is a bacterium that infects the stomach lining and is a major cause of gastritis, stomach ulcers, and is linked to stomach cancer. This blood test detects antibodies to H. pylori, indicating current or past infection. If positive, treatment with antibiotics can eliminate the infection.",
    biomarkers: ["H. pylori IgG Antibodies"],
    whoShouldTake: [
      "Those with persistent stomach pain or discomfort",
      "People with symptoms of acid reflux or heartburn",
      "Anyone with a history of stomach ulcers",
      "Those with unexplained nausea or bloating",
      "People with a family history of stomach cancer"
    ],
    preparation: "No fasting required.",
    sampleType: "Venous blood sample",
    turnaround: "3-5 working days",
    category: "Digestive Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/helicobacter-pylori-blood-test/",
    price: 79
  },
  "sports-fitness": {
    slug: "sports-fitness",
    name: "Sports & Fitness",
    headline: "Athletic Performance Optimisation",
    description: "A comprehensive test for athletes and fitness enthusiasts, measuring markers that affect performance, recovery, and overall health.",
    detailedDescription: "Whether you're a professional athlete or fitness enthusiast, this test provides insights into markers that affect your training and recovery. It analyses energy metabolism, muscle health, inflammation, hormones, and nutritional status to help you optimise performance and prevent overtraining.",
    biomarkers: ["Full Blood Count", "Iron Studies", "Vitamin D", "Vitamin B12", "Magnesium", "Testosterone", "Cortisol", "CRP", "CK (Creatine Kinase)", "Thyroid Function", "HbA1c", "Lipid Profile"],
    whoShouldTake: [
      "Athletes and serious fitness enthusiasts",
      "Those training for events or competitions",
      "Anyone experiencing fatigue or poor recovery",
      "People wanting to optimise their performance",
      "Those new to training who want baseline markers"
    ],
    preparation: "Avoid intense exercise for 48 hours before the test. Fasting for 8-12 hours recommended.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Sports Performance",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/sports-fitness-blood-test/",
    price: 199
  },
  "testosterone": {
    slug: "testosterone",
    name: "Testosterone",
    headline: "Testosterone Level Assessment",
    description: "A testosterone test measuring total and free testosterone levels to assess male hormone status.",
    detailedDescription: "Testosterone is the primary male sex hormone, essential for muscle mass, bone density, libido, and overall wellbeing. This test measures both total testosterone and the biologically active 'free' testosterone. Low testosterone can cause fatigue, low mood, reduced libido, and loss of muscle mass.",
    biomarkers: ["Total Testosterone", "Free Testosterone (calculated)", "SHBG"],
    whoShouldTake: [
      "Men with symptoms of low testosterone",
      "Those experiencing fatigue or low energy",
      "Men with reduced libido or erectile issues",
      "Anyone with mood changes or depression",
      "Men wanting to monitor hormone levels"
    ],
    preparation: "Blood sample must be taken between 8-10am for accurate results.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Hormones",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/testosterone-blood-test/",
    price: 79
  },
  "thyroid-function": {
    slug: "thyroid-function",
    name: "Thyroid Function",
    headline: "Thyroid Health Assessment",
    description: "A thyroid function test measuring TSH, T4, and T3 to assess thyroid gland function.",
    detailedDescription: "Your thyroid gland controls your metabolism and affects almost every organ in your body. This test measures the key thyroid hormones (TSH, Free T4, Free T3) to assess whether your thyroid is underactive (hypothyroidism) or overactive (hyperthyroidism). Thyroid disorders are common and highly treatable.",
    biomarkers: ["TSH (Thyroid Stimulating Hormone)", "Free T4 (Thyroxine)", "Free T3 (Triiodothyronine)"],
    whoShouldTake: [
      "Those with fatigue, weight changes, or mood swings",
      "People with family history of thyroid disease",
      "Women planning pregnancy",
      "Anyone with symptoms of thyroid dysfunction",
      "Those on thyroid medication (monitoring)"
    ],
    preparation: "No fasting required. If on thyroid medication, take blood before your morning dose.",
    sampleType: "Venous blood sample",
    turnaround: "1-2 working days",
    category: "Thyroid",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/thyroid-function-blood-test/",
    price: 79
  },
  "thyroid-with-antibodies": {
    slug: "thyroid-with-antibodies",
    name: "Thyroid With Antibodies",
    headline: "Complete Thyroid Panel",
    description: "A comprehensive thyroid test including thyroid hormones and antibodies to detect autoimmune thyroid conditions.",
    detailedDescription: "This extended thyroid panel includes the standard thyroid function markers plus thyroid antibodies. Antibodies like TPO and TgAb indicate autoimmune thyroid conditions such as Hashimoto's thyroiditis or Graves' disease. This test provides a complete picture of thyroid health and is recommended for those with suspected autoimmune thyroid disease.",
    biomarkers: ["TSH", "Free T4", "Free T3", "TPO Antibodies (Thyroid Peroxidase)", "TgAb (Thyroglobulin Antibodies)"],
    whoShouldTake: [
      "Those with symptoms of thyroid dysfunction",
      "People with family history of autoimmune thyroid disease",
      "Women with fertility issues or recurrent miscarriage",
      "Anyone with fluctuating thyroid levels",
      "Those wanting comprehensive thyroid assessment"
    ],
    preparation: "No fasting required. If on thyroid medication, take blood before your morning dose.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "Thyroid",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/thyroid-with-antibodies-blood-test/",
    price: 119
  },
  "tiredness-fatigue": {
    slug: "tiredness-fatigue",
    name: "Tiredness & Fatigue",
    headline: "Fatigue Investigation Panel",
    description: "A comprehensive test investigating the common causes of tiredness and fatigue, including thyroid, iron, vitamins, and diabetes markers.",
    detailedDescription: "Persistent tiredness can have many causes, from vitamin deficiencies to thyroid problems. This panel tests the most common causes of fatigue in one comprehensive test. By checking multiple markers simultaneously, we can efficiently identify what might be causing your tiredness and help you feel energised again.",
    biomarkers: ["Full Blood Count", "Ferritin", "Iron", "Vitamin B12", "Folate", "Vitamin D", "Thyroid Function", "HbA1c", "Liver Function", "Kidney Function", "CRP"],
    whoShouldTake: [
      "Those experiencing persistent tiredness or low energy",
      "People with unexplained fatigue",
      "Anyone with poor sleep despite adequate rest",
      "Those with concentration difficulties",
      "People wanting to investigate energy levels"
    ],
    preparation: "Fasting for 8-12 hours recommended.",
    sampleType: "Venous blood sample",
    turnaround: "2-3 working days",
    category: "General Health",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/tiredness-fatigue-blood-test/",
    price: 149
  },
  "trace-metal": {
    slug: "trace-metal",
    name: "Trace Metal",
    headline: "Essential Trace Elements Analysis",
    description: "A test measuring essential trace elements and heavy metals to assess nutritional status and detect toxic metal exposure.",
    detailedDescription: "Trace elements like zinc, copper, and selenium are essential for health in small amounts, while heavy metals like lead and mercury can be toxic. This test measures both essential trace elements to check for deficiencies and potentially harmful metals to detect environmental exposure or occupational hazards.",
    biomarkers: ["Zinc", "Copper", "Selenium", "Manganese", "Chromium", "Lead", "Mercury", "Arsenic", "Cadmium"],
    whoShouldTake: [
      "Those with suspected nutritional deficiencies",
      "People with occupational metal exposure",
      "Anyone with unexplained symptoms",
      "Those living in areas with environmental concerns",
      "People wanting to check trace element status"
    ],
    preparation: "No fasting required. Avoid supplements containing trace minerals for 24 hours before the test.",
    sampleType: "Venous blood sample",
    turnaround: "5-7 working days",
    category: "Vitamins & Nutrition",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/trace-metal-blood-test/",
    price: 199
  },
  "vitamins": {
    slug: "vitamins",
    name: "Vitamins",
    headline: "Essential Vitamins Panel",
    description: "A core vitamins test measuring the most important vitamins including D, B12, and folate.",
    detailedDescription: "Vitamin deficiencies are common and can cause a range of symptoms from fatigue to neurological problems. This essential vitamins panel tests the key vitamins that are most commonly deficient in the UK population. It's a great starting point for anyone wanting to check their nutritional status.",
    biomarkers: ["Vitamin D", "Vitamin B12", "Folate", "Ferritin"],
    whoShouldTake: [
      "Those with fatigue or low energy",
      "Vegetarians and vegans",
      "People with limited sun exposure",
      "Anyone with poor diet or absorption issues",
      "Those wanting to check basic vitamin status"
    ],
    preparation: "No fasting required.",
    sampleType: "Venous blood sample",
    turnaround: "1-2 working days",
    category: "Vitamins & Nutrition",
    goodbodyUrl: "https://health.goodbodyclinic.com/product/vitamins-blood-test/",
    price: 99
  }
};

/**
 * Get test details by slug
 */
export const getGoodbodyTestBySlug = (slug: string): GoodbodyTestDetail | undefined => {
  return goodbodyTestDetails[slug];
};

/**
 * Get all Goodbody test slugs
 */
export const getAllGoodbodyTestSlugs = (): string[] => {
  return Object.keys(goodbodyTestDetails);
};

/**
 * Map database test name to slug
 */
export const testNameToSlug = (testName: string): string => {
  return testName
    .toLowerCase()
    .replace(/[&]/g, '')
    .replace(/[()]/g, '')
    .replace(/[']/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Get test details by database test name
 */
export const getGoodbodyTestByName = (testName: string): GoodbodyTestDetail | undefined => {
  const slug = testNameToSlug(testName);
  return goodbodyTestDetails[slug];
};
