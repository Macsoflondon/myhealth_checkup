import type { AgeBand, TestRecord, UserProfile } from "@/types/testFinder";

export function ageToNumber(age_band: AgeBand): number {
  return ({ "18_29": 25, "30_39": 35, "40_49": 45, "50_59": 55, "60_plus": 65 } as const)[age_band];
}

export function isSexCompatible(test: TestRecord, profile: UserProfile): boolean {
  if (test.sex_restriction === "none") return true;
  if (test.sex_restriction === "male_only" && profile.sex === "male") return true;
  if (test.sex_restriction === "female_only" && profile.sex === "female") return true;
  return false;
}

export function ageBoost(test: TestRecord, profile: UserProfile): number {
  const age = ageToNumber(profile.age_band);
  let boost = 0;
  if (profile.sex === "male") {
    if (age >= 30 && test.condition_tags.includes("prostate_health")) boost += 20;
    if (age >= 30 && test.condition_tags.includes("male_hormones")) boost += 12;
    if (age >= 40 && profile.goals.includes("preventative") && test.condition_tags.includes("cardiovascular_risk")) boost += 12;
    if (age >= 40 && profile.goals.includes("longevity") && test.condition_tags.includes("metabolic_health")) boost += 10;
  }
  if (profile.sex === "female") {
    if (age >= 35 && age <= 50 && test.condition_tags.includes("female_hormones")) boost += 12;
    if (age >= 40 && (test.condition_tags.includes("menopause_hrt") || test.condition_tags.includes("gynaecology"))) boost += 20;
    if (age >= 40 && profile.goals.includes("preventative") && test.condition_tags.includes("cardiovascular_risk")) boost += 12;
    if (age >= 40 && profile.goals.includes("longevity") && test.condition_tags.includes("metabolic_health")) boost += 10;
  }
  if (age >= 40 && profile.goals.includes("preventative")) {
    if (test.condition_tags.includes("diabetes")) boost += 10;
    if (test.condition_tags.includes("thyroid")) boost += 8;
  }
  return boost;
}

function intersection<T>(a: T[], b: T[]): T[] {
  const setB = new Set(b);
  return a.filter((x) => setB.has(x));
}

export function computeMatchScore(test: TestRecord, profile: UserProfile): number {
  if (!isSexCompatible(test, profile)) return 0;
  let score = 0;
  score += intersection(test.goal_tags, profile.goals).length * 15;
  score += intersection(test.condition_tags, profile.concerns).length * 25;
  score += ageBoost(test, profile);
  if (profile.preferences.preferred_sample_types.includes(test.sample_type)) score += 10;
  if (profile.preferences.avoid_venous && test.sample_type === "venous") score -= 20;
  score += intersection(test.collection_method, profile.preferences.preferred_collection_methods).length * 5;
  if (profile.preferences.prefer_no_additional_fees)
    score += test.collection_fee_type === "none" ? 10 : -10;
  if (profile.preferences.require_clinical_review_included)
    score += test.clinical_review_type === "included" ? 10 : -20;
  score += Math.min(test.biomarkers / 10, 10);
  return score;
}

export const MAX_RECOMMENDATIONS = 18;

export function buildRecommendations(
  tests: TestRecord[],
  profile: UserProfile,
  limit: number = MAX_RECOMMENDATIONS,
): TestRecord[] {
  const scored = tests
    .map((test) => ({ ...test, ai_match_score: computeMatchScore(test, profile) }))
    .filter((test) => (test.ai_match_score ?? 0) > 0)
    .sort((a, b) =>
      (b.ai_match_score ?? 0) !== (a.ai_match_score ?? 0)
        ? (b.ai_match_score ?? 0) - (a.ai_match_score ?? 0)
        : a.price - b.price,
    );
  // Threshold: require a meaningful score (>= 25 = ~one goal + one age boost,
  // or one concern match). Falls back to top-N if too few clear that bar.
  const strong = scored.filter((t) => (t.ai_match_score ?? 0) >= 25);
  const pool = strong.length >= 6 ? strong : scored;
  return pool.slice(0, limit);
}

export function buildExplanation(test: TestRecord, profile: UserProfile): string[] {
  const lines: string[] = [];
  if (profile.sex === "male" && test.condition_tags.includes("prostate_health"))
    lines.push(
      profile.age_band === "50_59" || profile.age_band === "60_plus"
        ? "Prioritised for male users aged 50+ with prostate health concerns."
        : "Recommended for male users with prostate health concerns.",
    );
  if (profile.sex === "male" && test.condition_tags.includes("male_hormones"))
    lines.push("Relevant to male hormone and testosterone-related concerns.");
  if (profile.sex === "female" && test.condition_tags.includes("female_hormones"))
    lines.push("Relevant to female hormone concerns.");
  if (
    profile.sex === "female" &&
    (test.condition_tags.includes("menopause_hrt") || test.condition_tags.includes("gynaecology"))
  )
    lines.push("Prioritised for peri-menopause, menopause, or gynaecology-related concerns.");
  if (profile.preferences.prefer_no_additional_fees && test.collection_fee_type === "none")
    lines.push("Matches your preference for no additional collection fees.");
  if (
    profile.preferences.require_clinical_review_included &&
    test.clinical_review_type === "included"
  )
    lines.push("Includes clinician review of results.");
  return lines.slice(0, 3);
}
