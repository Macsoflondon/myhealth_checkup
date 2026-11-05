import { describe, expect, it } from "vitest";
import {
  extractPhlebotomyFee,
  resolveScrapedFee,
} from "../../../supabase/functions/medical-diagnosis-scraper/fees";
import {
  isBiomarkerDebris,
  sanitiseBiomarkerEntries,
} from "../../../supabase/functions/_shared/scrape/sanitiseBiomarkerEntries";

describe("Medical Diagnosis phlebotomy fee", () => {
  it("reads a fee stated in the provider copy", () => {
    expect(extractPhlebotomyFee("Phlebotomy service fee: £24.")).toBe(24);
    expect(extractPhlebotomyFee("phlebotomy fee £21.50 applies")).toBe(21.5);
  });

  it("returns null when the copy states no fee", () => {
    expect(extractPhlebotomyFee("Results in 2 days.")).toBeNull();
  });

  it("adds a stated fee to the total", () => {
    expect(resolveScrapedFee("Phlebotomy service fee: £24.", 50)).toEqual({
      clinicFee: 24,
      totalExpectedCost: 74,
    });
  });

  it("stores no fee and total = price when none is stated", () => {
    expect(resolveScrapedFee("Results in 2 days.", 50)).toEqual({
      clinicFee: null,
      totalExpectedCost: 50,
    });
  });

  it("keeps the total null without a price", () => {
    expect(resolveScrapedFee("No fee mentioned", null)).toEqual({
      clinicFee: null,
      totalExpectedCost: null,
    });
  });
});

describe("biomarker list debris", () => {
  it("cleans the real London Health Company male hormone list to its markers", () => {
    const raw = [
      "# Male Hormone Blood Test Panel (4 Biomarkers Total & Free Testosterone & SHBG)",
      "Total Testosterone",
      "Sex Hormone Binding Globulin (SHBG)",
      "Free Testosterone",
      "### **Male Hormone & Testosterone Test**",
      "Fast results!!!",
      "## Health & Medical Information Related to our Tests",
      "London Health Company (LHC) Ltd",
      "londonhealthcompany.co.uk",
      "# londonhealthcompany.co.uk is blocked",
    ];
    expect(sanitiseBiomarkerEntries(raw)).toEqual([
      "Total Testosterone",
      "Sex Hormone Binding Globulin (SHBG)",
      "Free Testosterone",
    ]);
  });

  it("rejects headings, links, URLs and sentences", () => {
    for (const entry of [
      "### Monitor Your Hormonal Health with our Comprehensive Male Hormone Panel",
      "[Vitamin D](https://londonhealthcompany.co.uk/vitamin-d)",
      "https://www.example.com/test",
      "High or low LH may signal problems with the testes or pituitary gland.",
      "Signs of testosterone deficiency can include:**",
      "How long does menopause last?**",
      "Blood Count Test \\| RBC, WBC & Haemoglobin",
      "Cortisol Blood Test Kit",
      "Iron Blood Test (5 Parameters)",
    ]) {
      expect(isBiomarkerDebris(entry)).toBe(true);
    }
  });

  it("keeps marker names and strips list numbering and bold", () => {
    expect(
      sanitiseBiomarkerEntries([
        "1\\. Testosterone**",
        "5\\. Sex Hormone-Binding Globulin (SHBG)**",
        "High Sensitivity C-Reactive Protein (hs-CRP)**",
        "Free T4 (FT4)",
      ]),
    ).toEqual([
      "Testosterone",
      "Sex Hormone-Binding Globulin (SHBG)",
      "High Sensitivity C-Reactive Protein (hs-CRP)",
      "Free T4 (FT4)",
    ]);
  });
});
