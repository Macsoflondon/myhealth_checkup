import { describe, expect, it } from "vitest";
import {
  HOMEPAGE_PROVIDER_IDS,
  selectHomepageProviderTests,
  type ShowcaseCandidate,
} from "./homepage-provider-selection";

const candidates: ShowcaseCandidate[] = HOMEPAGE_PROVIDER_IDS.flatMap(
  (provider_id) => [
    {
      id: `${provider_id}-a`,
      provider_id,
      test_name: "General health profile",
      price: 60,
      url: "https://example.com/test",
      is_popular: provider_id === "lola-health",
      popularity_rank: provider_id === "lola-health" ? 1 : null,
    },
    {
      id: `${provider_id}-b`,
      provider_id,
      test_name: "Thyroid profile",
      price: 50,
      url: "https://example.com/thyroid",
      is_popular: false,
    },
  ],
);

describe("homepage provider coverage", () => {
  it("represents all eight providers in the upper eight-card section", () => {
    const selected = selectHomepageProviderTests(candidates, 8);
    expect(selected).toHaveLength(8);
    expect(selected.map((test) => test.provider_id)).toEqual([
      "lola-health",
      "goodbody-clinic",
      "medichecks",
      "randox",
      "london-medical-laboratory",
      "london-health-company",
      "medical-diagnosis",
      "clinilabs",
    ]);
  });
  it("includes all eight before a provider repeats in the lower nine-card section", () => {
    const selected = selectHomepageProviderTests(candidates, 9);
    expect(selected).toHaveLength(9);
    expect(
      new Set(selected.slice(0, 8).map((test) => test.provider_id)).size,
    ).toBe(8);
    expect(selected[8].provider_id).toBe("lola-health");
  });
  it("never fabricates popularity for unranked providers", () => {
    const selected = selectHomepageProviderTests(candidates, 8);
    expect(
      selected
        .filter((test) => test.is_popular)
        .map((test) => test.provider_id),
    ).toEqual(["lola-health"]);
    expect(
      selected.find((test) => test.provider_id === "randox")?.popularity_rank,
    ).toBeNull();
  });
  it("prioritises provider ranks over price or a name's alphabetical position", () => {
    const ranked = {
      ...candidates[0],
      id: "ranked",
      test_name: "Z profile",
      price: 200,
      popularity_rank: 1,
    };
    const lowerRank = {
      ...candidates[0],
      id: "lower",
      test_name: "A profile",
      price: 10,
      popularity_rank: 2,
    };
    expect(selectHomepageProviderTests([lowerRank, ranked], 1)[0].id).toBe(
      "ranked",
    );
  });
  it("excludes add-ons, missing prices, missing links and non-test appointments", () => {
    const base = candidates[0];
    expect(
      selectHomepageProviderTests([
        { ...base, id: "addon", is_addon: true },
        { ...base, id: "unpriced", price: null },
        { ...base, id: "unlinked", url: null },
        { ...base, id: "appointment", test_name: "Blood draw appointment" },
      ]),
    ).toEqual([]);
  });
  it("deduplicates provider test names without hiding a distinct provider's same panel", () => {
    const selected = selectHomepageProviderTests([
      candidates[0],
      { ...candidates[0], id: "duplicate" },
      candidates[2],
    ]);
    expect(selected.map((test) => test.id)).toEqual([
      "lola-health-a",
      "goodbody-clinic-a",
    ]);
  });
  it("excludes Lola add-ons whose stored flag contradicts provider evidence", () => {
    expect(
      selectHomepageProviderTests([
        {
          ...candidates[0],
          test_name: "Omega 6:3 Ratio (ARA:EPA)",
          is_addon: false,
          description:
            "This add-on measures the balance between arachidonic acid (ARA) and eicosapentaenoic acid (EPA).",
        },
      ]),
    ).toEqual([]);
  });
});
