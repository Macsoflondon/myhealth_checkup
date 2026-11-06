/**
 * Symptom hub content for /compare/symptoms and /compare/symptoms/:slug.
 *
 * Content rules (owner's standard): evidence-led, UK references only (NICE,
 * NHS), British English, plain English for clinical terms on first use, no
 * outcome guarantees, and say what testing cannot do. myhealth checkup
 * compares tests. It does not provide medical care.
 *
 * Each `searchQuery` feeds /compare?search=<query> ('+' means a space) and
 * /compare?symptom=<slug> loads the union of a symptom's queries. Every query
 * here was checked against production `provider_tests` (active rows, supported
 * providers) on 4 November 2026 and returns tests. Re-check any query you add.
 *
 * Evidence notes for the 4 November 2026 review:
 * - Bloating: NICE CG61 (IBS) lists full blood count, ESR or CRP and coeliac
 *   antibodies as the blood tests to rule out other causes. It does not list
 *   allergy (IgE) testing, and the NHS advises against bought food
 *   intolerance tests. CA125 sits in the GP advice only (NICE NG12, QS18).
 * - Acne: hormone tests only with signs of raised androgens (NHS PCOS/PMOS).
 * - Sleep: no blood test diagnoses a sleep disorder. A single cortisol test
 *   does not assess sleep. Thyroid (NHS insomnia) and ferritin for restless
 *   legs (NHS restless legs syndrome) remain.
 * - Heavy periods: NICE NG88 advises a full blood count and no routine
 *   ferritin, female hormone or thyroid tests.
 * - Hot flushes: NICE NG23 diagnoses menopause without tests over 45 and
 *   advises against FSH tests on combined hormonal contraception.
 */
export interface SymptomRecommendedTest {
  name: string;
  why: string;
  keyBiomarkers: string[];
  searchQuery: string;
}

