import { describe, expect, it } from "vitest";
import { describeSampleType, homeKitSampleLabel } from "./sampleType";

describe("describeSampleType", () => {
  it("capillary is a home blood route, never venous", () => {
    for (const raw of ["capillary", "Capillary blood (QuickDraw upper-arm device)"]) {
      const info = describeSampleType(raw);
      expect(info.token).toBe("capillary");
      expect(info.label).toBe("QuickDraw upper-arm device (no finger-prick)");
      expect(info.isBlood).toBe(true);
      expect(info.isHomeCollectable).toBe(true);
    }
  });
  it("maps the Randox values", () => {
    expect(describeSampleType("Venous").label).toBe("Venous blood draw");
    expect(describeSampleType("Finger-prick").token).toBe("finger_prick");
    expect(describeSampleType("Saliva").label).toBe("Saliva");
    expect(describeSampleType("Stool").label).toBe("Stool sample");
    expect(describeSampleType("Nail clipping").label).toBe("Nail clipping");
    expect(describeSampleType("Urine or swab").label).toBe("Urine or swab");
    expect(describeSampleType("Venous blood and urine or swab").label).toBe(
      "Blood and urine or swab",
    );
    expect(describeSampleType("multiple").label).toBe("Multiple sample types");
    expect(describeSampleType("buccal_swab").label).toBe("Cheek swab");
  });
  it("bare 'blood' is not venous", () => {
    expect(describeSampleType("Blood").token).toBeNull();
  });
  it("home kit short labels", () => {
    expect(homeKitSampleLabel("Saliva")).toBe("saliva");
    expect(homeKitSampleLabel("capillary")).toBe("QuickDraw upper-arm device");
    expect(homeKitSampleLabel("Venous")).toBeNull();
  });
});
