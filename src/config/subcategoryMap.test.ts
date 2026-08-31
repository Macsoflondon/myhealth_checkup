import { describe, expect, it } from "vitest";
import { findSubcategory, testMatchesSubcategory } from "./subcategoryMap";

const maleFertility = findSubcategory("fertility", "male-fertility")!;
const femaleFertility = findSubcategory("fertility", "female-fertility")!;
const mensHealthFertility = findSubcategory("mens-health", "fertility")!;
const womensHealthFertility = findSubcategory("womens-health", "fertility")!;

const maleTests = [
  "Essentials Male fertility test",
  "Ultimate Male Fertility Test",
  "INFERTILITY Profile - Male",
  "Male Fertility Sperm Test",
  "Advanced Male Fertility Hormone Blood Test",
];

const femaleTests = [
  "Essential Female Fertility Blood Test",
  "Advanced Female Fertility Check",
  "Ultimate Female Fertility Blood Test",
  "INFERTILITY Profile - Female",
];

describe("fertility sub-category matching", () => {
  it.each(maleTests)("keeps %s in male fertility only", (title) => {
    expect(testMatchesSubcategory(maleFertility, { title })).toBe(true);
    expect(testMatchesSubcategory(femaleFertility, { title })).toBe(false);
  });

  it.each(femaleTests)("keeps %s in female fertility only", (title) => {
    expect(testMatchesSubcategory(femaleFertility, { title })).toBe(true);
    expect(testMatchesSubcategory(maleFertility, { title })).toBe(false);
  });

  it("does not leak female panels into the Men's Health fertility tab", () => {
    for (const title of femaleTests) {
      expect(testMatchesSubcategory(mensHealthFertility, { title })).toBe(false);
    }
    for (const title of maleTests) {
      expect(testMatchesSubcategory(mensHealthFertility, { title })).toBe(true);
    }
  });

  it("does not leak male panels into the Women's Health fertility tab", () => {
    for (const title of maleTests) {
      expect(testMatchesSubcategory(womensHealthFertility, { title })).toBe(false);
    }
    for (const title of femaleTests) {
      expect(testMatchesSubcategory(womensHealthFertility, { title })).toBe(true);
    }
  });
});
