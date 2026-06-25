/**
 * Convert a live `provider_tests` row (Supabase) into the canonical TestRecord
 * shape used by the Assisted Test Finder. The DB columns for sample_type,
 * collection_method, collection_fee_*, clinical_review_* already match the
 * brief's enum vocabulary — we just normalise free-text sample_type and
 * derive verification flags / goal & condition tags.
 */
import type { Database } from "@/integrations/supabase/types";
import type {
  ClinicalReviewProfessional,
  ClinicalReviewType,
  CollectionFeeType,
  CollectionMethod,
  ConditionTag,
  FieldStatus,
  GoalTag,
  SampleType,
  SexRestriction,
  TestRecord,
} from "@/types/testFinder";

export type ProviderTestRow = Database["public"]["Tables"]["provider_tests"]["Row"];

const PROVIDER_DISPLAY: Record<string, { name: string; logo?: string }> = {
  thriva: { name: "Thriva" },
  medichecks: { name: "Medichecks", logo: "/lovable-uploads/provider-medichecks-new-v3.png" },
  randox: { name: "Randox Health" },
  "lola-health": { name: "Lola Health" },
  "goodbody-clinic": { name: "GOODBODY Clinic" },
  "london-medical-laboratory": {
    name: "London Medical Laboratory",
    logo: "/lovable-uploads/provider-london-medical.png",
  },
  "london-health-company": { name: "London Health Company" },
  clinilabs: { name: "Clinilabs" },
  "medical-diagnosis": { name: "Medical Diagnosis" },
  "blood-tests-london": { name: "Blood Tests London" },
};

/* -------------------------------- normalisers ------------------------------ */

function normSampleType(raw: string | null): SampleType {
  if (!raw) return "venous";
  const n = raw.toLowerCase();
  if (n.includes("stool")) return "stool";
  if (n.includes("urine") && n.includes("swab")) return "multiple";
  if (n.includes("urine")) return "urine";
  if (n.includes("saliva")) return "saliva";
  if (n.includes("swab")) return "buccal_swab";
  if (n.includes("finger") && n.includes("venous")) return "multiple";
  if (n.includes("finger")) return "finger_prick";
  if (n.includes("venous") || n.includes("blood")) return "venous";
  return "venous";
}

function normCollectionMethod(
  raw: string | null,
  homeKit: boolean | null,
  clinic: boolean | null,
): CollectionMethod[] {
  const out = new Set<CollectionMethod>();
  if (raw) {
    const parts = raw.split(/[,;]/).map((s) => s.trim().toLowerCase());
    for (const p of parts) {
      if (
        p === "home_kit" ||
        p === "clinic_appointment" ||
        p === "home_visit" ||
        p === "mobile_phlebotomy" ||
        p === "third_party_phlebotomy" ||
        p === "self_arranged" ||
        p === "multiple"
      ) {
        out.add(p);
      }
    }
  }
  if (homeKit) out.add("home_kit");
  if (clinic) out.add("clinic_appointment");
  if (out.size === 0) out.add("clinic_appointment");
  return [...out];
}

function normFeeType(raw: string | null): CollectionFeeType {
  switch (raw) {
    case "none":
    case "fixed":
    case "range":
    case "patient_arranged":
    case "varies_by_location":
      return raw;
    default:
      return "none";
  }
}

function normReviewType(raw: string | null): ClinicalReviewType {
  switch (raw) {
    case "included":
    case "optional":
    case "not_included":
    case "not_available":
      return raw;
    default:
      return "not_included";
  }
}

function normReviewProfessional(raw: string | null): ClinicalReviewProfessional {
  switch (raw) {
    case "gp":
    case "consultant":
    case "clinician":
    case "nurse":
    case "clinical_scientist":
      return raw;
    default:
      return null;
  }
}

function normStatus(raw: string | null, fallback: FieldStatus = "needs_verification"): FieldStatus {
  return raw === "verified" ? "verified" : fallback;
}

/* ---------------------------- tag inference -------------------------------- */

function inferGoals(name: string, category: string | null): GoalTag[] {
  const n = `${name} ${category ?? ""}`.toLowerCase();
  const g = new Set<GoalTag>();
  if (/(performance|sports|athlete|optimal|ultimate)/.test(n)) g.add("performance");
  if (/(general|wellness|well[- ]?(man|woman)|mot|screening|lifestyle|nutrition|preventative)/.test(n))
    g.add("preventative");
  if (/(advanced|longevity|biological age)/.test(n)) g.add("longevity");
  if (/(weight|metabolic|diabetes|hba1c|cholesterol)/.test(n)) g.add("weight_management");
  if (/(thyroid|cortisol|fatigue|hormone|testosterone|oestradiol|amh|psa|liver|kidney|iron|vitamin|allergy|fertility|pregnancy)/.test(n))
    g.add("symptom_investigation");
  if (/(trt|monitoring|hba1c)/.test(n)) g.add("condition_monitoring");
  if (g.size === 0) g.add("preventative");
  return [...g];
}

