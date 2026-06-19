// ─────────────────────────────────────────────────────────────────────────────
// Assisted Test Finder — complete data package (drop-in)
// Single source of truth for: test records, tag taxonomy, quiz pathways,
// provider policy cards, and the recommendation scoring weights.
//
// Every test record carries per-field `verification` flags ('verified' |
// 'needs_verification') and a `source_url` so nothing unverified is ever shown
// as confirmed fact. All 10 provider policies were verified against each
// provider's own published page (June 2026).
//
// No external deps. Import directly:
//   import { TEST_RECORDS, TAG_TAXONOMY, QUIZ_CONFIG, PROVIDER_POLICIES,
//            SCORING, recommend, computeTotalExpectedCost } from "@/data/testFinderData";
// ─────────────────────────────────────────────────────────────────────────────

// ---------- enums / unions ----------
export type SampleType =
  | "finger_prick" | "venous" | "saliva" | "urine" | "stool" | "buccal_swab" | "multiple";

export type CollectionMethod =
  | "home_kit" | "clinic_appointment" | "home_visit" | "mobile_phlebotomy"
  | "third_party_phlebotomy" | "self_arranged" | "multiple";

export type CollectionFeeType =
  | "none" | "fixed" | "range" | "varies_by_location" | "patient_arranged";

export type ClinicalReviewType = "included" | "optional" | "not_included" | "not_available";

export type ClinicalProfessional =
  | "gp" | "consultant" | "clinician" | "nurse" | "clinical_scientist";

export type SexRestriction = "none" | "male_only" | "female_only";

export type VerificationState = "verified" | "needs_verification";

export type GoalTag =
  | "preventative" | "longevity" | "performance" | "weight_management"
  | "symptom_investigation" | "condition_monitoring";

export type ConditionTag =
  | "cardiovascular_risk" | "metabolic_health" | "thyroid" | "diabetes"
  | "fatigue_low_energy" | "general_health" | "prostate_health" | "male_hormones"
  | "fertility_male" | "female_hormones" | "menopause_hrt" | "gynaecology"
  | "fertility_female" | "sports_performance";

export interface VerificationFlags {
  price: VerificationState;
  biomarkers: VerificationState;
  collection_fee: VerificationState;
  clinical_review: VerificationState;
}

export interface FeeRange { min: number; max: number; }

export interface TestRecord {
  id: string;
  name: string;
  provider: string;
  price: number;
  biomarkers: number;
  turnaround_label: string;
  sample_type: SampleType;
  collection_method: CollectionMethod[];
  collection_fee_type: CollectionFeeType;
  collection_fee_amount: number | FeeRange | null;
  clinical_review_type: ClinicalReviewType;
  clinical_review_professional?: ClinicalProfessional;
  clinical_review_fee: number;
  goal_tags: GoalTag[];
  condition_tags: ConditionTag[];
  sex_restriction: SexRestriction;
  book_url: string;
  source_url?: string;
  verification: VerificationFlags;
}

const v = (
  price: VerificationState, biomarkers: VerificationState,
  collection_fee: VerificationState, clinical_review: VerificationState,
): VerificationFlags => ({ price, biomarkers, collection_fee, clinical_review });
const V: VerificationState = "verified";
const N: VerificationState = "needs_verification";

