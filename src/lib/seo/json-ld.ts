/**
 * Serialises an object for embedding inside a `<script type="application/ld+json">`
 * tag. Escapes `<` so scraped provider content containing a literal `</script>`
 * cannot break out of the script element (an XSS vector in prerendered HTML).
 */
export const serializeJsonLd = (value: unknown): string =>
  JSON.stringify(value).replace(/</g, "\\u003c");
