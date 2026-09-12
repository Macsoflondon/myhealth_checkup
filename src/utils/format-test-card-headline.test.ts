import { describe, expect, it } from "vitest";
import { formatTestCardHeadline } from "./format-test-card-headline";

describe("formatTestCardHeadline", () => {
  it.each([
    ["Advanced Well Man Blood Test", "Advanced Well Man"],
    ["Advanced Thyroid Function blood test", "Advanced Thyroid Function"],
    ["Premium Complete BLOOD TEST   ", "Premium Complete"],
    ["Blood Test", "Blood Test"],
  ])("formats %s", (input, expected) => {
    expect(formatTestCardHeadline(input)).toBe(expected);
  });

  it("keeps blood test wording when it is not the terminal phrase", () => {
    expect(formatTestCardHeadline("Blood Test for Vitamin D — Home Kit")).toBe(
      "Blood Test for Vitamin D — Home Kit",
    );
  });

  it("keeps unrelated test names unchanged", () => {
    expect(formatTestCardHeadline("Allergy Complete")).toBe("Allergy Complete");
  });
});