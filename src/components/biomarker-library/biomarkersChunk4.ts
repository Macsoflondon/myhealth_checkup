// biomarkersChunk4.ts — chunk 4 of 15 — myhealth checkup Biomarker Library
export const biomarkersChunk4 = [
  {
    id: "osteocalcin", name: "Osteocalcin", abbr: "OC", category: "Bone Health",
    icon: "🦴", what: "Osteocalcin is the most abundant non-collagen protein in bone, synthesised exclusively by osteoblasts (bone-forming cells). It binds calcium and is a direct marker of active bone formation. Beyond bone, osteocalcin acts as a hormone — stimulating insulin secretion, improving insulin sensitivity, and influencing energy metabolism.", why: "Used in metabolic bone disease assessment, osteoporosis management, and monitoring treatment response to bone-building therapies. Low osteocalcin may indicate impaired bone formation from vitamin D or vitamin K deficiency.",
    unit: "ng/mL",
    ranges: {
      male: { low: { range: "< 10 ng/mL", label: "Low", meaning: "Reduced bone formation — vitamin D deficiency, hypogonadism, glucocorticoid excess." }, normal: { range: "10–40 ng/mL", label: "Normal" }, high: { range: "> 40 ng/mL", label: "High", meaning: "Increased bone turnover — Paget's disease, healing fractures, hyperparathyroidism, or hyperthyroidism." } },
      female: { low: { range: "< 8 ng/mL", label: "Low (pre-menopausal)", meaning: "Reduced bone formation — vitamin D or K deficiency, hypo-oestrogenism, glucocorticoid use." }, normal: { range: "8–35 ng/mL", label: "Normal (pre-menopausal)" }, borderline: { range: "8–45 ng/mL", label: "Normal (post-menopausal)", meaning: "Post-menopausal bone turnover is physiologically higher." }, high: { range: "> 45 ng/mL (post-menopausal)", label: "High", meaning: "Accelerated bone turnover — osteoporosis risk without treatment. Paget's disease if very elevated." } }
    },
    tips: ["Osteocalcin is vitamin K-dependent — deficiency impairs its carboxylation and function even when total levels appear normal.", "Always measure CTx (bone resorption marker) alongside osteocalcin (formation marker) for a complete picture of bone turnover.", "Glucocorticoids (prednisolone) rapidly and markedly suppress osteocalcin — major mechanism of steroid-induced osteoporosis.", "Osteocalcin rises 3–6 months after starting bone-building treatment — useful for early response monitoring."],
    relatedTests: ["Bone Profile", "CTx (Bone Resorption)", "NTx", "Vitamin D", "PTH", "Calcium"],
  },
  {
    id: "ctx", name: "CTx (C-Telopeptide of Type I Collagen)", abbr: "CTx", category: "Bone Health",
    icon: "🦴", what: "CTx (beta-C-terminal telopeptide of type I collagen) is released into blood when osteoclasts break down bone collagen during bone resorption. It is the most widely used marker of bone resorption rate and is measured in fasting morning blood (it follows a diurnal rhythm — highest in early morning).", why: "CTx is used to monitor the bone-protective effects of anti-resorptive therapies (bisphosphonates: alendronate, zoledronate; denosumab) in osteoporosis and bone metastasis treatment. A significant fall in CTx confirms effective drug action. It also helps assess fracture risk and identify rapid bone losers.",
    unit: "ng/mL",
    ranges: {
      male: { normal: { range: "0.10–0.57 ng/mL (fasting AM)", label: "Normal" }, high: { range: "> 0.57 ng/mL", label: "Elevated Resorption", meaning: "Bone breakdown exceeding normal — high fracture risk, hyperparathyroidism, hyperthyroidism, Paget's, steroid use, or bone metastases." } },
      female: { normal: { range: "0.10–0.57 ng/mL (pre-menopausal, fasting AM)", label: "Normal (pre-menopausal)" }, borderline: { range: "0.10–0.57 ng/mL", label: "Normal (post-menopausal)" }, high: { range: "> 0.57 ng/mL (post-menopausal)", label: "Elevated", meaning: "Post-menopausal bone loss. Strongly indicates need for anti-resorptive therapy." } }
    },
    tips: ["CTx must be measured fasting (overnight), before 10am — it drops significantly after eating.", "A 50–75% reduction in CTx at 3 months confirms effective bisphosphonate or denosumab therapy.", "CTx > 1.0 ng/mL before dental procedures is a risk factor for jaw osteonecrosis in patients on bisphosphonates.", "CTx is not specific to osteoporosis — any condition with rapid bone turnover (Paget's, bone mets, hyperparathyroidism) elevates it."],
    relatedTests: ["Bone Profile", "Osteocalcin", "NTx", "DEXA Scan", "Vitamin D", "PTH"],
  },
  {
    id: "ntx", name: "NTx (N-Telopeptide)", abbr: "NTx", category: "Bone Health",
    icon: "🦴", what: "NTx (N-terminal telopeptide of type I collagen) is a cross-linked collagen fragment released during osteoclast-mediated bone resorption. Like CTx, NTx is a bone resorption marker, but it can be measured in either blood or urine (urine NTx is commonly measured as bone resorption index corrected for creatinine).", why: "NTx is used alongside CTx to monitor anti-resorptive therapy response, assess fracture risk, and evaluate bone metastasis activity. In patients with cancer, rising NTx indicates active bone destruction and predicts skeletal-related events (fractures, spinal cord compression).",
    unit: "nM BCE/mM creatinine (urine) or nM BCE (serum)",
    ranges: {
      male: { normal: { range: "3–51 nM BCE (urine)", label: "Normal" }, high: { range: "> 51 nM BCE", label: "High", meaning: "Excess bone resorption — fracture risk, malignancy, or hyperparathyroidism." } },
      female: { normal: { range: "5–65 nM BCE (urine, pre-menopausal)", label: "Normal (pre-menopausal)" }, high: { range: "> 65 nM BCE (pre-menopausal)", label: "High", meaning: "Excess resorption. In post-menopausal women, >100 is strongly associated with rapid bone loss." } }
    },
    tips: ["NTx (urine) is often used when blood tests are impractical — second morning void standardises collection.", "Serum CTx is generally more precise and reproducible than urine NTx for therapeutic monitoring.", "In cancer patients on denosumab or bisphosphonates for bone metastases, NTx monitoring guides dosing.", "Both NTx and CTx fall significantly within weeks of starting effective anti-resorptive therapy."],
    relatedTests: ["Bone Profile", "CTx", "Osteocalcin", "DEXA Scan", "Calcium", "Alkaline Phosphatase"],
  },
  {
    id: "dhea-s", name: "DHEA-S (Dehydroepiandrosterone Sulphate)", abbr: "DHEA-S", category: "Hormones",
    icon: "⚡", what: "DHEA-S is the sulphated form of DHEA (dehydroepiandrosterone), the most abundant steroid hormone in the body. It is produced almost exclusively by the adrenal cortex and is a precursor for both oestrogen and testosterone. DHEA-S levels are stable throughout the day (no diurnal variation), making it a reliable adrenal androgen marker.", why: "DHEA-S declines significantly with age (by up to 80% between age 25 and 75 — termed adrenopause). Low DHEA-S is associated with fatigue, low libido, poor mood, and impaired immune function. Elevated DHEA-S in women indicates excess adrenal androgen production — a feature of PCOS, congenital adrenal hyperplasia, or adrenal tumours.",
    unit: "µmol/L",
    ranges: {
      male: { low: { range: "< 3.0 µmol/L (under 40)", label: "Low", meaning: "Adrenal insufficiency, adrenopause, or chronic illness." }, normal: { range: "3.0–13.0 µmol/L (20–40 years)", label: "Normal (young adult)" }, borderline: { range: "1.0–5.0 µmol/L (> 60 years)", label: "Normal (older adult)", meaning: "Physiological decline with age." }, high: { range: "> 13.0 µmol/L", label: "High", meaning: "Adrenal hyperplasia, adrenal carcinoma, or exogenous DHEA supplementation." } },
      female: { low: { range: "< 2.0 µmol/L (under 40)", label: "Low", meaning: "Adrenal insufficiency, adrenopause, Addison's disease." }, normal: { range: "2.0–9.0 µmol/L (20–40 years)", label: "Normal (young adult)" }, high: { range: "> 9.0 µmol/L", label: "High", meaning: "PCOS (adrenal component), congenital adrenal hyperplasia, or adrenal tumour." } }
    },
    tips: ["DHEA-S doesn't require fasting or time-of-day standardisation — a practical advantage over other hormones.", "DHEA supplementation is widely used but evidence for clinical benefit is modest — discuss with an endocrinologist.", "In PCOS, elevated DHEA-S (> 9 µmol/L) identifies the adrenal androgen component alongside elevated total testosterone.", "Adrenal carcinoma causes extremely high DHEA-S (often > 30–50 µmol/L) alongside other androgens."],
    relatedTests: ["Adrenal Panel", "Total Testosterone", "Androstenedione", "17-OH Progesterone", "Cortisol"],
  },
  {
    id: "cortisol-diurnal", name: "Cortisol (Diurnal Profile)", abbr: "CORT", category: "Hormones",
    icon: "🧠", what: "Cortisol is the primary glucocorticoid hormone produced by the adrenal cortex under ACTH stimulation. It follows a pronounced diurnal rhythm — highest at 8–9am (morning peak) and lowest at midnight. Morning cortisol reflects adrenal reserve; evening cortisol should be very low. Loss of the diurnal rhythm — with persistently elevated evening cortisol — is the hallmark of Cushing's syndrome.", why: "Cortisol testing diagnoses Cushing's syndrome (cortisol excess — from a pituitary adenoma, adrenal tumour, or ectopic ACTH), Addison's disease (cortisol deficiency), and monitors steroid-induced adrenal suppression. It is also elevated in severe physiological stress, psychiatric illness, and chronic anxiety.",
    unit: "nmol/L",
    ranges: {
      both: {
        stages: [
          { stage: "Morning (8–9am)", range: "140–700 nmol/L", meaning: "Normal circadian peak. < 140 nmol/L suggests adrenal insufficiency; > 700 warrants investigation for Cushing's." },
          { stage: "Evening (9–11pm)", range: "< 50 nmol/L (serum)", meaning: "Should be very low — loss of diurnal variation (high evening cortisol) is the most sensitive marker of Cushing's syndrome." },
          { stage: "Late-night salivary", range: "< 4 nmol/L (saliva, 11pm)", meaning: "Best screening test for Cushing's syndrome. Preserved midnight saliva cortisol < 4 nmol/L excludes Cushing's with high sensitivity." },
        ]
      }
    },
    tips: ["The 9am cortisol is the primary adrenal sufficiency screen — < 100 nmol/L confirms adrenal insufficiency; 100–140 requires further testing (SST).", "24-hour urine free cortisol (UFC) provides integrated cortisol exposure — useful for Cushing's diagnosis.", "Midnight saliva cortisol is the most convenient and sensitive Cushing's screen — can be self-collected at home.", "Oral contraceptives raise cortisol-binding globulin and total cortisol — can falsely elevate measured levels."],
    relatedTests: ["Adrenal Panel", "ACTH", "DHEA-S", "24hr UFC", "Dexamethasone Suppression Test"],
  },
  {
    id: "gh", name: "Growth Hormone (GH)", abbr: "GH", category: "Hormones",
    icon: "🧠", what: "Growth hormone (somatotropin) is produced by the anterior pituitary gland. It is released in pulses throughout the day, with the largest pulse occurring 1–2 hours after sleep onset. GH stimulates IGF-1 production in the liver (which mediates most of GH's anabolic effects), bone growth, protein synthesis, fat breakdown, and blood glucose regulation.", why: "GH deficiency in adults causes fatigue, poor body composition (increased fat, reduced muscle), reduced bone density, and impaired quality of life. Excess GH causes acromegaly (in adults) — progressive enlargement of extremities, facial features, and internal organs, with increased cardiovascular risk. GH should not be tested as a random level — IGF-1 is the preferred screening test for both excess and deficiency.",
    unit: "µg/L (mIU/L)",
    ranges: {
      both: {
        note: "Random GH is meaningless — GH is released in pulses and can be undetectable between pulses in healthy people. Always measure IGF-1 first; use stimulation/suppression tests for diagnosis.",
        stages: [
          { stage: "Acromegaly (excess)", range: "GH > 1 µg/L after 75g glucose OGTT", meaning: "Failure to suppress GH after glucose indicates autonomous secretion — acromegaly until proven otherwise." },
          { stage: "GH deficiency", range: "GH < 3 µg/L on stimulation testing", meaning: "Impaired GH secretory reserve — adult GH deficiency. See stimulation test results." },
        ]
      }
    },
    tips: ["Never use a random GH measurement to diagnose GH disorders — use IGF-1 as the initial screening test.", "Acromegaly: GH >1 µg/L after OGTT (glucose should suppress GH in healthy individuals).", "GH deficiency in adults requires two stimulation tests (ITT or GHRH-arginine) for diagnosis — guidelines vary by country.", "Obesity suppresses GH pulsatility — overweight individuals may have falsely low IGF-1 and GH peaks."],
    relatedTests: ["Hormonal Panel", "IGF-1", "IGF-BP3", "Pituitary MRI", "OGTT for acromegaly"],
  },
  {
    id: "igf-1", name: "Insulin-Like Growth Factor 1", abbr: "IGF-1", category: "Hormones",
    icon: "🧠", what: "IGF-1 (insulin-like growth factor 1, also called somatomedin C) is produced primarily by the liver in response to growth hormone (GH). Unlike GH (which is released in unpredictable pulses), IGF-1 has a stable half-life of ~15 hours and reflects integrated GH activity over the preceding days to weeks — making it the preferred screening test for GH disorders.", why: "IGF-1 is elevated in acromegaly (excess GH from a pituitary adenoma) causing progressive facial and extremity enlargement, cardiovascular disease, and diabetes. Low IGF-1 indicates GH deficiency, severe malnutrition, liver disease, or hypothyroidism. IGF-1 is also increasingly studied as a longevity marker — with both very low and very high levels associated with increased mortality.",
    unit: "nmol/L (or ng/mL — lab-specific)",
    ranges: {
      both: {
        note: "IGF-1 reference ranges are highly age-dependent — levels peak in adolescence and decline significantly with age.",
        stages: [
          { stage: "Adults (20–30 years)", range: "16–26 nmol/L", meaning: "Normal young adult range." },
          { stage: "Adults (40–50 years)", range: "10–22 nmol/L", meaning: "Age-appropriate normal — compare to age-matched reference range." },
          { stage: "Adults (> 60 years)", range: "7–18 nmol/L", meaning: "Physiologically lower — compare to age-specific reference." },
          { stage: "Elevated for age", range: "Above age-specific 97.5th centile", meaning: "Acromegaly or exogenous GH use. Requires OGTT-GH suppression test to confirm." },
          { stage: "Low for age", range: "Below age-specific 2.5th centile", meaning: "GH deficiency, malnutrition, severe illness, liver disease, or hypothyroidism." },
        ]
      }
    },
    tips: ["Always compare to age-specific reference ranges — an IGF-1 of 15 nmol/L is normal at 60 but low at 25.", "Acromegaly diagnosis: elevated IGF-1 + failure to suppress GH below 1 µg/L after 75g glucose OGTT.", "Severe calorie restriction and anorexia markedly lower IGF-1 — not indicative of GH deficiency in this context.", "IGF-1 is often used in longevity medicine as a metabolic health marker — optimal range for longevity is debated."],
    relatedTests: ["Hormonal Panel", "Growth Hormone", "IGF-BP3", "IGFBP-1", "Pituitary Function Screen"],
  },
  {
    id: "prolactin", name: "Prolactin", abbr: "PRL", category: "Hormones",
    icon: "🧠", what: "Prolactin is a hormone produced by the anterior pituitary gland. Its primary physiological role is stimulating breast milk production after childbirth. In men and non-pregnant/non-lactating women, prolactin at elevated levels suppresses GnRH, reducing LH and FSH — inhibiting testosterone production in men and oestradiol in women.", why: "Elevated prolactin (hyperprolactinaemia) causes infertility, irregular or absent periods in women, and reduced libido and erectile dysfunction in men. The most common cause is a pituitary prolactinoma (benign adenoma) — which is highly treatable with dopamine agonists (cabergoline, bromocriptine). Prolactin is also elevated by many medications, hypothyroidism, and stress.",
    unit: "mU/L",
    ranges: {
      male: { normal: { range: "< 450 mU/L", label: "Normal" }, borderline: { range: "450–1000 mU/L", label: "Mildly Elevated", meaning: "Stress (macroprolactin), medication effect (antipsychotics, metoclopramide), or hypothyroidism." }, high: { range: "> 1000 mU/L", label: "Elevated", meaning: "Investigate for prolactinoma — MRI pituitary required. Also consider medication-related causes." }, veryHigh: { range: "> 5000 mU/L", label: "Very High", meaning: "Almost certainly a prolactinoma (macroprolactinoma if > 5000). Dopamine agonist therapy highly effective." } },
      female: { normal: { range: "< 600 mU/L (non-pregnant)", label: "Normal" }, borderline: { range: "600–1500 mU/L", label: "Mildly Elevated", meaning: "Stress, medication, macroprolactin (inactive form), or hypothyroidism." }, high: { range: "> 1500 mU/L", label: "Elevated", meaning: "Investigate for prolactinoma. Check TSH, medications. MRI pituitary if persists." }, veryHigh: { range: "> 5000 mU/L", label: "Very High", meaning: "Likely macroprolactinoma. Cabergoline first-line — highly effective." } }
    },
    tips: ["Macroprolactin (biologically inactive prolactin polymer) causes falsely elevated results — check with PEG precipitation test if clinically asymptomatic.", "Many common drugs raise prolactin: antipsychotics, metoclopramide, domperidone, SSRIs, opioids.", "Cabergoline (twice-weekly) is highly effective — normalises prolactin and shrinks prolactinomas in >90% of cases.", "High prolactin suppresses sex hormones — treat the prolactin, and testosterone/oestradiol often recover spontaneously."],
    relatedTests: ["Pituitary Panel", "TSH", "Testosterone / Oestradiol", "LH", "FSH", "Pituitary MRI"],
  },
  {
    id: "shbg", name: "Sex Hormone-Binding Globulin", abbr: "SHBG", category: "Hormones",
    icon: "⚡", what: "SHBG is a glycoprotein produced by the liver that binds tightly to testosterone and oestradiol in the blood, rendering them biologically inactive. Only the small free (unbound) fraction of sex hormones can enter cells and exert their effects. SHBG is regulated by insulin, thyroid hormone, oestrogens, and androgens.", why: "SHBG is the critical denominator for calculating free testosterone and free oestradiol. High SHBG (common in ageing, hyperthyroidism, liver disease, or OCP use) reduces bioavailable testosterone — causing symptomatic androgen deficiency in men despite 'normal' total testosterone. Low SHBG (in obesity, metabolic syndrome, hypothyroidism, PCOS) increases free testosterone — contributing to PCOS symptoms.",
    unit: "nmol/L",
    ranges: {
      male: { low: { range: "< 15 nmol/L", label: "Low", meaning: "Metabolic syndrome, obesity, hypothyroidism, or anabolic steroid use. High free testosterone — possible PCOS equivalent in men." }, normal: { range: "15–55 nmol/L", label: "Normal" }, high: { range: "> 55 nmol/L", label: "High", meaning: "Ageing, hyperthyroidism, liver disease, HIV, oestrogen exposure. Free testosterone is reduced — symptomatic androgen deficiency possible despite normal total testosterone." } },
      female: { low: { range: "< 25 nmol/L", label: "Low", meaning: "Obesity, PCOS, insulin resistance, or hypothyroidism. High free testosterone — androgenic symptoms." }, normal: { range: "25–100 nmol/L", label: "Normal" }, high: { range: "> 100 nmol/L", label: "High", meaning: "OCP use (OCP raises SHBG markedly), hyperthyroidism, liver disease. Reduced bioavailable testosterone and oestradiol." } }
    },
    tips: ["SHBG is essential for calculating free testosterone and free androgen index — always order alongside testosterone.", "The OCP raises SHBG 3–4 fold — may cause persistent low libido and sexual dysfunction even after stopping.", "Low SHBG is a marker of insulin resistance and metabolic syndrome — often predates glucose abnormality.", "Alcohol lowers SHBG, while oestrogens raise it."],
    relatedTests: ["Testosterone Test", "Free Testosterone", "Total Testosterone", "Albumin", "Insulin"],
  },
  {
    id: "lh", name: "Luteinising Hormone", abbr: "LH", category: "Reproductive Health",
    icon: "🌸", what: "LH (luteinising hormone) is produced by the anterior pituitary gland. In women, a mid-cycle LH surge triggers ovulation. In men, LH stimulates testicular Leydig cells to produce testosterone. LH is controlled by GnRH from the hypothalamus and by negative feedback from sex hormones.", why: "LH is essential for diagnosing and categorising reproductive disorders. In women, high LH is a feature of polycystic ovary syndrome (PCOS — elevated LH:FSH ratio) and premature ovarian insufficiency. In men, elevated LH indicates primary hypogonadism (testicular failure). Low LH indicates hypothalamic or pituitary failure (secondary hypogonadism).",
    unit: "IU/L",
    ranges: {
      male: { low: { range: "< 1.5 IU/L", label: "Low", meaning: "Secondary hypogonadism — pituitary or hypothalamic failure. Low testosterone alongside low LH/FSH is secondary." }, normal: { range: "1.5–9.3 IU/L", label: "Normal" }, high: { range: "> 9.3 IU/L", label: "High", meaning: "Primary hypogonadism (testicular failure) — Klinefelter's syndrome, orchitis, chemotherapy, surgical castration. High LH drives failing testes maximally." } },
      female: {
        phases: [
          { phase: "Follicular phase", range: "1.0–11.4 IU/L" },
          { phase: "Ovulatory surge", range: "17.6–119 IU/L" },
          { phase: "Luteal phase", range: "0.5–14.7 IU/L" },
          { phase: "Post-menopausal", range: "10.6–58.5 IU/L" },
        ],
        note: "Elevated LH in the follicular phase, especially with elevated LH:FSH ratio > 2:1, is a feature of PCOS."
      }
    },
    tips: ["Always interpret LH alongside FSH and testosterone/oestradiol — the combination reveals the level of the problem.", "LH:FSH ratio > 2 in the early follicular phase is a classical PCOS pattern.", "LH surge home testing kits detect the ovulation surge — peak fertility is 24–36 hours after LH peak.", "Pulsatile GnRH therapy can restart LH/FSH and fertility in hypothalamic amenorrhoea."],
    relatedTests: ["Reproductive Hormones", "FSH", "Oestradiol / Testosterone", "SHBG", "Prolactin", "AMH"],
  },
  {
    id: "fsh", name: "Follicle-Stimulating Hormone", abbr: "FSH", category: "Reproductive Health",
    icon: "🌸", what: "FSH (follicle-stimulating hormone) is produced by the anterior pituitary gland. In women, FSH stimulates ovarian follicle development and oestrogen production. In men, FSH acts on Sertoli cells to support sperm production (spermatogenesis). FSH is controlled by GnRH and by feedback from inhibin B and sex hormones.", why: "FSH is the primary marker of ovarian reserve in women — elevated FSH indicates the pituitary is working harder to stimulate declining ovarian follicle numbers. A high early-follicular phase FSH (> 10 IU/L) suggests diminished ovarian reserve and reduced fertility. In men, elevated FSH with low sperm count suggests impaired Sertoli cell function.",
    unit: "IU/L",
    ranges: {
      male: { low: { range: "< 1.5 IU/L", label: "Low", meaning: "Secondary hypogonadism — hypothalamic or pituitary origin." }, normal: { range: "1.5–12.4 IU/L", label: "Normal" }, high: { range: "> 12.4 IU/L", label: "High", meaning: "Primary testicular failure with impaired spermatogenesis. Klinefelter's syndrome if very elevated." } },
      female: {
        phases: [
          { phase: "Follicular phase", range: "2.5–10.2 IU/L" },
          { phase: "Ovulatory surge", range: "3.4–33.4 IU/L" },
          { phase: "Luteal phase", range: "1.5–9.1 IU/L" },
          { phase: "Post-menopausal", range: "23.0–116.3 IU/L" },
        ],
        note: "Elevated early-follicular FSH (> 10 IU/L, day 2–4 of cycle) indicates diminished ovarian reserve."
      }
    },
    tips: ["FSH > 10 IU/L on day 2–4 of cycle is a red flag for diminished ovarian reserve — consider fertility specialist referral.", "High FSH post-menopause is physiologically expected — the pituitary drives the exhausted ovaries maximally.", "AMH is now preferred over FSH as a marker of ovarian reserve — it is more consistent across the cycle.", "Low FSH with low testosterone in men: MRI pituitary to rule out adenoma, especially with headaches or visual disturbance."],
    relatedTests: ["Reproductive Hormones", "LH", "AMH", "Oestradiol", "Inhibin B", "Testosterone"],
  },
  {
    id: "amh", name: "Anti-Müllerian Hormone", abbr: "AMH", category: "Reproductive Health",
    icon: "🌸", what: "AMH (anti-Müllerian hormone) is produced by granulosa cells of ovarian pre-antral and small antral follicles. It is the best clinical marker of ovarian reserve — reflecting the remaining number of follicles (egg-containing structures) in the ovaries. AMH declines progressively from the early twenties onwards and reaches undetectable levels at menopause.", why: "AMH is used in fertility treatment planning (predicting IVF response), ovarian reserve assessment (counselling about natural fertility timeline), early menopause diagnosis, and monitoring after cancer treatment (assessing ovarian damage from chemotherapy). It is also elevated in PCOS, where excess small follicles secrete more AMH than normal.",
    unit: "pmol/L",
    ranges: {
      female: {
        note: "AMH declines with age — reference ranges are age-stratified. These are general guidance values.",
        stages: [
          { stage: "Very low / poor reserve", range: "< 3.6 pmol/L (< 0.5 ng/mL)", meaning: "Very limited ovarian reserve — reduced natural fertility and poor IVF response predicted." },
          { stage: "Low reserve", range: "3.6–7.9 pmol/L (0.5–1.1 ng/mL)", meaning: "Below average reserve for age. Reduced time window for conception." },
          { stage: "Normal reserve", range: "8.0–28.6 pmol/L (1.1–4.0 ng/mL)", meaning: "Good ovarian reserve — reassuring for fertility planning." },
          { stage: "High (PCOS range)", range: "> 35 pmol/L (> 4.9 ng/mL)", meaning: "Elevated — consistent with PCOS (excess small follicles). Also a risk factor for ovarian hyperstimulation in IVF." },
        ]
      },
      male: { normal: { range: "11–45 pmol/L (varies by age)", label: "Normal", meaning: "Produced by Sertoli cells — used in male hypogonadism evaluation." }, low: { range: "< 11 pmol/L", label: "Low (males)", meaning: "Impaired Sertoli cell function — reduced sperm production." } }
    },
    tips: ["AMH is the most cycle-stable fertility hormone — can be tested on any day of the menstrual cycle.", "AMH does not predict the quality of eggs (oocyte quality) — only quantity. Older eggs have lower quality regardless of AMH.", "Chemotherapy can dramatically reduce AMH — AMH testing before and after cancer treatment assesses ovarian damage.", "The 'egg freezing window': AMH is used to advise on timing — values < 5 pmol/L indicate limited time.", "PCOS: very high AMH is a reliable diagnostic marker alongside ultrasound and clinical features."],
    relatedTests: ["Reproductive Hormones", "FSH", "LH", "Oestradiol", "Pelvic Ultrasound (AFC)"],
  },
  {
    id: "oestradiol", name: "Oestradiol (Oestrogen E2)", abbr: "E2", category: "Reproductive Health",
    icon: "🌸", what: "Oestradiol (E2) is the most biologically potent and predominant oestrogen in pre-menopausal women, produced primarily by ovarian follicles. In men, oestradiol is produced in small quantities by aromatisation of testosterone in adipose tissue and testes. Oestradiol is essential for bone health, cardiovascular function, mood, cognition, libido, and reproductive function in both sexes.", why: "In women, oestradiol is measured to assess ovarian function, diagnose menopause, evaluate fertility, monitor hormonal contraception or HRT, and investigate symptoms of excess oestrogen (endometriosis) or deficiency (premature ovarian insufficiency). In men, elevated oestradiol causes gynaecomastia, reduced libido, and can suppress testosterone.",
    unit: "pmol/L",
    ranges: {
      male: { low: { range: "< 70 pmol/L", label: "Low", meaning: "Reduced bone protection, low libido, mood disturbance. Aromatase inhibitor use or hypogonadism." }, normal: { range: "70–210 pmol/L", label: "Normal" }, high: { range: "> 210 pmol/L", label: "High", meaning: "Gynaecomastia, sexual dysfunction. Causes: obesity (aromatisation), liver disease, oestrogen-secreting tumour, or exogenous oestrogen." } },
      female: {
        phases: [
          { phase: "Follicular phase", range: "75–1000 pmol/L" },
          { phase: "Ovulatory peak", range: "400–1800 pmol/L" },
          { phase: "Luteal phase", range: "100–600 pmol/L" },
          { phase: "Post-menopausal", range: "< 110 pmol/L" },
        ],
        note: "Very low oestradiol in a reproductive-age woman with menstrual irregularity warrants investigation for premature ovarian insufficiency (FSH + AMH + pelvic ultrasound)."
      }
    },
    tips: ["Oestradiol varies dramatically across the menstrual cycle — always note cycle day and phase when interpreting.", "Oestradiol > 200 pmol/L in a post-menopausal woman on no HRT warrants investigation for an oestrogen-secreting tumour.", "In IVF, oestradiol is used to monitor follicle development — each follicle contributes approximately 700–1000 pmol/L.", "Oestradiol is critical for bone density in both men and women — levels < 70 pmol/L in men increase fracture risk."],
    relatedTests: ["Reproductive Hormones", "FSH", "LH", "Progesterone", "SHBG", "Testosterone"],
  },
  {
    id: "progesterone", name: "Progesterone", abbr: "PROG", category: "Reproductive Health",
    icon: "🌸", what: "Progesterone is a steroid hormone produced primarily by the corpus luteum (the temporary gland formed in the ovary after ovulation), with smaller amounts from the adrenal glands. In pregnancy, the placenta becomes the main source. Progesterone prepares the uterine lining (endometrium) for embryo implantation and maintains early pregnancy.", why: "Progesterone is measured to confirm ovulation has occurred (mid-luteal progesterone > 30 nmol/L confirms ovulation), diagnose luteal phase deficiency, monitor early pregnancy, detect ectopic pregnancy (lower progesterone for gestational age), and guide progesterone supplementation in IVF cycles.",
    unit: "nmol/L",
    ranges: {
      female: {
        phases: [
          { phase: "Follicular phase (pre-ovulation)", range: "< 3 nmol/L", meaning: "Normal — progesterone is low before ovulation." },
          { phase: "Mid-luteal (day 21, 7 days after ovulation)", range: "> 30 nmol/L", meaning: "Confirms ovulation occurred. < 16 nmol/L suggests anovulation or luteal phase defect." },
          { phase: "Early pregnancy (first trimester)", range: "25–95 nmol/L", meaning: "Rising — supports pregnancy maintenance." },
        ]
      },
      male: { normal: { range: "< 2 nmol/L", label: "Normal" }, high: { range: "> 5 nmol/L", label: "Elevated", meaning: "Adrenal hyperplasia, congenital adrenal hyperplasia, or adrenal tumour." } }
    },
    tips: ["The mid-luteal progesterone (day 21 of a 28-day cycle, or 7 days after ovulation) is the standard ovulation confirmation test.", "Progesterone < 16 nmol/L on day 21 suggests anovulation — one of the most common causes of female infertility.", "In IVF, progesterone suppositories or injections (luteal phase support) are given until the placenta takes over at ~12 weeks.", "Progesterone does not reliably distinguish intrauterine from ectopic pregnancy — hCG and ultrasound are needed."],
    relatedTests: ["Reproductive Hormones", "LH", "FSH", "Oestradiol", "hCG (pregnancy test)"],
  },
];
