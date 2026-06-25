import { describe, it, expect } from "vitest";
import { buildRecommendations, computeMatchScore, isSexCompatible } from "../scoring";
import { computeTotalCost } from "../cost";
import { applyFilters, deriveFilterState } from "../filters";
import { SEED_TESTS } from "@/data/testFinderSeed";
import type { UserProfile } from "@/types/testFinder";

const baseProfile: UserProfile = {
  sex: "male",
  age_band: "40_49",
  goals: ["preventative", "longevity"],
  concerns: ["male_hormones", "cardiovascular_risk"],
  preferences: {
    preferred_sample_types: ["finger_prick"],
    preferred_collection_methods: ["home_kit"],
    avoid_venous: true,
    prefer_no_additional_fees: true,
    require_clinical_review_included: true,
  },
};

describe("testFinder scoring", () => {
  it("filters out female-only tests for male profile", () => {
    const female = SEED_TESTS.find((t) => t.id === "randox-everywoman")!;
    expect(isSexCompatible(female, baseProfile)).toBe(false);
    expect(computeMatchScore(female, baseProfile)).toBe(0);
  });

  it("ranks Thriva metabolic above Blood Tests London for male/preventative/finger-prick profile", () => {
    const recs = buildRecommendations(SEED_TESTS, baseProfile);
    const ids = recs.map((r) => r.id);
    expect(ids.indexOf("thriva-metabolic")).toBeLessThan(ids.indexOf("btl-full-vip"));
  });

  it("excludes zero-scoring tests", () => {
    const recs = buildRecommendations(SEED_TESTS, baseProfile);
    expect(recs.every((r) => (r.ai_match_score ?? 0) > 0)).toBe(true);
  });
});

describe("testFinder cost", () => {
  it("returns price only for no-fee tests", () => {
    const t = SEED_TESTS.find((t) => t.id === "thriva-metabolic")!;
    const c = computeTotalCost(t);
    expect(c.total).toBe(96);
    expect(c.isEstimate).toBe(false);
  });

  it("adds fixed fee for venous tests with fixed collection fee", () => {
    const t = SEED_TESTS.find((t) => t.id === "medichecks-male-hormone")!;
    const c = computeTotalCost(t);
    expect(c.total).toBe(134);
  });

  it("marks varies_by_location as estimate using min", () => {
    const t = SEED_TESTS.find((t) => t.id === "lola-vital-56")!;
    const c = computeTotalCost(t);
    expect(c.isEstimate).toBe(true);
    expect(c.total).toBe(155);
  });
});

describe("testFinder filters", () => {
  it("AND across groups, OR within group", () => {
    const filters = deriveFilterState(baseProfile);
    const out = applyFilters(SEED_TESTS, filters);
    expect(out.every((t) => t.sample_type === "finger_prick")).toBe(true);
    expect(out.every((t) => t.collection_fee_type === "none")).toBe(true);
    expect(out.every((t) => t.clinical_review_type === "included")).toBe(true);
  });
});
