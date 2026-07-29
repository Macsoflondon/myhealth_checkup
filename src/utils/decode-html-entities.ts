/**
 * Decodes HTML entities that leak in from scraped provider content
 * (e.g. "Accurate &amp; fast" -> "Accurate & fast").
 * Numeric and named entities are both handled, without using innerHTML.
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
  pound: "£",
  reg: "®",
  trade: "™",
  copy: "©",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  rsquo: "\u2019",
  lsquo: "\u2018",
  rdquo: "\u201d",
  ldquo: "\u201c",
  deg: "°",
};

export const decodeHtmlEntities = (value: string): string => {
  if (!value || !value.includes("&")) return value;

  let previous = value;
  // Handle double-encoded input (e.g. "&amp;amp;") by decoding repeatedly.
  for (let pass = 0; pass < 3; pass += 1) {
    const decoded = previous.replace(
      /&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g,
      (match, entity: string) => {
        if (entity.startsWith("#x") || entity.startsWith("#X")) {
          const code = Number.parseInt(entity.slice(2), 16);
          return Number.isNaN(code) ? match : String.fromCodePoint(code);
        }
        if (entity.startsWith("#")) {
          const code = Number.parseInt(entity.slice(1), 10);
          return Number.isNaN(code) ? match : String.fromCodePoint(code);
        }
        return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
      },
    );
    if (decoded === previous) return decoded;
    previous = decoded;
  }
  return previous;
};
