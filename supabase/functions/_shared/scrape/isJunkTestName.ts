/**
 * Guard against scrapers persisting HTTP error pages / bot walls as if they
 * were products (e.g. a row literally named "404 Not Found" with no price).
 */
const JUNK_PATTERNS: RegExp[] = [
  /^\s*(4\d{2}|5\d{2})\b/,
  /^\s*(page\s+)?not\s+found\b/i,
  /^\s*error\b/i,
  /access\s+denied/i,
  /forbidden/i,
  /just\s+a\s+moment/i,
  /attention\s+required/i,
  /are\s+you\s+a\s+(human|robot)/i,
  /security\s+check/i,
  /site\s+(is\s+)?(unavailable|maintenance)/i,
  /^\s*untitled\s*$/i,
];

export function isJunkTestName(name: string | null | undefined): boolean {
  const value = String(name ?? "").trim();
  if (value.length < 3) return true;
  return JUNK_PATTERNS.some((pattern) => pattern.test(value));
}
