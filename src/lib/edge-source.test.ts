import { describe, expect, it } from "vitest";
import {
  edgeLinks,
  edgePublicationDate,
  parseEdgeProduct,
} from "./edge-source";

describe("EDGE source rules", () => {
  it.each([120, 125, 129, 130, 99])(
    "reads exact £%s product price, never the £35 navigation offer",
    (price) => {
      const product = parseEdgeProduct(
        `<nav>Build your own from £35</nav><h1>Blood Test for<br>Male Runners</h1><div><p>Provider's original description.</p><p id="p-price-normal">£${price}<span>per test</span></p></div>`,
        "https://www.sportsbloodtests.co.uk/blood-tests/runners/runner-male/",
      );
      expect(product.price).toBe(price);
      expect(product.description).toBe("Provider's original description.");
    },
  );
  it("fails closed when the exact product price is missing", () => {
    expect(() =>
      parseEdgeProduct("<h1>Runner</h1><nav>From £35</nav>", "source"),
    ).toThrow();
  });
  it("accepts fixed product links but excludes category indexes and other hosts", () => {
    expect(
      edgeLinks(
        '<a href="/blood-tests/runners/">Category</a><a href="/blood-tests/runners/runner-male/">Test</a><a href="https://evil.example/blood-tests/runners/runner-male/">Other</a>',
        "blood-tests",
      ),
    ).toEqual([
      "https://www.sportsbloodtests.co.uk/blood-tests/runners/runner-male/",
    ]);
  });
  it("excludes the biomarker index from articles", () => {
    expect(
      edgeLinks(
        '<a href="/biomarkers/">Index</a><a href="/biomarkers/vitamin-d/">Vitamin D</a>',
        "biomarkers",
      ),
    ).toEqual(["https://www.sportsbloodtests.co.uk/biomarkers/vitamin-d/"]);
  });
  it("preserves source publication dates instead of treating a check as publication", () => {
    expect(
      edgePublicationDate(
        '<script type="application/ld+json">{"@graph":[{"datePublished":"2025-05-22T12:06:30+01:00"}]}</script>',
      ),
    ).toBe("2025-05-22");
    expect(
      edgePublicationDate(
        '<meta property="og:updated_time" content="2026-11-06">',
      ),
    ).toBeNull();
  });
});
