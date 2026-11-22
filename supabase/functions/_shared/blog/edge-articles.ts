import { decodeEntities } from "./decode-entities.ts";

const EDGE_ORIGIN = "https://www.sportsbloodtests.co.uk";

export function edgeArticleLinks(html: string): string[] {
  return [
    ...new Set(
      [...html.matchAll(/href=["']([^"']+)["']/gi)].flatMap((match) => {
        const href = match[1];
        if (!href) return [];
        try {
          const url = new URL(decodeEntities(href), EDGE_ORIGIN);
          return url.origin === EDGE_ORIGIN &&
            /^\/biomarkers\/[^/]+\/$/.test(url.pathname)
            ? [url.href]
            : [];
        } catch {
          return [];
        }
      }),
    ),
  ];
}

export function edgeArticlePublicationDate(html: string): string | null {
  for (const match of html.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    if (!match[1]) continue;
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
      // Missing or invalid source dates remain unavailable.
    }
  }
  return null;
}
