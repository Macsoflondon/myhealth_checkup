import type { FilterState, TestRecord, UserProfile } from "@/types/testFinder";
import { EMPTY_FILTERS } from "@/types/testFinder";

export function deriveFilterState(profile: UserProfile): FilterState {
  return {
    ...EMPTY_FILTERS,
    goals: [...profile.goals],
    sample_types: [...profile.preferences.preferred_sample_types],
    collection_methods: [...profile.preferences.preferred_collection_methods],
    no_additional_fees: profile.preferences.prefer_no_additional_fees,
    clinical_review_included: profile.preferences.require_clinical_review_included,
  };
}

export function applyFilters(tests: TestRecord[], f: FilterState): TestRecord[] {
  return tests.filter((t) => {
    if (f.goals.length && !f.goals.some((g) => t.goal_tags.includes(g))) return false;
    if (f.sample_types.length && !f.sample_types.includes(t.sample_type)) return false;
    if (
      f.collection_methods.length &&
      !f.collection_methods.some((m) => t.collection_method.includes(m))
    )
      return false;
    if (f.no_additional_fees && t.collection_fee_type !== "none") return false;
    if (f.clinical_review.length && !f.clinical_review.includes(t.clinical_review_type))
      return false;
    if (f.clinical_review_included && t.clinical_review_type !== "included") return false;
    return true;
  });
}

export function countActiveFilters(f: FilterState): number {
  return (
    f.goals.length +
    f.sample_types.length +
    f.collection_methods.length +
    f.clinical_review.length +
    (f.no_additional_fees ? 1 : 0) +
    (f.clinical_review_included ? 1 : 0)
  );
}

export function filtersDifferFrom(a: FilterState, b: FilterState): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}
