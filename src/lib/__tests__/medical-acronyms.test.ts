import { describe, expect, it } from "vitest";
import { normaliseMedicalAcronyms } from "@/lib/medical-acronyms";

describe("normaliseMedicalAcronyms", () => {
  it("fixes Lola's scraped immunoglobulin casing", () => {
    expect(normaliseMedicalAcronyms("Hepatitis B Surface Antibody igG")).toBe("Hepatitis B Surface Antibody IgG");
  });
  it("fixes the other immunoglobulins and HbA1c in any casing", () => {
    expect(normaliseMedicalAcronyms("Total igA, IGM, ige and hba1c")).toBe("Total IgA, IgM, IgE and HbA1c");
  });
  it("fixes mixed-case abbreviations but leaves plain English words", () => {
    expect(normaliseMedicalAcronyms("Ldl and tSH, alt text")).toBe("LDL and TSH, alt text");
  });
  it("leaves correct names unchanged", () => {
    expect(normaliseMedicalAcronyms("Vitamin B12 and eGFR")).toBe("Vitamin B12 and eGFR");
  });
});
