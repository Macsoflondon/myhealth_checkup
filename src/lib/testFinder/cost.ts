import type { TestRecord } from "@/types/testFinder";

export interface TotalCost {
  testPrice: number;
  addOn: number;
  total: number;
  addOnLabel: string;
  isEstimate: boolean;
  tooltip?: string;
}

export function formatGBP(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const hasDecimals = n % 1 !== 0;
  return `£${hasDecimals ? n.toFixed(2) : Math.round(n)}`;
}

export function computeTotalCost(test: TestRecord): TotalCost {
  const price = test.price;
  switch (test.collection_fee_type) {
    case "none":
      return {
        testPrice: price,
        addOn: 0,
        total: price,
        addOnLabel: "No additional fees",
        isEstimate: false,
      };
    case "fixed": {
      const amt = typeof test.collection_fee_amount === "number" ? test.collection_fee_amount : 0;
      return {
        testPrice: price,
        addOn: amt,
        total: price + amt,
        addOnLabel: amt > 0 ? `Clinic blood draw +${formatGBP(amt)}` : "No additional fees",
        isEstimate: false,
      };
    }
    case "range": {
      const range = test.collection_fee_amount as { min: number; max: number } | null;
      const min = range?.min ?? 0;
      return {
        testPrice: price,
        addOn: min,
        total: price + min,
        addOnLabel: `From ${formatGBP(min)}`,
        isEstimate: true,
        tooltip:
          "Estimate based on the typical/lowest collection fee. Final cost depends on your chosen collection option and location.",
      };
    }
    case "varies_by_location": {
      const range = test.collection_fee_amount as { min: number; max: number } | null;
      const min = range?.min ?? 0;
      return {
        testPrice: price,
        addOn: min,
        total: price + min,
        addOnLabel: "Price varies by location",
        isEstimate: true,
        tooltip:
          "Estimate based on the typical/lowest collection fee. Final cost depends on your chosen collection option and location.",
      };
    }
    case "patient_arranged":
      return {
        testPrice: price,
        addOn: 0,
        total: price,
        addOnLabel: "Patient arranges own phlebotomy",
        isEstimate: true,
        tooltip: "Total excludes your own phlebotomy cost.",
      };
  }
}
