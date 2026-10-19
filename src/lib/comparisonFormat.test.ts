import { describe, expect, it } from "vitest";
import { formatCollectionFee, formatFeeAmount } from "./comparisonFormat";

describe("formatCollectionFee", () => {
  it("none", () => {
    expect(formatCollectionFee("none", null).label).toBe("None");
  });
  it("fixed", () => {
    expect(formatCollectionFee("fixed", 35).label).toBe("+£35");
  });
  it("from", () => {
    expect(formatCollectionFee("from", 30).label).toBe("from £30");
  });
  it("self_arranged with an amount", () => {
    expect(formatCollectionFee("self_arranged", 35).label).toBe(
      "Free if self-arranged, or from £35",
    );
  });
  it("self_arranged without an amount", () => {
    expect(formatCollectionFee("self_arranged", null).label).toBe(
      "Patient arranges own phlebotomy",
    );
  });
  it("keeps pence when the amount isn't whole", () => {
    expect(formatCollectionFee("fixed", 3.99).label).toBe("+£3.99");
    expect(formatFeeAmount(24)).toBe("£24");
  });
});
