/**
 * Biomarker & test explainer guides.
 * Each entry powers a /guides/:slug page targeting a specific high-intent
 * UK search term identified in the Semrush gap analysis vs Medichecks/Thriva.
 *
 * Editorial rules (per project knowledge):
 *  - British English
 *  - No diagnostic claims, no outcome guarantees
 *  - Plain-English explanations of clinical terms on first use
 *  - Non-guaranteed turnaround phrasing
 */

export type BiomarkerGuide = {
  slug: string;
  /** Primary keyword the page targets. Used in H1 verbatim. */
  keyword: string;
  /** SEO <title> (≤60 chars, brand suffix appended by Helmet). */
  title: string;
  /** Meta description (50-160 chars). */
  description: string;
  /** One-line strapline shown under H1. */
  strapline: string;
  /** Opening paragraph — answers the search intent in the first 2 sentences. */
  intro: string;
  /** Key biomarkers measured / related markers. */
  biomarkers: { name: string; what: string }[];
  /** "Why it matters" bullets. */
  whyItMatters: string[];
  /** "How testing works" steps. */
  howItWorks: string[];
  /** FAQ pairs — also emitted as FAQPage JSON-LD. */
  faqs: { q: string; a: string }[];
  /** Comparison hub the CTA links to. */
  compareHref: string;
  /** Category for the index hub grouping. */
  category: "Hormones" | "Vitamins & Minerals" | "Organ Health" | "Inflammation & Immunity" | "General";
};

