import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("https://esm.sh/@supabase/supabase-js@2.51.0", () => ({
  createClient: vi.fn(),
}));

type Parser = (html: string) => { rating: number | null; count: number | null };
let parseTrustpilotHtml: Parser;

const EDGE_MODULE = "../../../supabase/functions/refresh-trustpilot-ratings/index.ts";

beforeAll(async () => {
  (globalThis as unknown as { Deno: unknown }).Deno = {
    serve: vi.fn(),
    env: { get: () => undefined },
  };
  ({ parseTrustpilotHtml } = await import(
    // Non-literal path keeps the Deno module out of the app typecheck.
    /* @vite-ignore */ new URL(EDGE_MODULE, import.meta.url).href
  ));
});

const ld = (obj: unknown) =>
  `<html><script type="application/ld+json">${JSON.stringify(obj)}</script></html>`;

describe("parseTrustpilotHtml", () => {
  it("reads a top-level aggregateRating", () => {
    const html = ld({
      "@type": "LocalBusiness",
      aggregateRating: { ratingValue: "4.5", reviewCount: "2759" },
    });
    expect(parseTrustpilotHtml(html)).toEqual({ rating: 4.5, count: 2759 });
  });

  it("reads aggregateRating inside @graph", () => {
    const html = ld({
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebPage" },
        {
          "@type": "Organization",
          aggregateRating: { ratingValue: 3.9, reviewCount: 724 },
        },
      ],
    });
    expect(parseTrustpilotHtml(html)).toEqual({ rating: 3.9, count: 724 });
  });

  it("falls back to og:title and description text", () => {
    const html = `<meta property="og:title" content='Medichecks is rated "Excellent" with 4.5 / 5 on Trustpilot'>
<meta property="og:description" content="Do you agree? Read what 2,759 people have written so far">`;
    expect(parseTrustpilotHtml(html)).toEqual({ rating: 4.5, count: 2759 });
  });

  it("returns nulls when no rating is published", () => {
    expect(parseTrustpilotHtml("<html><body>Nothing</body></html>")).toEqual({
      rating: null,
      count: null,
    });
  });
});
