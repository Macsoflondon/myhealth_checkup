import { describe, expect, it } from "vitest";
import {
  deriveRandoxSample,
  SAMPLE,
} from "../../../supabase/functions/mhc-randox-scrape/sample";

const HOME = "https://randoxhealth.com/en-GB/product/home/";
const CLINIC = "https://randoxhealth.com/en-GB/product/clinic/";

describe("deriveRandoxSample", () => {
  it("QuickDraw kit ignores finger-prick in the cross-sell", () => {
    const text =
      "Female Hormone QuickDraw. No finger-prick needed. Customers Also Bought Fingerprick AMH test";
    expect(
      deriveRandoxSample(`${HOME}female-hormone-quickdraw`, text, null, null, []),
    ).toBe(SAMPLE.quickdraw);
  });
  it("finger-prick home kit", () => {
    expect(
      deriveRandoxSample(`${HOME}vitamin-d-test`, "Collect a finger-prick sample", null, null, []),
    ).toBe(SAMPLE.fingerPrick);
  });
  it("saliva", () => {
    expect(deriveRandoxSample(`${HOME}dna`, "Provide a saliva sample", null, null, [])).toBe(SAMPLE.saliva);
  });
  it("stool", () => {
    expect(deriveRandoxSample(`${HOME}gut`, "Collect a stool sample", null, null, [])).toBe(SAMPLE.stool);
  });
  it("nail clipping", () => {
    expect(deriveRandoxSample(`${HOME}fracture`, "Send a nail clipping", null, null, [])).toBe(SAMPLE.nail);
  });
  it("home urine or swab", () => {
    expect(
      deriveRandoxSample(`${HOME}home-sti-test`, "Provide a urine sample or a swab", null, null, []),
    ).toBe(SAMPLE.urineSwab);
  });
  it("clinic cardiac page with finger-prick only in cross-sell is venous", () => {
    expect(
      deriveRandoxSample(`${CLINIC}cardiac-risk-test`, "Cardiac risk. You may also like Finger-prick heart test", null, "Cardiac Risk", []),
    ).toBe(SAMPLE.venous);
  });
  it("clinic STI urine and swab", () => {
    const text = "Provide a urine sample or swab at the clinic";
    expect(deriveRandoxSample(`${CLINIC}sti-test`, text, null, "STI Test", [])).toBe(SAMPLE.urineSwab);
    expect(deriveRandoxSample(`${CLINIC}sti-test`, text, null, "HIV and STI Test", [])).toBe(
      SAMPLE.venousUrineSwab,
    );
  });
  it("home page with no method returns null", () => {
    expect(deriveRandoxSample(`${HOME}mystery`, "A great test", null, null, [])).toBeNull();
  });
});
