/**
 * Shared upsert helper for `provider_tests`.
 *
 * The table has TWO unique constraints we must satisfy on every scrape:
 *   1. (provider_id, provider_test_id)            — full unique index
 *   2. (provider_id, test_name) WHERE is_active   — partial unique index
 *
 * Naive in-memory dedupe by slug is insufficient because a *different* slug
 * already in the DB may carry the same test_name. This helper:
 *   - fetches existing active (provider_test_id, test_name) for the provider
 *   - reserves those names against incoming rows whose slug is NEW
 *   - disambiguates name collisions by appending a slug suffix
 *   - dedupes incoming rows by slug AND by name within the batch
 *
 * The result is safe to upsert with `onConflict: 'provider_id,provider_test_id'`.
 */

import { getErrorMessage } from "./errors.ts";

export interface ProviderTestRow {
  provider_id: string;
  provider_test_id: string;
  test_name: string;
  is_active?: boolean;
  // additional fields are passed through untouched
  [k: string]: unknown;
}

interface SupabaseLike {
  from: (table: string) => {
    select: (cols: string) => {
      eq: (col: string, val: string) => {
        eq: (col: string, val: boolean) => Promise<{
          data: Array<{ provider_test_id: string | null; test_name: string }> | null;
          error: { message: string } | null;
        }>;
      };
    };
    upsert: (
      rows: ProviderTestRow[],
      opts: { onConflict: string },
    ) => Promise<{ error: { message: string } | null }>;
  };
}

export interface UpsertResult {
  upsertedCount: number;
  errors: string[];
  finalRowCount: number;
}

export async function upsertProviderTests(
  supabase: SupabaseLike,
  providerId: string,
  rows: ProviderTestRow[],
  slugPrefix: string, // e.g. 'clinilabs-' or 'meddiag-'
  chunkSize = 50,
): Promise<UpsertResult> {
  // 1. Load existing active rows for this provider so we can reserve their names.
  const { data: existing, error: fetchErr } = await supabase
    .from("provider_tests")
    .select("provider_test_id, test_name")
    .eq("provider_id", providerId)
    .eq("is_active", true);

  if (fetchErr) {
    // Don't hard-fail; proceed with empty reservation set and let DB reject if needed.
    console.warn(
      `[provider-upsert] could not load existing rows for ${providerId}: ${getErrorMessage(fetchErr)}`,
    );
  }

  // Map of normalised name -> the slug that currently owns it in the DB.
  const reservedNames = new Map<string, string>();
  for (const row of existing ?? []) {
    if (!row.provider_test_id) continue;
    reservedNames.set(row.test_name.toLowerCase().trim(), row.provider_test_id);
  }

  // 2. Stage A: dedupe incoming rows by slug.
  const seenSlugs = new Set<string>();
  const slugDeduped = rows.filter((r) => {
    const key = (r.provider_test_id || r.test_name).toLowerCase().trim();
    if (seenSlugs.has(key)) return false;
    seenSlugs.add(key);
    return true;
  });

  // 3. Stage B: dedupe by name, both within batch and against reservedNames.
  // If a name collides AND the colliding row in DB has a different slug,
  // append a slug fragment to disambiguate so both rows can coexist active.
  const seenNames = new Set<string>();
  const finalRows = slugDeduped.map((r) => {
    let name = r.test_name;
    let key = name.toLowerCase().trim();
    const reservedSlug = reservedNames.get(key);
    const collides =
      seenNames.has(key) ||
      (reservedSlug !== undefined && reservedSlug !== r.provider_test_id);

    if (collides) {
      const suffix = (r.provider_test_id || "")
        .replace(new RegExp(`^${slugPrefix}`), "")
        .slice(0, 24);
      name = suffix ? `${r.test_name} (${suffix})` : `${r.test_name} (${r.provider_test_id})`;
      key = name.toLowerCase().trim();

      // Extremely rare: even the suffixed name collides. Append numeric salt.
      let salt = 2;
      while (
        seenNames.has(key) ||
        (reservedNames.has(key) && reservedNames.get(key) !== r.provider_test_id)
      ) {
        name = `${r.test_name} (${suffix}-${salt})`;
        key = name.toLowerCase().trim();
        salt += 1;
        if (salt > 50) break;
      }
    }

    seenNames.add(key);
    return { ...r, test_name: name };
  });

  // 4. Chunked upsert with per-row fallback. The (provider_id,test_name)
  // partial unique can still trip if upstream renames a product (old slug now
  // owns "Foo Test", new slug arrives also as "Foo Test") — fall back to
  // per-row upsert so one bad row doesn't fail an entire 50-row chunk.
  let upsertedCount = 0;
  const errors: string[] = [];

  async function upsertOne(row: ProviderTestRow): Promise<boolean> {
    const { error } = await supabase
      .from("provider_tests")
      .upsert([row], { onConflict: "provider_id,provider_test_id" });
    if (!error) return true;

    // Last-resort name disambiguation if the active-name unique still trips.
    const msg = getErrorMessage(error);
    if (msg.includes("provider_tests_unique_active")) {
      const suffix = (row.provider_test_id || "")
        .replace(new RegExp(`^${slugPrefix}`), "")
        .slice(0, 24);
      const renamed = {
        ...row,
        test_name: `${row.test_name} [${suffix || row.provider_test_id}]`,
      };
      const retry = await supabase
        .from("provider_tests")
        .upsert([renamed], { onConflict: "provider_id,provider_test_id" });
      if (!retry.error) return true;
      errors.push(`row ${row.provider_test_id}: ${getErrorMessage(retry.error)}`);
      return false;
    }
    errors.push(`row ${row.provider_test_id}: ${msg}`);
    return false;
  }

  for (let i = 0; i < finalRows.length; i += chunkSize) {
    const chunk = finalRows.slice(i, i + chunkSize);
    const { error } = await supabase
      .from("provider_tests")
      .upsert(chunk, { onConflict: "provider_id,provider_test_id" });
    if (!error) {
      upsertedCount += chunk.length;
      continue;
    }
    // Chunk failed — retry row-by-row so we save what we can.
    console.warn(
      `[provider-upsert] chunk ${i}-${i + chunk.length} failed (${getErrorMessage(error)}), falling back to per-row upsert`,
    );
    for (const row of chunk) {
      if (await upsertOne(row)) upsertedCount += 1;
    }
  }

  return { upsertedCount, errors, finalRowCount: finalRows.length };
}