export const biomarkerGuides: BiomarkerGuide[] = [
  {
    slug: "testosterone-test",
    keyword: "Testosterone Test",
    title: "Testosterone Test UK — Compare Private Blood Tests",
    description:
      "Compare private testosterone blood tests in the UK. See total and free testosterone, SHBG, prices and turnaround times from CQC-regulated providers.",
    strapline: "Total and free testosterone, SHBG, and what the numbers typically mean.",
    intro:
      "A testosterone test measures the level of testosterone in your blood. Private testosterone tests in the UK typically measure total testosterone, free testosterone and SHBG (sex hormone binding globulin) so you can see both the total amount and how much is biologically available.",
    biomarkers: [
      { name: "Total testosterone", what: "The combined amount of testosterone in your blood, both bound and free." },
      { name: "Free testosterone", what: "The fraction not bound to proteins — the portion considered biologically active." },
      { name: "SHBG", what: "A protein that binds testosterone. High SHBG can reduce the free testosterone available to your body." },
      { name: "Albumin", what: "Used alongside SHBG to calculate free testosterone accurately." },
    ],
    whyItMatters: [
      "Low testosterone is associated with low energy, reduced libido, mood changes and loss of muscle mass.",
      "Levels follow a daily rhythm — most clinical labs recommend a morning sample (typically before 11am).",
      "Results should always be interpreted by a qualified clinician alongside your symptoms.",
    ],
    howItWorks: [
      "Choose a finger-prick home kit or a clinic venous draw from an accredited provider.",
      "Collect the sample in the morning, ideally fasted, and post or return to the lab.",
      "Results are typically returned in 2–5 working days with a clinician-reviewed report.",
    ],
    faqs: [
      {
        q: "What is a normal testosterone level for a man?",
        a: "UK reference ranges for adult men typically sit around 8.6–29 nmol/L for total testosterone, but ranges vary by laboratory and age. Always interpret results against the range printed on your report and discuss with a clinician.",
      },
      {
        q: "Do I need a doctor's referral?",
        a: "No. Private testosterone tests in the UK are available direct-to-consumer from CQC-regulated providers, with clinician-reviewed reports included.",
      },
      {
        q: "Finger-prick or venous blood draw?",
        a: "Both are accepted by UKAS-accredited laboratories. Venous samples are generally preferred when accuracy is critical or when multiple hormones are tested together.",
      },
    ],
    compareHref: "/hormones",
    category: "Hormones",
  },
  {
    slug: "low-testosterone-symptoms",
    keyword: "Low Testosterone Symptoms",
    title: "Low Testosterone Symptoms — Signs and Tests UK",
    description:
      "Recognise the signs of low testosterone in men. Common symptoms, who should test, and how to compare private testosterone tests from UK providers.",
    strapline: "What low testosterone can feel like — and when a test is worth considering.",
    intro:
      "Low testosterone (sometimes called low T or male hypogonadism) can cause a cluster of symptoms that build up gradually. Recognising the pattern is the first step; a blood test from an accredited UK lab is how clinicians confirm whether levels are actually low.",
    biomarkers: [
      { name: "Total testosterone", what: "The headline measurement clinicians use to confirm low T." },
      { name: "Free testosterone", what: "The active fraction — sometimes low even when total testosterone looks normal." },
      { name: "LH & FSH", what: "Pituitary hormones that help identify whether the cause is testicular or pituitary." },
      { name: "Prolactin & oestradiol", what: "Often included in advanced male hormone panels to give a fuller picture." },
    ],
    whyItMatters: [
      "Symptoms overlap with many other conditions (thyroid issues, low iron, depression) — testing helps narrow it down.",
      "Self-diagnosis from symptoms alone is unreliable; lab confirmation is essential before any treatment is considered.",
      "Lifestyle factors (sleep, training load, weight) can influence testosterone meaningfully.",
    ],
    howItWorks: [
      "Make a symptom list — energy, libido, mood, recovery, body composition.",
      "Order a comprehensive male hormone panel and collect a morning sample.",
      "Review the clinician-written report; repeat testing is usually advised before any diagnosis is made.",
    ],
    faqs: [
      {
        q: "What are the most common symptoms of low testosterone?",
        a: "Low libido, persistent fatigue, low mood, reduced morning erections, loss of muscle mass, increased body fat and poor recovery from exercise are the most frequently reported symptoms.",
      },
      {
        q: "At what age does testosterone start to decline?",
        a: "Testosterone typically declines gradually from around age 30, by roughly 1% per year on average, but trajectories vary widely between individuals.",
      },
      {
        q: "Can lifestyle changes improve testosterone?",
        a: "Sleep, resistance training, maintaining a healthy weight and managing stress are all associated with healthier testosterone levels. A test gives you a baseline to track against.",
      },
    ],
    compareHref: "/tests/mens-health",
    category: "Hormones",
  },
  {
    slug: "cortisol-test",
    keyword: "Cortisol Test",
    title: "Cortisol Test UK — Compare Private Blood Tests",
    description:
      "Compare private cortisol tests from accredited UK labs. Understand stress hormone levels, sample timing and prices side-by-side.",
    strapline: "Your body's primary stress hormone — and how it's typically measured.",
    intro:
      "A cortisol test measures the level of cortisol — your body's primary stress hormone — in blood, saliva or urine. Private cortisol tests in the UK are available from CQC-regulated providers, with most clinical labs preferring a morning blood sample taken between 8 and 10am.",
    biomarkers: [
      { name: "Serum cortisol", what: "Total cortisol in the blood — the standard clinical measurement." },
      { name: "Salivary cortisol", what: "Useful for assessing the diurnal rhythm across the day." },
      { name: "ACTH", what: "Pituitary hormone that drives cortisol release; sometimes tested alongside cortisol." },
    ],
    whyItMatters: [
      "Cortisol follows a daily curve — highest in the morning, lowest around midnight.",
      "Persistently high or low levels can point to adrenal or pituitary conditions that need medical assessment.",
      "Single readings have limited value without timing context; clinician interpretation is essential.",
    ],
    howItWorks: [
      "Order a morning cortisol blood test or a multi-sample salivary kit.",
      "Collect according to instructions — timing matters more than for most tests.",
      "Results are typically returned in 2–4 working days with reference ranges.",
    ],
    faqs: [
      {
        q: "What is a normal morning cortisol level?",
        a: "UK labs typically use a morning serum cortisol reference range of around 133–537 nmol/L, but this varies by lab and assay. Always read the range printed on your own report.",
      },
      {
        q: "Should I test blood or saliva?",
        a: "Blood is the standard for screening single-time-point cortisol. Salivary tests across the day are better for assessing rhythm and are often used in functional medicine.",
      },
      {
        q: "Can high cortisol cause weight gain?",
        a: "Sustained high cortisol is associated with central weight gain, but many other factors are involved. A test is a starting point, not a diagnosis.",
      },
    ],
    compareHref: "/hormones",
    category: "Hormones",
  },
  {
    slug: "ferritin-test",
    keyword: "Ferritin & Iron Test",
    title: "Ferritin & Iron Test UK — Compare Private Tests",
    description:
      "Compare private ferritin and iron profile tests in the UK. Check iron stores, transferrin saturation and TIBC from accredited UK labs.",
    strapline: "Ferritin is the best single marker of your body's iron stores.",
    intro:
      "Ferritin is a protein that stores iron in your body — measuring it is the most reliable single test for iron deficiency. A full iron profile also measures serum iron, transferrin and transferrin saturation to distinguish low stores from other causes of low iron.",
    biomarkers: [
      { name: "Ferritin", what: "The main store of iron in your body — low ferritin is the earliest sign of iron deficiency." },
      { name: "Serum iron", what: "The amount of iron currently circulating in your blood." },
      { name: "Transferrin", what: "The protein that carries iron around the body." },
      { name: "Transferrin saturation", what: "How much of your transferrin is actually carrying iron." },
      { name: "TIBC", what: "Total iron-binding capacity — your blood's ability to bind iron." },
    ],
    whyItMatters: [
      "Iron deficiency is one of the most common nutritional deficiencies, particularly in women of reproductive age.",
      "Ferritin can be falsely raised by inflammation, so a full iron profile is often more informative.",
      "Symptoms of low iron include fatigue, breathlessness, pale skin and brittle nails.",
    ],
    howItWorks: [
      "Order a finger-prick or venous iron profile from a UKAS-accredited lab.",
      "Avoid iron supplements for 24 hours before testing for the most accurate reading.",
      "Results are typically returned in 2–4 working days with a clinician-reviewed report.",
    ],
    faqs: [
      {
        q: "What ferritin level is considered low?",
        a: "UK guidance typically considers ferritin below 30 µg/L as suggestive of iron deficiency, though some clinicians use a 50 µg/L threshold for symptomatic individuals. Always interpret against your lab's reference range.",
      },
      {
        q: "Do I need to fast before an iron test?",
        a: "Fasting is not strictly required for ferritin, but morning samples taken before food and supplements are preferred for consistency.",
      },
    ],
    compareHref: "/tests/vitamins",
    category: "Vitamins & Minerals",
  },
  {
    slug: "vitamin-d-test",
    keyword: "Vitamin D Blood Test",
    title: "Vitamin D Blood Test UK — Compare Private Tests",
    description:
      "Compare private vitamin D blood tests in the UK. Check your 25-OH vitamin D level with home finger-prick or clinic tests from accredited labs.",
    strapline: "25-OH vitamin D is the standard measurement of your vitamin D status.",
    intro:
      "A vitamin D blood test measures 25-hydroxyvitamin D — known as 25-OH D — which is the form clinicians use to assess vitamin D status. In the UK, deficiency is common between October and March when sunlight exposure is limited.",
    biomarkers: [
      { name: "25-OH Vitamin D", what: "The storage form of vitamin D and the standard clinical measurement." },
    ],
    whyItMatters: [
      "Vitamin D supports bone health, immune function and muscle function.",
      "Public Health England advises considering a 10 µg daily supplement during autumn and winter for most UK adults.",
      "Both deficiency and excess are possible — testing avoids guessing your dose.",
    ],
    howItWorks: [
      "Order a finger-prick home kit or a clinic venous draw from an accredited UK provider.",
      "Collect the sample and return by post; most kits include pre-paid return packaging.",
      "Results are typically returned in 2–5 working days.",
    ],
    faqs: [
      {
        q: "What is a healthy vitamin D level?",
        a: "UK NICE guidance defines deficiency as below 25 nmol/L, insufficiency as 25–50 nmol/L and sufficiency as 50 nmol/L or above. Many clinicians target 75–100 nmol/L for optimal health.",
      },
      {
        q: "How often should I test vitamin D?",
        a: "Once or twice a year is usually enough for most adults — typically late winter (to catch deficiency) and late summer (to confirm replenishment).",
      },
    ],
    compareHref: "/tests/vitamins",
    category: "Vitamins & Minerals",
  },
  {
    slug: "thyroid-test",
    keyword: "Thyroid Test",
    title: "Thyroid Test UK — TSH, FT4 and FT3 Compared",
    description:
      "Compare private thyroid blood tests in the UK. Understand TSH, FT4, FT3 and thyroid antibodies from CQC-regulated providers.",
    strapline: "TSH, FT4, FT3 and thyroid antibodies — what each marker actually tells you.",
    intro:
      "A thyroid test measures the hormones that regulate your metabolism. A basic thyroid screen looks at TSH (thyroid stimulating hormone), while an advanced panel adds FT4, FT3 and thyroid antibodies to give a complete picture of how your thyroid is functioning.",
    biomarkers: [
      { name: "TSH", what: "Made by the pituitary — the most sensitive single screen for thyroid problems." },
      { name: "Free T4 (FT4)", what: "The main hormone produced by the thyroid gland." },
      { name: "Free T3 (FT3)", what: "The active hormone that drives metabolism in your cells." },
      { name: "TPO antibodies", what: "Raised in autoimmune thyroid conditions such as Hashimoto's." },
    ],
    whyItMatters: [
      "Thyroid issues are common and often missed — symptoms overlap with stress, low iron and menopause.",
      "An advanced panel is more informative than a TSH-only test when symptoms are present.",
      "Thyroid results should always be interpreted by a clinician alongside symptoms.",
    ],
    howItWorks: [
      "Order a thyroid panel as a finger-prick home kit or clinic blood draw.",
      "Sample in the morning, ideally before any biotin-containing supplements.",
      "Results are typically returned in 2–5 working days with reference ranges and clinician comments.",
    ],
    faqs: [
      {
        q: "What does a high TSH mean?",
        a: "A raised TSH usually suggests an underactive thyroid (hypothyroidism), as the pituitary increases TSH to try to stimulate more hormone production. A clinician will normally repeat the test and check FT4 before any diagnosis.",
      },
      {
        q: "TSH-only or full panel?",
        a: "TSH alone is fine for routine screening when you have no symptoms. If you have symptoms (fatigue, weight changes, hair loss, mood changes), a full panel including FT4, FT3 and antibodies is usually more informative.",
      },
    ],
    compareHref: "/tests/thyroid",
    category: "Hormones",
  },
  {
    slug: "liver-function-test",
    keyword: "Liver Function Test",
    title: "Liver Function Test UK — ALT, AST, GGT Explained",
    description:
      "Compare private liver function tests in the UK. Understand ALT, AST, ALP, GGT and bilirubin from accredited UK labs.",
    strapline: "What ALT, AST, ALP, GGT and bilirubin actually measure.",
    intro:
      "A liver function test (LFT) is a blood test that checks how well your liver is working. It measures a panel of enzymes and proteins — ALT, AST, ALP, GGT, bilirubin and albumin — that can flag liver stress, damage or disease.",
    biomarkers: [
      { name: "ALT", what: "An enzyme released when liver cells are damaged — often the first marker to rise." },
      { name: "AST", what: "Another liver enzyme; useful read alongside ALT." },
      { name: "ALP", what: "Raised in bile duct issues and some bone conditions." },
      { name: "GGT", what: "Sensitive to alcohol intake and bile duct problems." },
      { name: "Bilirubin", what: "A breakdown product of red blood cells; high levels can cause jaundice." },
      { name: "Albumin", what: "The main protein made by the liver; low levels suggest chronic liver impairment." },
    ],
    whyItMatters: [
      "Many liver conditions are silent in their early stages — testing can catch issues before symptoms appear.",
      "Alcohol intake, certain medications and intense exercise can all temporarily affect LFT results.",
      "Results should always be interpreted alongside lifestyle and clinical history.",
    ],
    howItWorks: [
      "Order a liver function panel as a finger-prick home kit or clinic venous draw.",
      "Avoid alcohol for 24–48 hours before testing for the most representative reading.",
      "Results are typically returned in 2–4 working days with reference ranges.",
    ],
    faqs: [
      {
        q: "What does a high ALT mean?",
        a: "Raised ALT usually indicates that liver cells are under stress. Common causes include fatty liver, alcohol, certain medications, viral hepatitis or recent strenuous exercise. A clinician will normally repeat the test and look at the full panel before any conclusion.",
      },
      {
        q: "Do I need to fast?",
        a: "Most LFT panels do not require fasting, but if cholesterol or glucose is included on the same panel, a 10–12 hour fast is usually recommended.",
      },
    ],
    compareHref: "/compare?category=liver",
    category: "Organ Health",
  },
  {
    slug: "kidney-function-test",
    keyword: "Kidney Function Test",
    title: "Kidney Function Test UK — Creatinine, eGFR & Urea",
    description:
      "Compare private kidney function tests in the UK. Check creatinine, eGFR, urea and electrolytes from CQC-regulated providers.",
    strapline: "Creatinine, eGFR, urea and electrolytes — the standard kidney markers.",
    intro:
      "A kidney function test measures how well your kidneys are filtering waste. The standard panel includes creatinine, eGFR (estimated glomerular filtration rate), urea and electrolytes such as sodium and potassium.",
    biomarkers: [
      { name: "Creatinine", what: "A waste product cleared by the kidneys — the headline marker of kidney function." },
      { name: "eGFR", what: "A calculation that estimates how well your kidneys are filtering blood." },
      { name: "Urea", what: "Another waste product; affected by protein intake, hydration and kidney function." },
      { name: "Sodium & potassium", what: "Electrolytes regulated by the kidneys." },
    ],
    whyItMatters: [
      "Chronic kidney disease is often silent until later stages — early detection is valuable.",
      "Hydration, diet and certain medications can affect kidney markers.",
      "Anyone with diabetes, high blood pressure or a family history should consider periodic testing.",
    ],
    howItWorks: [
      "Order a kidney function panel as a finger-prick home kit or clinic blood draw.",
      "Stay normally hydrated in the 24 hours before testing — avoid heavy protein loads or supplements.",
      "Results are typically returned in 2–4 working days.",
    ],
    faqs: [
      {
        q: "What is a normal eGFR?",
        a: "An eGFR of 90 mL/min/1.73m² or above is generally considered normal for adults. Values between 60–89 may be normal depending on age; below 60 for 3 months or more meets the definition of chronic kidney disease.",
      },
      {
        q: "Can dehydration affect kidney results?",
        a: "Yes — mild dehydration can raise creatinine and urea temporarily. Test when normally hydrated for the most representative result.",
      },
    ],
    compareHref: "/compare?category=kidney",
    category: "Organ Health",
  },
  {
    slug: "crp-test",
    keyword: "CRP Test (Inflammation)",
    title: "CRP Test UK — Inflammation Blood Test Compared",
    description:
      "Compare private CRP and hs-CRP tests in the UK. Measure inflammation and cardiovascular risk from accredited UK labs.",
    strapline: "C-reactive protein — the most common marker of inflammation in the blood.",
    intro:
      "A CRP test measures C-reactive protein in your blood, a marker that rises with inflammation. A high-sensitivity CRP (hs-CRP) test can also be used as part of cardiovascular risk assessment.",
    biomarkers: [
      { name: "CRP", what: "Standard C-reactive protein — rises with infection, injury or chronic inflammation." },
      { name: "hs-CRP", what: "High-sensitivity CRP — used to detect low-grade inflammation linked to cardiovascular risk." },
    ],
    whyItMatters: [
      "Chronic low-grade inflammation is linked to cardiovascular disease and metabolic conditions.",
      "Acute infections or injuries can raise CRP dramatically — clinicians usually retest once recovered.",
      "Results are most useful alongside other markers such as cholesterol and HbA1c.",
    ],
    howItWorks: [
      "Order CRP or hs-CRP as a standalone test or as part of a wellness panel.",
      "Avoid testing within 1–2 weeks of an acute illness or injury for a true baseline.",
      "Results are typically returned in 2–4 working days.",
    ],
    faqs: [
      {
        q: "What is a normal CRP level?",
        a: "Standard CRP is usually under 5 mg/L in healthy adults. For hs-CRP, a level under 1 mg/L is considered low cardiovascular risk, 1–3 mg/L moderate risk and above 3 mg/L higher risk.",
      },
      {
        q: "What raises CRP?",
        a: "Infection, injury, autoimmune conditions, obesity and smoking can all raise CRP. Even an intense workout can transiently elevate it.",
      },
    ],
    compareHref: "/tests/heart",
    category: "Inflammation & Immunity",
  },
  {
    slug: "autoimmune-blood-test",
    keyword: "Autoimmune Blood Test",
    title: "Autoimmune Blood Test UK — ANA, RF, TPO Compared",
    description:
      "Compare private autoimmune blood tests in the UK. Screen for ANA, rheumatoid factor, TPO and coeliac antibodies from accredited labs.",
    strapline: "How autoimmune conditions are typically screened in private UK testing.",
    intro:
      "Autoimmune blood tests look for antibodies your immune system has produced against your own tissues. Common screening tests include ANA (antinuclear antibodies), rheumatoid factor, anti-CCP, TPO antibodies and coeliac screening.",
    biomarkers: [
      { name: "ANA", what: "A general screen for autoimmune disease, often raised in lupus and related conditions." },
      { name: "Rheumatoid factor", what: "Used to help assess rheumatoid arthritis." },
      { name: "Anti-CCP", what: "A more specific marker for rheumatoid arthritis than rheumatoid factor alone." },
      { name: "TPO antibodies", what: "Raised in autoimmune thyroid disease such as Hashimoto's." },
      { name: "tTG IgA", what: "First-line screen for coeliac disease." },
    ],
    whyItMatters: [
      "Autoimmune conditions are common and frequently underdiagnosed, particularly in women.",
      "Antibody tests are screening tools — diagnosis always requires clinical assessment.",
      "Some antibodies can be positive in healthy people, so context matters.",
    ],
    howItWorks: [
      "Order a targeted autoimmune panel based on your symptoms (joints, thyroid, gut, skin).",
      "Most panels require a venous blood draw at a clinic rather than a finger-prick.",
      "Results are typically returned in 3–7 working days with clinician comments.",
    ],
    faqs: [
      {
        q: "Can a single test diagnose an autoimmune condition?",
        a: "No. Antibody tests support diagnosis but are never used in isolation. A clinician will combine symptoms, examination and additional investigations before any diagnosis is made.",
      },
      {
        q: "Can I have a positive ANA but be healthy?",
        a: "Yes — a low-titre positive ANA is found in a small proportion of healthy adults. The result needs interpretation in clinical context.",
      },
    ],
    compareHref: "/test/general-health",
    category: "Inflammation & Immunity",
  },
  {
    slug: "finger-prick-blood-test",
    keyword: "Finger-Prick Blood Test",
    title: "Finger-Prick Blood Test UK — How It Works & What to Test",
    description:
      "Compare private finger-prick blood tests in the UK. Convenient home kits from accredited labs covering thyroid, hormones, vitamins and more.",
    strapline: "Convenient home testing — what works on a finger-prick sample and what doesn't.",
    intro:
      "A finger-prick blood test lets you collect a small blood sample at home, then post it to an accredited UK lab. Most common biomarkers — thyroid, vitamins, hormones, cholesterol and HbA1c — can be measured reliably from a finger-prick sample.",
    biomarkers: [
      { name: "Thyroid (TSH, FT4, FT3)", what: "Routinely tested via finger-prick by UKAS-accredited labs." },
      { name: "Vitamins (D, B12, folate)", what: "All commonly tested from a small finger-prick sample." },
      { name: "Hormones", what: "Testosterone, oestradiol, progesterone and others available via home kit." },
      { name: "HbA1c & cholesterol", what: "Used to monitor diabetes risk and cardiovascular health." },
    ],
    whyItMatters: [
      "Home finger-prick kits remove the need to visit a clinic for many tests.",
      "Some tests — including most autoimmune panels and full hormone profiles — still require a venous sample.",
      "Following the collection instructions carefully avoids haemolysis (damaged sample) and a wasted kit.",
    ],
    howItWorks: [
      "Order a kit online — it arrives by post within 1–3 working days.",
      "Warm your hands, prick the side of a finger using the supplied lancet, and fill the small tube.",
      "Post the sample using the included pre-paid envelope. Results are typically returned in 2–5 working days.",
    ],
    faqs: [
      {
        q: "Are finger-prick tests as accurate as venous tests?",
        a: "For most common biomarkers, yes — UKAS-accredited labs validate finger-prick samples against venous standards. A small number of tests are still preferred from a venous draw.",
      },
      {
        q: "What if I can't get enough blood?",
        a: "Most providers will send a replacement kit free of charge if the lab can't process your sample due to insufficient volume or haemolysis.",
      },
    ],
    compareHref: "/at-home-tests",
    category: "General",
  },
  {
    slug: "female-hormone-test",
    keyword: "Female Hormone Test",
    title: "Female Hormone Test UK — Compare Private Tests",
    description:
      "Compare private female hormone tests in the UK. Oestradiol, progesterone, LH, FSH, AMH and prolactin from CQC-regulated providers.",
    strapline: "Oestradiol, progesterone, LH, FSH, AMH and prolactin — what each measures.",
    intro:
      "A female hormone test measures the hormones that regulate your menstrual cycle, fertility and perimenopause. The right panel and timing depend on what you're trying to understand — cycle health, fertility, perimenopause or PCOS.",
    biomarkers: [
      { name: "Oestradiol", what: "The main form of oestrogen — changes across the cycle and falls in menopause." },
      { name: "Progesterone", what: "Rises after ovulation; tested mid-luteal phase to confirm ovulation." },
      { name: "LH & FSH", what: "Pituitary hormones that drive the cycle. Raised FSH is a marker of perimenopause." },
      { name: "AMH", what: "A marker of ovarian reserve, commonly used in fertility assessment." },
      { name: "Prolactin", what: "Raised levels can disrupt the cycle and affect fertility." },
    ],
    whyItMatters: [
      "Cycle timing matters — most hormone tests are best collected on specific days of your cycle.",
      "A single result rarely tells the full story; clinicians often look at multiple hormones together.",
      "Symptoms (cycle changes, mood, sleep, hot flushes) are essential context alongside lab values.",
    ],
    howItWorks: [
      "Pick the panel that matches your goal — cycle health, fertility or perimenopause.",
      "Collect at the recommended cycle day (often day 3 for LH/FSH, day 21 for progesterone).",
      "Results are typically returned in 2–5 working days with clinician interpretation.",
    ],
    faqs: [
      {
        q: "When in my cycle should I test hormones?",
        a: "LH, FSH and oestradiol are usually tested on days 2–5 of your cycle. Progesterone is tested 7 days after ovulation (typically around day 21 of a 28-day cycle). AMH can be tested at any time.",
      },
      {
        q: "Can a blood test diagnose perimenopause?",
        a: "Hormone tests can support the picture but are not used in isolation. Perimenopause is primarily diagnosed clinically from symptoms in women aged 45 or over.",
      },
    ],
    compareHref: "/tests/womens-health",
    category: "Hormones",
  },
];

export const guidesBySlug = (slug: string) =>
  biomarkerGuides.find((g) => g.slug === slug);

export const guideCategories = Array.from(
  new Set(biomarkerGuides.map((g) => g.category))
);