// ─────────────────────────────────────────────────────────────────────────────
// TEST RECORDS — verified seed (17 hero tests across all 10 providers)
// ─────────────────────────────────────────────────────────────────────────────
export const TEST_RECORDS: TestRecord[] = [
  { id: "thriva-metabolic", name: "Metabolic Health", provider: "Thriva", price: 96, biomarkers: 19, turnaround_label: "~48 hrs", sample_type: "finger_prick", collection_method: ["home_kit"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_professional: "gp", clinical_review_fee: 0, goal_tags: ["preventative", "longevity", "condition_monitoring"], condition_tags: ["metabolic_health", "cardiovascular_risk", "diabetes", "general_health"], sex_restriction: "none", book_url: "https://thriva.co/shop/blood-test-packages/metabolic-health-blood-test", source_url: "https://thriva.co/hub/blood-tests/blood-tests-different-types-and-what-to-expect", verification: v(N, V, V, V) },
  { id: "thriva-cardio", name: "Cardiovascular Health", provider: "Thriva", price: 118, biomarkers: 22, turnaround_label: "~48 hrs", sample_type: "finger_prick", collection_method: ["home_kit"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_professional: "gp", clinical_review_fee: 0, goal_tags: ["preventative", "longevity"], condition_tags: ["cardiovascular_risk", "metabolic_health", "general_health"], sex_restriction: "none", book_url: "https://thriva.co/shop/blood-test-packages/cardiovascular-health-blood-test", source_url: "https://thriva.co/hub/blood-tests/blood-tests-different-types-and-what-to-expect", verification: v(N, V, V, V) },
  { id: "thriva-thyroid", name: "Advanced Thyroid Function", provider: "Thriva", price: 105, biomarkers: 6, turnaround_label: "~48 hrs", sample_type: "finger_prick", collection_method: ["home_kit"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_professional: "gp", clinical_review_fee: 0, goal_tags: ["symptom_investigation", "condition_monitoring"], condition_tags: ["thyroid", "fatigue_low_energy"], sex_restriction: "none", book_url: "https://thriva.co/shop/blood-test-packages/advanced-thyroid-function-test", source_url: "https://thriva.co/hub/blood-tests/blood-tests-different-types-and-what-to-expect", verification: v(N, V, V, V) },
  { id: "medichecks-male-hormone", name: "Male Hormone Check", provider: "Medichecks", price: 99, biomarkers: 11, turnaround_label: "2–5 days", sample_type: "venous", collection_method: ["self_arranged", "clinic_appointment", "home_visit"], collection_fee_type: "range", collection_fee_amount: { min: 0, max: 59 }, clinical_review_type: "included", clinical_review_professional: "gp", clinical_review_fee: 0, goal_tags: ["symptom_investigation", "performance"], condition_tags: ["male_hormones", "fatigue_low_energy"], sex_restriction: "male_only", book_url: "https://www.medichecks.com/products/male-hormone-check-blood-test", source_url: "https://support.medichecks.com/hc/en-gb/articles/30837564263581-How-to-place-an-order-on-the-website", verification: v(N, N, V, V) },
  { id: "medichecks-cholesterol", name: "Cholesterol & Lipids", provider: "Medichecks", price: 39, biomarkers: 7, turnaround_label: "2–4 days", sample_type: "finger_prick", collection_method: ["home_kit"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_professional: "gp", clinical_review_fee: 0, goal_tags: ["preventative", "condition_monitoring"], condition_tags: ["cardiovascular_risk", "metabolic_health"], sex_restriction: "none", book_url: "https://www.medichecks.com/products/cholesterol-blood-test", source_url: "https://support.medichecks.com/hc/en-gb/articles/30837564263581-How-to-place-an-order-on-the-website", verification: v(N, V, V, V) },
  { id: "lola-vital-56", name: "Vital Check 56", provider: "Lola Health", price: 155, biomarkers: 56, turnaround_label: "~4 days", sample_type: "venous", collection_method: ["home_visit", "clinic_appointment"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_professional: "clinician", clinical_review_fee: 0, goal_tags: ["preventative", "longevity", "weight_management"], condition_tags: ["general_health", "metabolic_health", "thyroid", "cardiovascular_risk"], sex_restriction: "none", book_url: "https://lolahealth.com", source_url: "https://lolahealth.com", verification: v(V, V, V, V) },
  { id: "lola-core-45", name: "Core Health 45", provider: "Lola Health", price: 119, biomarkers: 45, turnaround_label: "~4 days", sample_type: "venous", collection_method: ["home_visit", "clinic_appointment"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_professional: "clinician", clinical_review_fee: 0, goal_tags: ["preventative", "longevity"], condition_tags: ["general_health", "metabolic_health", "thyroid"], sex_restriction: "none", book_url: "https://lolahealth.com", source_url: "https://lolahealth.com", verification: v(N, V, V, V) },
  { id: "lhc-essential-mot", name: "Essential Health MOT", provider: "London Health Company", price: 34, biomarkers: 16, turnaround_label: "24–48 hrs", sample_type: "finger_prick", collection_method: ["home_kit"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "not_included", clinical_review_fee: 0, goal_tags: ["preventative", "weight_management"], condition_tags: ["general_health", "cardiovascular_risk", "metabolic_health"], sex_restriction: "none", book_url: "https://londonhealthcompany.co.uk/products/general-health-blood-test-15", source_url: "https://www.londonhealthcompany.co.uk", verification: v(V, V, V, V) },
  { id: "lhc-male-hormone", name: "Male Hormone Blood Test", provider: "London Health Company", price: 49, biomarkers: 4, turnaround_label: "24–48 hrs", sample_type: "finger_prick", collection_method: ["home_kit"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "not_included", clinical_review_fee: 0, goal_tags: ["symptom_investigation", "performance"], condition_tags: ["male_hormones"], sex_restriction: "male_only", book_url: "https://londonhealthcompany.co.uk", source_url: "https://www.londonhealthcompany.co.uk", verification: v(N, V, V, V) },
  { id: "btl-full-vip", name: "FULL LONDON VIP Blood Test", provider: "Blood Tests London", price: 159, biomarkers: 55, turnaround_label: "~3 days", sample_type: "venous", collection_method: ["clinic_appointment"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "optional", clinical_review_professional: "gp", clinical_review_fee: 0, goal_tags: ["preventative", "longevity"], condition_tags: ["general_health", "cardiovascular_risk", "metabolic_health", "thyroid"], sex_restriction: "none", book_url: "https://bloodtestslondon.com/products/full-london-health-screen-plus-v", source_url: "https://bloodtestslondon.com", verification: v(V, V, V, V) },
  { id: "btl-fbc", name: "Full Blood Count Profile", provider: "Blood Tests London", price: 90.37, biomarkers: 17, turnaround_label: "~1 day", sample_type: "venous", collection_method: ["clinic_appointment"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "optional", clinical_review_professional: "gp", clinical_review_fee: 0, goal_tags: ["condition_monitoring"], condition_tags: ["general_health"], sex_restriction: "none", book_url: "https://bloodtestslondon.com", source_url: "https://bloodtestslondon.com", verification: v(V, V, V, V) },
  { id: "md-health-screen", name: "Health Screening Profile", provider: "Medical Diagnosis", price: 79, biomarkers: 27, turnaround_label: "Next day", sample_type: "venous", collection_method: ["clinic_appointment"], collection_fee_type: "fixed", collection_fee_amount: 20, clinical_review_type: "not_included", clinical_review_fee: 0, goal_tags: ["preventative", "condition_monitoring"], condition_tags: ["general_health", "cardiovascular_risk", "thyroid", "metabolic_health"], sex_restriction: "none", book_url: "https://www.medical-diagnosis.co.uk/exam/profiles/health-screening-profile/", source_url: "https://www.medical-diagnosis.co.uk/exam/profiles/health-screening-profile/", verification: v(N, V, V, V) },
  { id: "randox-female-hormone", name: "Female Hormonal Health", provider: "Randox Health", price: 145, biomarkers: 9, turnaround_label: "Next day", sample_type: "venous", collection_method: ["clinic_appointment"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_professional: "clinician", clinical_review_fee: 0, goal_tags: ["symptom_investigation", "condition_monitoring"], condition_tags: ["female_hormones", "gynaecology", "menopause_hrt"], sex_restriction: "female_only", book_url: "https://www.randoxhealth.com", source_url: "https://www.randoxhealth.com", verification: v(N, N, V, V) },
  { id: "randox-everyman", name: "Everyman Health Check", provider: "Randox Health", price: 295, biomarkers: 120, turnaround_label: "Next day", sample_type: "venous", collection_method: ["clinic_appointment"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_professional: "clinician", clinical_review_fee: 0, goal_tags: ["preventative", "longevity", "performance"], condition_tags: ["general_health", "cardiovascular_risk", "metabolic_health", "prostate_health", "male_hormones"], sex_restriction: "male_only", book_url: "https://www.randoxhealth.com", source_url: "https://www.randoxhealth.com", verification: v(N, N, V, V) },
  { id: "goodbody-full-mot", name: "Advanced Well Person", provider: "Goodbody Clinic", price: 139, biomarkers: 50, turnaround_label: "2–3 days", sample_type: "venous", collection_method: ["clinic_appointment", "home_visit", "home_kit"], collection_fee_type: "range", collection_fee_amount: { min: 0, max: 20 }, clinical_review_type: "optional", clinical_review_professional: "gp", clinical_review_fee: 59.99, goal_tags: ["preventative", "longevity"], condition_tags: ["general_health", "cardiovascular_risk", "metabolic_health", "thyroid"], sex_restriction: "none", book_url: "https://goodbodyclinic.com", source_url: "https://goodbodyclinic.com/products/gp-consultation", verification: v(V, V, V, V) },
  { id: "lml-general", name: "General Health Profile", provider: "London Medical Laboratory", price: 89, biomarkers: 35, turnaround_label: "Next day", sample_type: "finger_prick", collection_method: ["home_kit", "clinic_appointment"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_professional: "gp", clinical_review_fee: 0, goal_tags: ["preventative", "condition_monitoring"], condition_tags: ["general_health", "cardiovascular_risk", "metabolic_health"], sex_restriction: "none", book_url: "https://www.londonmedicallaboratory.com", source_url: "https://www.londonmedicallaboratory.com", verification: v(V, N, V, V) },
  { id: "clinilabs-performance", name: "Ultimate Performance Panel", provider: "Clinilabs", price: 189, biomarkers: 48, turnaround_label: "2–4 days", sample_type: "venous", collection_method: ["clinic_appointment"], collection_fee_type: "fixed", collection_fee_amount: 30, clinical_review_type: "optional", clinical_review_professional: "clinician", clinical_review_fee: 0, goal_tags: ["performance", "longevity"], condition_tags: ["sports_performance", "male_hormones", "metabolic_health", "cardiovascular_risk"], sex_restriction: "none", book_url: "https://www.clinilabs.co.uk", source_url: "https://www.clinilabs.co.uk", verification: v(N, V, V, V) },
];

// ─────────────────────────────────────────────────────────────────────────────
// TAG TAXONOMY — canonical keys + display labels (the pathways / tags)
// ─────────────────────────────────────────────────────────────────────────────
export const TAG_TAXONOMY = {
  goals: {
    preventative: "Preventative health",
    longevity: "Longevity & ageing",
    performance: "Sports & performance",
    weight_management: "Weight management",
    symptom_investigation: "Symptom investigation",
    condition_monitoring: "Condition monitoring",
  } as Record<GoalTag, string>,

  conditions: {
    cardiovascular_risk: "Heart / cardiovascular",
    metabolic_health: "Metabolic health",
    thyroid: "Thyroid",
    diabetes: "Diabetes",
    fatigue_low_energy: "Fatigue / low energy",
    general_health: "General wellbeing",
    prostate_health: "Prostate health",
    male_hormones: "Hormones / testosterone",
    fertility_male: "Fertility (male)",
    female_hormones: "Female hormones",
    menopause_hrt: "Menopause / peri",
    gynaecology: "Gynaecology",
    fertility_female: "Fertility (female)",
    sports_performance: "Sports performance",
  } as Record<ConditionTag, string>,

  bodySystems: {
    cardiovascular: { label: "Cardiovascular", conditions: ["cardiovascular_risk"] },
    metabolic_endocrine: { label: "Metabolic & endocrine", conditions: ["metabolic_health", "diabetes", "thyroid"] },
    hormonal_male: { label: "Hormonal (male)", conditions: ["male_hormones", "prostate_health", "fertility_male"] },
    hormonal_female: { label: "Hormonal (female)", conditions: ["female_hormones", "menopause_hrt", "gynaecology", "fertility_female"] },
    general_wellbeing: { label: "General wellbeing", conditions: ["general_health", "fatigue_low_energy"] },
    performance: { label: "Performance", conditions: ["sports_performance"] },
  } as Record<string, { label: string; conditions: ConditionTag[] }>,

  sampleTypeLabels: {
    finger_prick: "Finger-prick blood",
    venous: "Venous blood draw",
    saliva: "Saliva sample",
    urine: "Urine sample",
    stool: "Stool sample",
    buccal_swab: "Buccal swab",
    multiple: "Multiple sample types",
  } as Record<SampleType, string>,

  sampleTypeShort: {
    finger_prick: "Finger-prick", venous: "Venous", saliva: "Saliva",
    urine: "Urine", stool: "Stool", buccal_swab: "Swab", multiple: "Multiple",
  } as Record<SampleType, string>,

  collectionMethodLabels: {
    home_kit: "Home kit included",
    clinic_appointment: "Clinic appointment included",
    home_visit: "Home visit available",
    mobile_phlebotomy: "Mobile phlebotomy available",
    third_party_phlebotomy: "Third-party phlebotomy accepted",
    self_arranged: "Self-arranged blood draw",
    multiple: "Multiple options available",
  } as Record<CollectionMethod, string>,
};

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ CONFIG — the pathways through the assisted finder
// ─────────────────────────────────────────────────────────────────────────────
export const QUIZ_CONFIG = {
  sexOptions: [
    { key: "male", label: "Male" },
    { key: "female", label: "Female" },
    { key: "other", label: "Prefer not to say" },
  ],
  ageBands: [
    { key: "18_29", label: "18–29", midpoint: 25 },
    { key: "30_39", label: "30–39", midpoint: 35 },
    { key: "40_49", label: "40–49", midpoint: 45 },
    { key: "50_59", label: "50–59", midpoint: 55 },
    { key: "60_plus", label: "60+", midpoint: 65 },
  ],
  goalOptions: [
    { key: "preventative", label: "Preventative health" },
    { key: "longevity", label: "Longevity & ageing" },
    { key: "performance", label: "Sports & performance" },
    { key: "weight_management", label: "Weight management" },
    { key: "symptom_investigation", label: "Symptom investigation" },
    { key: "condition_monitoring", label: "Condition monitoring" },
  ],
  concernOptions: {
    base: [
      { key: "cardiovascular_risk", label: "Heart / cardiovascular" },
      { key: "metabolic_health", label: "Metabolic health" },
      { key: "thyroid", label: "Thyroid" },
      { key: "diabetes", label: "Diabetes" },
      { key: "fatigue_low_energy", label: "Fatigue / low energy" },
      { key: "general_health", label: "General wellbeing" },
    ],
    male: [
      { key: "prostate_health", label: "Prostate health" },
      { key: "male_hormones", label: "Hormones / testosterone" },
      { key: "fertility_male", label: "Fertility" },
    ],
    female: [
      { key: "female_hormones", label: "Female hormones" },
      { key: "menopause_hrt", label: "Menopause / peri" },
      { key: "gynaecology", label: "Gynaecology" },
      { key: "fertility_female", label: "Fertility" },
    ],
  },
  preferenceOptions: [
    { key: "finger_only", label: "Prefer finger-prick only" },
    { key: "clinic_ok", label: "Happy to attend a clinic" },
    { key: "home_visit", label: "Prefer a home visit" },
    { key: "no_fees", label: "No additional fees" },
    { key: "review_inc", label: "Clinical review included" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER POLICY CARDS — verified June 2026
// ─────────────────────────────────────────────────────────────────────────────
export interface ProviderPolicy {
  provider: string;
  color: string;
  verified: boolean;
  sample: string;
  collection: string;
  fees: string;
  clinical_review: string;
  source_url: string;
  collection_methods: CollectionMethod[];
  collection_fee_type: CollectionFeeType;
  collection_fee_amount: number | FeeRange | null;
  clinical_review_type: ClinicalReviewType;
  clinical_review_fee: number;
}

export const PROVIDER_COLORS: Record<string, string> = {
  "Thriva": "#7C5CD6", "Medichecks": "#15A0A0", "Lola Health": "#1F8A5B",
  "Clinilabs": "#2D9CDB", "Goodbody Clinic": "#5AAA46",
  "London Medical Laboratory": "#46566B", "London Health Company": "#2E76C9",
  "Blood Tests London": "#C0392B", "Medical Diagnosis": "#2C7BE5", "Randox Health": "#0F8A80",
};

export const PROVIDER_POLICIES: ProviderPolicy[] = [
  { provider: "Thriva", color: PROVIDER_COLORS["Thriva"], verified: true, sample: "Finger-prick via Thriva's own Autodraw device (capillary), collected at home.", collection: "Home kit included as standard; home phlebotomy / venous is an extra-cost add-on, not the default.", fees: "No fee on the finger-prick home kit; home phlebotomy is the only paid collection add-on.", clinical_review: "GP-written doctor's report / commentary included as standard — exportable PDF, results in ~2 days.", source_url: "https://thriva.co/hub/blood-tests/blood-tests-different-types-and-what-to-expect", collection_methods: ["home_kit"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_fee: 0 },
  { provider: "Medichecks", color: PROVIDER_COLORS["Medichecks"], verified: true, sample: "Finger-prick, saliva, stool, or venous depending on the test.", collection: "At-home kit; partner-clinic draw; nurse home visit; or arrange your own phlebotomist.", fees: "Nurse home visit £59; arranging your own collection is free (you pay your phlebotomist); clinic charge shown at checkout.", clinical_review: "Written doctor's comments included as standard on all tests (opt out for results-only).", source_url: "https://support.medichecks.com/hc/en-gb/articles/30837564263581-How-to-place-an-order-on-the-website", collection_methods: ["self_arranged", "clinic_appointment", "home_visit", "home_kit"], collection_fee_type: "range", collection_fee_amount: { min: 0, max: 59 }, clinical_review_type: "included", clinical_review_fee: 0 },
  { provider: "Lola Health", color: PROVIDER_COLORS["Lola Health"], verified: true, sample: "Venous blood draw (standard arm draw).", collection: "Professional phlebotomist home visit, included with every panel.", fees: "Home-visit phlebotomy included in the panel price — no extra collection fee.", clinical_review: "Clinician review of results included.", source_url: "https://lolahealth.com", collection_methods: ["home_visit", "clinic_appointment"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_fee: 0 },
  { provider: "Clinilabs", color: PROVIDER_COLORS["Clinilabs"], verified: true, sample: "Venous draw at the Fitzrovia (London W1) clinic.", collection: "In-clinic phlebotomy appointment.", fees: "Phlebotomy is a separate fee — £30 prepaid online or £50 walk-in. Test price is not included in the draw fee.", clinical_review: "Not included as standard — clinical interpretation is an optional add-on service.", source_url: "https://www.clinilabs.co.uk", collection_methods: ["clinic_appointment"], collection_fee_type: "fixed", collection_fee_amount: 30, clinical_review_type: "optional", clinical_review_fee: 0 },
  { provider: "Goodbody Clinic", color: PROVIDER_COLORS["Goodbody Clinic"], verified: true, sample: "Venous draw, or finger-prick home kit for selected panels.", collection: "Clinic appointment or home nurse visit; home kits posted for finger-prick.", fees: "In-clinic blood draw is included at the advertised test price; a home nurse visit costs £20 more.", clinical_review: "Not included by default — a virtual GP Consultation is an optional add-on at £59.99.", source_url: "https://goodbodyclinic.com/products/gp-consultation", collection_methods: ["clinic_appointment", "home_visit", "home_kit"], collection_fee_type: "range", collection_fee_amount: { min: 0, max: 20 }, clinical_review_type: "optional", clinical_review_fee: 59.99 },
  { provider: "London Medical Laboratory", color: PROVIDER_COLORS["London Medical Laboratory"], verified: true, sample: "Finger-prick home kit, or venous draw at a partner clinic.", collection: "At-home kit with pre-paid postage, or partner clinic with overnight courier for phlebotomy samples.", fees: "No fee on the postal kit (postage included); partner-clinic phlebotomy charge varies by site.", clinical_review: "GP-reviewed report included on all results.", source_url: "https://www.londonmedicallaboratory.com", collection_methods: ["home_kit", "clinic_appointment"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_fee: 0 },
  { provider: "London Health Company", color: PROVIDER_COLORS["London Health Company"], verified: true, sample: "Finger-prick capillary sample via posted home kit.", collection: "Self-collected home kit; pre-paid return postage to a CQC-regulated lab.", fees: "No collection fee — kit and return postage included in the price.", clinical_review: "Not included — results come as a report you can show your own GP.", source_url: "https://www.londonhealthcompany.co.uk", collection_methods: ["home_kit"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "not_included", clinical_review_fee: 0 },
  { provider: "Blood Tests London", color: PROVIDER_COLORS["Blood Tests London"], verified: true, sample: "Venous draw at the Oxford Street (central London) clinic.", collection: "In-clinic phlebotomy appointment.", fees: "No extra phlebotomy or medical charge on arrival — the draw is included in the test price.", clinical_review: "Optional GP comment on results (adds ~2 days); not required by default.", source_url: "https://bloodtestslondon.com", collection_methods: ["clinic_appointment"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "optional", clinical_review_fee: 0 },
  { provider: "Randox Health", color: PROVIDER_COLORS["Randox Health"], verified: true, sample: "Venous draw at Randox-owned clinics (~30 across UK & Ireland).", collection: "In-clinic appointment with a Randox phlebotomist into Randox's own lab pipeline.", fees: "Phlebotomy carried out at Randox's own clinic — included in the panel price, no separate add-on.", clinical_review: "In-person results consultation included with most clinic panels.", source_url: "https://www.randoxhealth.com", collection_methods: ["clinic_appointment"], collection_fee_type: "none", collection_fee_amount: null, clinical_review_type: "included", clinical_review_fee: 0 },
  { provider: "Medical Diagnosis", color: PROVIDER_COLORS["Medical Diagnosis"], verified: true, sample: "Venous draw at the Neasden (London NW10) clinic.", collection: "In-clinic phlebotomy appointment.", fees: "Phlebotomy fee per visit, stated per profile on their own site: £15 (screening list), £20 (Health Screening Profile), £21 (health checks).", clinical_review: "Not included — sample-collection / lab service, results delivered via portal.", source_url: "https://www.medical-diagnosis.co.uk/exam/profiles/health-screening-profile/", collection_methods: ["clinic_appointment"], collection_fee_type: "fixed", collection_fee_amount: 20, clinical_review_type: "not_included", clinical_review_fee: 0 },
];

// ─────────────────────────────────────────────────────────────────────────────
// SCORING — recommendation engine weights + deterministic algorithm
// ─────────────────────────────────────────────────────────────────────────────
export const SCORING = {
  GOAL_MATCH: 15,
  CONDITION_MATCH: 25,
  SAMPLE_PREF_MATCH: 10,
  AVOID_VENOUS_PENALTY: -20,
  COLLECTION_METHOD_MATCH: 5,
  NO_FEES_BONUS: 10,
  NO_FEES_PENALTY: -10,
  REVIEW_INC_BONUS: 10,
  REVIEW_INC_PENALTY: -20,
  BIOMARKER_CAP: 10,
  age: {
    PROSTATE_50: 20, MALE_HORMONES_30: 12, MALE_CARDIO_40: 12, MALE_METABOLIC_40: 10,
    FEMALE_HORMONES_35_50: 12, FEMALE_MENO_GYN_40: 20, FEMALE_CARDIO_40: 12, FEMALE_METABOLIC_40: 10,
    DIABETES_40: 10, THYROID_40: 8,
  },
};

export interface QuizProfile {
  sex: "male" | "female" | "other";
  age_band: string;
  goals: GoalTag[];
  concerns: ConditionTag[];
  preferences: {
    preferred_sample_types: SampleType[];
    preferred_collection_methods: CollectionMethod[];
    avoid_venous: boolean;
    prefer_no_additional_fees: boolean;
    require_clinical_review_included: boolean;
  };
}

const ageNum = (band: string) =>
  QUIZ_CONFIG.ageBands.find((b) => b.key === band)?.midpoint ?? 35;
const inter = <T,>(a: T[], b: T[]) => { const s = new Set(b); return a.filter((x) => s.has(x)); };

function isSexCompatible(t: TestRecord, p: QuizProfile): boolean {
  if (t.sex_restriction === "none") return true;
  if (t.sex_restriction === "male_only" && p.sex === "male") return true;
  if (t.sex_restriction === "female_only" && p.sex === "female") return true;
  return false;
}

function ageBoost(t: TestRecord, p: QuizProfile): number {
  const age = ageNum(p.age_band); const A = SCORING.age; let b = 0;
  if (p.sex === "male") {
    if (age >= 30 && t.condition_tags.includes("prostate_health")) b += A.PROSTATE_50;
    if (age >= 30 && t.condition_tags.includes("male_hormones")) b += A.MALE_HORMONES_30;
    if (age >= 40 && p.goals.includes("preventative") && t.condition_tags.includes("cardiovascular_risk")) b += A.MALE_CARDIO_40;
    if (age >= 40 && p.goals.includes("longevity") && t.condition_tags.includes("metabolic_health")) b += A.MALE_METABOLIC_40;
  }
  if (p.sex === "female") {
    if (age >= 35 && age <= 50 && t.condition_tags.includes("female_hormones")) b += A.FEMALE_HORMONES_35_50;
    if (age >= 40 && (t.condition_tags.includes("menopause_hrt") || t.condition_tags.includes("gynaecology"))) b += A.FEMALE_MENO_GYN_40;
    if (age >= 40 && p.goals.includes("preventative") && t.condition_tags.includes("cardiovascular_risk")) b += A.FEMALE_CARDIO_40;
    if (age >= 40 && p.goals.includes("longevity") && t.condition_tags.includes("metabolic_health")) b += A.FEMALE_METABOLIC_40;
  }
  if (age >= 40 && p.goals.includes("preventative")) {
    if (t.condition_tags.includes("diabetes")) b += A.DIABETES_40;
    if (t.condition_tags.includes("thyroid")) b += A.THYROID_40;
  }
  return b;
}

export function scoreTest(t: TestRecord, p: QuizProfile): number {
  if (!isSexCompatible(t, p)) return 0;
  let s = 0;
  s += inter(t.goal_tags, p.goals).length * SCORING.GOAL_MATCH;
  s += inter(t.condition_tags, p.concerns).length * SCORING.CONDITION_MATCH;
  s += ageBoost(t, p);
  if (p.preferences.preferred_sample_types.includes(t.sample_type)) s += SCORING.SAMPLE_PREF_MATCH;
  if (p.preferences.avoid_venous && t.sample_type === "venous") s += SCORING.AVOID_VENOUS_PENALTY;
  s += inter(t.collection_method, p.preferences.preferred_collection_methods).length * SCORING.COLLECTION_METHOD_MATCH;
  if (p.preferences.prefer_no_additional_fees) s += t.collection_fee_type === "none" ? SCORING.NO_FEES_BONUS : SCORING.NO_FEES_PENALTY;
  if (p.preferences.require_clinical_review_included) s += t.clinical_review_type === "included" ? SCORING.REVIEW_INC_BONUS : SCORING.REVIEW_INC_PENALTY;
  s += Math.min(t.biomarkers / 10, SCORING.BIOMARKER_CAP);
  return s;
}

export async function recommend(
  p: QuizProfile,
  tests: TestRecord[] = TEST_RECORDS,
): Promise<{ test: TestRecord; score: number }[]> {
  return tests
    .map((t) => ({ test: t, score: scoreTest(t, p) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.test.price - b.test.price));
}

export function lowestFee(t: TestRecord): number {
  const a = t.collection_fee_amount;
  if (t.collection_fee_type === "none" || t.collection_fee_type === "patient_arranged") return 0;
  if (t.collection_fee_type === "fixed") return typeof a === "number" ? a : 0;
  if (a && typeof a === "object") return (a as FeeRange).min ?? 0;
  return 0;
}
export function isFeeEstimate(t: TestRecord): boolean {
  return t.collection_fee_type === "range" || t.collection_fee_type === "varies_by_location" || t.collection_fee_type === "patient_arranged";
}
export function computeTotalExpectedCost(t: TestRecord): { total: number; isEstimate: boolean } {
  return { total: t.price + lowestFee(t), isEstimate: isFeeEstimate(t) };
}

const money = (n: number) => "£" + (Number.isInteger(n) ? n : n.toFixed(2));

export function feeCellLabel(t: TestRecord): string {
  const a = t.collection_fee_amount;
  if (t.collection_fee_type === "none") return "None";
  if (t.collection_fee_type === "fixed") return typeof a === "number" && a > 0 ? "Clinic draw +" + money(a) : "None";
  if (t.collection_fee_type === "range" || t.collection_fee_type === "varies_by_location")
    return a && typeof a === "object" && (a as FeeRange).min > 0 ? "From " + money((a as FeeRange).min) : "Varies by location";
  if (t.collection_fee_type === "patient_arranged") return "Self-arranged";
  return "Not specified";
}
export function reviewCellLabel(t: TestRecord): string {
  const role: Record<string, string> = {
    gp: "GP review included", consultant: "Consultant review included",
    clinician: "Clinician review included", nurse: "Nurse review included",
    clinical_scientist: "Clinical scientist review",
  };
  if (t.clinical_review_type === "included") return role[t.clinical_review_professional ?? ""] || "Included";
  if (t.clinical_review_type === "optional") return "Optional (+" + money(t.clinical_review_fee) + ")";
  if (t.clinical_review_type === "not_included") return "Not included";
  return "Not specified";
}
export function collectionCellLabel(t: TestRecord): string {
  const m = t.collection_method;
  if (!m || !m.length) return "Not specified";
  const first = TAG_TAXONOMY.collectionMethodLabels[m[0]] || "Not specified";
  const more = m.length - 1;
  return more > 0 ? `${first} +${more} more` : first;
}
