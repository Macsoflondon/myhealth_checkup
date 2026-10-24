import { describe, expect, it } from "vitest";
import { testIncludesBiomarker } from "./CancerBiomarkerGroup";
import type { EnhancedTestData } from "@/types/comparison";
import type { CancerBiomarker } from "@/data/compare/cancerBiomarkers";

/**
 * Regression guard for the cancer-biomarker-inclusion honesty fix (2026-10-23
 * test-card audit, pass 4). `testIncludesBiomarker` decides whether a test
 * shows a green "included" checkmark for a given cancer biomarker on
 * CancerComparisonPage's Biomarkers tab. It previously also matched a
 * biomarker's name against the test's free-text `testName`/`description` —
 * meaning a test could be marked as including PSA simply because its
 * marketing description mentioned "PSA" in passing, with no real
 * `biomarkersList` evidence it actually tests for it. It must now rely only
 * on the real biomarkers list.
 */

const baseTest: EnhancedTestData = {
  id: "t1",
  testName: "Men's Health Check",
  provider: "Medichecks",
  providerId: "medichecks",
  providerLogo: "",
  category: "General Health",
  basePrice: 99,
  gpConsultationIncluded: false,
  gpConsultationCost: null,
  phlebotomyIncluded: false,
  phlebotomyCost: null,
  totalEstimatedCost: 99,
  turnaroundDays: 3,
  sampleType: "venous",
  homeKitAvailable: true,
  clinicVisitAvailable: false,
  sampleTypeCode: "venous",
  collectionMethod: null,
  collectionFeeType: null,
  collectionFeeAmount: null,
  clinicalReviewType: null,
  clinicalReviewFee: null,
  totalExpectedCost: 99,
  biomarkerCount: null,
  biomarkersList: null,
  accreditations: [],
  description:
    "Recommended for men concerned about their PSA levels and prostate health.",
  url: "https://example.com/test",
  urlVerified: null,
  dataSource: "database",
};

const psaBiomarker: CancerBiomarker = {
  id: "psa",
  name: "PSA (Prostate-Specific Antigen)",
  description: "",
  clinicalSignificance: "",
  cancerTypes: ["prostate"],
  riskGroups: [],
};

describe("testIncludesBiomarker honesty", () => {
  it("does not mark a test as including a biomarker just because the description mentions it", () => {
    // The real biomarkersList has nothing — only the free-text description
    // mentions "PSA levels". The old code would have matched this and shown
    // a green "included" checkmark with no real backing data.
    expect(testIncludesBiomarker(baseTest, psaBiomarker)).toBe(false);
  });

  it("does not mark a test as including a biomarker just because its name mentions a related word", () => {
    const test = {
      ...baseTest,
      testName: "Prostate Screening Panel",
      description: "",
      biomarkersList: null,
    };
    expect(testIncludesBiomarker(test, psaBiomarker)).toBe(false);
  });

  it("returns false (never crashes) when biomarkersList is null", () => {
    expect(
      testIncludesBiomarker({ ...baseTest, biomarkersList: null }, psaBiomarker),
    ).toBe(false);
  });

  it("returns true only when the real biomarkers list actually contains the marker", () => {
    const test = { ...baseTest, biomarkersList: ["PSA", "Testosterone"] };
    expect(testIncludesBiomarker(test, psaBiomarker)).toBe(true);
  });

  it("returns false when the real biomarkers list does not contain the marker, even with a matching description", () => {
    const test = {
      ...baseTest,
      biomarkersList: ["Testosterone", "Oestradiol"],
    };
    expect(testIncludesBiomarker(test, psaBiomarker)).toBe(false);
  });
});
