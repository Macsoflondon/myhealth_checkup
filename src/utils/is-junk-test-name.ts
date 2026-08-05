/**
 * Scraper artefacts occasionally land in the catalogue as test rows:
 * HTTP error pages ("404 Not Found"), bot-challenge titles ("Just a moment"),
 * gift cards and other non-test entries. They must never surface in a
 * comparison view.
 */
const JUNK_PREFIX =
  /^\s*(\d{3}\b|error\b|(page\s+)?not\s+found\b|access denied|forbidden|just a moment)/i;

const JUNK_CONTAINS = /(gift\s*card|thank you for your patience|voucher)/i;

export const isJunkTestName = (name: string | null | undefined): boolean => {
  const trimmed = (name ?? "").trim();
  if (trimmed.length < 3) return true;
  return JUNK_PREFIX.test(trimmed) || JUNK_CONTAINS.test(trimmed);
};
