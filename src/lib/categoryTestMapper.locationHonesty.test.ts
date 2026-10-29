import { describe, expect, it } from "vitest";
import {
  mapProviderTestRow,
  mapProviderTestRowVariants,
  type ProviderTestRow,
} from "@/lib/categoryTestMapper";

/**
 * Regression guard for a real bug found during the 2026-10-20 test-card audit
 * (pass 3): `mapProviderTestRow`'s `collection` label fell through to the
 * literal string "Home Kit" whenever `clinic_visit_available` was falsy —
 * including when `home_kit_available` was ALSO false (or null), which is
 * exactly the "neither option confirmed" case the fallback should read as
 * unknown, not default to either option. Live on 2 real Medichecks rows at
 * the time this was found (`provider_tests` where both flags are falsy).
 *
 * This label round-trips: `mapProviderTestRow` turns the two booleans into a
 * `collection` string, and `fromCategoryTestItem`/`fromLegacyUnified` in
 * `universalTestAdapter.ts` turn that string back into booleans via a regex
 * match. A test here guards the string; `unifiedCardAdapter.price.test.ts`
 * is the sibling precedent for this style of adapter-chain regression test.
 */

const BASE_ROW: ProviderTestRow = {
  id: "row-1",
  provider_id: "medichecks",
  test_name: "Example Test",
  description: null,
  price: 49,
  base_price: null,
  url: "https://example.com/test",
  image_url: null,
  biomarker_count: 5,
  biomarkers_list: null,
  turnaround_days_text: "3 working days",
  is_popular: false,
  popularity_rank: null,
  sample_type: null,
  home_kit_available: null,
  clinic_visit_available: null,
  home_phlebotomy_cost: null,
  category: null,
  source_section_label: null,
  canonical_category: null,
};

describe("mapProviderTestRow collection-label honesty", () => {
  it("keeps all 36 supplied biomarkers instead of counting a six-marker preview", () => {
    const biomarkers = Array.from({ length: 36 }, (_, i) => `Marker ${i + 1}`);
    const item = mapProviderTestRow(
      { ...BASE_ROW, biomarker_count: 36, biomarkers_list: biomarkers },
      "",
    );
    expect(item.biomarkerCount).toBe(36);
    expect(item.biomarkers).toEqual(biomarkers);
  });

  it("preserves venous clinic and home-nurse options even with no selected collection fee", () => {
    const items = mapProviderTestRowVariants(
      {
        ...BASE_ROW,
        sample_type: "venous",
        home_kit_available: false,
        clinic_visit_available: true,
        home_phlebotomy_cost: 59,
      },
      "",
    );
    expect(items).toHaveLength(1);
    expect(items[0].routeVariant?.route).toBe("venous");
    expect(items[0].routeVariant?.secondary?.fee).toBe(59);
  });

  it("neither flag true (both false) reads as unknown, not 'Home Kit'", () => {
    const row: ProviderTestRow = {
      ...BASE_ROW,
      home_kit_available: false,
      clinic_visit_available: false,
    };
    const item = mapProviderTestRow(row, "#000000");
    expect(item.collection).toBe("Not stated");
  });

  it("neither flag set (both null) also reads as unknown", () => {
    const row: ProviderTestRow = {
      ...BASE_ROW,
      home_kit_available: null,
      clinic_visit_available: null,
    };
    const item = mapProviderTestRow(row, "#000000");
    expect(item.collection).toBe("Not stated");
  });

  it("home_kit_available alone true still says 'Home Kit'", () => {
    const row: ProviderTestRow = {
      ...BASE_ROW,
      home_kit_available: true,
      clinic_visit_available: false,
    };
    const item = mapProviderTestRow(row, "#000000");
    expect(item.collection).toBe("Home Kit");
  });

  it("clinic_visit_available alone true still says 'Clinic'", () => {
    const row: ProviderTestRow = {
      ...BASE_ROW,
      home_kit_available: false,
      clinic_visit_available: true,
    };
    const item = mapProviderTestRow(row, "#000000");
    expect(item.collection).toBe("Clinic");
  });

  it("both true still says 'Home Kit / Clinic'", () => {
    const row: ProviderTestRow = {
      ...BASE_ROW,
      home_kit_available: true,
      clinic_visit_available: true,
    };
    const item = mapProviderTestRow(row, "#000000");
    expect(item.collection).toBe("Home Kit / Clinic");
  });
});
