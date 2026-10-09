import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  looksTruncated,
  parseClinilabsBodyHtml,
  parseClinilabsProductPage,
  parseMedicalDiagnosisTestsIncluded,
  parseRandoxWhatsIncluded,
  reconcileBiomarkerCount,
} from "../../../supabase/functions/_shared/scrape/biomarkerParsers";
import {
  isBiomarkerNoise,
  normaliseBiomarkers,
} from "../../../supabase/functions/_shared/scrape/normaliseBiomarkers";
import { guardBiomarkerList } from "../../../supabase/functions/_shared/scrape/upsertWithProvenance";

const fixture = (name: string): string =>
  readFileSync(join(__dirname, "fixtures", "scrape", name), "utf8");

describe("Clinilabs bio-acc parser", () => {
  it("reads marker names from details.bio-acc summaries", () => {
    const parsed = parseClinilabsProductPage(fixture("clinilabs-bio-acc.html"));
    expect(parsed.biomarkers.slice(0, 4)).toEqual([
      "Cholesterol",
      "HDL Cholesterol",
      "LDL Cholesterol",
      "Non-HDL Cholesterol",
    ]);
    expect(parsed.statedCount).not.toBeNull();
    expect(parsed.biomarkers).not.toContain("10 markers");
  });

  it("returns nothing for body_html without list items", () => {
    expect(parseClinilabsBodyHtml("<p>Book your test today.</p>")).toEqual([]);
  });
});

describe("placeholder filter", () => {
  it.each(["1 Biomarker", "35 Biomarkers", "35\u00a0BIOMARKERS", "10 markers", "35&nbsp;Biomarkers"])(
    "drops %s",
    (s) => {
      expect(isBiomarkerNoise(s)).toBe(true);
      expect(normaliseBiomarkers([s, "Ferritin"])).toEqual(["Ferritin"]);
    },
  );
});

describe("Medical Diagnosis Tests Included parser", () => {
  it("keeps full labels (no High-Densi / Triglycerid)", () => {
    const list = parseMedicalDiagnosisTestsIncluded(
      fixture("medical-diagnosis-mens-essentials.html"),
    );
    expect(list).toContain("High-Density Lipoprotein (HDL Cholesterol)");
    expect(list).toContain("Triglycerides");
    expect(list).toContain("Non-HDL");
    expect(list).toHaveLength(15);
  });

  it("finds the list past page furniture longer than 6,000 characters", () => {
    const list = parseMedicalDiagnosisTestsIncluded(
      fixture("medical-diagnosis-detox-profile-plus.html"),
    );
    expect(list).toContain("Triglycerides");
    expect(list.length).toBeGreaterThan(10);
  });

  it("keeps allergen codes whole (no F- / D-01 Dermatophagoid)", () => {
    const list = parseMedicalDiagnosisTestsIncluded(
      fixture("medical-diagnosis-allergy-atopic.html"),
    );
    expect(list).toContain("D-01 Dermatophagoides pteronyssinus");
    expect(list.every((x) => !/-$/.test(x))).toBe(true);
    expect(list).toHaveLength(30);
  });
});

describe("Randox whats_included parser", () => {
  it("reads itemised markers", () => {
    const r = parseRandoxWhatsIncluded(fixture("randox-male-hormone.html"));
    expect(r.biomarkers).toHaveLength(8);
    expect(r.biomarkers).toContain("Sex Hormone Binding Globulin (SHBG)");
  });

  it("panel-only pages publish no marker list", () => {
    const r = parseRandoxWhatsIncluded(
      fixture("randox-signature-platinum-plus.html"),
    );
    expect(r.biomarkers).toEqual([]);
    expect(r.panels).toContain("Pancreatic Health");
  });
});

describe("count reconciliation", () => {
  it("uses the list length and reports a different stated figure", () => {
    const list = Array.from({ length: 40 }, (_, i) => `M${i}`);
    const d = reconcileBiomarkerCount(list, 1, "Driver's Lifestyle Blood Test");
    expect(d.count).toBe(40);
    expect(d.mismatch).toContain("states 1");
  });
  it("no mismatch when they agree", () => {
    expect(reconcileBiomarkerCount(["A", "B"], 2, "x").mismatch).toBeNull();
  });
});

describe("truncation detection", () => {
  it("flags a list clipped to 300 joined characters", () => {
    const list = ["A".repeat(148), "B".repeat(150)];
    expect(list.join(", ").length).toBe(300);
    expect(looksTruncated(list)).toBe(true);
  });
  it("flags fewer names than the stated count", () => {
    expect(looksTruncated(["Ferritin", "Uric ac"], 5)).toBe(true);
  });
  it("accepts a complete list", () => {
    expect(looksTruncated(["Ferritin", "Uric Acid"], 2)).toBe(false);
  });
});

describe("biomarker list guard", () => {
  const existing = { biomarkers_list: ["Ferritin", "TSH"] };
  it("keeps an existing list when the scrape returns null", () => {
    const warnings: string[] = [];
    const r = guardBiomarkerList(existing, null, null, false, warnings);
    expect(r.list).toEqual(["Ferritin", "TSH"]);
    expect(r.count).toBe(2);
    expect(warnings).toHaveLength(1);
  });
  it("keeps an existing list when the scrape returns []", () => {
    const r = guardBiomarkerList(existing, [], 0, false, []);
    expect(r.list).toEqual(["Ferritin", "TSH"]);
  });
  it("allows clearing only with the explicit override", () => {
    const r = guardBiomarkerList(existing, null, null, true, []);
    expect(r.list).toBeNull();
  });
});
