/** Bounded isolate-local cache: public catalogue DTOs only, never sessions or health records. */
export const PUBLIC_CATALOGUE_TTL_MS = 5 * 60 * 1000;

export function createPublicCatalogueMemo() {
  const entries = new Map<
    string,
    { expires: number; value: Promise<unknown> }
  >();
  return async function read<T>(
    key: string,
    load: () => Promise<T>,
  ): Promise<T> {
    const now = Date.now();
    const hit = entries.get(key);
    if (hit && hit.expires > now) return hit.value as Promise<T>;
    entries.delete(key);
    if (entries.size >= 100) {
      const oldest = entries.keys().next().value;
      if (oldest !== undefined) entries.delete(oldest);
    }
    const value = load();
    entries.set(key, { expires: now + PUBLIC_CATALOGUE_TTL_MS, value });
    try {
      return await value;
    } catch (error) {
      if (entries.get(key)?.value === value) entries.delete(key);
      throw error;
    }
  };
}

const readMemo = createPublicCatalogueMemo();
export function publicCatalogueRead<T>(
  key: string,
  load: () => Promise<T>,
): Promise<T> {
  // Browser QueryClient remains the cache owner; no cross-session browser memo.
  return import.meta.env.SSR ? readMemo(key, load) : load();
}
