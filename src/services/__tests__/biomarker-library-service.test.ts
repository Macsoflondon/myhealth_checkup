import { describe, expect, it } from "vitest";
import {
  buildSearchFilter,
  biomarkerLibraryHref,
  sanitiseSearchTerm,
} from "@/services/BiomarkerLibraryService";
import { normaliseReferenceRanges } from "@/components/biomarker-library/biomarker-ranges";

describe("biomarker library search", () => {
  it("strips PostgREST control characters", () => {
    expect(sanitiseSearchTerm('fe(r),ri*"tin')).toBe("fe r ri tin");
  });
  it("searches name, abbreviation and synonyms", () => {
    const f = buildSearchFilter("ferritin");
    expect(f).toContain("biomarker_name.ilike.*ferritin*");
    expect(f).toContain("abbreviation.ilike.*ferritin*");
    expect(f).toContain('synonyms.cs.{"Ferritin"}');
  });
  it("returns null for an empty term", () => {
    expect(buildSearchFilter("  ,* ")).toBeNull();
  });
  it("builds the library deep link", () => {
    expect(biomarkerLibraryHref("vitamin-d")).toBe(
      "/biomarker-database?biomarker=vitamin-d",
    );
  });
});

describe("normaliseReferenceRanges", () => {
  it("formats min/max bands and drops nulls", () => {
    const r = normaliseReferenceRanges({
      both: { low: null, optimal: { min: 0, max: 30 }, high: { min: 31 } },
    });
    expect(r.both?.bands.map((b) => b.range)).toEqual(["0–30", "≥ 31"]);
  });
  it("returns nothing for empty input", () => {
    expect(normaliseReferenceRanges({ both: {} })).toEqual({});
    expect(normaliseReferenceRanges(null)).toEqual({});
  });
});
