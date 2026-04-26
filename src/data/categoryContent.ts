// SEO-optimised content for category landing pages

export interface CategoryContent {
  id: string;
  name: string;
  slug: string;
  title: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  introduction: string;
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  healthConcerns: string[];
  whoShouldTest: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedCategories: string[];
  keywords: string[];
}

export const categoryContent: Record<string, CategoryContent> = {
  "hormones": {
    id: "hormones",
    name: "Hormone Tests",
    slug: "hormones",
    title: "Hormone Blood Tests UK | Compare Prices from £39 | myhealth checkup",
    metaDescription: "Compare hormone blood tests from UK's leading private providers. Check testosterone, oestrogen, cortisol & more. Same-day results available. UKAS accredited labs.",
    heroTitle: "Hormone Blood Tests",
    heroSubtitle: "Understand your hormonal balance with comprehensive hormone testing from trusted UK providers",
    introduction: "Hormones are chemical messengers that regulate virtually every function in your body, from metabolism and mood to sleep and reproduction. A hormone blood test can reveal imbalances that may be causing symptoms like fatigue, weight changes, mood swings, or fertility issues. Our platform compares hormone tests from UKAS-accredited UK laboratories, helping you find the right test at the best price.",
    benefits: [
      {
        title: "Understand Your Balance",
        description: "Identify hormonal imbalances that could be affecting your energy, mood, weight, and overall wellbeing.",
        icon: "Scale"
      },
      {
        title: "Track Changes Over Time",
        description: "Monitor how your hormone levels change with age, lifestyle modifications, or treatment.",
        icon: "TrendingUp"
      },
      {
        title: "Personalised Insights",
        description: "Get actionable recommendations based on your unique hormonal profile.",
        icon: "Sparkles"
      }
    ],
    healthConcerns: [
      "Unexplained fatigue or low energy",
      "Mood swings or anxiety",
      "Weight gain or difficulty losing weight",
      "Hair loss or thinning",
      "Low libido or sexual dysfunction",
      "Irregular periods or fertility concerns",
      "Sleep disturbances",
      "Brain fog or concentration issues"
    ],
    whoShouldTest: [
      "Adults experiencing unexplained symptoms",
      "Those going through perimenopause or menopause",
      "Men concerned about testosterone levels",
      "Anyone with thyroid concerns",
      "Athletes optimising performance",
      "Those on hormone replacement therapy"
    ],
    faqs: [
      {
        question: "What hormones are typically tested in a hormone panel?",
        answer: "A comprehensive hormone panel typically includes testosterone, oestrogen, progesterone, cortisol, DHEA, thyroid hormones (TSH, T3, T4), and sometimes growth hormone markers. The specific biomarkers depend on the test you choose."
      },
      {
        question: "When is the best time to test hormones?",
        answer: "For most accurate results, hormone tests should be done in the morning (before 10am) when levels are most stable. Women should test on specific days of their cycle - typically day 2-5 for FSH/LH or day 21 for progesterone."
      },
      {
        question: "Do I need to fast before a hormone test?",
        answer: "Most hormone tests don't require fasting, but some comprehensive panels that include metabolic markers may recommend a 10-12 hour fast. Always check the specific test requirements."
      },
      {
        question: "How long do hormone test results take?",
        answer: "Most hormone test results are available within 2-5 working days, depending on the provider and complexity of the panel. Some providers offer express results for an additional fee."
      }
    ],
    relatedCategories: ["thyroid", "womens-health", "mens-health", "fertility"],
    keywords: ["hormone test", "testosterone test", "oestrogen test", "cortisol test", "hormone panel UK", "private hormone test"]
  },
  
  "thyroid": {
    id: "thyroid",
    name: "Thyroid Tests",
    slug: "thyroid",
    title: "Thyroid Function Tests UK | Compare Prices from £29 | myhealth checkup",
    metaDescription: "Compare thyroid blood tests from trusted UK providers. Check TSH, T3, T4 & thyroid antibodies. Fast results from UKAS accredited labs. Find your perfect test today.",
    heroTitle: "Thyroid Function Tests",
    heroSubtitle: "Comprehensive thyroid testing to check your metabolism, energy levels, and overall thyroid health",
    introduction: "Your thyroid gland controls your metabolism, affecting everything from your weight and energy levels to your heart rate and body temperature. Thyroid disorders are common, affecting around 1 in 20 people in the UK, yet often go undiagnosed. Our platform helps you compare thyroid tests from leading UK providers, ensuring you get accurate results from UKAS-accredited laboratories.",
    benefits: [
      {
        title: "Complete Thyroid Picture",
        description: "Go beyond basic TSH testing with comprehensive panels that include T3, T4, and thyroid antibodies.",
        icon: "Activity"
      },
      {
        title: "Early Detection",
        description: "Identify thyroid issues early, before they significantly impact your health and quality of life.",
        icon: "Search"
      },
      {
        title: "Monitor Treatment",
        description: "Track your thyroid function if you're on medication or managing a thyroid condition.",
        icon: "LineChart"
      }
    ],
    healthConcerns: [
      "Unexplained weight changes",
      "Constant fatigue or lethargy",
      "Feeling cold all the time",
      "Hair loss or dry skin",
      "Slow heart rate or palpitations",
      "Constipation or digestive issues",
      "Depression or mood changes",
      "Family history of thyroid problems"
    ],
    whoShouldTest: [
      "Those with unexplained fatigue or weight changes",
      "Women planning pregnancy",
      "People with family history of thyroid disease",
      "Those with autoimmune conditions",
      "Anyone on thyroid medication",
      "Women during or after menopause"
    ],
    faqs: [
      {
        question: "What's the difference between TSH and full thyroid panel?",
        answer: "A TSH test only measures thyroid-stimulating hormone, which indicates if your thyroid is over or underactive. A full panel includes Free T3, Free T4, and thyroid antibodies, giving a complete picture of thyroid function and detecting autoimmune conditions like Hashimoto's."
      },
      {
        question: "Should I stop my thyroid medication before testing?",
        answer: "No, don't stop your medication unless your doctor advises otherwise. However, many providers recommend taking your blood sample before your morning medication dose for the most accurate results."
      },
      {
        question: "Can I test for thyroid antibodies?",
        answer: "Yes, many comprehensive thyroid panels include TPO and TG antibodies, which can detect autoimmune thyroid conditions like Hashimoto's thyroiditis or Graves' disease."
      },
      {
        question: "How often should I test my thyroid?",
        answer: "If you have a thyroid condition, testing every 6-12 months is typical. For those on stable medication, annual testing may suffice. Those with symptoms should test and discuss results with their GP."
      }
    ],
    relatedCategories: ["hormones", "general-health", "womens-health", "fatigue"],
    keywords: ["thyroid test", "TSH test", "T3 T4 test", "thyroid function test UK", "thyroid antibodies test", "hypothyroid test"]
  },
  
  "general-health": {
    id: "general-health",
    name: "General Health",
    slug: "general-health",
    title: "General Health Blood Tests UK | Full Health Checks from £49 | myhealth checkup",
    metaDescription: "Compare comprehensive health check blood tests from UK's top private providers. Check cholesterol, liver, kidney function & more. UKAS accredited results in 2-5 days.",
    heroTitle: "General Health Blood Tests",
    heroSubtitle: "Comprehensive health screening to understand your overall wellbeing and catch issues early",
    introduction: "A general health blood test provides a comprehensive snapshot of your overall health, screening for common conditions and identifying potential issues before they become serious. These tests typically cover multiple body systems including liver function, kidney function, cholesterol, blood sugar, and key vitamins. Regular health checks are one of the most proactive steps you can take for your long-term wellbeing.",
    benefits: [
      {
        title: "Complete Health Overview",
        description: "Screen multiple body systems in one test, from heart health to organ function and nutrient levels.",
        icon: "Heart"
      },
      {
        title: "Early Warning System",
        description: "Detect potential health issues before symptoms appear, enabling early intervention.",
        icon: "AlertCircle"
      },
      {
        title: "Baseline Tracking",
        description: "Establish your personal health baseline and track changes over time.",
        icon: "BarChart3"
      }
    ],
    healthConcerns: [
      "Wanting a complete health check",
      "No specific symptoms but proactive about health",
      "Starting a new fitness or diet programme",
      "Family history of chronic conditions",
      "Haven't had blood tests in over a year",
      "Preparing for life insurance medical"
    ],
    whoShouldTest: [
      "Adults over 30 seeking baseline health data",
      "Those with sedentary lifestyles",
      "People with family history of heart disease or diabetes",
      "Anyone wanting to optimise their health",
      "Those embarking on lifestyle changes"
    ],
    faqs: [
      {
        question: "How many biomarkers are in a general health test?",
        answer: "General health tests typically include 20-50+ biomarkers, covering liver function, kidney function, cholesterol, blood sugar, full blood count, iron, and key vitamins. More comprehensive tests include additional markers like hormones and inflammation markers."
      },
      {
        question: "Do I need to fast before a general health blood test?",
        answer: "Most general health tests require a 10-12 hour fast for accurate cholesterol and blood sugar readings. You can drink water during this time. Check your specific test requirements."
      },
      {
        question: "How often should I have a general health check?",
        answer: "For healthy adults, an annual health check is recommended. Those with existing conditions or risk factors may benefit from more frequent testing as advised by their healthcare provider."
      },
      {
        question: "What do abnormal results mean?",
        answer: "Abnormal results don't always indicate a problem - they may be normal for you. Results include reference ranges, and many tests offer GP review or advice on next steps. Always discuss concerning results with a healthcare professional."
      }
    ],
    relatedCategories: ["heart-health", "diabetes", "vitamins", "liver-kidney"],
    keywords: ["health check blood test", "full health MOT", "comprehensive blood test UK", "private health screening", "annual health check"]
  },
  
  "womens-health": {
    id: "womens-health",
    name: "Women's Health",
    slug: "womens-health",
    title: "Women's Health Blood Tests UK | Hormone & Fertility Tests from £49 | myhealth checkup",
    metaDescription: "Compare women's health blood tests from trusted UK providers. Check hormones, fertility, menopause markers & more. Discreet home testing with fast results.",
    heroTitle: "Women's Health",
    heroSubtitle: "Comprehensive testing designed for women's unique health needs at every life stage",
    introduction: "Women's health testing addresses the unique hormonal and physiological needs at every life stage, from reproductive health and fertility to perimenopause and beyond. Our platform compares women's health tests from leading UK providers, helping you understand your hormonal balance, fertility potential, and overall wellbeing with tests designed specifically for female biology.",
    benefits: [
      {
        title: "Life Stage Support",
        description: "Tests designed for every stage - from fertility planning to menopause management.",
        icon: "Heart"
      },
      {
        title: "Hormone Insights",
        description: "Understand your unique hormonal profile and how it affects your health and symptoms.",
        icon: "Activity"
      },
      {
        title: "Fertility Assessment",
        description: "Check ovarian reserve and reproductive hormones for family planning decisions.",
        icon: "Baby"
      }
    ],
    healthConcerns: [
      "Irregular or painful periods",
      "PCOS symptoms",
      "Planning pregnancy",
      "Perimenopause or menopause symptoms",
      "Low energy or mood changes",
      "Unexplained weight changes",
      "Hair thinning or skin changes",
      "Low libido"
    ],
    whoShouldTest: [
      "Women experiencing menstrual irregularities",
      "Those planning pregnancy in the next 1-2 years",
      "Women over 35 considering fertility",
      "Those experiencing perimenopause symptoms",
      "Women on HRT wanting to monitor levels",
      "Anyone with PCOS or suspected hormonal issues"
    ],
    faqs: [
      {
        question: "When should I take a women's hormone test?",
        answer: "Timing depends on what you're testing. For ovarian reserve (AMH, FSH), test on day 2-5 of your cycle. For progesterone, test on day 21 (or 7 days after ovulation). Some tests like AMH can be done any time."
      },
      {
        question: "Can I test for menopause at home?",
        answer: "Yes, home finger-prick tests can check FSH, LH, and oestradiol levels that indicate perimenopause or menopause. Results should be discussed with your GP for proper interpretation."
      },
      {
        question: "What tests should I do before trying to conceive?",
        answer: "Pre-conception tests often include AMH (ovarian reserve), thyroid function, vitamin D, folate, and iron. Some women also test FSH, LH, and oestradiol for a complete fertility picture."
      },
      {
        question: "Do the tests include a doctor's review?",
        answer: "Many providers include GP review with women's health tests. Check the specific test details - some offer this as standard, others as an optional add-on."
      }
    ],
    relatedCategories: ["hormones", "fertility", "thyroid", "menopause"],
    keywords: ["women's health test", "female hormone test", "menopause test", "PCOS test", "fertility test UK", "perimenopause blood test"]
  },
  
  "mens-health": {
    id: "mens-health",
    name: "Men's Health",
    slug: "mens-health",
    title: "Men's Health Blood Tests UK | Testosterone & Prostate Tests from £49 | myhealth checkup",
    metaDescription: "Compare men's health blood tests from leading UK providers. Check testosterone, PSA, heart health & more. Discreet home testing available. UKAS accredited labs.",
    heroTitle: "Men's Health Blood Tests",
    heroSubtitle: "Comprehensive testing for men's unique health needs, from hormones to heart health",
    introduction: "Men's health testing focuses on the specific health concerns that affect men, including testosterone levels, prostate health, cardiovascular risk, and metabolic function. Many men put off health checks, but regular testing can catch issues early when they're most treatable. Our platform compares men's health tests from trusted UK providers, making it easy to take control of your health.",
    benefits: [
      {
        title: "Testosterone Insights",
        description: "Understand your testosterone levels and how they affect energy, mood, and vitality.",
        icon: "Zap"
      },
      {
        title: "Prostate Screening",
        description: "PSA testing for early detection of prostate issues, especially important for men over 50.",
        icon: "Shield"
      },
      {
        title: "Heart Health Focus",
        description: "Men's tests often emphasise cardiovascular markers given higher male heart disease risk.",
        icon: "Heart"
      }
    ],
    healthConcerns: [
      "Low energy or fatigue",
      "Reduced libido or erectile issues",
      "Difficulty building muscle",
      "Mood changes or irritability",
      "Weight gain, especially around the middle",
      "Family history of prostate issues",
      "Sleep problems",
      "Reduced motivation or 'drive'"
    ],
    whoShouldTest: [
      "Men over 40 seeking baseline health data",
      "Those experiencing low testosterone symptoms",
      "Men with family history of prostate cancer",
      "Athletes monitoring hormone levels",
      "Those on TRT wanting to track levels",
      "Men experiencing unexplained fatigue"
    ],
    faqs: [
      {
        question: "What testosterone level is considered low?",
        answer: "Total testosterone below 8 nmol/L is generally considered low. Levels between 8-12 nmol/L may be borderline. However, symptoms matter too - some men with 'normal' levels still experience symptoms. Free testosterone is also important."
      },
      {
        question: "When should men start PSA testing?",
        answer: "Discuss with your GP, but generally men over 50 (or 45 with family history or Black ethnicity) should consider PSA testing. It's a personal decision based on risk factors and preferences."
      },
      {
        question: "Is morning testing important for testosterone?",
        answer: "Yes, testosterone levels are highest in the morning and can drop 30% by afternoon. For accurate results, test before 10am and ideally fasted."
      },
      {
        question: "What's included in a comprehensive men's health test?",
        answer: "Comprehensive tests typically include testosterone (total and free), PSA, cholesterol panel, liver and kidney function, blood sugar, thyroid, and key vitamins like D and B12."
      }
    ],
    relatedCategories: ["hormones", "heart-health", "general-health", "sports-performance"],
    keywords: ["men's health test", "testosterone test UK", "PSA test", "male hormone panel", "prostate test", "men's MOT blood test"]
  },
  
  "fertility": {
    id: "fertility",
    name: "Fertility Tests",
    slug: "fertility",
    title: "Fertility Blood Tests UK | AMH & Hormone Tests from £49 | myhealth checkup",
    metaDescription: "Compare fertility blood tests from UK's leading providers. Check AMH, FSH, LH & reproductive hormones. Discreet home testing. Results reviewed by fertility specialists.",
    heroTitle: "Fertility Blood Tests",
    heroSubtitle: "Comprehensive fertility testing to support your family planning journey",
    introduction: "Fertility testing provides valuable insights into your reproductive health, whether you're planning to conceive soon or want to understand your fertility potential for the future. These tests measure key hormones like AMH (Anti-Müllerian Hormone), FSH, and LH that indicate ovarian reserve and reproductive function. Our platform compares fertility tests from specialist UK providers.",
    benefits: [
      {
        title: "Know Your Fertility",
        description: "Understand your ovarian reserve and reproductive hormone levels for informed family planning.",
        icon: "Baby"
      },
      {
        title: "Plan Ahead",
        description: "Get insights that help you make decisions about timing and fertility preservation options.",
        icon: "Calendar"
      },
      {
        title: "Specialist Support",
        description: "Many tests include review by fertility specialists who can explain your results.",
        icon: "Users"
      }
    ],
    healthConcerns: [
      "Wanting to know fertility status",
      "Planning pregnancy in the future",
      "Irregular or absent periods",
      "Previous difficulty conceiving",
      "Considering egg freezing",
      "Family history of early menopause",
      "PCOS diagnosis or symptoms",
      "Age-related fertility concerns"
    ],
    whoShouldTest: [
      "Women wanting to understand their fertility timeline",
      "Those considering egg freezing",
      "Couples who have been trying to conceive",
      "Women with irregular periods or PCOS",
      "Anyone with family history of early menopause",
      "Women over 35 planning pregnancy"
    ],
    faqs: [
      {
        question: "What is AMH and why is it important?",
        answer: "AMH (Anti-Müllerian Hormone) indicates your ovarian reserve - the number of eggs remaining. Unlike FSH, AMH can be tested any day of your cycle and gives insight into your fertility timeline and potential response to IVF."
      },
      {
        question: "When should I take a fertility test?",
        answer: "AMH can be tested any day. For a complete picture including FSH and LH, test on day 2-5 of your menstrual cycle. If testing progesterone to confirm ovulation, test on day 21 (or 7 days after suspected ovulation)."
      },
      {
        question: "Do fertility tests tell me if I can get pregnant?",
        answer: "Fertility tests indicate your hormonal profile and ovarian reserve, but many factors affect conception. Normal results are encouraging but don't guarantee pregnancy; abnormal results don't mean you can't conceive. Results should be discussed with a fertility specialist."
      },
      {
        question: "Should my partner also be tested?",
        answer: "Yes, male factor contributes to around 40-50% of fertility issues. Male fertility tests check sperm count, motility, and morphology. Many providers offer couples' packages."
      }
    ],
    relatedCategories: ["womens-health", "hormones", "mens-health", "pcos"],
    keywords: ["fertility test", "AMH test UK", "ovarian reserve test", "fertility MOT", "egg count test", "conception blood test"]
  },
  
  "heart-health": {
    id: "heart-health",
    name: "Heart Health",
    slug: "heart-health",
    title: "Heart Health Blood Tests UK | Cholesterol & Cardiac Tests from £39 | myhealth checkup",
    metaDescription: "Compare heart health blood tests from trusted UK providers. Check cholesterol, triglycerides, inflammation markers & cardiac risk. Fast results from UKAS labs.",
    heroTitle: "Heart Health Blood Tests",
    heroSubtitle: "Comprehensive cardiac screening to assess your cardiovascular risk and heart health",
    introduction: "Heart disease remains the leading cause of death in the UK, yet it's largely preventable with early detection and lifestyle changes. Heart health blood tests measure key markers like cholesterol, triglycerides, and inflammation that indicate cardiovascular risk. Our platform compares cardiac tests from UKAS-accredited UK providers, helping you take proactive steps to protect your heart.",
    benefits: [
      {
        title: "Know Your Risk",
        description: "Assess your cardiovascular risk with comprehensive lipid panels and cardiac markers.",
        icon: "Heart"
      },
      {
        title: "Beyond Basic Cholesterol",
        description: "Advanced tests measure particle size, inflammation, and emerging cardiac risk markers.",
        icon: "Activity"
      },
      {
        title: "Track Progress",
        description: "Monitor how diet, exercise, and medication affect your heart health markers.",
        icon: "TrendingUp"
      }
    ],
    healthConcerns: [
      "High cholesterol or family history",
      "High blood pressure",
      "Overweight or obesity",
      "Sedentary lifestyle",
      "Smoker or former smoker",
      "Diabetes or pre-diabetes",
      "Stress or anxiety",
      "Poor diet high in saturated fats"
    ],
    whoShouldTest: [
      "Adults over 40 (or 35 with risk factors)",
      "Those with family history of heart disease",
      "People with high blood pressure",
      "Those with diabetes or metabolic syndrome",
      "Anyone on statins or cholesterol medication",
      "Those making lifestyle changes for heart health"
    ],
    faqs: [
      {
        question: "What's the difference between good and bad cholesterol?",
        answer: "LDL ('bad' cholesterol) can build up in arteries causing blockages. HDL ('good' cholesterol) helps remove LDL from arteries. Ideally, LDL should be below 3 mmol/L and HDL above 1 mmol/L for men, 1.2 mmol/L for women."
      },
      {
        question: "Do I need to fast for a cholesterol test?",
        answer: "Current guidelines suggest fasting isn't essential for most people, but a 10-12 hour fast gives the most accurate triglyceride readings. Check your specific test requirements."
      },
      {
        question: "What are advanced cardiac markers?",
        answer: "Beyond standard cholesterol, advanced tests may include apolipoprotein B, Lp(a), hs-CRP (inflammation), and LDL particle size. These provide deeper insight into cardiovascular risk."
      },
      {
        question: "How often should I test heart health markers?",
        answer: "For those at average risk, every 4-6 years is typical. Those with elevated risk, existing conditions, or on medication should test more frequently - often annually."
      }
    ],
    relatedCategories: ["general-health", "diabetes", "inflammation", "liver-kidney"],
    keywords: ["cholesterol test", "heart health blood test", "lipid panel UK", "cardiac risk test", "cardiovascular screening", "triglycerides test"]
  },
  
  "diabetes": {
    id: "diabetes",
    name: "Diabetes Tests",
    slug: "diabetes",
    title: "Diabetes Blood Tests UK | HbA1c & Glucose Tests from £29 | myhealth checkup",
    metaDescription: "Compare diabetes blood tests from UK's trusted providers. Check HbA1c, fasting glucose & insulin resistance. Monitor blood sugar control. Fast, accurate results.",
    heroTitle: "Diabetes Blood Tests",
    heroSubtitle: "Comprehensive blood sugar testing to detect, monitor, and manage diabetes",
    introduction: "Diabetes affects over 4.9 million people in the UK, with many more undiagnosed or at risk. Blood tests for diabetes measure how well your body manages blood sugar, helping detect pre-diabetes early when lifestyle changes can prevent progression. Our platform compares diabetes tests from trusted UK providers, whether you're screening for risk or monitoring an existing condition.",
    benefits: [
      {
        title: "Early Detection",
        description: "Identify pre-diabetes early when lifestyle changes can prevent type 2 diabetes.",
        icon: "AlertCircle"
      },
      {
        title: "Monitor Control",
        description: "HbA1c shows your average blood sugar over 2-3 months for effective management.",
        icon: "LineChart"
      },
      {
        title: "Comprehensive Screening",
        description: "Advanced tests assess insulin resistance and metabolic function.",
        icon: "Activity"
      }
    ],
    healthConcerns: [
      "Family history of diabetes",
      "Overweight or obesity",
      "Excessive thirst or urination",
      "Unexplained fatigue",
      "Slow-healing wounds",
      "Tingling in hands or feet",
      "Previous gestational diabetes",
      "PCOS diagnosis"
    ],
    whoShouldTest: [
      "Adults over 45 (or younger with risk factors)",
      "Those with BMI over 25",
      "People with family history of type 2 diabetes",
      "Women with history of gestational diabetes",
      "Those with PCOS",
      "Anyone with pre-diabetes monitoring progression"
    ],
    faqs: [
      {
        question: "What's the difference between HbA1c and fasting glucose?",
        answer: "Fasting glucose shows blood sugar at one point in time. HbA1c measures average blood sugar over the past 2-3 months, giving a better picture of overall control. HbA1c below 42 mmol/mol is normal, 42-47 is pre-diabetes, 48+ indicates diabetes."
      },
      {
        question: "Do I need to fast for diabetes tests?",
        answer: "HbA1c doesn't require fasting. Fasting glucose tests require a 10-12 hour fast. Some comprehensive metabolic panels also require fasting."
      },
      {
        question: "What is insulin resistance?",
        answer: "Insulin resistance means your cells don't respond well to insulin, causing high blood sugar. Tests for fasting insulin alongside glucose can calculate insulin resistance (HOMA-IR), identifying risk before glucose levels rise."
      },
      {
        question: "How often should diabetics test HbA1c?",
        answer: "People with diabetes typically test HbA1c every 3-6 months. Those with well-controlled diabetes may test every 6 months. New diagnoses or medication changes may require more frequent testing."
      }
    ],
    relatedCategories: ["general-health", "heart-health", "weight-management", "metabolic"],
    keywords: ["diabetes test", "HbA1c test UK", "blood sugar test", "pre-diabetes screening", "glucose test", "insulin resistance test"]
  },
  
  "vitamins": {
    id: "vitamins",
    name: "Vitamin Tests",
    slug: "vitamins",
    title: "Vitamin & Mineral Blood Tests UK | Deficiency Tests from £29 | myhealth checkup",
    metaDescription: "Compare vitamin and mineral blood tests from UK providers. Check vitamin D, B12, iron, folate & more. Identify deficiencies affecting your energy and health.",
    heroTitle: "Vitamin & Mineral Blood Tests",
    heroSubtitle: "Identify nutritional deficiencies that could be affecting your energy, mood, and overall health",
    introduction: "Vitamins and minerals are essential for hundreds of bodily functions, yet deficiencies are surprisingly common in the UK. Low vitamin D affects around 1 in 5 adults, while B12 deficiency is common in vegetarians and older adults. A blood test can identify deficiencies causing symptoms like fatigue, brain fog, or poor immunity, enabling targeted supplementation.",
    benefits: [
      {
        title: "Identify Deficiencies",
        description: "Discover specific nutrient gaps that may be causing unexplained symptoms.",
        icon: "Search"
      },
      {
        title: "Optimise Supplementation",
        description: "Stop guessing - know exactly which supplements your body actually needs.",
        icon: "Pill"
      },
      {
        title: "Boost Energy",
        description: "Address iron, B12, and vitamin D deficiencies that commonly cause fatigue.",
        icon: "Zap"
      }
    ],
    healthConcerns: [
      "Persistent fatigue or low energy",
      "Brain fog or concentration issues",
      "Frequent illness or slow recovery",
      "Muscle weakness or cramps",
      "Hair loss or brittle nails",
      "Mood changes or depression",
      "Dietary restrictions (vegan, vegetarian)",
      "Limited sun exposure"
    ],
    whoShouldTest: [
      "Those with persistent fatigue",
      "Vegetarians and vegans (especially for B12)",
      "People with limited sun exposure",
      "Those with digestive conditions",
      "Older adults (absorption decreases with age)",
      "Anyone with restricted diets"
    ],
    faqs: [
      {
        question: "Which vitamins are most commonly deficient in the UK?",
        answer: "Vitamin D is the most common deficiency due to limited sunlight, followed by iron (especially in women), vitamin B12 (especially in vegans/vegetarians and older adults), and folate."
      },
      {
        question: "What vitamin D level is optimal?",
        answer: "Optimal vitamin D is generally 75-150 nmol/L. Below 25 nmol/L is deficiency, 25-50 nmol/L is insufficiency. Many UK adults fall below optimal, especially in winter months."
      },
      {
        question: "Should I stop supplements before testing?",
        answer: "For accurate baseline results, some providers recommend stopping supplements 7-14 days before testing. However, if monitoring your supplemented levels, continue as normal. Check specific test instructions."
      },
      {
        question: "Can I test multiple vitamins at once?",
        answer: "Yes, many providers offer comprehensive vitamin panels testing D, B12, folate, iron, and more in a single test. This is often more cost-effective than individual tests."
      }
    ],
    relatedCategories: ["general-health", "fatigue", "immunity", "bone-health"],
    keywords: ["vitamin test", "vitamin D test UK", "B12 test", "iron deficiency test", "mineral test", "nutritional blood test"]
  },
  
  "cancer-screening": {
    id: "cancer-screening",
    name: "Cancer Screening",
    slug: "cancer-screening",
    title: "Cancer Marker Blood Tests UK | PSA, CEA & CA125 from £39 | myhealth checkup",
    metaDescription: "Compare cancer screening blood tests from UK's trusted providers. Check PSA, CEA, CA125 & other tumour markers. Early detection from UKAS accredited laboratories.",
    heroTitle: "Cancer Marker Blood Tests",
    heroSubtitle: "Tumour marker testing for early detection and peace of mind",
    introduction: "Cancer marker blood tests (tumour markers) can support early detection and monitoring of certain cancers. While not diagnostic on their own, elevated markers can prompt further investigation when symptoms or risk factors are present. Our platform compares cancer marker tests from trusted UK providers, all using UKAS-accredited laboratories for reliable results.",
    benefits: [
      {
        title: "Early Detection Support",
        description: "Tumour markers can help detect some cancers earlier when treatment is most effective.",
        icon: "Search"
      },
      {
        title: "Monitor Treatment",
        description: "Track marker levels during and after treatment to assess effectiveness.",
        icon: "Activity"
      },
      {
        title: "Peace of Mind",
        description: "For those with family history or concerns, regular screening provides reassurance.",
        icon: "Shield"
      }
    ],
    healthConcerns: [
      "Family history of cancer",
      "Unexplained weight loss",
      "Persistent fatigue",
      "Changes in bowel habits",
      "Unusual lumps or swelling",
      "Post-cancer treatment monitoring",
      "Age-related screening",
      "General peace of mind"
    ],
    whoShouldTest: [
      "Those with strong family history of specific cancers",
      "People experiencing concerning symptoms",
      "Post-treatment cancer patients (monitoring)",
      "Men over 50 for PSA screening",
      "Those wanting baseline readings",
      "Individuals with genetic predisposition"
    ],
    faqs: [
      {
        question: "Can blood tests detect cancer?",
        answer: "Blood tests for tumour markers can indicate increased risk or presence of certain cancers, but they're not diagnostic. Elevated markers require further investigation - many non-cancerous conditions can also raise markers. They're best used alongside other screening methods."
      },
      {
        question: "What is PSA testing?",
        answer: "PSA (Prostate-Specific Antigen) is a protein produced by the prostate. Elevated levels may indicate prostate cancer, but also benign conditions like enlarged prostate. It's typically recommended for men over 50, or earlier with risk factors."
      },
      {
        question: "What does CA125 test for?",
        answer: "CA125 is often elevated in ovarian cancer, but also in endometriosis, pregnancy, and other conditions. It's most useful for monitoring ovarian cancer treatment rather than general screening in low-risk women."
      },
      {
        question: "How often should I test cancer markers?",
        answer: "For general screening in those without symptoms, annual testing may be considered. Post-cancer treatment, more frequent monitoring is typical (every 3-6 months initially). Discuss with your doctor based on personal risk."
      }
    ],
    relatedCategories: ["mens-health", "womens-health", "general-health", "inflammation"],
    keywords: ["cancer blood test", "tumour marker test", "PSA test UK", "CA125 test", "CEA test", "cancer screening blood test"]
  }
};

