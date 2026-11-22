import { describe, expect, it } from "vitest";
import {
  matchesEducationalPanel,
  selectEducationalProviders,
  resolveSimilarCategory,
  getSimilarCatalogueTests,
  type CatalogueRow,
} from "./educational-test-catalogue";

const row = (overrides: Partial<CatalogueRow> = {}): CatalogueRow =>
  ({
    id: "11111111-1111-4111-8111-111111111111",
    provider_id: "medichecks",
    test_name: "General health blood test",
    category_primary: "general-health",
    biomarkers_list: ["Serum Iron", "Ferritin", "Vitamin D (25-OH)"],
    biomarker_count: 3,
    total_expected_cost: 80,
    price: 45,
    url: "https://www.medichecks.com/products/general-health-blood-test",
    is_addon: false,
    turnaround_days_text: "Results in 3 working days (estimated)",
    collection_method: "Venous draw",
    sample_type: "blood",
    location_options: ["Clinic"],
    clinic_visit_available: true,
    home_kit_available: false,
    collection_fee_amount: 35,
    collection_fee_type: "fixed",
    collection_fee_note: null,
    clinical_review_fee: 0,
    price_checked_at: "2026-11-22T00:00:00Z",
    updated_at: null,
    ...overrides,
  }) as CatalogueRow;

describe("educational catalogue matching", () => {
  it("matches general health panels, not standalone unrelated markers", () => {
    expect(matchesEducationalPanel(row(), "general-health")).toBe(true);
    expect(
      matchesEducationalPanel(
        row({ test_name: "Vitamin D", category_primary: "vitamins" }),
        "general-health",
      ),
    ).toBe(false);
  });
  it("requires testosterone in male hormone panels", () => {
    expect(
      matchesEducationalPanel(
        row({
          test_name: "Men’s hormone panel",
          biomarkers_list: ["Testosterone", "LH"],
        }),
        "male-hormones",
      ),
    ).toBe(true);
    expect(
      matchesEducationalPanel(
        row({ test_name: "Male hormone panel", biomarkers_list: ["LH"] }),
        "male-hormones",
      ),
    ).toBe(false);
    expect(
      matchesEducationalPanel(
        row({
          test_name: "Female hormone panel",
          biomarkers_list: ["Testosterone"],
        }),
        "male-hormones",
      ),
    ).toBe(false);
  });
  it.each(["female-hormones", "well-woman"] as const)(
    "matches female hormone and well woman panels for %s",
    (panel) => {
      expect(
        matchesEducationalPanel(
          row({ test_name: "Female hormone panel" }),
          panel,
        ),
      ).toBe(true);
      expect(
        matchesEducationalPanel(
          row({ test_name: "Well woman blood test" }),
          panel,
        ),
      ).toBe(true);
      expect(
        matchesEducationalPanel(
          row({ test_name: "Male hormone panel" }),
          panel,
        ),
      ).toBe(false);
    },
  );
  it("requires ferritin and iron, not ferritin or binding capacity alone", () => {
    expect(matchesEducationalPanel(row(), "iron-profile")).toBe(true);
    expect(
      matchesEducationalPanel(
        row({ biomarkers_list: ["Ferritin"] }),
        "iron-profile",
      ),
    ).toBe(false);
    expect(
      matchesEducationalPanel(
        row({ biomarkers_list: ["Ferritin", "Total iron binding capacity"] }),
        "iron-profile",
      ),
    ).toBe(false);
  });
  it("uses vitamin D biomarker evidence", () => {
    expect(
      matchesEducationalPanel(
        row({ biomarkers_list: ["25-Hydroxyvitamin D"] }),
        "vitamin-d",
      ),
    ).toBe(true);
    expect(
      matchesEducationalPanel(
        row({ test_name: "Vitamin D test", biomarkers_list: ["Vitamin B12"] }),
        "vitamin-d",
      ),
    ).toBe(false);
  });
  it("matches cholesterol and lipid panels", () => {
    expect(
      matchesEducationalPanel(
        row({ test_name: "Cholesterol blood test" }),
        "lipid-profile",
      ),
    ).toBe(true);
    expect(
      matchesEducationalPanel(
        row({ test_name: "Lipid profile" }),
        "lipid-profile",
      ),
    ).toBe(true);
    expect(matchesEducationalPanel(row(), "lipid-profile")).toBe(false);
  });
  it("sorts by view total expected cost and deduplicates IDs", () => {
    const cheap = row({
      id: "22222222-2222-4222-8222-222222222222",
      price: 70,
      total_expected_cost: 70,
    });
    const providers = selectEducationalProviders(
      [row(), cheap, row()],
      "general-health",
    );
    expect(providers.map((provider) => provider.price)).toEqual([70, 80]);
  });
  it("books by catalogue ID through the tracked redirect, never the fixture URL", () => {
    const provider = selectEducationalProviders([row()], "general-health")[0];
    expect(provider?.bookingUrl).toBe(
      "/api/public/affiliate-click?test=11111111-1111-4111-8111-111111111111&pl=comparison&src=%2Ftest%2Fgeneral-health",
    );
    expect(
      selectEducationalProviders(
        [row({ url: "https://www.medichecks.com/" })],
        "general-health",
      ),
    ).toEqual([]);
  });
  it("keeps missing count and cost unknown, never zero or a fabricated price", () => {
    const provider = selectEducationalProviders(
      [
        row({
          biomarker_count: null,
          biomarkers_list: null,
          total_expected_cost: null,
        }),
      ],
      "general-health",
    )[0];
    expect(provider?.biomarkers).toBeNull();
    expect(provider?.price).toBeNull();
  });
  it("excludes add-ons from standalone panel comparisons", () => {
    expect(
      selectEducationalProviders([row({ is_addon: true })], "general-health"),
    ).toEqual([]);
  });
  it("uses canonical category then category IDs, skipping unknown categories", async () => {
    expect(resolveSimilarCategory("hormones", ["general-health"])).toBe(
      "hormones",
    );
    expect(resolveSimilarCategory(null, ["", "fitness"])).toBe("fitness");
    expect(resolveSimilarCategory(null, [])).toBeNull();
    expect(await getSimilarCatalogueTests(null)).toEqual([]);
  });
});
