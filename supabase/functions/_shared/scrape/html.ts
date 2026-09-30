/**
 * Shared HTML-to-text helpers for the scrapers.
 *
 * Scraped provider copy is stored and rendered as plain text, never as HTML.
 * These helpers replace the per-scraper regex chains that CodeQL flagged:
 *
 * - `stripTags` walks the markup character by character instead of using
 *   `/<[^>]+>/`, so nested or malformed tags (`<scr<script>ipt>`), `</script >`
 *   end tags, `>` inside quoted attributes and `--!>` comment ends are handled.
 * - `decodeEntities` decodes in a single pass, so `&amp;lt;` becomes `&lt;`
 *   (the literal text) and is never decoded twice into `<`.
 *
 * Always strip tags first and decode entities last (`htmlToText` does both).
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  pound: "£",
  euro: "€",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  hellip: "…",
  bull: "•",
  middot: "·",
  copy: "©",
  reg: "®",
  trade: "™",
  deg: "°",
  micro: "µ",
  times: "×",
  le: "≤",
  ge: "≥",
};

const ENTITY =
  /&(?:#(\d{1,7})|#[xX]([0-9a-fA-F]{1,6})|([a-zA-Z][a-zA-Z0-9]{1,31}));/g;

function fromCodePoint(code: number, raw: string): string {
  if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) return raw;
  // U+00A0 (non-breaking space) reads as a normal space in stored text.
  if (code === 0xa0) return " ";
  return String.fromCodePoint(code);
}

/** Decodes HTML character references in one pass. Unknown names are left as-is. */
export function decodeEntities(input: string): string {
  return input.replace(
    ENTITY,
    (raw, dec?: string, hex?: string, name?: string) => {
      if (dec) return fromCodePoint(parseInt(dec, 10), raw);
      if (hex) return fromCodePoint(parseInt(hex, 16), raw);
      const mapped = NAMED_ENTITIES[name!.toLowerCase()];
      return mapped ?? raw;
    },
  );
}

/** Elements whose content is never visible text. */
const RAW_TEXT_ELEMENTS = new Set([
  "script",
  "style",
  "noscript",
  "template",
  "svg",
]);

/** Elements whose end tag (or `<br>` itself) becomes a line break when `preserveNewlines` is on. */
const BLOCK_ELEMENTS = new Set([
  "br",
  "p",
  "div",
  "li",
  "ul",
  "ol",
  "tr",
  "table",
  "section",
  "article",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "details",
  "summary",
]);

function isTagNameStart(ch: string | undefined): boolean {
  return ch !== undefined && /[a-zA-Z]/.test(ch);
}

/** Index just past the `>` that closes the tag starting at `start`, honouring quotes. */
function endOfTag(html: string, start: number): number {
  let quote: string | null = null;
  for (let i = start; i < html.length; i++) {
    const ch = html[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === ">") {
      return i + 1;
    }
  }
  return html.length;
}

function readTagName(html: string, start: number): string {
  let end = start;
  while (end < html.length && /[a-zA-Z0-9-]/.test(html[end])) end++;
  return html.slice(start, end).toLowerCase();
}

/** Index of the matching `</name ...>` end tag (case-insensitive), or -1. */
function findEndTag(html: string, name: string, from: number): number {
  const lower = html.toLowerCase();
  let i = from;
  while ((i = lower.indexOf("</" + name, i)) !== -1) {
    const after = lower[i + 2 + name.length];
    if (
      after === undefined ||
      after === ">" ||
      after === "/" ||
      /\s/.test(after)
    )
      return i;
    i += 2 + name.length;
  }
  return -1;
}

/**
 * Removes all markup and returns the text content (entities NOT decoded).
 * Tags become a space, or a newline for block end tags and `<br>` when
 * `preserveNewlines` is set. A `<` that does not start a tag is kept as text.
 */
export function stripTags(
  html: string,
  { preserveNewlines = false } = {},
): string {
  let out = "";
  let i = 0;
  while (i < html.length) {
    const ch = html[i];
    if (ch !== "<") {
      out += ch;
      i++;
      continue;
    }
    const next = html[i + 1];

    // Comment: <!-- ... --> (also tolerates the `--!>` end browsers accept).
    if (html.startsWith("<!--", i)) {
      const close = /--!?>/.exec(html.slice(i + 4));
      i = close ? i + 4 + close.index + close[0].length : html.length;
      out += " ";
      continue;
    }

    // Doctype, CDATA, processing instructions.
    if (next === "!" || next === "?") {
      i = endOfTag(html, i);
      out += " ";
      continue;
    }

    const closing = next === "/";
    const nameStart = closing ? i + 2 : i + 1;
    if (!isTagNameStart(html[nameStart])) {
      // Not a tag (e.g. "<5 mmol/L"): keep the character as text.
      out += ch;
      i++;
      continue;
    }

    const name = readTagName(html, nameStart);
    i = endOfTag(html, nameStart);
    const lineBreak =
      preserveNewlines &&
      BLOCK_ELEMENTS.has(name) &&
      (closing || name === "br");
    out += lineBreak ? "\n" : " ";

    if (!closing && RAW_TEXT_ELEMENTS.has(name) && html[i - 2] !== "/") {
      const end = findEndTag(html, name, i);
      i = end === -1 ? html.length : endOfTag(html, end + 2);
    }
  }
  return out;
}

/**
 * Converts an HTML fragment to plain text: strips tags, decodes entities once,
 * then normalises whitespace. With `preserveNewlines`, block elements become
 * line breaks (at most one blank line in a row); otherwise all whitespace
 * collapses to single spaces.
 */
export function htmlToText(
  html: string,
  { preserveNewlines = false } = {},
): string {
  const text = decodeEntities(stripTags(html, { preserveNewlines }));
  if (!preserveNewlines) return text.replace(/\s+/g, " ").trim();
  return text
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
