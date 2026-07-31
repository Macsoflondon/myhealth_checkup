/**
 * Provider-scoped, exact-match application of externally scraped rows
 * (Apify datasets today) onto `provider_tests`.
 *
 * Safety rules — these exist because a fuzzy, provider-agnostic update once
 * made it possible to overwrite pricing across every provider at once:
 *   1. Every read and write is scoped with `.eq('provider_id', providerId)`.
 *   2. Matching is by stable identifier: the provider's product URL first,
 *      then an exact (case-insensitive, trimmed) test_name equality match.
 *      Never a substring/`ilike '%...%'` match.
 *   3. Zero matches or more than one match => skip the row entirely.
 *      Ambiguity must never write.
 */

// deno-lint-ignore no-explicit-any
type SupabaseLike = any;

export interface ProviderDatasetRow {
  test_name?: string | null;
  url?: string | null;
  product_url?: string | null;
  base_price?: number | string | null;
  price?: number | string | null;
  clinic_fee?: number | string | null;
  clinic_phlebotomy_cost?: number | string | null;
  home_nurse_fee?: number | string | null;
  home_phlebotomy_cost?: number | string | null;
  gp_review_included?: boolean | null;
  biomarkers_list?: string[] | null;
  biomarker_count?: number | null;
  turnaround_raw?: string | null;
  [key: string]: unknown;
}

export interface UnmatchedItem {
  test_name: string | null;
  url: string | null;
  reason: "unmatched" | "ambiguous" | "no_identifier" | "no_fields";
  candidates?: number;
}

export interface ApplyResult {
  matched: number;
  updated: number;
  skipped_ambiguous: number;
  skipped_unmatched: number;
  unmatched: UnmatchedItem[];
  errors: { test_name: string | null; message: string }[];
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** Trailing-slash-insensitive URL variants for exact matching. */
function urlVariants(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const withoutSlash = trimmed.replace(/\/+$/, "");
  return Array.from(new Set([trimmed, withoutSlash, `${withoutSlash}/`]));
}

/** PostgREST `ilike` with no wildcards is a case-insensitive equality match. */
function escapeLikeLiteral(value: string): string {
  return value.replace(/([%_\\])/g, "\\$1");
}

export async function applyProviderRows(
  supabase: SupabaseLike,
  providerId: string,
  items: ProviderDatasetRow[],
  options: { scrapeSourceUrl?: string } = {},
): Promise<ApplyResult> {
  const result: ApplyResult = {
    matched: 0,
    updated: 0,
    skipped_ambiguous: 0,
    skipped_unmatched: 0,
    unmatched: [],
    errors: [],
  };

  const nowIso = new Date().toISOString();

  for (const item of items) {
    const name = typeof item.test_name === "string" ? item.test_name.trim() : "";
    const rawUrl = typeof (item.url ?? item.product_url) === "string"
      ? String(item.url ?? item.product_url).trim()
      : "";

    if (!name && !rawUrl) {
      result.skipped_unmatched++;
      result.unmatched.push({ test_name: name || null, url: rawUrl || null, reason: "no_identifier" });
      continue;
    }

    // 1. Stable identifier first: the provider's product URL.
    let candidates: { id: string }[] = [];
    if (rawUrl) {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("id")
        .eq("provider_id", providerId)
        .eq("is_active", true)
        .in("url", urlVariants(rawUrl))
        .limit(5);
      if (error) {
        result.errors.push({ test_name: name || null, message: error.message });
        continue;
      }
      candidates = data ?? [];
    }

    // 2. Fall back to exact, case-insensitive, trimmed name equality.
    if (candidates.length === 0 && name) {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("id")
        .eq("provider_id", providerId)
        .eq("is_active", true)
        .ilike("test_name", escapeLikeLiteral(name))
        .limit(5);
      if (error) {
        result.errors.push({ test_name: name || null, message: error.message });
        continue;
      }
      candidates = data ?? [];
    }

    if (candidates.length === 0) {
      result.skipped_unmatched++;
      result.unmatched.push({ test_name: name || null, url: rawUrl || null, reason: "unmatched" });
      continue;
    }
    if (candidates.length > 1) {
      result.skipped_ambiguous++;
      result.unmatched.push({
        test_name: name || null,
        url: rawUrl || null,
        reason: "ambiguous",
        candidates: candidates.length,
      });
      continue;
    }

    result.matched++;

    const basePrice = toNumber(item.base_price ?? item.price);
    const clinicFee = toNumber(item.clinic_fee ?? item.clinic_phlebotomy_cost);
    const homeFee = toNumber(item.home_nurse_fee ?? item.home_phlebotomy_cost);

    // deno-lint-ignore no-explicit-any
    const patch: Record<string, any> = {
      scraped_at: nowIso,
      last_validated_at: nowIso,
    };
    if (basePrice !== null) patch.base_price = basePrice;
    if (clinicFee !== null) patch.clinic_phlebotomy_cost = clinicFee;
    if (homeFee !== null) patch.home_phlebotomy_cost = homeFee;
    if (typeof item.gp_review_included === "boolean") patch.gp_review_included = item.gp_review_included;
    if (Array.isArray(item.biomarkers_list) && item.biomarkers_list.length > 0) {
      patch.biomarkers_list = item.biomarkers_list;
      patch.biomarker_count = item.biomarkers_list.length;
    }
    if (typeof item.turnaround_raw === "string" && item.turnaround_raw.trim()) {
      patch.turnaround_raw = item.turnaround_raw.trim();
    }
    if (options.scrapeSourceUrl) patch.url_verified_at = nowIso;

    const { error: updateError } = await supabase
      .from("provider_tests")
      .update(patch)
      .eq("id", candidates[0].id)
      .eq("provider_id", providerId);

    if (updateError) {
      result.errors.push({ test_name: name || null, message: updateError.message });
      continue;
    }
    result.updated++;
  }

  return result;
}