export interface SymptomPageData {
  slug: string;
  name: string;
  icon: string;
  colorHex: string;
  shortDescription: string;
  clinicalExplanation: string;
  recommendedTests: SymptomRecommendedTest[];
  /** Plain-English statement of what blood tests cannot tell you here. */
  limitations?: string;
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
      "Tiredness that does not improve with rest has many causes, including stress, poor sleep and low mood. Some physical causes show up in a blood test. These include anaemia (a low level of red blood cells or haemoglobin), an underactive thyroid, low iron stores, raised blood sugar and low vitamin B12. A test can help you and your GP rule these in or out.",
    recommendedTests: [
      {
        name: "Full Blood Count",
        why: "Checks for anaemia, a common physical cause of tiredness",
        keyBiomarkers: [
          "Haemoglobin",
          "Red Blood Cells",
          "White Blood Cells",
          "Platelets",
        ],
        searchQuery: "full+blood+count",
      },
      {
        name: "Thyroid Function",
        why: "An underactive thyroid (hypothyroidism) can cause tiredness, weight gain and feeling cold",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Iron Profile",
        why: "Ferritin shows your iron stores, which can run low before anaemia develops",
        keyBiomarkers: ["Ferritin", "Iron", "TIBC", "Transferrin Saturation"],
        searchQuery: "iron",
      },
      {
        name: "Diabetes Check (HbA1c)",
        why: "Raised blood sugar can cause tiredness, thirst and passing more urine",
        keyBiomarkers: ["HbA1c"],
        searchQuery: "hba1c",
      },
      {
        name: "Vitamin B12 & Folate",
        why: "Low levels can cause tiredness, pins and needles and problems with memory",
        keyBiomarkers: ["Vitamin B12", "Folate"],
        searchQuery: "vitamin+b12",
      },
      {
        name: "Vitamin D",
        why: "Low vitamin D is common in UK winters and can cause muscle aches and weakness",
        keyBiomarkers: ["25-OH Vitamin D"],
        searchQuery: "vitamin+d",
      },
    ],
    limitations:
      "Many people with ongoing tiredness have normal blood results. A normal result does not mean your tiredness is not real. It means these causes are less likely, and your GP can look at others.",
    whenToSeeGP:
      "See your GP if tiredness lasts more than four weeks, or comes with unexplained weight loss, a persistent fever or night sweats.",
  },
  {
    slug: "low-mood",
    name: "Low Mood",
    icon: "😔",
    colorHex: "#7c3aed",
    shortDescription: "Persistent low mood, anxiety, or emotional changes",
    clinicalExplanation:
      "Low mood and depression have many causes. Some physical conditions can affect mood and energy, including thyroid problems, anaemia and hormone changes in men or around the menopause. A blood test can check for these alongside other care from your GP.",
    recommendedTests: [
      {
        name: "Thyroid Function",
        why: "An overactive or underactive thyroid can affect mood, anxiety and sleep",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Full Blood Count",
        why: "Anaemia causes tiredness and low energy, which can feel like low mood",
        keyBiomarkers: ["Haemoglobin", "Red Blood Cells", "MCV"],
        searchQuery: "full+blood+count",
      },
      {
        name: "Hormone Profile",
        why: "Low testosterone in men and changing hormone levels around the menopause can affect mood",
        keyBiomarkers: ["Testosterone", "Oestradiol", "SHBG", "FSH"],
        searchQuery: "hormone",
      },
      {
        name: "Vitamin D",
        why: "Some studies link low vitamin D with low mood, but the evidence is mixed. Testing makes most sense if you get little sun on your skin",
        keyBiomarkers: ["25-OH Vitamin D"],
        searchQuery: "vitamin+d",
      },
    ],
    limitations:
      "No blood test can diagnose depression or anxiety. Treatment for low mood does not depend on a blood result, and a normal result does not mean you should not seek support.",
    whenToSeeGP:
      "Speak to your GP if low mood lasts more than two weeks or affects your sleep, appetite or daily life. If you have thoughts of harming yourself, call 999 or contact the Samaritans on 116 123.",
  },
  {
    slug: "hair-loss",
    name: "Hair Loss",
    icon: "💇",
    colorHex: "#f59e0b",
    shortDescription: "Thinning hair, excessive shedding, or bald patches",
    clinicalExplanation:
      "Hair loss (alopecia) has many causes. Male and female pattern hair loss run in families and do not show up in a blood test. Other causes include stress, illness, weight loss, low iron stores, thyroid problems and hormone changes. A blood test can check for some of these.",
    recommendedTests: [
      {
        name: "Iron Profile",
        why: "Low ferritin, a measure of iron stores, is linked to hair shedding even without anaemia",
        keyBiomarkers: ["Ferritin", "Iron", "TIBC"],
        searchQuery: "iron",
      },
      {
        name: "Thyroid Function",
        why: "An overactive or underactive thyroid can cause thinning across the scalp",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Hormone Profile",
        why: "Raised androgens (male-type hormones), for example in PCOS, can thin hair on the top of the head. Most useful for women who also have irregular periods or excess hair growth",
        keyBiomarkers: ["Testosterone", "SHBG", "DHEA-S", "Oestradiol"],
        searchQuery: "hormone",
      },
    ],
    limitations:
      "Pattern hair loss, the most common type, gives normal blood results. When a test does find a cause, hair takes several months to regrow after treatment.",
    whenToSeeGP:
      "If you notice sudden patchy hair loss, loss of your eyebrows or eyelashes, or scarring on the scalp, see your GP. They can refer you to a specialist.",
  },
  {
    slug: "weight-gain",
    name: "Weight Gain",
    icon: "⚖️",
    colorHex: "#22c0d4",
    shortDescription: "Unexplained weight gain or difficulty losing weight",
    clinicalExplanation:
      "Most weight gain relates to diet, activity, sleep, medicines or age. A few medical conditions can contribute, including an underactive thyroid, polycystic ovary syndrome (PCOS) and type 2 diabetes. A blood test can check for these and for related risks such as raised cholesterol.",
    recommendedTests: [
      {
        name: "Thyroid Function",
        why: "An underactive thyroid can cause weight gain, tiredness and feeling cold",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Diabetes Check (HbA1c)",
        why: "HbA1c shows your average blood sugar over about three months and can pick up prediabetes and type 2 diabetes",
        keyBiomarkers: ["HbA1c", "Fasting Glucose", "Insulin"],
        searchQuery: "diabetes",
      },
      {
        name: "Hormone Profile",
        why: "Low testosterone in men and PCOS in women are both linked to weight gain",
        keyBiomarkers: ["Testosterone", "Oestradiol", "SHBG"],
        searchQuery: "hormone",
      },
      {
        name: "Lipid Profile",
        why: "Weight gain can come with raised cholesterol, which affects heart health",
        keyBiomarkers: ["Total Cholesterol", "LDL", "HDL", "Triglycerides"],
        searchQuery: "cholesterol",
      },
    ],
    limitations:
      "Most people who gain weight have normal thyroid and hormone results. A blood test checks for medical contributors. It cannot measure diet, activity or sleep.",
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
      "Low libido affects men and women and often has more than one cause, including stress, relationship factors, medicines and tiredness. Hormones can play a part. Low testosterone, thyroid problems and high prolactin (a hormone made by the pituitary gland in the brain) can all reduce sex drive. A blood test can check for these.",
    recommendedTests: [
      {
        name: "Male Hormone Profile",
        why: "Low testosterone can reduce sex drive in men. Levels peak in the morning, so most providers ask for a morning sample",
        keyBiomarkers: [
          "Total Testosterone",
          "Free Testosterone",
          "SHBG",
          "LH",
          "FSH",
        ],
        searchQuery: "male+hormone",
      },
      {
        name: "Female Hormone Profile",
        why: "Hormone levels change through the cycle and around the menopause, and these changes can affect desire",
        keyBiomarkers: ["Oestradiol", "Testosterone", "Progesterone", "SHBG"],
        searchQuery: "female+hormone",
      },
      {
        name: "Thyroid Function",
        why: "An overactive or underactive thyroid can lower libido and energy",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Prolactin",
        why: "High prolactin lowers sex hormones and can reduce desire",
        keyBiomarkers: ["Prolactin"],
        searchQuery: "prolactin",
      },
    ],
    limitations:
      "Many people with low libido have normal hormone results. Hormone levels vary through the day and, in women, through the cycle, so one result gives a snapshot.",
    whenToSeeGP:
      "If low libido comes with erectile dysfunction, absent periods or discharge from the nipples, seek medical advice promptly.",
  },
  {
    slug: "brain-fog",
    name: "Brain Fog",
    icon: "🧠",
    colorHex: "#22c0d4",
    shortDescription: "Poor concentration, forgetfulness or slowed thinking",
    clinicalExplanation:
      "Brain fog describes difficulty concentrating, remembering or thinking clearly. It is not a diagnosis in itself. Common causes include stress, poor sleep and the menopause. Some physical causes show up in a blood test, such as low vitamin B12 or folate, an underactive thyroid, anaemia, low iron stores and raised blood sugar.",
    recommendedTests: [
      {
        name: "Vitamin B12 & Folate",
        why: "Low B12 or folate can affect memory, concentration and energy",
        keyBiomarkers: ["Vitamin B12", "Active B12", "Folate"],
        searchQuery: "b12",
      },
      {
        name: "Thyroid Function",
        why: "An underactive thyroid can slow thinking and cause forgetfulness",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Full Blood Count",
        why: "Anaemia reduces the oxygen your blood carries and can affect concentration",
        keyBiomarkers: ["Haemoglobin", "Red Blood Cells", "MCV"],
        searchQuery: "full+blood+count",
      },
      {
        name: "Iron Profile",
        why: "Iron stores can run low before anaemia develops",
        keyBiomarkers: ["Ferritin", "Iron", "Transferrin Saturation"],
        searchQuery: "iron",
      },
      {
        name: "Diabetes Check (HbA1c)",
        why: "Shows your average blood sugar over about three months",
        keyBiomarkers: ["HbA1c"],
        searchQuery: "hba1c",
      },
    ],
    limitations:
      "Blood tests cannot measure memory or concentration, and they cannot diagnose dementia. Brain fog linked to stress, sleep or the menopause gives normal blood results.",
    whenToSeeGP:
      "If confusion comes on suddenly, or you notice slurred speech, facial drooping or weakness in an arm or leg, call 999 immediately. For memory problems that are getting worse over weeks or months, speak to your GP.",
  },
  {
    slug: "joint-pain",
    name: "Joint Pain & Stiffness",
    icon: "🦴",
    colorHex: "#081129",
    shortDescription: "Aching, swollen or stiff joints",
    clinicalExplanation:
      "Joint pain has many causes, from wear and tear to inflammation. Blood tests cannot replace a clinical examination or imaging. They can measure markers of inflammation, check for antibodies linked to rheumatoid arthritis, and measure uric acid, which is raised in gout.",
    recommendedTests: [
      {
        name: "Arthritis Screen",
        why: "Combines markers used to investigate inflammatory joint conditions",
        keyBiomarkers: ["Rheumatoid Factor", "Anti-CCP", "CRP"],
        searchQuery: "arthritis",
      },
      {
        name: "Inflammation (CRP)",
        why: "C-reactive protein (CRP) rises when there is inflammation in the body",
        keyBiomarkers: ["CRP", "hs-CRP"],
        searchQuery: "crp",
      },
      {
        name: "Rheumatoid Factor",
        why: "An antibody found in many people with rheumatoid arthritis, and in some people without it",
        keyBiomarkers: ["Rheumatoid Factor"],
        searchQuery: "rheumatoid",
      },
      {
        name: "Uric Acid",
        why: "High uric acid levels are linked to gout",
        keyBiomarkers: ["Uric Acid"],
        searchQuery: "uric+acid",
      },
    ],
    limitations:
      "Osteoarthritis, the most common cause of joint pain, does not show up in a blood test. A positive antibody result does not confirm arthritis on its own, and a normal result does not rule it out.",
    whenToSeeGP:
      "If a joint is suddenly hot, red and swollen, especially with a fever, seek same-day medical advice. See your GP if stiffness lasts more than 30 minutes each morning or pain persists for several weeks.",
  },
  {
    slug: "bloating",
    name: "Bloating & Digestive Discomfort",
    icon: "🫄",
    colorHex: "#e70d69",
    shortDescription: "Ongoing bloating, wind or changes in bowel habit",
    clinicalExplanation:
      "Bloating and digestive discomfort often relate to diet, stress or irritable bowel syndrome (IBS), a common long-term condition of the gut. NICE lists a small set of blood tests that doctors use to rule out other causes in people with IBS-type symptoms. These check for coeliac disease (an immune reaction to gluten), anaemia and inflammation. Coeliac testing only works while you are still eating gluten.",
    recommendedTests: [
      {
        name: "Coeliac Screen",
        why: "Looks for tissue transglutaminase (tTG) antibodies, which most people with coeliac disease make. Keep eating gluten in more than one meal a day for at least six weeks before the test. Choose an antibody blood test, as a genetic coeliac test cannot diagnose the condition",
        keyBiomarkers: ["Tissue Transglutaminase IgA (tTG)", "Total IgA"],
        searchQuery: "coeliac",
      },
      {
        name: "Full Blood Count",
        why: "Checks for anaemia, which can point to coeliac disease or another bowel condition",
        keyBiomarkers: ["Haemoglobin", "Red Blood Cells", "MCV"],
        searchQuery: "full+blood+count",
      },
      {
        name: "Inflammation (CRP)",
        why: "C-reactive protein (CRP) rises with inflammation. A raised level points away from IBS and towards a condition your GP should look into",
        keyBiomarkers: ["CRP"],
        searchQuery: "crp",
      },
      {
        name: "Ferritin",
        why: "Low iron stores can come with coeliac disease, which reduces how much iron your gut absorbs",
        keyBiomarkers: ["Ferritin"],
        searchQuery: "ferritin",
      },
    ],
    limitations:
      "No blood test can diagnose IBS. NICE does not include allergy (IgE) tests in its tests for IBS-type symptoms, and the NHS advises against food intolerance tests bought online. If a coeliac test comes back positive, keep eating gluten until a specialist confirms the diagnosis.",
    whenToSeeGP:
      "See your GP if you have unexplained weight loss, blood in your stools, difficulty swallowing, persistent vomiting, or a change in bowel habit lasting more than three weeks. Women aged 50 or over with bloating on most days, or for a month or more, should also see their GP. NICE advises GPs to offer a CA125 blood test in this situation, which helps decide whether you need a scan.",
  },
  {
    slug: "hot-flushes",
    name: "Hot Flushes & Night Sweats",
    icon: "🌡️",
    colorHex: "#22c0d4",
    shortDescription: "Sudden heat, sweating or disturbed sleep",
    clinicalExplanation:
      "Hot flushes and night sweats are common during perimenopause (the years before periods stop) and menopause. NICE advises that women over 45 with typical symptoms do not need a blood test for a diagnosis. Testing can help women aged 40 to 45 or under 40, and can check for other causes such as an overactive thyroid.",
    recommendedTests: [
      {
        name: "Menopause Hormone Profile",
        why: "FSH (follicle-stimulating hormone) rises as the ovaries slow down. NICE suggests this test for women aged 40 to 45, or under 40, with symptoms",
        keyBiomarkers: ["FSH", "LH", "Oestradiol"],
        searchQuery: "menopause",
      },
      {
        name: "Thyroid Function",
        why: "An overactive thyroid can cause heat intolerance and sweating",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
    ],
    limitations:
      "FSH levels rise and fall during perimenopause, so one normal result does not rule it out. The test is not reliable if you take the combined pill or a high-dose progestogen. Night sweats also have causes these tests do not check, such as infections and some medicines.",
    whenToSeeGP:
      "See your GP if night sweats come with unexplained weight loss, fever or swollen glands, or if bleeding returns after your periods have stopped.",
  },
  {
    slug: "frequent-illness",
    name: "Frequent Infections",
    icon: "🛡️",
    colorHex: "#081129",
    shortDescription: "Catching colds often or slow to recover",
    clinicalExplanation:
      "Picking up infections often, or taking a long time to recover, has many causes, including stress and poor sleep. Blood tests can look at white blood cells, which fight infection, and at nutrients such as vitamin D and iron that support normal immune function.",
    recommendedTests: [
      {
        name: "Full Blood Count",
        why: "Measures white blood cells and checks for anaemia",
        keyBiomarkers: [
          "White Blood Cells",
          "Neutrophils",
          "Lymphocytes",
          "Haemoglobin",
        ],
        searchQuery: "full+blood+count",
      },
      {
        name: "Vitamin D",
        why: "Vitamin D supports normal immune function, and levels often drop in UK winters",
        keyBiomarkers: ["25-OH Vitamin D"],
        searchQuery: "vitamin+d",
      },
      {
        name: "Iron Profile",
        why: "Low iron stores can leave you tired and slow to recover",
        keyBiomarkers: ["Ferritin", "Iron"],
        searchQuery: "iron",
      },
    ],
    limitations:
      "Most people who catch frequent colds have normal results. These tests do not assess the immune system in depth. Your GP can arrange specialist immune tests if they are needed.",
    whenToSeeGP:
      "See your GP if you need antibiotics repeatedly, have infections that keep returning, persistent mouth ulcers, or swollen glands that do not go down.",
  },
  {
    slug: "muscle-cramps",
    name: "Muscle Weakness & Cramps",
    icon: "💪",
    colorHex: "#e70d69",
    shortDescription: "Cramps, twitching or unexplained muscle weakness",
    clinicalExplanation:
      "Muscle cramps are common and often linked to exercise or dehydration. Blood tests can check minerals that muscles rely on, such as magnesium and calcium, and creatine kinase (CK), an enzyme your muscles release when they are damaged. Some medicines, including statins, can also affect muscles.",
    recommendedTests: [
      {
        name: "Magnesium",
        why: "Low magnesium is linked to cramps and muscle twitching",
        keyBiomarkers: ["Magnesium"],
        searchQuery: "magnesium",
      },
      {
        name: "Bone Profile (Calcium)",
        why: "Low calcium can cause cramps and tingling in the hands and around the mouth",
        keyBiomarkers: ["Calcium", "Albumin", "Phosphate", "ALP"],
        searchQuery: "calcium",
      },
      {
        name: "Creatine Kinase",
        why: "Raised CK shows muscle strain or damage",
        keyBiomarkers: ["Creatine Kinase (CK)"],
        searchQuery: "creatine+kinase",
      },
      {
        name: "Vitamin D",
        why: "Low vitamin D can cause muscle aches and weakness",
        keyBiomarkers: ["25-OH Vitamin D"],
        searchQuery: "vitamin+d",
      },
    ],
    limitations:
      "Most cramps, including night cramps and cramps after exercise, come with normal blood results. Hard exercise in the two or three days before a CK test can raise the result.",
    whenToSeeGP:
      "Seek urgent medical advice if muscle pain comes with dark or tea-coloured urine. See your GP if weakness is getting worse, such as difficulty climbing stairs or rising from a chair.",
  },
  {
    slug: "irregular-periods",
    name: "Irregular or Heavy Periods",
    icon: "🩸",
    colorHex: "#22c0d4",
    shortDescription: "Unpredictable cycles or heavy bleeding",
    clinicalExplanation:
      "Irregular periods can be linked to polycystic ovary syndrome (PCOS), which the NHS now calls polyendocrine metabolic ovarian syndrome (PMOS), or to thyroid or prolactin problems. Heavy periods can lower iron and lead to anaemia. For heavy periods, NICE advises a full blood count and does not advise routine hormone tests.",
    recommendedTests: [
      {
        name: "Full Blood Count",
        why: "Checks for anaemia caused by heavy bleeding. NICE advises this test for anyone with heavy periods",
        keyBiomarkers: ["Haemoglobin", "Red Blood Cells", "MCV"],
        searchQuery: "full+blood+count",
      },
      {
        name: "PCOS Profile",
        why: "Measures androgens (male-type hormones), which are often raised in PCOS. Most useful if your periods are irregular",
        keyBiomarkers: ["Testosterone", "SHBG", "LH", "FSH", "DHEA-S"],
        searchQuery: "pcos",
      },
      {
        name: "Thyroid Function",
        why: "Thyroid problems can disrupt the cycle. NICE does not advise this test for heavy periods alone, unless you have other thyroid symptoms",
        keyBiomarkers: ["TSH", "Free T4"],
        searchQuery: "thyroid",
      },
      {
        name: "Prolactin",
        why: "High prolactin can make periods irregular or stop them",
        keyBiomarkers: ["Prolactin"],
        searchQuery: "prolactin",
      },
    ],
    limitations:
      "Hormone levels change through the cycle, and hormonal contraception changes them too. Ask the provider which day of your cycle to test. A blood test alone cannot diagnose PCOS. Doctors also look at your symptoms and sometimes an ultrasound scan.",
    whenToSeeGP:
      "See your GP if you bleed between periods, after sex or after the menopause, or if you have severe pelvic pain. Seek urgent help for very heavy bleeding with dizziness or fainting.",
  },
  {
    slug: "sleep-problems",
    name: "Sleep Problems",
    icon: "🌙",
    colorHex: "#081129",
    shortDescription:
      "Trouble getting to sleep, staying asleep or waking refreshed",
    clinicalExplanation:
      "Poor sleep most often relates to stress, anxiety, routine, caffeine, alcohol or shift work. Blood tests cannot diagnose sleep disorders such as insomnia or sleep apnoea (pauses in breathing during sleep). They can check for two physical factors: an overactive thyroid, and low iron stores, which are linked to restless legs syndrome (an urge to move your legs in the evening or at night).",
    recommendedTests: [
      {
        name: "Thyroid Function",
        why: "An overactive thyroid can cause poor sleep, sweating and a racing heart",
        keyBiomarkers: ["TSH", "Free T4", "Free T3"],
        searchQuery: "thyroid",
      },
      {
        name: "Iron Profile",
        why: "Low ferritin is linked to restless legs syndrome. Most useful if you feel an urge to move your legs at night",
        keyBiomarkers: ["Ferritin", "Iron", "Transferrin Saturation"],
        searchQuery: "iron",
      },
    ],
    limitations:
      "A blood test cannot measure sleep. A single cortisol test does not assess sleep either, so we do not list one here. If you snore loudly or stop breathing in your sleep, your GP can refer you to a sleep clinic for a sleep study.",
    whenToSeeGP:
      "See your GP if you are falling asleep during the day or while driving, if a partner notices you stop breathing or gasp in your sleep, or if poor sleep lasts more than three months.",
  },
  {
    slug: "skin-breakouts",
    name: "Adult Acne & Skin Breakouts",
    icon: "✨",
    colorHex: "#e70d69",
    shortDescription: "Persistent spots or breakouts in adulthood",
    clinicalExplanation:
      "Adult acne often relates to hormone changes around periods, pregnancy or the menopause, and to some medicines and skin products. Most people with acne do not need a blood test. Hormone tests help when acne comes with signs of raised androgens (male-type hormones), such as irregular periods or excess facial or body hair. These signs can point to polycystic ovary syndrome (PCOS).",
    recommendedTests: [
      {
        name: "PCOS Hormone Profile",
        why: "Measures androgens and sex hormone binding globulin (SHBG), a protein that controls how much testosterone is active. Consider it only if you also have irregular periods or excess hair growth",
        keyBiomarkers: [
          "Testosterone",
          "SHBG",
          "Free Androgen Index",
          "LH",
          "FSH",
        ],
        searchQuery: "pcos",
      },
    ],
    limitations:
      "Blood tests cannot diagnose acne or show which treatment will work. The NHS does not list allergies as a cause of acne, so we do not list allergy tests. If a doctor prescribes isotretinoin, they arrange the blood tests you need during treatment.",
    whenToSeeGP:
      "See your GP if acne is painful, leaving scars or affecting your wellbeing, or if it comes with excess hair growth or irregular periods. Seek urgent help for a sudden widespread or blistering rash.",
  },
  {
    slug: "excessive-thirst",
    name: "Excessive Thirst",
    icon: "💧",
    colorHex: "#22c0d4",
    shortDescription: "Feeling thirsty often or needing to urinate more",
    clinicalExplanation:
      "Feeling very thirsty and passing urine more often, especially at night, can be early signs of raised blood sugar. Blood tests can measure HbA1c, which reflects your average blood sugar over about three months, and check kidney function.",
    recommendedTests: [
      {
        name: "Diabetes Check (HbA1c)",
        why: "Shows your average blood sugar over about three months",
        keyBiomarkers: ["HbA1c"],
        searchQuery: "hba1c",
      },
      {
        name: "Diabetes Profile",
        why: "A broader look at blood sugar control",
        keyBiomarkers: ["HbA1c", "Glucose", "Insulin"],
        searchQuery: "diabetes",
      },
      {
        name: "Kidney Function",
        why: "Checks how well your kidneys filter the blood",
        keyBiomarkers: ["eGFR", "Creatinine", "Urea"],
        searchQuery: "kidney",
      },
    ],
    limitations:
      "HbA1c can read too high or too low in pregnancy, with anaemia and with some inherited blood conditions. Thirst also has causes these tests do not check, such as some medicines and hot weather.",
    whenToSeeGP:
      "See your GP promptly if thirst comes with weight loss, tiredness or blurred vision. Seek urgent help (NHS 111 or 999) if you feel very unwell, are vomiting or have fruity-smelling breath.",
  },
];
