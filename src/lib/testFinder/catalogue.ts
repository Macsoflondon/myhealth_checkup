/**
 * Phase 5 — Provider catalogue adapter.
 *
 * Converts the real provider rows in `src/data/compare/realProviderData.ts`
 * (118+ products across Medichecks, London Medical Laboratory, Thriva,
 * Randox, etc.) into the canonical `TestRecord` shape used by the Assisted
 * Test Finder.
 *
 * Inferences (sample type, collection, fees, clinical review, goal/condition
 * tags, sex restriction) are derived heuristically from provider + test name
 * + tag. Each derived field is marked `needs_verification` so the UI surfaces
 * a dotted underline + tooltip until product data is confirmed against the
 * source URL. Price + biomarker count come directly from the catalogue and
 * are marked `verified` unless the biomarker count looks like a placeholder
 * (the legacy seed defaults to "4" for unmapped tests).
 *
 * Seed entries from `testFinderSeed.ts` are merged in as additional coverage
 * for providers not yet present in the real-data file (Lola Health, London
 * Health Company, Blood Tests London, Medical Diagnosis, Goodbody).
 */
import { realTestData, type RealTestData } from "@/data/compare/realProviderData";
import { SEED_TESTS } from "@/data/testFinderSeed";
import type {
  ClinicalReviewProfessional,
  ClinicalReviewType,
  CollectionFeeType,
  CollectionMethod,
  ConditionTag,
  GoalTag,
  SampleType,
  SexRestriction,
  TestRecord,
} from "@/types/testFinder";

/* ------------------------------------------------------------------ */
/*  Provider-level defaults                                           */
/* ------------------------------------------------------------------ */

interface ProviderDefaults {
  logo?: string;
  turnaround: string;
  sample_type: SampleType;
  collection_method: CollectionMethod[];
  collection_fee_type: CollectionFeeType;
  collection_fee_amount: number | { min: number; max: number } | null;
  clinical_review_type: ClinicalReviewType;
  clinical_review_professional: ClinicalReviewProfessional;
  clinical_review_fee: number;
}

const PROVIDER_DEFAULTS: Record<string, ProviderDefaults> = {
  Medichecks: {
    logo: "/lovable-uploads/provider-medichecks-new-v3.png",
    turnaround: "2–5 days",
    sample_type: "venous",
    collection_method: ["clinic_appointment", "self_arranged"],
    collection_fee_type: "fixed",
    collection_fee_amount: 35,
    clinical_review_type: "included",
    clinical_review_professional: "gp",
    clinical_review_fee: 0,
  },
  "London Medical Laboratory": {
    logo: "/lovable-uploads/provider-london-medical.png",
    turnaround: "24–72 hours",
    sample_type: "venous",
    collection_method: ["clinic_appointment", "home_kit"],
    collection_fee_type: "varies_by_location",
    collection_fee_amount: { min: 0, max: 45 },
    clinical_review_type: "not_included",
    clinical_review_professional: null,
    clinical_review_fee: 0,
  },
  Thriva: {
    turnaround: "~48 hours",
    sample_type: "finger_prick",
    collection_method: ["home_kit"],
    collection_fee_type: "none",
    collection_fee_amount: null,
    clinical_review_type: "included",
    clinical_review_professional: "gp",
    clinical_review_fee: 0,
  },
  Randox: {
    turnaround: "Next day",
    sample_type: "venous",
    collection_method: ["clinic_appointment", "home_visit"],
    collection_fee_type: "varies_by_location",
    collection_fee_amount: { min: 0, max: 65 },
    clinical_review_type: "included",
    clinical_review_professional: "clinician",
    clinical_review_fee: 0,
  },
};

const DEFAULT_PROVIDER: ProviderDefaults = {
  turnaround: "2–4 days",
  sample_type: "venous",
  collection_method: ["clinic_appointment"],
  collection_fee_type: "fixed",
  collection_fee_amount: 0,
  clinical_review_type: "not_included",
  clinical_review_professional: null,
  clinical_review_fee: 0,
};

/* ------------------------------------------------------------------ */
/*  Heuristic taggers                                                 */
/* ------------------------------------------------------------------ */

function inferSampleType(name: string, fallback: SampleType): SampleType {
  const n = name.toLowerCase();
  if (n.includes("saliva")) return "saliva";
  if (n.includes("urine")) return "urine";
  if (n.includes("stool")) return "stool";
  if (n.includes("swab")) return "buccal_swab";
  if (n.includes("at home") || n.includes("at-home")) return "finger_prick";
  return fallback;
}

function inferCollection(
  name: string,
  fallback: CollectionMethod[],
): CollectionMethod[] {
  const n = name.toLowerCase();
  if (n.includes("at home") || n.includes("at-home")) return ["home_kit"];
  return fallback;
}

