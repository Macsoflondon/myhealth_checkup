import { describe, expect, it } from "vitest";
import { buildTestSummary, resolveTestSummary } from "@/lib/test-summary";

describe("buildTestSummary", () => {
  it("summarises count, collection and turnaround from real fields", () => {
    const summary = buildTestSummary({
      testName: "Core Health 45",
      providerName: "Lola Health",
      measurementCount: 45,
      measurementType: "biomarkers",
      collectionMethod: "Venous blood draw at a partner clinic",
      turnaroundText: "2–3 working days",
      category: "General health",
    });
    expect(summary).toContain("45 biomarkers");
    expect(summary).toContain("Lola Health");
    expect(summary).toContain("2–3 working days");
  });

  it("uses singular labels and non-biomarker measurement types", () => {
    expect(
      buildTestSummary({ testName: "Galleri", measurementCount: 1, measurementType: "cancers" }),
    ).toContain("1 cancer signal");
  });

  it("returns an empty string when there is nothing substantive to say", () => {
    expect(buildTestSummary({ testName: "Mystery test" })).toBe("");
  });

  it("prefers the provider's own description", () => {
    expect(
      resolveTestSummary("Provider copy.", { testName: "X", measurementCount: 10 }),
    ).toBe("Provider copy.");
  });

  it("falls back to a generated summary when the description is blank", () => {
    expect(resolveTestSummary("   ", { testName: "X", measurementCount: 10 })).toContain(
      "10 biomarkers",
    );
  });
});
