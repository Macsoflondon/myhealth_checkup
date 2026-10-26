import { describe, expect, it } from "vitest";
import {
  describeBiomarkers,
  isPanelEntry,
  parseCollection,
  resolveCollection,
  stripCollectionFeeText,
} from "@/lib/resolve-test-fields";
import { headerPriceParts } from "@/lib/comparison-header-price";

describe("headerPriceParts", () => {
  it("Clinilabs FBC shows the total with a blood draw line", () => {
    const r = headerPriceParts({
      price: 50,
      collectionFeeType: "from",
      collectionFeeAmount: 30,
    });
    expect(`£${r.total.toFixed(2)}`).toBe("£80.00");
    expect(r.breakdown).toBe("Test £50.00 + blood draw from £30");
  });
  it("Medichecks FBC self-arranged keeps the test price with no extra line", () => {
    const r = headerPriceParts({
      price: 59,
      collectionFeeType: "self_arranged",
      collectionFeeAmount: 35,
    });
    expect(`£${r.total.toFixed(2)}`).toBe("£59.00");
    expect(r.breakdown).toBeNull();
  });
});

describe("describeBiomarkers", () => {
  it("lists panel entries instead of counting them", () => {
    const list = ["Full Blood Count (FBC) + Differential", "ESR"];
    expect(isPanelEntry(list[0])).toBe(true);
    expect(isPanelEntry("ESR")).toBe(false);
    expect(
      describeBiomarkers({ biomarker_count: 2, biomarkers_list: list }),
    ).toEqual({
      count: null,
      label: "Full Blood Count (FBC) + Differential + ESR",
    });
  });
  it("counts a normal 15-item list", () => {
    const list = [
      "Haemoglobin",
      "Haematocrit",
      "RBC",
      "MCV",
      "MCH",
      "MCHC",
      "RDW",
      "WBC",
      "Neutrophils",
      "Lymphocytes",
      "Monocytes",
      "Eosinophils",
      "Basophils",
      "Platelets",
      "MPV",
    ];
    expect(describeBiomarkers({ biomarkers_list: list })).toEqual({
      count: 15,
      label: "15 biomarkers",
    });
  });
  it("handles an empty list", () => {
    expect(describeBiomarkers({ biomarkers_list: [] })).toEqual({
      count: null,
      label: "Not stated by provider",
    });
  });
  it("matches names ending in profile or panel", () => {
    expect(isPanelEntry("Liver Profile")).toBe(true);
    expect(isPanelEntry("Thyroid panel")).toBe(true);
    expect(isPanelEntry("UK allergy panel")).toBe(true);
  });
  it("ignores profile or panel inside a longer phrase", () => {
    expect(isPanelEntry("Cholesterol, part of lipid profile")).toBe(false);
    expect(isPanelEntry("Ferritin and iron profile")).toBe(false);
    expect(isPanelEntry("Panel review")).toBe(false);
  });
  it("44-entry list with one FBC entry", () => {
    const list = [
      "Full Blood Count (FBC)",
      ...Array.from({ length: 43 }, (_, i) => `Marker ${i + 1}`),
    ];
    expect(
      describeBiomarkers({ biomarker_count: 44, biomarkers_list: list }),
    ).toEqual({
      count: null,
      label: "44 tests listed, including 1 panel",
    });
  });
  it("18-entry list with two panel entries", () => {
    const list = [
      "Liver Profile",
      "Kidney panel",
      ...Array.from({ length: 16 }, (_, i) => `Marker ${i + 1}`),
    ];
    expect(describeBiomarkers({ biomarkers_list: list })).toEqual({
      count: null,
      label: "18 tests listed, including 2 panels",
    });
  });
  it("singular label for one marker", () => {
    expect(describeBiomarkers({ biomarkers_list: ["Ferritin"] }).label).toBe(
      "1 biomarker",
    );
  });
});

describe("parseCollection", () => {
  it.each([
    ["Blood", "Blood"],
    ["Venous blood", "Venous draw"],
    ["Finger-prick blood", "At-home kit"],
    ["Finger-prick or Venous", "At-home kit & venous draw"],
    ["Capillary blood (QuickDraw upper-arm device)", "At-home kit"],
    ["Nail clipping", "At-home kit"],
    ["Saliva", "At-home kit"],
  ])("%s → %s", (input, label) => {
    expect(parseCollection(input).label).toBe(label);
  });
  it("resolveCollection never treats bare blood as venous", () => {
    expect(resolveCollection({ sample_type: "Blood" }, "medichecks")).toBe(
      "Blood sample",
    );
  });
});

describe("stripCollectionFeeText", () => {
  it("removes stale phlebotomy fee wording", () => {
    const raw =
      "In-clinic appointment — venous blood draw (phlebotomy fee £21)";
    expect(stripCollectionFeeText(raw)).toBe(
      "In-clinic appointment — venous blood draw",
    );
    expect(
      resolveCollection({ collection_method: raw }, "medical-diagnosis"),
    ).not.toMatch(/£/);
  });
});
