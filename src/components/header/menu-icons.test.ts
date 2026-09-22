import { describe, expect, it } from "vitest";
import {
  CATEGORY_MENU_ICONS,
  categoryMenuIconFor,
  resolveCategoryMenuName,
} from "@/components/header/menuIcons";

describe("category menu accents", () => {
  it("keeps all eight canonical categories visually distinct", () => {
    const colours = Object.values(CATEGORY_MENU_ICONS).map(({ color }) => color);
    expect(colours).toHaveLength(8);
    expect(new Set(colours).size).toBe(8);
  });

  it.each([
    ["Women's Health", "Women's Health", "#7C3AED"],
    ["womens-health", "Women's Health", "#7C3AED"],
    ["Thyroid", "General Wellness", "#22c0d4"],
    ["sports-performance", "Sports & Fitness", "#2563EB"],
    ["fertility", "Fertility - Prenatal", "#C026D3"],
    ["at-home", "At Home Test Kits", "#C2410C"],
    ["unknown-category", "General Wellness", "#22c0d4"],
  ])("resolves %s to %s", (input, expectedName, expectedColour) => {
    expect(resolveCategoryMenuName(input)).toBe(expectedName);
    expect(categoryMenuIconFor(input).color).toBe(expectedColour);
  });
});