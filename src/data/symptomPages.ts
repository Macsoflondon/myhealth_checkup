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
        name: "Full blood count",
        why: "Screens for anaemia and infection markers that commonly cause fatigue",
        keyBiomarkers: [
          "Haemoglobin",
          "Red blood cells",
          "White blood cells",
          "Platelets",
        ],
        searchQuery: "full+blood+count",
      },
      {
        name: "Thyroid function",
        why: "Hypothyroidism is a leading cause of unexplained tiredness",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Iron profile",
        why: "Iron deficiency is the most common nutritional deficiency worldwide",
        keyBiomarkers: ["Ferritin", "Iron", "TIBC", "Transferrin saturation"],
        searchQuery: "iron",
      },
      {
        name: "Vitamin D",
        why: "Low vitamin D is extremely common in the UK and linked to fatigue and muscle weakness",
        keyBiomarkers: ["25-OH vitamin D"],
        searchQuery: "vitamin+d",
      },
      {
        name: "Vitamin B12 & folate",
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
    name: "Low mood",
    icon: "😔",
    colorHex: "#7c3aed",
    shortDescription: "Persistent low mood, anxiety, or emotional changes",
    clinicalExplanation:
      "While low mood and depression have complex causes, several treatable medical conditions can contribute. Thyroid dysfunction, vitamin D deficiency, iron deficiency anaemia, and hormonal imbalances are all known to affect mood, energy, and cognitive function. Blood testing can identify these physical contributors alongside other care.",
    recommendedTests: [
      {
        name: "Thyroid function",
        why: "Both hypo- and hyperthyroidism can significantly affect mood and anxiety levels",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Vitamin D",
        why: "Strong correlation between low vitamin D and mood disorders, especially in winter months",
        keyBiomarkers: ["25-OH vitamin D"],
        searchQuery: "vitamin+d",
      },
      {
        name: "Hormone profile",
        why: "Testosterone, oestrogen, and cortisol imbalances can all impact emotional wellbeing",
        keyBiomarkers: ["Testosterone", "Oestradiol", "Cortisol", "DHEA-S"],
        searchQuery: "hormone",
      },
      {
        name: "Full blood count",
        why: "Anaemia is a common but often overlooked contributor to low mood",
        keyBiomarkers: ["Haemoglobin", "Red blood cells", "MCV"],
        searchQuery: "full+blood+count",
      },
    ],
    whenToSeeGP:
      "If you are experiencing persistent low mood, thoughts of self-harm, or significant changes in sleep and appetite, please speak to your GP or contact the Samaritans (116 123) immediately.",
  },
  {
    slug: "hair-loss",
    name: "Hair loss",
    icon: "💇",
    colorHex: "#f59e0b",
    shortDescription: "Thinning hair, excessive shedding, or bald patches",
    clinicalExplanation:
      "Hair loss (alopecia) can be triggered by iron deficiency, thyroid disorders, hormonal changes, vitamin deficiencies, and stress. In many cases, identifying and treating the underlying cause can slow or reverse hair loss. Blood tests are typically the first step in investigating unexplained hair thinning.",
    recommendedTests: [
      {
        name: "Iron profile",
        why: "Ferritin levels below 70 µg/L are associated with hair shedding even without full anaemia",
        keyBiomarkers: ["Ferritin", "Iron", "TIBC"],
        searchQuery: "iron",
      },
      {
        name: "Thyroid function",
        why: "Both overactive and underactive thyroid can cause diffuse hair thinning",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Hormone profile",
        why: "Elevated androgens or hormonal shifts (e.g. PCOS, menopause) are common causes",
        keyBiomarkers: ["Testosterone", "DHEA-S", "Oestradiol", "SHBG"],
        searchQuery: "hormone",
      },
      {
        name: "Vitamin D test",
        why: "Vitamin D deficiency is linked to hair thinning and slow regrowth",
        keyBiomarkers: ["25-OH vitamin D"],
        searchQuery: "vitamin d",
      },
      {
        name: "Vitamin B12 test",
        why: "B12 deficiency independently contributes to hair shedding and fatigue",
        keyBiomarkers: ["Vitamin B12"],
        searchQuery: "vitamin b12",
      },
    ],
    whenToSeeGP:
      "If you notice sudden patchy hair loss, complete loss of eyebrows/eyelashes, or scarring on the scalp, see your GP for specialist referral.",
  },
  {
    slug: "weight-gain",
    name: "Weight gain",
    icon: "⚖️",
    colorHex: "#22c0d4",
    shortDescription: "Unexplained weight gain or difficulty losing weight",
    clinicalExplanation:
      "Unexplained weight gain can indicate thyroid dysfunction, insulin resistance, hormonal imbalances, or metabolic issues. If diet and exercise aren't producing expected results, blood tests can reveal whether an underlying medical condition is contributing — allowing targeted intervention rather than guesswork.",
    recommendedTests: [
      {
        name: "Thyroid function",
        why: "Hypothyroidism slows metabolism and is one of the most common causes of unexplained weight gain",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Diabetes check (HbA1c)",
        why: "Insulin resistance and pre-diabetes cause the body to store more fat, especially around the abdomen",
        keyBiomarkers: ["HbA1c", "Fasting glucose", "Insulin"],
        searchQuery: "diabetes",
      },
      {
        name: "Hormone profile",
        why: "Low testosterone (men) or hormonal shifts (women) can drive weight changes",
        keyBiomarkers: ["Testosterone", "Oestradiol", "Cortisol", "SHBG"],
        searchQuery: "hormone",
      },
      {
        name: "Lipid profile",
        why: "Assesses cardiovascular risk often associated with metabolic weight gain",
        keyBiomarkers: ["Total cholesterol", "LDL", "HDL", "Triglycerides"],
        searchQuery: "cholesterol",
      },
    ],
    whenToSeeGP:
      "If you've gained weight rapidly without dietary change, notice swelling in your face or limbs, or have a family history of thyroid disease, consult your GP.",
  },
  {
    slug: "low-libido",
    name: "Low libido",
    icon: "💜",
    colorHex: "#e70d69",
    shortDescription: "Reduced sex drive or changes in sexual function",
    clinicalExplanation:
      "Low libido affects both men and women and frequently has a hormonal component. Testosterone deficiency, thyroid disorders, high prolactin, and chronic fatigue from anaemia or vitamin deficiency can all reduce sexual desire. Blood testing helps identify treatable causes so that appropriate support — medical or lifestyle — can be targeted effectively.",
    recommendedTests: [
      {
        name: "Male hormone profile",
        why: "Low testosterone is the most common hormonal cause of reduced libido in men",
        keyBiomarkers: [
          "Total testosterone",
          "Free testosterone",
          "SHBG",
          "LH",
          "FSH",
        ],
        searchQuery: "male+hormone",
      },
      {
        name: "Female hormone profile",
        why: "Oestrogen, testosterone, and progesterone imbalances all affect desire and arousal",
        keyBiomarkers: ["Oestradiol", "Testosterone", "Progesterone", "SHBG"],
        searchQuery: "female+hormone",
      },
      {
        name: "Thyroid function",
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
  {
    slug: "brain-fog",
    name: "Brain fog",
    icon: "🧠",
    colorHex: "#22c0d4",
    shortDescription: "Poor concentration, forgetfulness or slowed thinking",
    clinicalExplanation:
      "Brain fog describes difficulty concentrating, remembering or thinking clearly. It is not a diagnosis in itself, but it is commonly linked to treatable factors such as low vitamin B12 or folate, an underactive thyroid, low iron stores, poor blood sugar control or low vitamin D. Blood testing can help identify or rule out these physical contributors.",
    recommendedTests: [
      {
        name: "Vitamin B12 & folate",
        why: "Low B12 or folate can affect memory, concentration and energy",
        keyBiomarkers: ["Vitamin B12", "Active B12", "Folate"],
        searchQuery: "b12",
      },
      {
        name: "Thyroid function",
        why: "An underactive thyroid commonly slows thinking and causes forgetfulness",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Iron profile",
        why: "Low iron stores can reduce concentration before anaemia develops",
        keyBiomarkers: ["Ferritin", "Iron", "Transferrin saturation"],
        searchQuery: "iron",
      },
      {
        name: "Vitamin D",
        why: "Low vitamin D is common in the UK and linked to tiredness and low mood",
        keyBiomarkers: ["25-OH vitamin D"],
        searchQuery: "vitamin+d",
      },
    ],
    whenToSeeGP:
      "If confusion comes on suddenly, or you notice slurred speech, facial drooping or weakness in an arm or leg, call 999 immediately. For memory problems that are getting worse over weeks or months, speak to your GP.",
  },
  {
    slug: "joint-pain",
    name: "Joint pain & stiffness",
    icon: "🦴",
    colorHex: "#081129",
    shortDescription: "Aching, swollen or stiff joints",
    clinicalExplanation:
      "Joint pain has many causes, from wear and tear to inflammation. Blood tests cannot replace a clinical examination or imaging, but they can measure markers of inflammation, check for antibodies associated with rheumatoid arthritis, and measure uric acid, which is raised in gout.",
    recommendedTests: [
      {
        name: "Arthritis screen",
        why: "Combines markers used to investigate inflammatory joint conditions",
        keyBiomarkers: ["Rheumatoid factor", "Anti-CCP", "CRP"],
        searchQuery: "arthritis",
      },
      {
        name: "Inflammation (CRP)",
        why: "C-reactive protein (CRP) rises when there is inflammation in the body",
        keyBiomarkers: ["CRP", "hs-CRP"],
        searchQuery: "crp",
      },
      {
        name: "Rheumatoid factor",
        why: "An antibody often present in rheumatoid arthritis",
        keyBiomarkers: ["Rheumatoid factor"],
        searchQuery: "rheumatoid",
      },
      {
        name: "Uric acid",
        why: "High uric acid levels are associated with gout",
        keyBiomarkers: ["Uric acid"],
        searchQuery: "uric+acid",
      },
    ],
    whenToSeeGP:
      "If a joint is suddenly hot, red and swollen, especially with a fever, seek same-day medical advice. See your GP if stiffness lasts more than 30 minutes each morning or pain persists for several weeks.",
  },
  {
    slug: "bloating",
    name: "Bloating & digestive discomfort",
    icon: "🫄",
    colorHex: "#e70d69",
    shortDescription: "Ongoing bloating, wind or changes in bowel habit",
    clinicalExplanation:
      "Bloating and digestive discomfort are often linked to diet, stress or irritable bowel syndrome. Blood tests can check for coeliac disease (an immune reaction to gluten) and allergy antibodies, and look at liver function. Coeliac testing is only reliable while you are still eating gluten.",
    recommendedTests: [
      {
        name: "Coeliac screen",
        why: "Detects antibodies associated with coeliac disease",
        keyBiomarkers: ["Tissue transglutaminase IgA (tTG)", "Total IgA"],
        searchQuery: "coeliac",
      },
      {
        name: "Allergy profile",
        why: "Measures IgE antibodies to common food and environmental allergens",
        keyBiomarkers: ["Total IgE", "Specific IgE"],
        searchQuery: "allergy",
      },
      {
        name: "Liver function",
        why: "Checks how well the liver is working, which can affect digestion",
        keyBiomarkers: ["ALT", "ALP", "GGT", "Bilirubin", "Albumin"],
        searchQuery: "liver",
      },
    ],
    whenToSeeGP:
      "See your GP if you have unexplained weight loss, blood in your stools, difficulty swallowing, persistent vomiting, or a change in bowel habit lasting more than three weeks.",
  },
  {
    slug: "hot-flushes",
    name: "Hot flushes & night sweats",
    icon: "🌡️",
    colorHex: "#22c0d4",
    shortDescription: "Sudden heat, sweating or disturbed sleep",
    clinicalExplanation:
      "Hot flushes and night sweats are common during perimenopause and menopause. Menopause is usually recognised from symptoms in women over 45, but hormone tests can be useful for younger women and can help rule out other causes, such as an overactive thyroid.",
    recommendedTests: [
      {
        name: "Menopause hormone profile",
        why: "Measures the hormones that change through perimenopause",
        keyBiomarkers: ["FSH", "LH", "Oestradiol"],
        searchQuery: "menopause",
      },
      {
        name: "Female hormone profile",
        why: "A broader look at reproductive hormones",
        keyBiomarkers: ["Oestradiol", "Progesterone", "Testosterone", "Prolactin"],
        searchQuery: "female+hormone",
      },
      {
        name: "Thyroid function",
        why: "An overactive thyroid can cause heat intolerance and sweating",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
    ],
    whenToSeeGP:
      "See your GP if night sweats come with unexplained weight loss, fever or swollen glands, or if bleeding returns after your periods have stopped.",
  },
  {
    slug: "frequent-illness",
    name: "Frequent infections",
    icon: "🛡️",
    colorHex: "#081129",
    shortDescription: "Catching colds often or slow to recover",
    clinicalExplanation:
      "Picking up infections often, or taking a long time to recover, can have many causes, including stress and poor sleep. Blood tests can look at white blood cells, which fight infection, and at nutrients such as vitamin D, iron and zinc that support normal immune function.",
    recommendedTests: [
      {
        name: "Full blood count",
        why: "Measures white blood cells and checks for anaemia",
        keyBiomarkers: ["White blood cells", "Neutrophils", "Lymphocytes", "Haemoglobin"],
        searchQuery: "full+blood+count",
      },
      {
        name: "Vitamin D",
        why: "Vitamin D supports normal immune function and is often low in UK winters",
        keyBiomarkers: ["25-OH vitamin D"],
        searchQuery: "vitamin+d",
      },
      {
        name: "Iron profile",
        why: "Low iron stores can leave you run down",
        keyBiomarkers: ["Ferritin", "Iron"],
        searchQuery: "iron",
      },
    ],
    whenToSeeGP:
      "See your GP if you need antibiotics repeatedly, have infections that keep returning, persistent mouth ulcers, or swollen glands that do not go down.",
  },
  {
    slug: "muscle-cramps",
    name: "Muscle weakness & cramps",
    icon: "💪",
    colorHex: "#e70d69",
    shortDescription: "Cramps, twitching or unexplained muscle weakness",
    clinicalExplanation:
      "Muscle cramps are common and often linked to exercise or dehydration. Blood tests can check minerals that muscles rely on, such as magnesium and calcium, and creatine kinase (CK), an enzyme released when muscle is damaged. Some medicines, including statins, can also affect muscles.",
    recommendedTests: [
      {
        name: "Magnesium",
        why: "Low magnesium is associated with cramps and muscle twitching",
        keyBiomarkers: ["Magnesium"],
        searchQuery: "magnesium",
      },
      {
        name: "Creatine kinase",
        why: "Raised CK levels indicate muscle strain or damage",
        keyBiomarkers: ["Creatine kinase (CK)"],
        searchQuery: "creatine+kinase",
      },
      {
        name: "Sports profile",
        why: "Combines markers relevant to training, recovery and muscle health",
        keyBiomarkers: ["Creatine kinase", "Testosterone", "Cortisol", "Ferritin"],
        searchQuery: "sports",
      },
      {
        name: "Vitamin D",
        why: "Low vitamin D is linked to muscle weakness and aches",
        keyBiomarkers: ["25-OH vitamin D"],
        searchQuery: "vitamin+d",
      },
    ],
    whenToSeeGP:
      "Seek urgent medical advice if muscle pain comes with dark or tea-coloured urine. See your GP if weakness is getting worse, such as difficulty climbing stairs or rising from a chair.",
  },
  {
    slug: "irregular-periods",
    name: "Irregular or heavy periods",
    icon: "🩸",
    colorHex: "#22c0d4",
    shortDescription: "Unpredictable cycles or heavy bleeding",
    clinicalExplanation:
      "Irregular periods can be linked to hormonal conditions such as polycystic ovary syndrome (PCOS) or thyroid problems. Heavy periods can lower iron stores and lead to anaemia. Blood tests can measure reproductive hormones, thyroid function and iron levels.",
    recommendedTests: [
      {
        name: "PCOS profile",
        why: "Measures hormones commonly assessed when PCOS is being considered",
        keyBiomarkers: ["Testosterone", "SHBG", "LH", "FSH", "DHEA-S"],
        searchQuery: "pcos",
      },
      {
        name: "Female hormone profile",
        why: "Checks the hormones that regulate your cycle",
        keyBiomarkers: ["Oestradiol", "Progesterone", "LH", "FSH", "Prolactin"],
        searchQuery: "female+hormone",
      },
      {
        name: "Iron profile",
        why: "Heavy bleeding can reduce iron stores",
        keyBiomarkers: ["Ferritin", "Iron", "Haemoglobin"],
        searchQuery: "iron",
      },
      {
        name: "Thyroid function",
        why: "Thyroid problems can disrupt the menstrual cycle",
        keyBiomarkers: ["TSH", "Free T4"],
        searchQuery: "thyroid",
      },
    ],
    whenToSeeGP:
      "See your GP if you bleed between periods, after sex or after the menopause, or if you have severe pelvic pain. Seek urgent help for very heavy bleeding with dizziness or fainting.",
  },
  {
    slug: "sleep-problems",
    name: "Sleep problems",
    icon: "🌙",
    colorHex: "#081129",
    shortDescription: "Trouble getting to sleep, staying asleep or waking refreshed",
    clinicalExplanation:
      "Poor sleep is most often linked to stress, routine or lifestyle. Some physical factors can contribute, including an overactive thyroid, changes in the stress hormone cortisol, and low iron stores, which are associated with restless legs.",
    recommendedTests: [
      {
        name: "Cortisol",
        why: "Measures the body's main stress hormone",
        keyBiomarkers: ["Cortisol"],
        searchQuery: "cortisol",
      },
      {
        name: "Thyroid function",
        why: "An overactive thyroid can make it hard to sleep",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Iron profile",
        why: "Low ferritin is associated with restless legs at night",
        keyBiomarkers: ["Ferritin", "Iron"],
        searchQuery: "iron",
      },
      {
        name: "Magnesium",
        why: "Magnesium plays a role in normal muscle and nerve function",
        keyBiomarkers: ["Magnesium"],
        searchQuery: "magnesium",
      },
    ],
    whenToSeeGP:
      "See your GP if you are falling asleep during the day or while driving, if a partner notices you stop breathing or gasp in your sleep, or if poor sleep lasts more than three months.",
  },
  {
    slug: "skin-breakouts",
    name: "Adult acne & skin breakouts",
    icon: "✨",
    colorHex: "#e70d69",
    shortDescription: "Persistent spots or breakouts in adulthood",
    clinicalExplanation:
      "Acne in adulthood can be influenced by hormones, particularly androgens such as testosterone. Blood tests can measure these hormones and sex hormone binding globulin (SHBG), a protein that affects how much hormone is active. Allergy and liver tests are sometimes considered alongside them.",
    recommendedTests: [
      {
        name: "Hormone profile",
        why: "Measures androgens linked to oil production in the skin",
        keyBiomarkers: ["Testosterone", "Free androgen index", "SHBG", "DHEA-S"],
        searchQuery: "hormone",
      },
      {
        name: "Allergy profile",
        why: "Checks IgE antibodies to common allergens",
        keyBiomarkers: ["Total IgE", "Specific IgE"],
        searchQuery: "allergy",
      },
      {
        name: "Liver function",
        why: "Often checked before and during some acne treatments",
        keyBiomarkers: ["ALT", "ALP", "GGT", "Bilirubin"],
        searchQuery: "liver",
      },
    ],
    whenToSeeGP:
      "See your GP if acne is painful, leaving scars or affecting your wellbeing, or if it comes with excess hair growth or irregular periods. Seek urgent help for a sudden widespread or blistering rash.",
  },
  {
    slug: "excessive-thirst",
    name: "Excessive thirst",
    icon: "💧",
    colorHex: "#22c0d4",
    shortDescription: "Feeling thirsty often or needing to urinate more",
    clinicalExplanation:
      "Feeling very thirsty and passing urine more often, especially at night, can be early signs of raised blood sugar. Blood tests can measure HbA1c, which reflects average blood sugar over about three months, and check kidney function.",
    recommendedTests: [
      {
        name: "Diabetes check (HbA1c)",
        why: "Shows average blood sugar over the past two to three months",
        keyBiomarkers: ["HbA1c"],
        searchQuery: "hba1c",
      },
      {
        name: "Diabetes profile",
        why: "A broader look at blood sugar control",
        keyBiomarkers: ["HbA1c", "Glucose", "Insulin"],
        searchQuery: "diabetes",
      },
      {
        name: "Kidney function",
        why: "Checks how well your kidneys filter the blood",
        keyBiomarkers: ["eGFR", "Creatinine", "Urea"],
        searchQuery: "kidney",
      },
    ],
    whenToSeeGP:
      "See your GP promptly if thirst comes with weight loss, tiredness or blurred vision. Seek urgent help (NHS 111 or 999) if you feel very unwell, are vomiting or have fruity-smelling breath.",
  },
];
