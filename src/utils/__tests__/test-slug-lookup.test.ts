import { describe, expect, it } from "vitest";
import { matchTestBySlug } from "@/utils/testSlugLookup";

const homocysteineNullId = {
  test_name: "Homocysteine Blood Test",
  provider_test_id: null,
};
const ferritin = {
  test_name: "Ferritin Blood Test",
  provider_test_id: "ferritin-blood-test",
};

describe("matchTestBySlug", () => {
  it("resolves ferritin to Ferritin Blood Test even when a null-id row is listed first", () => {
    // Regression: testId.includes("") matched the first null provider_test_id
    // row, so /clinilabs/ferritin rendered Homocysteine.
    expect(matchTestBySlug("ferritin", [homocysteineNullId, ferritin])).toBe(
      ferritin,
    );
  });

  it("returns null when nothing matches", () => {
    expect(
      matchTestBySlug("nonexistent-marker", [homocysteineNullId, ferritin]),
    ).toBeNull();
  });

  it("still wins on an exact name slug", () => {
    expect(
      matchTestBySlug("ferritin-blood-test", [homocysteineNullId, ferritin]),
    ).toBe(ferritin);
  });

  it("matches name variations before any partial provider_test_id match", () => {
    const other = {
      test_name: "Iron Studies",
      provider_test_id: "ferritin-panel-plus",
    };
    expect(matchTestBySlug("ferritin", [other, ferritin])).toBe(ferritin);
  });

  it("prefers the shortest provider_test_id on partial matches", () => {
    const short = { test_name: "A", provider_test_id: "x-ferritin" };
    const long = { test_name: "B", provider_test_id: "x-ferritin-long" };
    expect(matchTestBySlug("ferritin", [long, short])).toBe(short);
    expect(matchTestBySlug("ferritin", [short, long])).toBe(short);
  });

  it("skips rows with null or blank provider_test_id in partial matching", () => {
    const blank = { test_name: "Blank Id", provider_test_id: "   " };
    expect(matchTestBySlug("zzz", [homocysteineNullId, blank])).toBeNull();
  });
});