function inferSexRestriction(name: string, tags: string | null): SexRestriction {
  const n = name.toLowerCase();
  if (/\b(male|men's|man|prostate|psa|trt|testosterone|sperm)\b/.test(n)) {
    // "Testosterone" can be ordered by anyone clinically, but in this
    // consumer context the marketing target is male — keep narrow for the
    // explicit "Male"/"Men's"/PSA/TRT cases only.
    if (/\b(male|men's|prostate|psa|trt|sperm)\b/.test(n)) return "male_only";
  }
  if (/\b(female|women's|woman|ovulation|amh|pregnancy|menopause|oestradiol|progesterone)\b/.test(n)) {
    if (/\b(female|women's|ovulation|amh|pregnancy|menopause)\b/.test(n)) return "female_only";
  }
  return "none";
}

function inferGoals(name: string, tags: string | null): GoalTag[] {
  const n = name.toLowerCase();
  const goals = new Set<GoalTag>();
  if (/(performance|sports|ultimate|optimal|athlete)/.test(n)) goals.add("performance");
  if (/(general|wellness|well[- ]?(man|woman)|mot|screening|lifestyle|nutrition)/.test(n)) {
    goals.add("preventative");
  }
  if (/(advanced|optimal|ultimate|longevity)/.test(n)) goals.add("longevity");
  if (/(weight|metabolic|diabetes|hba1c|cholesterol)/.test(n)) goals.add("weight_management");
  if (
    /(thyroid|cortisol|fatigue|hormone|testosterone|oestradiol|amh|psa|liver|kidney|iron|vitamin|deficiency|allergy|fertility|pregnancy)/.test(
      n,
    )
  ) {
    goals.add("symptom_investigation");
  }
  if (/(trt|monitoring|hba1c)/.test(n)) goals.add("condition_monitoring");
  if (goals.size === 0) goals.add("preventative");
  return [...goals];
}

function inferConditions(name: string, tags: string | null): ConditionTag[] {
  const n = name.toLowerCase();
  const t = (tags ?? "").toLowerCase();
  const c = new Set<ConditionTag>();

  if (/(psa|prostate)/.test(n)) c.add("prostate_health");
  if (/(testosterone|trt|male hormone|sports hormone|dhea)/.test(n)) c.add("male_hormones");
  if (/(female hormone|oestradiol|progesterone|amh|ovulation)/.test(n)) c.add("female_hormones");
  if (/menopause/.test(n)) c.add("menopause_hrt");
  if (/(pregnancy|fertility)/.test(n) && /female|women|amh|ovulation|pregnancy/.test(n)) {
    c.add("fertility_female");
  }
  if (/(sperm|male fertility)/.test(n)) c.add("fertility_male");
  if (/(cholesterol|heart|lipid|cardio)/.test(n) || t.includes("heart")) c.add("cardiovascular_risk");
  if (/(diabetes|hba1c|glucose|insulin)/.test(n) || t.includes("diabetes")) c.add("diabetes");
  if (/(metabolic|weight|nutrition|vitamin|iron)/.test(n)) c.add("metabolic_health");
  if (/thyroid/.test(n) || t.includes("thyroid")) c.add("thyroid");
  if (/(general|well[- ]?(man|woman)|mot|screening|lifestyle|optimal|ultimate)/.test(n))
    c.add("general_health");
  if (/(sports|performance|athlete)/.test(n)) c.add("sports_performance");
  if (/(fatigue|cortisol|stress|energy)/.test(n)) c.add("fatigue_low_energy");

  if (c.size === 0) c.add("general_health");
  return [...c];
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/* ------------------------------------------------------------------ */
/*  Row → TestRecord                                                  */
/* ------------------------------------------------------------------ */

function adaptRow(row: RealTestData, idx: number): TestRecord {
  const defaults = PROVIDER_DEFAULTS[row.Provider] ?? DEFAULT_PROVIDER;
  const name = row["Test Name"];
  const price = row["Price (£)"];
  const biomarkers = row["Biomarker Count"];
  const sample = inferSampleType(name, defaults.sample_type);
  const collection = inferCollection(name, defaults.collection_method);
  // Home-kit only flows generally drop the phlebotomy fee.
  const isHomeOnly = collection.length === 1 && collection[0] === "home_kit";
  const feeType: CollectionFeeType = isHomeOnly ? "none" : defaults.collection_fee_type;
  const feeAmount = isHomeOnly ? null : defaults.collection_fee_amount;

  // Biomarker counts of 4 in this dataset are placeholders; flag for review.
  const biomarkersStatus = biomarkers > 4 ? "verified" : "needs_verification";

  return {
    id: `${slugify(row.Provider)}-${slugify(name)}-${idx}`,
    name,
    provider: row.Provider,
    provider_logo: defaults.logo,
    price,
    biomarkers,
    turnaround_label: defaults.turnaround,
    sample_type: sample,
    collection_method: collection,
    collection_fee_type: feeType,
    collection_fee_amount: feeAmount,
    clinical_review_type: defaults.clinical_review_type,
    clinical_review_professional: defaults.clinical_review_professional,
    clinical_review_fee: defaults.clinical_review_fee,
    goal_tags: inferGoals(name, row.Tags),
    condition_tags: inferConditions(name, row.Tags),
    sex_restriction: inferSexRestriction(name, row.Tags),
    book_url: row["Test URL"],
    source_url: row["Test URL"],
    verification: {
      price: "verified",
      biomarkers: biomarkersStatus,
      collection_fee: "needs_verification",
      clinical_review: "needs_verification",
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Public catalogue                                                  */
/* ------------------------------------------------------------------ */

const adapted: TestRecord[] = realTestData.map(adaptRow);

// Merge: real provider data first, then seed entries that cover providers
// the real-data file doesn't include (Lola Health, London Health Company,
// Blood Tests London, Medical Diagnosis, Goodbody, Randox Health, etc.).
const seenIds = new Set(adapted.map((t) => t.id));
const realProviders = new Set(adapted.map((t) => t.provider));

const seedExtras = SEED_TESTS.filter(
  (t) => !seenIds.has(t.id) && !realProviders.has(t.provider),
);

export const TEST_CATALOGUE: TestRecord[] = [...adapted, ...seedExtras];

export const TEST_CATALOGUE_STATS = {
  total: TEST_CATALOGUE.length,
  fromRealData: adapted.length,
  fromSeed: seedExtras.length,
  providers: [...new Set(TEST_CATALOGUE.map((t) => t.provider))].sort(),
};
