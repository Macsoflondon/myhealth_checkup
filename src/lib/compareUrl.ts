/**
 * Serialisation helpers for the compare selection carried in the URL.
 * The `ids` search param is the shareable source of truth for /compare/results;
 * compareStore is the local cache that mirrors it.
 */

export const COMPARE_IDS_PARAM = "ids";

/** Maximum tests a comparison view supports. */
export const MAX_COMPARE_IDS = 5;

const isValidId = (id: string): boolean => /^[A-Za-z0-9_-]{1,64}$/.test(id);

/** Parse a comma-separated id list into a de-duplicated, validated array. */
export function parseCompareIds(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const seen = new Set<string>();
  const ids: string[] = [];
  for (const part of raw.split(",")) {
    const id = part.trim();
    if (!id || !isValidId(id) || seen.has(id)) continue;
    seen.add(id);
    ids.push(id);
    if (ids.length >= MAX_COMPARE_IDS) break;
  }
  return ids;
}

/** Serialise ids for the URL. Returns an empty string when there is nothing to share. */
export function serialiseCompareIds(ids: readonly string[]): string {
  return ids.slice(0, MAX_COMPARE_IDS).join(",");
}

/** Order-sensitive equality so we only rewrite the URL when the selection really changed. */
export function sameCompareIds(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((id, i) => id === b[i]);
}

/** Build a shareable path for a given selection. */
export function compareResultsPath(ids: readonly string[]): string {
  const query = serialiseCompareIds(ids);
  return query ? `/compare/results?${COMPARE_IDS_PARAM}=${encodeURIComponent(query)}` : "/compare/results";
}
