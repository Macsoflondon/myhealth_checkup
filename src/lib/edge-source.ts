import {
  htmlToText,
  decodeEntities,
} from "../../supabase/functions/_shared/scrape/html";

export const EDGE_ORIGIN = "https://www.sportsbloodtests.co.uk";

export function edgeLinks(
  html: string,
  section: "blood-tests" | "biomarkers",
): string[] {
  return [
    ...new Set(
      [...html.matchAll(/href=["']([^"']+)["']/gi)].flatMap((match) => {
        try {
          const url = new URL(decodeEntities(match[1]), EDGE_ORIGIN);
          const pattern =
            section === "blood-tests"
              ? /^\/blood-tests\/[^/]+\/[^/]+\/$/
              : /^\/biomarkers\/[^/]+\/$/;
          return url.origin === EDGE_ORIGIN && pattern.test(url.pathname)
            ? [url.href]
            : [];
        } catch {
          return [];
        }
      }),
    ),
  ];
}

export function parseEdgeProduct(html: string, url: string) {
  const name = htmlToText(
    html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "",
  );
  // Only this product's one-off price. Navigation advertises bespoke tests from £35.
  const priceText = htmlToText(
    html.match(
      /<p\b[^>]*id=["']p-price-normal["'][^>]*>([\s\S]*?)<\/p>/i,
    )?.[1] ?? "",
  );
  const amount = priceText.match(/£\s*([\d,]+(?:\.\d{1,2})?)/);
  const price = amount ? Number(amount[1].replace(/,/g, "")) : null;
  if (!name || price === null || price <= 1)
    throw new Error(`Missing product name or exact price: ${url}`);
  const description = htmlToText(
    html.match(
      /<h1\b[^>]*>[\s\S]*?<\/h1>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/i,
    )?.[1] ?? "",
  );
  const markerSection =
    html.match(
      /<div\b[^>]*class=["'][^"']*biomarker-content[^"']*["'][^>]*>[\s\S]*?<ul\b[^>]*>([\s\S]*?)<\/ul>/i,
    )?.[1] ?? "";
  const markers = [
    ...markerSection.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi),
  ].map((m) => htmlToText(m[1]));
  const advertised = html.match(
    /class=["'][^"']*biomarker-pill[^"']*["'][^>]*>\s*<span[^>]*>(\d+)/i,
  )?.[1];
  return {
    url,
    name,
    price,
    description,
    markers,
    biomarkerCount: advertised ? Number(advertised) : null,
  };
}

export function edgePublicationDate(html: string): string | null {
  for (const match of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const root: unknown = JSON.parse(match[1]);
      if (!root || typeof root !== "object") continue;
      const graph: unknown = "@graph" in root ? root["@graph"] : [root];
      if (!Array.isArray(graph)) continue;
      for (const node of graph) {
        if (
          !node ||
          typeof node !== "object" ||
          typeof node.datePublished !== "string"
        )
          continue;
        const date = new Date(node.datePublished);
        if (!Number.isNaN(date.getTime()))
          return date.toISOString().slice(0, 10);
      }
    } catch {
      /* Invalid source metadata is unavailable, not today's date. */
    }
  }
  return null;
}
