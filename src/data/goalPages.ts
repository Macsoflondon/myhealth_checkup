export interface GoalPageData {
  slug: string;
  name: string;
  icon: string;
  colorHex: string;
  shortDescription: string;
  explanation: string;
  recommendedTests: {
    name: string;
    why: string;
    keyBiomarkers: string[];
    searchQuery: string;
  }[];
  topTip: string;
}

export const goalPages: GoalPageData[] = [
  {
    slug: "longevity",
    name: "Longevity",
    icon: "🧬",
    colorHex: "#22c0d4",
    shortDescription: "Optimise your health for a longer, healthier life",
    explanation:
      "Longevity-focused testing goes beyond checking for illness — it tracks the biomarkers that predict long-term health outcomes. From cardiovascular risk and metabolic health to inflammation and organ function, regular monitoring lets you intervene early and make data-driven lifestyle adjustments. The goal is not just to live longer, but to extend your healthspan.",
    recommendedTests: [
      {
        name: "Advanced Health Check",
        why: "Comprehensive baseline covering heart, liver, kidney, thyroid, and metabolic markers",
        keyBiomarkers: ["HbA1c", "Cholesterol", "Liver Function", "Kidney Function", "CRP"],
        searchQuery: "advanced+health",
      },
      {
        name: "Heart Health",
        why: "Cardiovascular disease remains the UK's leading cause of death — early detection saves lives",
        keyBiomarkers: ["Total Cholesterol", "LDL", "HDL", "Triglycerides", "ApoB", "Lp(a)"],
        searchQuery: "heart+health",
      },
      {
        name: "Diabetes Check (HbA1c)",
        why: "Insulin resistance is a key driver of accelerated ageing and chronic disease",
        keyBiomarkers: ["HbA1c", "Fasting Glucose", "Insulin"],
        searchQuery: "diabetes",
      },
      {
        name: "Vitamin & Mineral Panel",
        why: "Micronutrient status impacts immune function, energy, and cellular repair",
        keyBiomarkers: ["Vitamin D", "Vitamin B12", "Folate", "Ferritin", "Magnesium"],
        searchQuery: "vitamin",
      },
    ],
    topTip:
      "Test annually. Track trends over time rather than single snapshots — longevity is about trajectory, not a single result.",
  },
  {
    slug: "performance",
    name: "Performance",
    icon: "⚡",
    colorHex: "#e70d69",
    shortDescription: "Maximise athletic output and recovery",
    explanation:
      "Whether you're a competitive athlete or a dedicated gym-goer, performance testing reveals what's happening beneath the surface. Hormonal balance, iron stores, inflammation, and metabolic efficiency all directly impact your training capacity, recovery speed, and injury risk. Testing removes guesswork from your programme.",
    recommendedTests: [
      {
        name: "Sports Performance Panel",
        why: "Tailored for athletes — covers hormones, iron, inflammation, and metabolic markers",
        keyBiomarkers: ["Testosterone", "Cortisol", "Ferritin", "CRP", "CK", "Vitamin D"],
        searchQuery: "sports+performance",
      },
      {
        name: "Iron Profile",
        why: "Iron deficiency impairs oxygen delivery and endurance before anaemia develops",
        keyBiomarkers: ["Ferritin", "Iron", "TIBC", "Transferrin Saturation"],
        searchQuery: "iron",
      },
      {
        name: "Male / Female Hormone Profile",
        why: "Hormonal balance directly affects muscle synthesis, recovery, and energy",
        keyBiomarkers: ["Testosterone", "Cortisol", "SHBG", "Oestradiol", "DHEA-S"],
        searchQuery: "hormone",
      },
      {
        name: "Thyroid Function",
        why: "Thyroid controls metabolic rate — dysfunction impairs performance and recovery",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
    ],
    topTip:
      "Test during a training block baseline (not peak volume) for the most actionable results. Retest every 3–6 months.",
  },
  {
    slug: "weight-loss",
    name: "Weight Loss",
    icon: "🎯",
    colorHex: "#059669",
    shortDescription: "Understand what's working against your weight loss goals",
    explanation:
      "If you're eating well and exercising but not losing weight, there may be a medical reason. Thyroid disorders, insulin resistance, hormonal imbalances, and chronic inflammation can all make weight loss significantly harder. Testing identifies these barriers so you can work with your body — not against it.",
    recommendedTests: [
      {
        name: "Thyroid Function",
        why: "An underactive thyroid is one of the most common yet underdiagnosed barriers to weight loss",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Diabetes & Insulin Resistance",
        why: "Elevated insulin drives fat storage and makes weight loss physiologically harder",
        keyBiomarkers: ["HbA1c", "Fasting Glucose", "Insulin"],
        searchQuery: "diabetes",
      },
      {
        name: "Hormone Profile",
        why: "Cortisol, testosterone, and oestrogen imbalances all influence body composition",
        keyBiomarkers: ["Cortisol", "Testosterone", "Oestradiol", "SHBG"],
        searchQuery: "hormone",
      },
      {
        name: "Lipid Profile",
        why: "Cholesterol and triglycerides help assess metabolic health and cardiovascular risk",
        keyBiomarkers: ["Total Cholesterol", "LDL", "HDL", "Triglycerides"],
        searchQuery: "cholesterol",
      },
    ],
    topTip:
      "Combine testing with a food diary for 2 weeks before your appointment. Context makes results far more actionable.",
  },
  {
    slug: "preventative-health",
    name: "Preventative Health",
    icon: "🛡️",
    colorHex: "#081129",
    shortDescription: "Catch problems early before symptoms appear",
    explanation:
      "Preventative health testing is the cornerstone of modern wellness. Many serious conditions — diabetes, cardiovascular disease, thyroid disorders, and some cancers — develop silently over years. Regular screening catches warning signs early, when intervention is most effective and least invasive. Think of it as a health MOT for your body.",
    recommendedTests: [
      {
        name: "Well Man / Well Woman Check",
        why: "Age- and gender-appropriate screening covering the most important health markers",
        keyBiomarkers: ["Full Blood Count", "Liver Function", "Kidney Function", "Thyroid", "Cholesterol"],
        searchQuery: "well+man",
      },
      {
        name: "Cancer Screening Panel",
        why: "Early-detection markers for common cancers including prostate, ovarian, and bowel",
        keyBiomarkers: ["PSA", "CA-125", "CEA"],
        searchQuery: "cancer",
      },
      {
        name: "Diabetes Check",
        why: "1 in 3 UK adults has pre-diabetes — most don't know it",
        keyBiomarkers: ["HbA1c", "Fasting Glucose"],
        searchQuery: "diabetes",
      },
      {
        name: "Heart Health Check",
        why: "Cardiovascular disease is the UK's biggest killer — a simple blood test assesses your risk",
        keyBiomarkers: ["Total Cholesterol", "LDL", "HDL", "Triglycerides", "CRP"],
        searchQuery: "heart+health",
      },
    ],
    topTip:
      "Start annual testing from age 30. Share results with your GP to build a longitudinal health record.",
  },
];
