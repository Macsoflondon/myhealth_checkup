import { describe, expect, it } from "vitest";
import { wellnessCategoryVisuals } from "./wellness-category-visuals";
import { findSubcategory } from "@/config/subcategoryMap";

const titles = Object.fromEntries(
  Object.entries(wellnessCategoryVisuals).map(([path, v]) => [path, v.title]),
);

describe("General Wellness picture cards", () => {
  it("use the destination category names as titles", () => {
    expect(titles).toEqual({
      "/wellness": "General health",
      "/wellness?subcategory=heart-health": "Heart health",
      "/wellness?subcategory=cholesterol": "Cholesterol",
      "/wellness?subcategory=diabetes": "Diabetes",
      "/wellness?subcategory=iron-anaemia": "Iron and anaemia",
      "/wellness?subcategory=liver": "Liver",
      "/wellness?subcategory=kidney": "Kidney",
      "/wellness?subcategory=vitamins": "Vitamins and nutrition",
      "/wellness?subcategory=allergy": "Allergy",
      "/wellness?subcategory=thyroid": "Thyroid",
    });
  });

  it("match the heading of the page each card opens", () => {
    for (const [path, v] of Object.entries(wellnessCategoryVisuals)) {
      const slug = new URL(path, "https://x").searchParams.get("subcategory");
      if (!slug) continue;
      const sub = findSubcategory("wellness", slug);
      expect(sub?.label.toLowerCase().startsWith(v.title.toLowerCase())).toBe(true);
    }
  });

  it("never list panels or repeat the card title as a biomarker", () => {
    for (const v of Object.values(wellnessCategoryVisuals)) {
      for (const b of v.biomarkers) {
        expect(["Liver", "Kidney", "Thyroid", "Iron"]).not.toContain(b);
        expect(b.toLowerCase()).not.toBe(v.title.toLowerCase());
      }
    }
  });

  it("show the real iron and general-health markers", () => {
    expect(wellnessCategoryVisuals["/wellness"]?.biomarkers).toEqual(["Full blood count", "ALT", "eGFR"]);
    expect(wellnessCategoryVisuals["/wellness?subcategory=iron-anaemia"]?.biomarkers).toEqual([
      "Ferritin",
      "Serum iron",
      "Transferrin saturation",
    ]);
  });
});
