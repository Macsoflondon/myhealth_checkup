import type {
  SampleType,
  CollectionMethod,
  ClinicalReviewType,
  ClinicalReviewProfessional,
  GoalTag,
  ConditionTag,
  AgeBand,
} from "@/types/testFinder";

export const SAMPLE_TYPE_LABEL: Record<SampleType, string> = {
  finger_prick: "Finger-prick blood sample",
  venous: "Venous blood draw",
  saliva: "Saliva sample",
  urine: "Urine sample",
  stool: "Stool sample",
  buccal_swab: "Buccal swab",
  multiple: "Multiple sample types",
};

export const COLLECTION_METHOD_LABEL: Record<CollectionMethod, string> = {
  home_kit: "Home kit included",
  clinic_appointment: "Clinic appointment included",
  home_visit: "Home visit available",
  mobile_phlebotomy: "Mobile phlebotomy available",
  third_party_phlebotomy: "Third-party phlebotomy accepted",
  self_arranged: "Self-arranged blood draw",
  multiple: "Multiple options available",
};

export const CLINICAL_REVIEW_PROFESSIONAL_LABEL: Record<
  Exclude<ClinicalReviewProfessional, null>,
  string
> = {
  gp: "GP",
  consultant: "Consultant",
  clinician: "Clinician",
  nurse: "Nurse",
  clinical_scientist: "Clinical scientist",
};

export function clinicalReviewLabel(
  type: ClinicalReviewType,
  professional?: ClinicalReviewProfessional,
  fee?: number,
): string {
  if (type === "included") {
    const role = professional ? CLINICAL_REVIEW_PROFESSIONAL_LABEL[professional] : "Clinical";
    return `${role} review included`;
  }
  if (type === "optional") {
    return fee && fee > 0 ? `Optional (+£${fee})` : "Optional";
  }
  if (type === "not_included") return "Not included";
  return "Not available";
}

export const GOAL_LABEL: Record<GoalTag, string> = {
  preventative: "Preventative health",
  longevity: "Longevity & healthy ageing",
  performance: "Sports performance & fitness",
  weight_management: "Weight management",
  symptom_investigation: "Symptom investigation",
  condition_monitoring: "Condition monitoring",
};

export const CONDITION_LABEL: Record<ConditionTag, string> = {
  prostate_health: "Prostate health",
  male_hormones: "Male hormones / testosterone",
  female_hormones: "Female hormones",
  menopause_hrt: "Peri-menopause / menopause",
  gynaecology: "Gynaecology",
  fertility_male: "Male fertility",
  fertility_female: "Female fertility",
  cardiovascular_risk: "Cardiovascular risk",
  metabolic_health: "Metabolic health",
  thyroid: "Thyroid",
  general_health: "General health",
  sports_performance: "Sports performance",
  diabetes: "Diabetes",
  fatigue_low_energy: "Fatigue / low energy",
};

export const AGE_BAND_LABEL: Record<AgeBand, string> = {
  "18_29": "18–29",
  "30_39": "30–39",
  "40_49": "40–49",
  "50_59": "50–59",
  "60_plus": "60+",
};
