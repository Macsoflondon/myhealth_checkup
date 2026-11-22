const namedEntities: Readonly<Record<string, string>> = {
  apos: "'",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  nbsp: "\u00a0",
  rsquo: "\u2019",
  lsquo: "\u2018",
  rdquo: "\u201d",
  ldquo: "\u201c",
  ndash: "\u2013",
  mdash: "\u2014",
  hellip: "\u2026",
  pound: "\u00a3",
  euro: "\u20ac",
  copy: "\u00a9",
  reg: "\u00ae",
  trade: "\u2122",
};

/** Decode provider text, including nested entities, without interpreting HTML. */
export function decodeEntities(input: string): string {
  const decodePass = (text: string): string =>
    text.replace(
      /&(#(?:x[\da-f]+|\d+)|[a-z][a-z\d]*);/gi,
      (match: string, entity: string) => {
        if (!entity.startsWith("#")) {
          const name = entity.toLowerCase();
          return Object.prototype.hasOwnProperty.call(namedEntities, name)
            ? (namedEntities[name] ?? match)
            : match;
        }
        const hex = entity[1]?.toLowerCase() === "x";
        const codePoint = Number.parseInt(
          entity.slice(hex ? 2 : 1),
          hex ? 16 : 10,
        );
        if (!Number.isFinite(codePoint) || codePoint > 0x10ffff) return match;
        if (codePoint === 0 || (codePoint >= 0xd800 && codePoint <= 0xdfff))
          return "\ufffd";
        return String.fromCodePoint(codePoint);
      },
    );
  const first = decodePass(input);
  if (first === input) return first;
  const second = decodePass(first);
  return second === first ? second : decodePass(second);
}
