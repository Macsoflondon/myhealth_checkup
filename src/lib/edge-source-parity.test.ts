import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as app from "./edge-source";
import * as deno from "../../supabase/functions/_shared/scrape/edge-source";

describe("EDGE source parity (app and deployed scraper)", () => {
  it("keeps the source identical except for the HTML import", () => {
    const appSource = readFileSync("src/lib/edge-source.ts", "utf8");
    const denoSource = readFileSync(
      "supabase/functions/_shared/scrape/edge-source.ts",
      "utf8",
    );
    expect(denoSource).toBe(
      appSource.replace(
        "../../supabase/functions/_shared/scrape/html",
        "./html.ts",
      ),
    );
  });

  it("discovers the same fixed products and source articles", () => {
    expect(deno.EDGE_ORIGIN).toBe(app.EDGE_ORIGIN);
    const html = `<a href="/blood-tests/runners/runner-male/">Runner</a>
      <a href="/blood-tests/runners/runner-male/">Duplicate</a>
      <a href="/blood-tests/runners/">Category</a>
      <a href="https://other.example/blood-tests/runners/runner-male/">Other</a>
      <a href="/biomarkers/vitamin-d/">Article</a>`;
    for (const section of ["blood-tests", "biomarkers"] as const) {
      expect(deno.edgeLinks(html, section)).toEqual(
        app.edgeLinks(html, section),
      );
    }
    expect(deno.edgeLinks(html, "blood-tests")).toEqual([
      `${app.EDGE_ORIGIN}/blood-tests/runners/runner-male/`,
    ]);
  });

  it("preserves exact prices, verbatim descriptions and full biomarker data", () => {
    const url = `${app.EDGE_ORIGIN}/blood-tests/hormones/advanced-testosterone/`;
    const html = `<nav>Build your own from £35</nav><h1>Advanced Testosterone</h1>
      <p>Provider's own description &amp; limitations.</p>
      <p id="p-price-normal">£99 per test</p>
      <div class="biomarker-content"><ul><li>Testosterone</li><li>SHBG</li></ul></div>
      <div class="biomarker-pill"><span>2</span></div>`;
    expect(deno.parseEdgeProduct(html, url)).toEqual(
      app.parseEdgeProduct(html, url),
    );
    expect(deno.parseEdgeProduct(html, url)).toMatchObject({
      price: 99,
      description: "Provider's own description & limitations.",
      markers: ["Testosterone", "SHBG"],
      biomarkerCount: 2,
    });
  });

  it("rejects missing exact prices in both parsers", () => {
    for (const parser of [app.parseEdgeProduct, deno.parseEdgeProduct]) {
      expect(() =>
        parser("<h1>Runner</h1><nav>From £35</nav>", "source"),
      ).toThrow("Missing product name or exact price");
    }
  });

  it("keeps source publication dates and missing metadata identical", () => {
    const html = `<script type="application/ld+json">{"@graph":[{"datePublished":"2025-05-22T12:06:30+01:00"}]}</script>`;
    expect(deno.edgePublicationDate(html)).toBe(app.edgePublicationDate(html));
    expect(deno.edgePublicationDate(html)).toBe("2025-05-22");
    expect(deno.edgePublicationDate("<p>Unavailable</p>")).toBeNull();
    expect(app.edgePublicationDate("<p>Unavailable</p>")).toBeNull();
  });
});
