export interface SymptomPageData {
  slug: string;
  name: string;
  icon: string;
  colorHex: string;
  shortDescription: string;
  clinicalExplanation: string;
  recommendedTests: {
    name: string;
    why: string;
    keyBiomarkers: string[];
    searchQuery: string;
  }[];
  whenToSeeGP: string;
}

export const symptomPages: SymptomPageData[] = [
  {
    slug: "fatigue",
    name: "Fatigue",
    icon: "🔋",
    colorHex: "#e70d69",
    shortDescription: "Persistent tiredness that doesn't improve with rest",
    clinicalExplanation:
      "Fatigue is one of the most common reasons people seek blood tests. It can stem from iron deficiency, underactive thyroid, vitamin D or B12 deficiency, diabetes, or hormonal imbalances. A targeted blood test can identify — or rule out — the most frequent underlying causes, giving you a clear direction for treatment.",
    recommendedTests: [
      {
        name: "Full Blood Count",
        why: "Screens for anaemia and infection markers that commonly cause fatigue",
        keyBiomarkers: ["Haemoglobin", "Red Blood Cells", "White Blood Cells", "Platelets"],
        searchQuery: "full+blood+count",
      },
      {
        name: "Thyroid Function",
        why: "Hypothyroidism is a leading cause of unexplained tiredness",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Iron Profile",
        why: "Iron deficiency is the most common nutritional deficiency worldwide",
        keyBiomarkers: ["Ferritin", "Iron", "TIBC", "Transferrin Saturation"],
        searchQuery: "iron",
      },
      {
        name: "Vitamin D",
        why: "Low vitamin D is extremely common in the UK and linked to fatigue and muscle weakness",
        keyBiomarkers: ["25-OH Vitamin D"],
        searchQuery: "vitamin+d",
      },
      {
        name: "Vitamin B12 & Folate",
        why: "Deficiency causes fatigue, brain fog, and neurological symptoms",
        keyBiomarkers: ["Vitamin B12", "Folate"],
        searchQuery: "vitamin+b12",
      },
    ],
    whenToSeeGP:
      "If your fatigue is accompanied by unexplained weight loss, persistent fever, or has lasted more than four weeks without improvement, consult your GP.",
  },
  {
    slug: "low-mood",
    name: "Low Mood",
    icon: "😔",
    colorHex: "#7c3aed",
    shortDescription: "Persistent low mood, anxiety, or emotional changes",
    clinicalExplanation:
      "While low mood and depression have complex causes, several treatable medical conditions can contribute. Thyroid dysfunction, vitamin D deficiency, iron deficiency anaemia, and hormonal imbalances are all known to affect mood, energy, and cognitive function. Blood testing can identify these physical contributors alongside other care.",
    recommendedTests: [
      {
        name: "Thyroid Function",
        why: "Both hypo- and hyperthyroidism can significantly affect mood and anxiety levels",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Vitamin D",
        why: "Strong correlation between low vitamin D and mood disorders, especially in winter months",
        keyBiomarkers: ["25-OH Vitamin D"],
        searchQuery: "vitamin+d",
      },
      {
        name: "Hormone Profile",
        why: "Testosterone, oestrogen, and cortisol imbalances can all impact emotional wellbeing",
        keyBiomarkers: ["Testosterone", "Oestradiol", "Cortisol", "DHEA-S"],
        searchQuery: "hormone",
      },
      {
        name: "Full Blood Count",
        why: "Anaemia is a common but often overlooked contributor to low mood",
        keyBiomarkers: ["Haemoglobin", "Red Blood Cells", "MCV"],
        searchQuery: "full+blood+count",
      },
    ],
    whenToSeeGP:
      "If you are experiencing persistent low mood, thoughts of self-harm, or significant changes in sleep and appetite, please speak to your GP or contact the Samaritans (116 123) immediately.",
  },
  {
    slug: "hair-loss",
    name: "Hair Loss",
    icon: "💇",
    colorHex: "#f59e0b",
    shortDescription: "Thinning hair, excessive shedding, or bald patches",
    clinicalExplanation:
      "Hair loss (alopecia) can be triggered by iron deficiency, thyroid disorders, hormonal changes, vitamin deficiencies, and stress. In many cases, identifying and treating the underlying cause can slow or reverse hair loss. Blood tests are typically the first step in investigating unexplained hair thinning.",
    recommendedTests: [
      {
        name: "Iron Profile",
        why: "Ferritin levels below 70 µg/L are associated with hair shedding even without full anaemia",
        keyBiomarkers: ["Ferritin", "Iron", "TIBC"],
        searchQuery: "iron",
      },
      {
        name: "Thyroid Function",
        why: "Both overactive and underactive thyroid can cause diffuse hair thinning",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Hormone Profile",
        why: "Elevated androgens or hormonal shifts (e.g. PCOS, menopause) are common causes",
        keyBiomarkers: ["Testosterone", "DHEA-S", "Oestradiol", "SHBG"],
        searchQuery: "hormone",
      },
      {
        name: "Vitamin D & B12",
        why: "Deficiencies in both are linked to hair thinning and slow regrowth",
        keyBiomarkers: ["25-OH Vitamin D", "Vitamin B12"],
        searchQuery: "vitamin",
      },
    ],
    whenToSeeGP:
      "If you notice sudden patchy hair loss, complete loss of eyebrows/eyelashes, or scarring on the scalp, see your GP for specialist referral.",
  },
  {
    slug: "weight-gain",
    name: "Weight Gain",
    icon: "⚖️",
    colorHex: "#22c0d4",
    shortDescription: "Unexplained weight gain or difficulty losing weight",
    clinicalExplanation:
      "Unexplained weight gain can indicate thyroid dysfunction, insulin resistance, hormonal imbalances, or metabolic issues. If diet and exercise aren't producing expected results, blood tests can reveal whether an underlying medical condition is contributing — allowing targeted intervention rather than guesswork.",
    recommendedTests: [
      {
        name: "Thyroid Function",
        why: "Hypothyroidism slows metabolism and is one of the most common causes of unexplained weight gain",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Diabetes Check (HbA1c)",
        why: "Insulin resistance and pre-diabetes cause the body to store more fat, especially around the abdomen",
        keyBiomarkers: ["HbA1c", "Fasting Glucose", "Insulin"],
        searchQuery: "diabetes",
      },
      {
        name: "Hormone Profile",
        why: "Low testosterone (men) or hormonal shifts (women) can drive weight changes",
        keyBiomarkers: ["Testosterone", "Oestradiol", "Cortisol", "SHBG"],
        searchQuery: "hormone",
      },
      {
        name: "Lipid Profile",
        why: "Assesses cardiovascular risk often associated with metabolic weight gain",
        keyBiomarkers: ["Total Cholesterol", "LDL", "HDL", "Triglycerides"],
        searchQuery: "cholesterol",
      },
    ],
    whenToSeeGP:
      "If you've gained weight rapidly without dietary change, notice swelling in your face or limbs, or have a family history of thyroid disease, consult your GP.",
  },
  {
    slug: "low-libido",
    name: "Low Libido",
    icon: "💜",
    colorHex: "#e70d69",
    shortDescription: "Reduced sex drive or changes in sexual function",
    clinicalExplanation:
      "Low libido affects both men and women and frequently has a hormonal component. Testosterone deficiency, thyroid disorders, high prolactin, and chronic fatigue from anaemia or vitamin deficiency can all reduce sexual desire. Blood testing helps identify treatable causes so that appropriate support — medical or lifestyle — can be targeted effectively.",
    recommendedTests: [
      {
        name: "Male Hormone Profile",
        why: "Low testosterone is the most common hormonal cause of reduced libido in men",
        keyBiomarkers: ["Total Testosterone", "Free Testosterone", "SHBG", "LH", "FSH"],
        searchQuery: "male+hormone",
      },
      {
        name: "Female Hormone Profile",
        why: "Oestrogen, testosterone, and progesterone imbalances all affect desire and arousal",
        keyBiomarkers: ["Oestradiol", "Testosterone", "Progesterone", "SHBG"],
        searchQuery: "female+hormone",
      },
      {
        name: "Thyroid Function",
        why: "Both overactive and underactive thyroid disrupt libido and energy",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Prolactin",
        why: "Elevated prolactin suppresses sex hormones and reduces desire",
        keyBiomarkers: ["Prolactin"],
        searchQuery: "prolactin",
      },
    ],
    whenToSeeGP:
      "If low libido is accompanied by erectile dysfunction, absent periods, or discharge from the nipples, seek medical advice promptly.",
  },
];
