import { describe, it, expect } from "vitest";
import {
  buildCandidates,
  toRelatedTest,
  validateRecommendedIds,
  type CatalogueTest,
} from "../related-tests";

const row = (o: Partial<CatalogueTest>): CatalogueTest => ({
  id: "a",
  provider_id: "medichecks",
  provider_name: "Medichecks",
  test_name: "Test",
  canonical_category: "thyroid",
  biomarkers_list: [],
  biomarker_count: null,
  price: 50,
  total_expected_cost: null,
  ...o,
});

describe("related tests", () => {
  const current = row({
    id: "cur",
    canonical_category: "thyroid",
    biomarkers_list: ["TSH", "Ferritin"],
  });

  it("excludes the current test, its category, duplicates and Thriva", () => {
    const c = buildCandidates(current, [
      row({ id: "cur", canonical_category: "vitamins" }),
      row({ id: "t2", canonical_category: "thyroid" }),
      row({ id: "v1", canonical_category: "vitamins" }),
      row({ id: "v1", canonical_category: "vitamins" }),
      row({ id: "x", provider_id: "thriva", canonical_category: "iron" }),
    ]);
    expect(c.map((r) => r.id)).toEqual(["v1"]);
  });

  it("caps each category", () => {
    const rows = Array.from({ length: 10 }, (_, i) =>
      row({ id: `v${i}`, canonical_category: "vitamins" }),
    );
    expect(buildCandidates(current, rows, 3)).toHaveLength(3);
  });

  it("drops ids the model invented and keeps at most four", () => {
    const pool = ["a", "b", "c", "d", "e"].map((id) => row({ id }));
    expect(
      validateRecommendedIds(["zz", "a", "a", "b", "c", "d", "e"], pool),
    ).toEqual(["a", "b", "c", "d"]);
    expect(validateRecommendedIds("nope", pool)).toEqual([]);
  });

  it("counts biomarkers not already in the current test and prefers total expected cost", () => {
    const r = toRelatedTest(
      current,
      row({
        id: "v",
        biomarkers_list: ["ferritin", "Vitamin D"],
        price: 40,
        total_expected_cost: 75,
      }),
    );
    expect(r.newBiomarkers).toBe(1);
    expect(r.totalExpectedCost).toBe(75);
  });
});
