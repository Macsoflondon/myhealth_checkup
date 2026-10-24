import { describe, expect, it } from "vitest";
import {
  sanitiseProviderProse,
  stripCss,
} from "../../../supabase/functions/_shared/scrape/prose";
import { parseMedichecksProductPage } from "../../../supabase/functions/_shared/scrape/medichecksProductPage";

describe("sanitiseProviderProse", () => {
  it("returns null for the stored Medichecks preparation fragment", () => {
    expect(
      sanitiseProviderProse("#block-text_FD4Lfp { display: none }."),
    ).toBeNull();
  });

  it("returns null for the stored Medichecks limitations fragment", () => {
    expect(
      sanitiseProviderProse("#block-text_FwzBLH { display: none }."),
    ).toBeNull();
  });

  it("keeps provider prose verbatim and drops surrounding CSS", () => {
    expect(
      sanitiseProviderProse(
        "#block-text_FD4Lfp { display: none } Avoid exercise for 48 hours before your test.",
      ),
    ).toBe("Avoid exercise for 48 hours before your test.");
  });

  it("removes style elements and element-selector rules", () => {
    expect(
      stripCss("<style>.a{color:red}</style>p { margin: 0 } Fast overnight."),
    ).not.toMatch(/[{}]/);
  });

  it("returns null for empty, whitespace or missing values", () => {
    expect(sanitiseProviderProse("")).toBeNull();
    expect(sanitiseProviderProse("   ")).toBeNull();
    expect(sanitiseProviderProse(null)).toBeNull();
    expect(sanitiseProviderProse(undefined)).toBeNull();
  });

  it("leaves ordinary prose untouched", () => {
    const text = "Take your sample before 10am. Drink water as normal.";
    expect(sanitiseProviderProse(text)).toBe(text);
  });
});

describe("parseMedichecksProductPage CSS-only sections", () => {
  it("stores null when a section contains only a stylesheet rule", () => {
    const doc = `
      <h3>How to prepare for your test</h3><div>#block-text_FD4Lfp { display: none }</div>
      <h3>Test limitations</h3><div>#block-text_FwzBLH { display: none }</div>
      <h3>Reviews</h3>`;
    const detail = parseMedichecksProductPage(doc);
    expect(detail.preparationNotes).toBeNull();
    expect(detail.testLimitations).toBeNull();
  });
});
