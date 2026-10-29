import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import {
  LiveCatalogueComparison,
  type CatalogueComparisonPanel,
} from "./live-catalogue-comparison";

const panel: CatalogueComparisonPanel = {
  slug: "full-blood-count",
  name: "Full Blood Count",
  methodLabel: "Clinic blood draw",
  rows: [
    {
      id: "row-1",
      provider: "Medichecks",
      testName: "Full Blood Count (FBC) Blood Test",
      price: 59,
      biomarkers: 15,
      turnaround: "Results in 2 working days (estimated)",
      priceCheckedAt: "2026-09-03T09:00:00Z",
      feeLabel: "Free if self-arranged, or from £35",
    },
  ],
};

/**
 * Every line of provider data the card is required to show: provider, test,
 * price in GBP with the "Total cost" caption, biomarker count, non-guaranteed
 * turnaround wording, the collection fee shown separately, and the date the
 * price was last checked in DD/MM/YYYY.
 */
const REQUIRED = [
  "Medichecks",
  "Full Blood Count (FBC) Blood Test",
  "£59.00",
  "Total cost",
  "15 biomarkers",
  "Typical results: Results in 2 working days (estimated)",
  "Free if self-arranged, or from £35",
  "Price checked 03/09/2026",
];

describe("LiveCatalogueComparison", () => {
  it.each(REQUIRED)("keeps %p visible at the compact size", (text) => {
    const { container } = render(
      <LiveCatalogueComparison panel={panel} size="compact" />,
    );
    expect(container.textContent).toContain(text);
  });

  it("keeps every row line visible at the default size as well", () => {
    const { container } = render(<LiveCatalogueComparison panel={panel} />);
    for (const text of REQUIRED) {
      expect(container.textContent).toContain(text);
    }
  });

  it("links the compare action to the panel slug at the compact size", () => {
    const { container } = render(
      <LiveCatalogueComparison panel={panel} size="compact" />,
    );
    expect(container.querySelector("a")?.getAttribute("href")).toBe(
      "/compare/results?panel=full-blood-count",
    );
  });
});
