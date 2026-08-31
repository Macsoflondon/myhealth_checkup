import { describe, expect, it } from "vitest";
import { isJunkTestName } from "./is-junk-test-name";

describe("isJunkTestName", () => {
  it.each([
    "Medichecks E-Gift Card",
    "collection method - urine in-store",
    "collection method - urine nurse-visit",
    "Visit a Medichecks partner clinic [collection method]",
    "Phlebotomy (Venous draw) at clinic",
    "Biological Kit",
    "Flu Vaccine",
    "HPV Vaccine - 1 dose",
  ])("rejects non-test catalogue entry %s", (name) => {
    expect(isJunkTestName(name)).toBe(true);
  });

  it.each([
    "Advanced Well Man Blood Test",
    "Vitamin D Blood Test",
    "Core Health 45",
  ])("retains genuine test %s", (name) => {
    expect(isJunkTestName(name)).toBe(false);
  });
});
