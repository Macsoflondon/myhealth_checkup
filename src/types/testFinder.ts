// Assisted Test Finder — typed data model (spec §7)

export type SexRestriction = "male_only" | "female_only" | "none";

export type SampleType =
  | "finger_prick"
  | "venous"
  | "saliva"
  | "urine"
  | "stool"
  | "buccal_swab"
  | "multiple";

export type CollectionMethod =
  | "home_kit"
  | "clinic_appointment"
  | "home_visit"
  | "mobile_phlebotomy"
  | "third_party_phlebotomy"
  | "self_arranged"
  | "multiple";

export type CollectionFeeType =
  | "none"
  | "fixed"
  | "range"
  | "patient_arranged"
  | "varies_by_location";

export type ClinicalReviewType =
  | "included"
  | "optional"
  | "not_included"
  | "not_available";

export type ClinicalReviewProfessional =
  | "gp"
  | "consultant"
  | "clinician"
  | "nurse"
  | "clinical_scientist"
  | null;

export type GoalTag =
  | "preventative"
  | "longevity"
  | "performance"
  | "weight_management"
  | "symptom_investigation"
  | "condition_monitoring";

export type ConditionTag =
  | "prostate_health"
  | "male_hormones"
  | "female_hormones"
  | "menopause_hrt"
  | "gynaecology"
  | "fertility_male"
  | "fertility_female"
  | "cardiovascular_risk"
  | "metabolic_health"
  | "thyroid"
  | "general_health"
  | "sports_performance"
  | "diabetes"
  | "fatigue_low_energy";

export type FieldStatus = "verified" | "needs_verification";

export interface TestRecord {
  id: string;
  name: string;
  provider: string;
  provider_logo?: string;
  price: number;
  biomarkers: number;
  turnaround_label: string;
  sample_type: SampleType;
  collection_method: CollectionMethod[];
  collection_fee_type: CollectionFeeType;
  collection_fee_amount: number | { min: number; max: number } | null;
  clinical_review_type: ClinicalReviewType;
  clinical_review_professional?: ClinicalReviewProfessional;
  clinical_review_fee: number;
  goal_tags: GoalTag[];
  condition_tags: ConditionTag[];
  sex_restriction: SexRestriction;
  recommended_age_min?: number | null;
  recommended_age_max?: number | null;
  book_url?: string;
  source_url?: string;
  verification: {
    price: FieldStatus;
    biomarkers: FieldStatus;
    collection_fee: FieldStatus;
    clinical_review: FieldStatus;
  };
  ai_match_score?: number;
}

export type Sex = "male" | "female" | "other";
export type AgeBand = "18_29" | "30_39" | "40_49" | "50_59" | "60_plus";

export interface UserProfile {
  sex: Sex;
  age_band: AgeBand;
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

export interface FilterState {
  goals: GoalTag[];
  sample_types: SampleType[];
  collection_methods: CollectionMethod[];
  no_additional_fees: boolean;
  clinical_review: ClinicalReviewType[];
  clinical_review_included: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  goals: [],
  sample_types: [],
  collection_methods: [],
  no_additional_fees: false,
  clinical_review: [],
  clinical_review_included: false,
};
