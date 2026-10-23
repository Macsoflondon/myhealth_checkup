import { describe, expect, it } from "vitest";
import {
  transformRawTestToEnhanced,
  type RawTestRow,
} from "./useEnhancedComparison";

/**
 * Regression guard for the CancerComparisonPage data-honesty fix (2026-10-23
 * test-card audit, pass 4). `transformRawTestToEnhanced` (the adapter behind
 * `CancerComparisonPage`'s browse grid, compare table, and biomarker group —
 * the only consumers of `useEnhancedComparison`) previously fabricated five
 * separate fields whenever a row's real data was missing: it keyword-matched
 * the test's free-text description to invent a biomarker count/list, defaulted
 * turnaround to a flat 3 days, defaulted `home_kit_available` to `true` on a
 * null flag, and hardcoded `["UKAS", "CQC"]` as every single test's
 * accreditations regardless of its real `lab_*` flags. Each must now come
 * through as an honest `null`/`[]`/real-data-only value instead.
 */

const baseRow: RawTestRow = {
  id: "row-1",
  test_name: "Test",
  provider_id: "medichecks",
  price: 99,
};

describe("transformRawTestToEnhanced honesty", () => {
  it("keeps a null price as null, never coerced to 0", () => {
    const result = transformRawTestToEnhanced({ ...baseRow, price: null });
    expect(result.basePrice).toBeNull();
    expect(result.totalExpectedCost).toBeNull();
  });

  it("passes a real price through unchanged", () => {
    const result = transformRawTestToEnhanced({ ...baseRow, price: 149.5 });
    expect(result.basePrice).toBe(149.5);
  });

  it("never invents a biomarker count from the description when the real count is missing", () => {
    const result = transformRawTestToEnhanced({
      ...baseRow,
      biomarker_count: null,
      biomarkers_list: null,
      description:
        "Checks cholesterol, glucose, HbA1c, TSH, vitamin D, iron, liver, kidney, testosterone, oestrogen, PSA and CRP",
    });
    // The old keyword-extractor would have matched every one of these and
    // returned a fabricated count (or its own invented floor of 5).
    expect(result.biomarkerCount).toBeNull();
    expect(result.biomarkersList).toBeNull();
  });

  it("passes a real biomarker count and list through unchanged", () => {
    const result = transformRawTestToEnhanced({
      ...baseRow,
      biomarker_count: 12,
      biomarkers_list: ["Ferritin", "TSH"],
    });
    expect(result.biomarkerCount).toBe(12);
    expect(result.biomarkersList).toEqual(["Ferritin", "TSH"]);
  });

  it("returns null turnaround instead of a fabricated 3 days when the text is missing", () => {
    const result = transformRawTestToEnhanced({
      ...baseRow,
      turnaround_days_text: null,
    });
    expect(result.turnaroundDays).toBeNull();
  });

  it("parses a real turnaround string instead of guessing", () => {
    const result = transformRawTestToEnhanced({
      ...baseRow,
      turnaround_days_text: "Results in 2-3 working days",
    });
    expect(result.turnaroundDays).toBe(3);
  });

  it("returns null home-kit/clinic availability instead of defaulting to true/false on a null flag", () => {
    const result = transformRawTestToEnhanced({
      ...baseRow,
      home_kit_available: null,
      clinic_visit_available: null,
    });
    expect(result.homeKitAvailable).toBeNull();
    expect(result.clinicVisitAvailable).toBeNull();
  });

  it("derives accreditations from the row's real lab_* flags, never a hardcoded guess", () => {
    const result = transformRawTestToEnhanced({
      ...baseRow,
      lab_ukas_accredited: false,
      lab_cqc_regulated: false,
      lab_iso15189: true,
    });
    // The old code returned ["UKAS", "CQC"] for every single test here,
    // regardless of these flags.
    expect(result.accreditations).toEqual(["ISO 15189"]);
  });

  it("returns an empty accreditations array, never a guessed badge, when a row has no real flags set", () => {
    const result = transformRawTestToEnhanced({
      ...baseRow,
      lab_ukas_accredited: false,
      lab_cqc_regulated: null,
      lab_iso15189: null,
    });
    expect(result.accreditations).toEqual([]);
  });
});
