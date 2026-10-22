import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { TestProviders } from "@/test/test-providers";
import {
  mergeActiveRows,
  mergeViewPricing,
  toViewPricing,
  viewFeeLabel,
  viewCollectionFee,
  type ViewPricing,
} from "@/lib/viewPricing";
import { mapHeroRows } from "@/hooks/queries/useHeroPopularTests";
import { toUniversalTest } from "@/components/sections/HeroPopularTests";
import { UniversalTestCard } from "@/components/cards/UniversalTestCard";
import { TestProviderPriceTable } from "@/components/compare/TestProviderPriceTable";

vi.mock("@/lib/router-compat", () => ({
  Link: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
  useNavigate: () => () => {},
  useLocation: () => ({ pathname: "/", search: "" }),
}));

// Full blood count rows exactly as unified_provider_tests returns them.
const viewRows: ViewPricing[] = [
  toViewPricing({
    id: "md",
    price: 39,
    collection_fee_type: "fixed",
    collection_fee_amount: 24,
    collection_fee_note: null,
    total_expected_cost: 63,
    price_checked_at: "2026-10-20T06:00:00Z",
  }),
  toViewPricing({
    id: "cl",
    price: 50,
    collection_fee_type: "from",
    collection_fee_amount: 30,
    collection_fee_note: null,
    total_expected_cost: 80,
    price_checked_at: "2026-10-20T06:00:00Z",
  }),
  toViewPricing({
    id: "mc",
    price: 59,
    collection_fee_type: "self_arranged",
    collection_fee_amount: 35,
    collection_fee_note: null,
    total_expected_cost: 59,
    price_checked_at: "2026-10-20T06:00:00Z",
  }),
];
const pricing = new Map(viewRows.map((p) => [p.id, p]));

// provider_tests metadata rows carrying stale raw price fields that must lose.
const rawRows = [
  {
    id: "md",
    provider_id: "medical-diagnosis",
    test_name: "Hematology Profile",
    price: 39,
    total_expected_cost: 60,
  },
  {
    id: "cl",
    provider_id: "clinilabs",
    test_name: "Full Blood Count",
    price: 50,
    total_expected_cost: 50,
  },
  {
    id: "mc",
    provider_id: "medichecks",
    test_name: "Full Blood Count (FBC)",
    price: 59,
    total_expected_cost: 94,
  },
];

describe("view pricing merge", () => {
  it("resolves the additional clinic route from the public £35 rule, not £3.99 postage", () => {
    const row = toViewPricing(
      {
        id: "lml",
        provider_id: "london-medical-laboratory",
        price: 45,
        sample_type: "multiple",
        home_kit_available: true,
        clinic_visit_available: true,
        collection_fee_type: "fixed",
        collection_fee_amount: 3.99,
        total_expected_cost: 48.99,
      },
      [
        {
          provider_id: "london-medical-laboratory",
          route: "clinic_only",
          fee_type: "fixed",
          fee_amount: 35,
        },
      ],
    );
    expect(row.collection_route_pricing?.home_kit?.total).toBe(48.99);
    expect(row.collection_route_pricing?.clinic).toEqual({
      fee: 35,
      feeLabel: "+£35",
      total: 80,
    });
  });

  it("collection fees exclude the £10 mandatory clinical review", () => {
    const row = toViewPricing({
      id: "review",
      price: 45,
      clinic_visit_available: true,
      collection_fee_type: "fixed",
      collection_fee_amount: 35,
      clinical_review_type: "included",
      clinical_review_fee: 10,
      total_expected_cost: 90,
    });
    expect(viewCollectionFee(row)).toBe(35);
    expect(row.collection_route_pricing?.clinic?.total).toBe(90);
  });

  it("takes totals and fees from the view, not provider_tests", () => {
    const merged = mergeActiveRows(rawRows, pricing);
    expect(merged.map((r) => r.total_expected_cost)).toEqual([63, 80, 59]);
    expect(merged.map((r) => viewFeeLabel(r))).toEqual([
      "+£24",
      "from £30",
      "Free if self-arranged, or from £35",
    ]);
  });

  it("drops rows the view does not list from active lists", () => {
    const rows = [
      ...rawRows,
      {
        id: "gone",
        provider_id: "x",
        test_name: "Old",
        price: 10,
        total_expected_cost: 99,
      },
    ];
    expect(mergeActiveRows(rows, pricing).map((r) => r.id)).toEqual([
      "md",
      "cl",
      "mc",
    ]);
  });

  it("a row missing from the view keeps its bare price with no fee or total", () => {
    const row = mergeViewPricing(
      {
        id: "gone",
        price: 42,
        total_expected_cost: 99,
        collection_fee_amount: 21,
      },
      undefined,
    );
    expect(row.price).toBe(42);
    expect(row.total_expected_cost).toBeNull();
    expect(row.collection_fee_amount).toBeNull();
    expect(viewFeeLabel(row)).toBeNull();
  });
});

describe("hero cards", () => {
  it("show the view totals for the full blood count", () => {
    const tests = mapHeroRows(rawRows, pricing);
    expect(tests.map((t) => t.totalExpectedCost)).toEqual([63, 80, 59]);
    render(<UniversalTestCard test={toUniversalTest(tests[0])} />, {
      wrapper: TestProviders,
    });
    expect(screen.getAllByText(/£63/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/£60/)).toBeNull();
  });
});

describe("test page price table", () => {
  it("shows view totals with the fee label under each", () => {
    const providers = mergeActiveRows(rawRows, pricing).map((t) => ({
      id: t.id,
      providerId: t.provider_id,
      providerName: t.provider_id,
      price: t.total_expected_cost ?? t.price ?? 0,
      feeLabel: viewFeeLabel(t),
      turnaroundTime: "2 days",
      collectionMethod: "Venous",
    }));
    render(
      <TestProviderPriceTable
        providers={providers}
        testName="Full blood count"
      />,
      {
        wrapper: TestProviders,
      },
    );
    for (const total of ["£63.00", "£80.00", "£59.00"]) {
      expect(screen.getAllByText(total).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText("Blood draw: from £30").length).toBeGreaterThan(
      0,
    );
    expect(screen.getAllByText("Blood draw: +£24").length).toBeGreaterThan(0);
    expect(screen.queryByText("£94.00")).toBeNull();
  });
});
