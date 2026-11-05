import { describe, expect, it } from "vitest";
import {
  matchesComparisonName,
  selectHomepageComparisons,
} from "./homepage-comparisons";
import type { CatalogueComparisonPanel } from "@/design-system/live-catalogue-comparison";

const panel = (slug: string): CatalogueComparisonPanel => ({
  slug,
  name: slug,
  methodLabel: "Clinic blood draw",
  rows: [],
});

describe("homepage comparison coordination", () => {
  it("keeps male and female hormone tests in different panels", () => {
    expect(matchesComparisonName("Female Hormones 7", "male hormone")).toBe(
      false,
    );
    expect(
      matchesComparisonName(
        "Advanced Female Hormone Blood Test",
        "male hormone",
      ),
    ).toBe(false);
    expect(
      matchesComparisonName("Male Hormone Blood Test", "male hormone"),
    ).toBe(true);
  });
  it("never shows the same health test in the three tables at the same time", () => {
    const panels = [
      "full-blood-count",
      "thyroid",
      "male-hormones",
      "female-hormones",
      "thyroid",
    ].map(panel);
    for (const index of [0, 1, 2, 3, 4, 30, 100]) {
      const { upper, left, right } = selectHomepageComparisons(panels, index);
      expect(upper?.slug).toBe("full-blood-count");
      expect(new Set([upper?.slug, left?.slug, right?.slug]).size).toBe(3);
    }
  });
  it("leaves a slot unavailable rather than repeating a health test when data is limited", () => {
    const result = selectHomepageComparisons(
      [panel("full-blood-count"), panel("thyroid"), panel("thyroid")],
      20,
    );
    expect(result.left?.slug).toBe("thyroid");
    expect(result.right).toBeNull();
    expect(selectHomepageComparisons([], 0)).toEqual({
      upper: null,
      left: null,
      right: null,
    });
  });
});
