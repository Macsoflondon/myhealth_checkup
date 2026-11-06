import { describe, expect, it } from "vitest";
import {
  CONSUMER_CATEGORIES,
  SEPARATE_SECTION_RAW_LABELS,
  compareConsumerCategories,
  consumerCategoryFor,
  isSeparateSectionCategory,
  rawFilterFor,
  resolveConsumerCategory,
} from "../biomarker-categories";

/** Raw labels in biomarker_library_public on 4 November 2026. */
const PRODUCTION_RAW_LABELS = [
  "Allergy & Immunology",
  "Autoimmune & Immunology",
  "Bone Health",
  "Cancer Markers",
  "Cancer Screening",
  "Cardiac",
  "Cardiac Markers",
  "Cardiovascular",
  "Cholesterol & Heart",
  "Diabetes",
  "Diabetes & Metabolic",
  "Digestive",
  "Digestive Health",
  "Electrolytes",
  "Enzymes",
  "Fertility",
  "Full Blood Count",
  "Genetics & Pharmacogenomics",
  "Gut Health",
  "Haematology",
  "Hormones",
  "Immunology",
  "Inborn Errors of Metabolism",
  "Infectious Disease",
  "Inflammation",
  "Iron & Nutrients",
  "Iron Status",
  "Kidney Function",
  "Lipid Profile",
  "Liver & Metabolic",
  "Liver Function",
  "Metabolic",
  "Minerals",
  "Neurology & Mental Health",
  "Other",
  "Pulmonary & Respiratory",
  "Reproductive Health",
  "Specialist",
  "Therapeutic Drug Monitoring",
  "Thyroid",
  "Toxicology & Heavy Metals",
  "Vitamins",
  "Vitamins & Minerals",
];

const knownLabels = new Set([
  ...CONSUMER_CATEGORIES.map((c) => c.label),
  "Allergens",
  "Infection markers",
]);

describe("consumer category mapping", () => {
  it("maps all 43 production labels to a known consumer category", () => {
    expect(PRODUCTION_RAW_LABELS).toHaveLength(43);
    for (const raw of PRODUCTION_RAW_LABELS) {
      expect(knownLabels.has(consumerCategoryFor(raw)), raw).toBe(true);
    }
  });

  it("assigns each raw label to exactly one category", () => {
    const all = CONSUMER_CATEGORIES.flatMap((c) => c.rawLabels);
    expect(new Set(all).size).toBe(all.length);
  });

  it.each([
    [["Cardiac", "Cardiac Markers", "Cardiovascular"], "Heart"],
    [
      ["Diabetes", "Diabetes & Metabolic", "Metabolic"],
      "Diabetes and metabolism",
    ],
    [["Liver Function", "Liver & Metabolic"], "Liver"],
    [
      ["Vitamins", "Minerals", "Vitamins & Minerals", "Iron & Nutrients"],
      "Vitamins and minerals",
    ],
    [["Lipid Profile", "Cholesterol & Heart"], "Cholesterol and lipids"],
    [["Immunology", "Autoimmune & Immunology"], "Immunity and autoimmunity"],
    [["Digestive", "Digestive Health", "Gut Health"], "Digestive health"],
    [["Fertility", "Reproductive Health"], "Fertility and reproductive health"],
    [["Haematology", "Full Blood Count"], "Blood count"],
  ])("collapses %j into %s", (raws, label) => {
    for (const raw of raws) expect(consumerCategoryFor(raw)).toBe(label);
  });

  it("moves Ferritin and Iron into the iron group", () => {
    expect(consumerCategoryFor("Haematology", "ferritin")).toBe("Iron");
    expect(consumerCategoryFor("Vitamins", "iron")).toBe("Iron");
    expect(consumerCategoryFor("Bone Health", "iron-stores-ferritin")).toBe(
      "Iron",
    );
    expect(consumerCategoryFor("Iron Status", "transferrin")).toBe("Iron");
    // Other rows under those raw labels stay put.
    expect(consumerCategoryFor("Haematology", "haemoglobin")).toBe(
      "Blood count",
    );
  });

  it("keeps allergens and infection markers out of the main list", () => {
    expect(SEPARATE_SECTION_RAW_LABELS).toEqual([
      "Allergy & Immunology",
      "Infectious Disease",
    ]);
    expect(
      isSeparateSectionCategory(consumerCategoryFor("Allergy & Immunology")),
    ).toBe(true);
    expect(
      isSeparateSectionCategory(consumerCategoryFor("Infectious Disease")),
    ).toBe(true);
    expect(isSeparateSectionCategory(consumerCategoryFor("Thyroid"))).toBe(
      false,
    );
  });

  it("passes an unknown label through and files a missing one as other", () => {
    expect(consumerCategoryFor("Brand New Label")).toBe("Brand New Label");
    expect(consumerCategoryFor(null)).toBe("Other markers");
    expect(consumerCategoryFor("  ")).toBe("Other markers");
  });
});

describe("raw-label filtering", () => {
  it("returns every raw label behind a consumer category", () => {
    expect(rawFilterFor("Heart").rawLabels).toEqual([
      "Cardiac",
      "Cardiac Markers",
      "Cardiovascular",
    ]);
  });
  it("adds iron overrides to Iron and excludes them elsewhere", () => {
    const iron = rawFilterFor("Iron");
    expect(iron.rawLabels).toEqual(["Iron Status"]);
    expect(iron.includeSlugs).toEqual(
      expect.arrayContaining(["ferritin", "iron", "transferrin"]),
    );
    expect(iron.excludeSlugs).toEqual([]);
    const blood = rawFilterFor("Blood count");
    expect(blood.includeSlugs).toEqual([]);
    expect(blood.excludeSlugs).toContain("ferritin");
  });
  it("filters an unknown label by itself", () => {
    expect(rawFilterFor("Brand New Label").rawLabels).toEqual([
      "Brand New Label",
    ]);
  });
  it("resolves old raw-label links and consumer labels", () => {
    expect(resolveConsumerCategory("Cardiac Markers")).toBe("Heart");
    expect(resolveConsumerCategory("thyroid")).toBe("Thyroid");
    expect(resolveConsumerCategory("Vitamins and minerals")).toBe(
      "Vitamins and minerals",
    );
    expect(resolveConsumerCategory("")).toBeNull();
    expect(resolveConsumerCategory(undefined)).toBeNull();
  });
  it("orders known categories first, unknown ones after", () => {
    const sorted = ["Zeta", "Heart", "Thyroid", "Alpha"].sort(
      compareConsumerCategories,
    );
    expect(sorted).toEqual(["Thyroid", "Heart", "Alpha", "Zeta"]);
  });
});
