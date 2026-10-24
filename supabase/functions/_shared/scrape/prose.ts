/**
 * Removes stylesheet content from scraped provider prose.
 *
 * Some provider pages ship inline CSS (for example
 * `#block-text_FD4Lfp { display: none }`) inside the sections we read as
 * preparation or limitations copy. That CSS must never be stored or shown.
 *
 * Only CSS is removed; the provider's own wording is otherwise left verbatim.
 * Returns null when no real prose remains.
 *
 * Pure TypeScript with no runtime imports, so the Deno scrapers and the Vite
 * front end share exactly the same rule.
 */

const STYLE_ELEMENT = /<style\b[^>]*>[\s\S]*?(?:<\/style\s*>|$)/gi;

/** Rules whose selector starts with `#`, `.` or `@` (ids, classes, at-rules). */
const SYMBOL_SELECTOR_RULE =
  /(?:[#.@][^\s{}]+\s*(?:[,>+~]\s*)?)+\{[^{}]*\}/g;

/** Rules on bare element selectors, e.g. `p { margin: 0 }` or `div.x > a { … }`. */
const ELEMENT_SELECTOR_RULE =
  /(^|[\s;}])(?:html|body|div|span|p|a|ul|ol|li|h[1-6]|section|img|table|td|tr|strong|em)(?:[#.:[][^\s{}]*)?(?:\s*[,>+~]?\s*[#.]?[\w-]+(?:[#.:[][^\s{}]*)?){0,4}\s*\{[^{}]*:[^{}]*\}/gi;

/** True when the text holds at least one real word. */
const hasWords = (text: string): boolean => /[A-Za-z]{2,}/.test(text);

export function stripCss(input: string): string {
  let text = input.replace(STYLE_ELEMENT, " ");
  // Repeat so adjacent rules separated only by whitespace are all caught.
  for (let i = 0; i < 3; i++) {
    const next = text
      .replace(SYMBOL_SELECTOR_RULE, " ")
      .replace(ELEMENT_SELECTOR_RULE, "$1 ");
    if (next === text) break;
    text = next;
  }
  return text;
}

/**
 * Returns the prose with any CSS removed, or null when nothing readable is
 * left (empty, whitespace, punctuation or CSS only).
 */
export function sanitiseProviderProse(
  input: string | null | undefined,
): string | null {
  if (typeof input !== "string") return null;
  const stripped = stripCss(input)
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
  const meaningful = stripped.replace(/^[\s.,;:!?\-–—]+|[\s.,;:\-–—]+$/g, "");
  if (!meaningful || !hasWords(meaningful)) return null;
  return stripped.replace(/^[\s.,;:\-–—]+/, "");
}
