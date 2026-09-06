import { describe, expect, it } from "vitest";
import { deriveCollectionVariants, variantFeeNote } from "./collectionVariants";

describe("deriveCollectionVariants", () => {
  it("splits a finger-prick kit from clinic and nurse routes", () => {
    const variants = deriveCollectionVariants({
      id: "psa",
      price: 69,
      sample_type: "Finger-prick",
      home_kit_available: true,
      clinic_visit_available: true,
      clinic_phlebotomy_cost: 40,
      home_phlebotomy_cost: 60,
    });

    expect(variants.map((v) => [v.route, v.total])).toEqual([
      ["home_kit", 69],
      ["clinic", 109],
      ["home_visit", 129],
    ]);
    expect(variants[0].variantId).toBe("psa::home_kit");
  });

  it("keeps venous-only tests as a single clinic listing", () => {
    const variants = deriveCollectionVariants({
      id: "fbc",
      price: 69,
      sample_type: "Venous",
      home_kit_available: false,
      clinic_visit_available: true,
      clinic_phlebotomy_cost: 0,
      home_phlebotomy_cost: 0,
    });
    expect(variants).toHaveLength(1);
    expect(variants[0].route).toBe("clinic");
    expect(variants[0].total).toBe(69);
  });

  it("always returns at least one variant", () => {
    const variants = deriveCollectionVariants({ id: "x", price: 25 });
    expect(variants).toHaveLength(1);
    expect(variants[0].route).toBe("standard");
  });

  it("describes the fee breakdown only when a fee applies", () => {
    const [kit, clinic] = deriveCollectionVariants({
      id: "psa",
      price: 69,
      sample_type: "Finger-prick",
      home_kit_available: true,
      clinic_visit_available: true,
      clinic_phlebotomy_cost: 40,
    });
    expect(variantFeeNote(kit)).toBeNull();
    expect(variantFeeNote(clinic)).toBe("£69.00 test + £40.00 clinic blood draw");
  });
});