function inferConditions(name: string, category: string | null): ConditionTag[] {
  const n = `${name} ${category ?? ""}`.toLowerCase();
  const c = new Set<ConditionTag>();
  if (/(psa|prostate)/.test(n)) c.add("prostate_health");
  if (/(testosterone|trt|male hormone|sports hormone|dhea)/.test(n)) c.add("male_hormones");
  if (/(female hormone|oestradiol|progesterone|amh|ovulation)/.test(n)) c.add("female_hormones");
  if (/menopause/.test(n)) c.add("menopause_hrt");
  if (/(pregnancy|nipt|fertility)/.test(n) && /female|women|amh|ovulation|pregnancy|nipt/.test(n))
    c.add("fertility_female");
  if (/(sperm|male fertility)/.test(n)) c.add("fertility_male");
  if (/(cholesterol|heart|lipid|cardio)/.test(n)) c.add("cardiovascular_risk");
  if (/(diabetes|hba1c|glucose|insulin)/.test(n)) c.add("diabetes");
  if (/(metabolic|weight|nutrition|vitamin|iron)/.test(n)) c.add("metabolic_health");
  if (/thyroid/.test(n)) c.add("thyroid");
  if (/(general|well[- ]?(man|woman)|mot|screening|lifestyle|optimal|ultimate)/.test(n))
    c.add("general_health");
  if (/(sports|performance|athlete)/.test(n)) c.add("sports_performance");
  if (/(fatigue|cortisol|stress|energy)/.test(n)) c.add("fatigue_low_energy");
  if (/(gynaecology|gynecology)/.test(n)) c.add("gynaecology");
  if (c.size === 0) c.add("general_health");
  return [...c];
}

function inferSexRestriction(name: string, category: string | null): SexRestriction {
  const n = `${name} ${category ?? ""}`.toLowerCase();
  if (/\b(male|men's|prostate|psa|trt|sperm)\b/.test(n)) return "male_only";
  if (/\b(female|women's|woman|ovulation|amh|pregnancy|menopause|nipt)\b/.test(n))
    return "female_only";
  return "none";
}

/* --------------------------------- adapter --------------------------------- */

export function adaptProviderTestRow(row: ProviderTestRow): TestRecord | null {
  if (!row.test_name || row.price == null) return null;

  const display = PROVIDER_DISPLAY[row.provider_id] ?? { name: row.provider_id };
  const feeType = normFeeType(row.collection_fee_type);
  const feeAmount =
    feeType === "none" ? null : feeType === "range" || feeType === "varies_by_location"
      ? row.collection_fee_amount != null
        ? { min: Number(row.collection_fee_amount), max: Number(row.collection_fee_amount) }
        : null
      : row.collection_fee_amount != null
        ? Number(row.collection_fee_amount)
        : null;

  return {
    id: row.id,
    name: row.test_name,
    provider: display.name,
    provider_logo: display.logo,
    price: Number(row.price),
    biomarkers: row.biomarker_count ?? 0,
    turnaround_label: row.turnaround_days_text || "Contact provider",
    sample_type: normSampleType(row.sample_type),
    collection_method: normCollectionMethod(
      row.collection_method,
      row.home_kit_available,
      row.clinic_visit_available,
    ),
    collection_fee_type: feeType,
    collection_fee_amount: feeAmount,
    clinical_review_type: normReviewType(row.clinical_review_type),
    clinical_review_professional: normReviewProfessional(row.clinical_review_professional),
    clinical_review_fee: Number(row.clinical_review_fee ?? 0),
    goal_tags: inferGoals(row.test_name, row.canonical_category ?? row.category),
    condition_tags: inferConditions(row.test_name, row.canonical_category ?? row.category),
    sex_restriction: inferSexRestriction(row.test_name, row.canonical_category ?? row.category),
    book_url: row.url ?? undefined,
    source_url: row.url ?? undefined,
    verification: {
      price: row.url_verified ? "verified" : "needs_verification",
      biomarkers:
        (row.biomarker_count ?? 0) > 0 &&
        Array.isArray(row.biomarkers_list) &&
        row.biomarkers_list.length > 0
          ? "verified"
          : "needs_verification",
      collection_fee: normStatus(row.collection_fee_verification),
      clinical_review: normStatus(row.clinical_review_verification),
    },
  };
}