export const getCategoryContent = (slug: string): CategoryContent | null => {
  // Normalise the slug
  const normalisedSlug = slug.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
  
  // Try direct match
  if (categoryContent[normalisedSlug]) {
    return categoryContent[normalisedSlug];
  }
  
  // Try matching by name or alternative slugs
  const slugMappings: Record<string, string> = {
    'hormone': 'hormones',
    'hormone-tests': 'hormones',
    'thyroid-tests': 'thyroid',
    'thyroid-function': 'thyroid',
    'general': 'general-health',
    'health-check': 'general-health',
    'womens': 'womens-health',
    'women': 'womens-health',
    'female': 'womens-health',
    'mens': 'mens-health',
    'men': 'mens-health',
    'male': 'mens-health',
    'fertility-tests': 'fertility',
    'heart': 'heart-health',
    'cardiac': 'heart-health',
    'cholesterol': 'heart-health',
    'diabetes-tests': 'diabetes',
    'blood-sugar': 'diabetes',
    'vitamin': 'vitamins',
    'minerals': 'vitamins',
    'nutritional': 'vitamins',
    'cancer': 'cancer-screening',
    'cancer-markers': 'cancer-screening',
    'tumour-markers': 'cancer-screening'
  };
  
  const mappedSlug = slugMappings[normalisedSlug];
  if (mappedSlug && categoryContent[mappedSlug]) {
    return categoryContent[mappedSlug];
  }
  
  return null;
};

export const getAllCategoryIds = (): string[] => {
  return Object.keys(categoryContent);
};

export const getCategoryByName = (name: string): CategoryContent | null => {
  const normalised = name.toLowerCase();
  
  for (const content of Object.values(categoryContent)) {
    if (
      content.name.toLowerCase() === normalised ||
      content.id === normalised ||
      content.slug === normalised
    ) {
      return content;
    }
  }
  
  return null;
};
