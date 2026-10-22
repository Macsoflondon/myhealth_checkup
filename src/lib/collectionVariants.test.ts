import { describe, expect, it } from "vitest";
import { deriveCollectionVariants, variantFeeNote } from "./collectionVariants";

describe("deriveCollectionVariants", () => {
  it("splits a finger-prick kit from a combined professional-draw listing", () => {
    const variants = deriveCollectionVariants({
      id: "psa",
      price: 69,
      sample_type: "Finger-prick",
      home_kit_available: true,
      clinic_visit_available: true,
      total_expected_cost: 109,
      collection_fee_type: "fixed",
      collection_fee_amount: 40,
      collection_route_pricing: {
        home_kit: { fee: 0, feeLabel: null, total: 69 },
        clinic: { fee: 40, feeLabel: "+£40", total: 109 },
      },
      home_phlebotomy_cost: 60,
    });

    expect(variants.map((v) => [v.route, v.total])).toEqual([
      ["home_kit", 69],
      ["venous", 109],
    ]);
    expect(variants[0].variantId).toBe("psa::home_kit");
    expect(variants[1].secondary).toEqual({
      route: "home_visit",
      label: "Nurse home visit",
      fee: 60,
      total: 129,
    });
  });

  it("keeps venous-only tests as a single clinic listing", () => {
    const variants = deriveCollectionVariants({
      id: "fbc",
      price: 69,
      sample_type: "Venous",
      home_kit_available: false,
      clinic_visit_available: true,
      total_expected_cost: 69,
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
      total_expected_cost: 109,
      collection_fee_type: "fixed",
      collection_fee_amount: 40,
      collection_route_pricing: {
        home_kit: { fee: 0, feeLabel: null, total: 69 },
        clinic: { fee: 40, feeLabel: "+£40", total: 109 },
      },
    });
    expect(variantFeeNote(kit)).toBeNull();
    expect(variantFeeNote(clinic)).toBe("£69.00 test + blood draw £40");
  });

  it("adds £3.99 postage to the £45 kit without inventing a clinic or nurse route", () => {
    const variants = deriveCollectionVariants({
      id: "lml-kit", price: 45, sample_type: "multiple",
      home_kit_available: true, clinic_visit_available: false,
      home_phlebotomy_cost: 80,
      collection_fee_type: "fixed", collection_fee_amount: 3.99,
      total_expected_cost: 48.99,
    });
    expect(variants.map((variant) => [variant.route, variant.fee, variant.total])).toEqual([
      ["home_kit", 3.99, 48.99],
    ]);
  });

  it("uses separate £3.99 kit postage and £35 clinic charges", () => {
    const variants = deriveCollectionVariants({
      id: "lml-both", price: 45, home_kit_available: true, clinic_visit_available: true,
      collection_route_pricing: {
        home_kit: { fee: 3.99, feeLabel: "+£3.99", total: 48.99 },
        clinic: { fee: 35, feeLabel: "+£35", total: 80 },
      },
    });
    expect(variants.map((variant) => [variant.route, variant.fee, variant.total])).toEqual([
      ["home_kit", 3.99, 48.99], ["clinic", 35, 80],
    ]);
  });

  it("does not turn mandatory review into a blood-draw fee", () => {
    const [clinic] = deriveCollectionVariants({
      id: "review", price: 45, clinic_visit_available: true,
      collection_fee_type: "fixed", collection_fee_amount: 35,
      total_expected_cost: 90,
    });
    expect(clinic.fee).toBe(35);
    expect(clinic.total).toBe(90);
  });
});
