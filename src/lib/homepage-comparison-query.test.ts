import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { homepageComparisonQuery } from "./homepage-comparison-query";
import { getHomepageComparisonPanels } from "@/services/homepage-comparison-service";

vi.mock("@/services/homepage-comparison-service", () => ({
  getHomepageComparisonPanels: vi.fn(),
}));

describe("homepage catalogue prefetch", () => {
  it("makes provider data available synchronously to the rendering query", async () => {
    const panels = [
      {
        slug: "full-blood-count",
        name: "Full blood count",
        methodLabel: "Clinic blood draw",
        rows: [
          {
            id: "test-a",
            provider: "Provider A",
            testName: "Full blood count",
            price: 42,
            biomarkers: 12,
            biomarkerLabel: "12 biomarkers",
            turnaround: null,
            priceCheckedAt: null,
            feeLabel: null,
          },
          {
            id: "test-b",
            provider: "Provider B",
            testName: "Full blood count",
            price: 53,
            biomarkers: 12,
            biomarkerLabel: "12 biomarkers",
            turnaround: null,
            priceCheckedAt: null,
            feeLabel: null,
          },
        ],
      },
    ];
    vi.mocked(getHomepageComparisonPanels).mockResolvedValueOnce(panels);
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    await client.prefetchQuery(homepageComparisonQuery);
    expect(client.getQueryData(homepageComparisonQuery.queryKey)).toEqual(
      panels,
    );
    await client.fetchQuery(homepageComparisonQuery);
    expect(getHomepageComparisonPanels).toHaveBeenCalledTimes(1);
    client.clear();
  });

  it("does not fail homepage rendering when the catalogue is unavailable", async () => {
    vi.mocked(getHomepageComparisonPanels).mockRejectedValueOnce(
      new Error("Unavailable"),
    );
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    await expect(
      client.prefetchQuery(homepageComparisonQuery),
    ).resolves.toBeUndefined();
    expect(
      client.getQueryData(homepageComparisonQuery.queryKey),
    ).toBeUndefined();
    client.clear();
  });
});
