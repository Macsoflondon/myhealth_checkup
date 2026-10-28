import { describe, expect, it } from "vitest";
import { isExcludedListing } from "@/lib/excluded-listings";

describe("isExcludedListing", () => {
  it("hides Goodbody's Blood Draw Appointment", () => {
    expect(isExcludedListing("goodbody-clinic", "Blood Draw Appointment")).toBe(true);
  });
  it("keeps real Goodbody tests", () => {
    expect(isExcludedListing("goodbody-clinic", "Testosterone Blood Test")).toBe(false);
  });
});
