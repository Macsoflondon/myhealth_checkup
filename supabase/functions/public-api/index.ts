// myhealth checkup — public comparison API (v1)
//
// Read-only JSON API over the api_v1_* views. Built for AI agents and any
// site that wants live UK private blood test and cancer screening prices.
// Described to agents by /.well-known/web-mcp.json and /llms.txt.
//
// Routes (".json" suffix and a leading "/v1" are both optional):
//   GET /                        API index
//   GET /tests                   search, filter and sort tests
//   GET /tests/{id}              one test
//   GET /providers               providers with accreditation notes
//   GET /providers/{id}          one provider
//   GET /categories              categories with live tests
//   GET /biomarkers              biomarker directory
//   GET /compare/tests           compare a named test across providers
//   GET /compare/biomarker       compare one biomarker across every test and provider
//   GET /compare/biomarkers      find tests that cover several biomarkers at once
//   GET /.well-known/web-mcp.json   WebMCP manifest (copied to the site)
//   GET /.well-known/mcp.json       MCP server card (copied to the site)
//   POST /mcp                    MCP server (streamable HTTP, stateless, tools only)
//
// Design rules (from the myhealth checkup operating standards):
//   * No user data. Nothing personal is read, stored or logged. IPs are only
//     hashed in memory for rate limiting and never persisted.
//   * Default ordering is by price. Nothing is ranked by commission.
//   * Every response carries a timestamp, a disclaimer and known limitations.
//   * Links go straight to the provider's own page.

import { createClient } from "npm:@supabase/supabase-js@2.111.0";

const API_VERSION = "1.0";
const SITE = "https://myhealthcheckup.co.uk";
const FN_BASE = "https://clvuioagsgfadynuvodj.supabase.co/functions/v1/public-api";

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX_ENTRIES = 300;
const RATE_LIMIT_PER_MINUTE = 120;
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 25;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

// ---------------------------------------------------------------------------
// Copy shown in every response
// ---------------------------------------------------------------------------

const DISCLAIMER =
  "Prices and test details come from each provider's own website and were checked at the time shown. " +
  "Prices change. Confirm the final price and what is included on the provider's page before you buy. " +
  "myhealth checkup compares tests. It is not a medical provider and does not give medical advice, diagnosis or treatment.";

const KNOWN_LIMITATIONS = [
  "total_expected_cost_gbp is our all-in figure. For clinic-only tests it adds the collection fee the provider publishes (see total_includes_collection_fee). Where a provider offers a choice of collection routes, each route's fee is listed separately and not added. Optional extras are not included.",
  "Add-on tests (is_addon: true) are bought with a base test, not on their own.",
  "Biomarkers are matched to our library by exact name, synonym, abbreviation or the text in and before brackets. No fuzzy matching. Some tests have no biomarker list, or none we could match yet, so the biomarker tools do not see them. The index reports how many.",
  "price_check_stale: true means the price has not been re-checked against the provider's page for 7 days or more. Stale prices are listed but never picked as the cheapest option.",
  "Accreditation notes record what we found on public registers (UKAS, CQC, MHRA) on the date shown for each provider. A null date means we have not checked that provider yet.",
];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Row = Record<string, unknown>;

interface ApiResult {
  status: number;
  body: Row;
}

class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public extra: Row = {}) {
    super(message);
  }
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const TEST_COLUMNS =
  "id, provider_id, provider_name, test_name, category, is_addon, price_gbp, total_expected_cost_gbp, total_includes_collection_fee, " +
  "collection_method, collection_fee_type, collection_fee_gbp, home_phlebotomy_cost_gbp, clinic_phlebotomy_cost_gbp, " +
  "clinical_review_type, clinical_review_fee_gbp, sample_type, home_kit_available, clinic_visit_available, " +
  "location_options, turnaround_days, turnaround_text, biomarker_count, biomarkers, gender_specific, " +
  "provider_url, provider_url_verified, last_checked_at, price_check_stale";

const OFFER_COLUMNS =
  "biomarker_id, test_id, provider_id, provider_name, test_name, is_addon, price_gbp, total_expected_cost_gbp, " +
  "biomarker_count, sample_type, home_kit_available, clinic_visit_available, turnaround_days, turnaround_text, " +
  "provider_url, last_checked_at, price_check_stale";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

/** Free-text search input: letters, digits, spaces and a few safe symbols only. */
function cleanText(v: string | null, max = 80): string | null {
  if (!v) return null;
  const s = v.normalize("NFKC").replace(/[^\p{L}\p{N} \-'.:/+]/gu, " ").replace(/\s+/g, " ").trim().slice(0, max);
  return s.length >= 2 ? s : null;
}

/** Slug input for ids and categories. */
function cleanSlug(v: string | null): string | null {
  if (!v) return null;
  const s = v.toLowerCase().trim().replace(/[^a-z0-9-]/g, "").slice(0, 60);
  return s || null;
}

function intParam(v: string | null, def: number, min: number, max: number): number {
  const n = v === null ? NaN : parseInt(v, 10);
  if (!Number.isFinite(n)) return def;
  return Math.min(max, Math.max(min, n));
}

function boolParam(v: string | null, def: boolean): boolean {
  if (v === null) return def;
  return ["1", "true", "yes"].includes(v.toLowerCase());
}

function normalise(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/%/g, " percent ").replace(/[^a-z0-9]+/g, " ").trim();
}

/** Prefer prices checked in the last 7 days; fall back to stale ones only if nothing else exists. */
function pickCheapest<T extends Row>(rows: T[]): T | null {
  const sorted = [...rows].sort(byCost);
  return sorted.find((r) => r.price_check_stale !== true) ?? sorted[0] ?? null;
}

/** Rows from untyped view queries. */
function asRows(data: unknown): Row[] {
  return Array.isArray(data) ? (data as Row[]) : [];
}

function escapeLike(s: string): string {
  return s.replace(/[%_\\]/g, (m) => `\\${m}`);
}

// ---------------------------------------------------------------------------
// Shaping rows into the public contract
// ---------------------------------------------------------------------------

function shapeTest(r: Row) {
  const listed = Array.isArray(r.biomarkers) ? (r.biomarkers as unknown[]).map(String) : [];
  return {
    id: r.id,
    name: r.test_name,
    provider: { id: r.provider_id, name: r.provider_name },
    category: r.category ?? null,
    is_addon: r.is_addon === true,
    price: {
      price_gbp: num(r.price_gbp),
      total_expected_cost_gbp: num(r.total_expected_cost_gbp),
      total_includes_collection_fee: r.total_includes_collection_fee === true,
      collection_method: r.collection_method ?? null,
      collection_fee_type: r.collection_fee_type ?? null,
      collection_fee_gbp: num(r.collection_fee_gbp),
      home_phlebotomy_cost_gbp: num(r.home_phlebotomy_cost_gbp),
      clinic_phlebotomy_cost_gbp: num(r.clinic_phlebotomy_cost_gbp),
      clinical_review_type: r.clinical_review_type ?? null,
      clinical_review_fee_gbp: num(r.clinical_review_fee_gbp),
    },
    sample: {
      type: r.sample_type ?? null,
      home_kit_available: r.home_kit_available === true,
      clinic_visit_available: r.clinic_visit_available === true,
      location_options: Array.isArray(r.location_options) ? r.location_options : [],
    },
    turnaround: {
      days: r.turnaround_days ?? null,
      text: r.turnaround_text ?? null,
    },
    biomarkers: {
      count: r.biomarker_count ?? (listed.length || null),
      listed,
    },
    gender_specific: r.gender_specific ?? null,
    provider_url: r.provider_url ?? null,
    provider_url_verified: r.provider_url_verified === true,
    last_checked_at: r.last_checked_at ?? null,
    price_check_stale: r.price_check_stale === true,
  };
}

function shapeOffer(r: Row) {
  return {
    test_id: r.test_id,
    test_name: r.test_name,
    provider: { id: r.provider_id, name: r.provider_name },
    is_addon: r.is_addon === true,
    price_gbp: num(r.price_gbp),
    total_expected_cost_gbp: num(r.total_expected_cost_gbp),
    biomarkers_in_test: r.biomarker_count ?? null,
    sample_type: r.sample_type ?? null,
    home_kit_available: r.home_kit_available === true,
    clinic_visit_available: r.clinic_visit_available === true,
    turnaround: { days: r.turnaround_days ?? null, text: r.turnaround_text ?? null },
    provider_url: r.provider_url ?? null,
    last_checked_at: r.last_checked_at ?? null,
    price_check_stale: r.price_check_stale === true,
  };
}

function shapeProvider(r: Row) {
  return {
    id: r.id,
    name: r.name,
    website_url: r.website_url ?? null,
    legal_name: r.legal_name ?? null,
    companies_house_number: r.companies_house_number ?? null,
    accreditation: {
      notes: Array.isArray(r.accreditation_notes) ? r.accreditation_notes : [],
      checked_on: r.accreditation_checked_on ?? null,
      source: "Public registers (UKAS, CQC, MHRA) as named in each note. A null checked_on means not yet checked.",
    },
    tests: {
      standalone_count: r.test_count ?? 0,
      addon_count: r.addon_count ?? 0,
      total_expected_cost_range_gbp: [num(r.min_total_expected_cost_gbp), num(r.max_total_expected_cost_gbp)],
    },
    offers_home_kits: r.offers_home_kits === true,
    offers_clinic_visits: r.offers_clinic_visits === true,
    prices_last_checked_at: r.prices_last_checked_at ?? null,
  };
}

function byCost(a: Row, b: Row): number {
  const x = num(a.total_expected_cost_gbp) ?? Number.MAX_VALUE;
  const y = num(b.total_expected_cost_gbp) ?? Number.MAX_VALUE;
  return x - y || String(a.test_name ?? "").localeCompare(String(b.test_name ?? ""));
}

// ---------------------------------------------------------------------------
// Shared lookups (cached in memory)
// ---------------------------------------------------------------------------

let freshness: { value: string | null; expires: number } = { value: null, expires: 0 };

async function dataLastCheckedAt(): Promise<string | null> {
  if (Date.now() < freshness.expires) return freshness.value;
  const { data, error } = await supabase
    .from("api_v1_tests")
    .select("last_checked_at")
    .not("last_checked_at", "is", null)
    .order("last_checked_at", { ascending: false })
    .limit(1);
  if (error) throw error;
  freshness = { value: (data?.[0]?.last_checked_at as string) ?? null, expires: Date.now() + CACHE_TTL_MS };
  return freshness.value;
}

interface BiomarkerEntry {
  id: string;
  name: string;
  abbreviation: string | null;
  synonyms: string[];
  category: string | null;
  provider_count: number;
  test_count: number;
  cheapest_standalone_test_gbp: number | null;
  keys: string[];
}

let biomarkerIndex: { value: BiomarkerEntry[]; expires: number } = { value: [], expires: 0 };

async function biomarkers(): Promise<BiomarkerEntry[]> {
  if (Date.now() < biomarkerIndex.expires && biomarkerIndex.value.length) return biomarkerIndex.value;
  const { data, error } = await supabase
    .from("api_v1_biomarkers")
    .select("id, name, abbreviation, synonyms, category, provider_count, test_count, cheapest_standalone_test_gbp")
    .limit(5000);
  if (error) throw error;
  const value = (data ?? []).map((r: Row) => {
    const synonyms = Array.isArray(r.synonyms) ? (r.synonyms as unknown[]).map(String) : [];
    const keys = [String(r.name), ...(r.abbreviation ? [String(r.abbreviation)] : []), ...synonyms]
      .map(normalise)
      .filter(Boolean);
    return {
      id: String(r.id),
      name: String(r.name),
      abbreviation: (r.abbreviation as string) ?? null,
      synonyms,
      category: (r.category as string) ?? null,
      provider_count: Number(r.provider_count ?? 0),
      test_count: Number(r.test_count ?? 0),
      cheapest_standalone_test_gbp: num(r.cheapest_standalone_test_gbp),
      keys: [...new Set(keys)],
    };
  });
  biomarkerIndex = { value, expires: Date.now() + CACHE_TTL_MS };
  return value;
}

function publicBiomarker(b: BiomarkerEntry) {
  return {
    id: b.id,
    name: b.name,
    abbreviation: b.abbreviation,
    synonyms: b.synonyms,
    category: b.category,
    provider_count: b.provider_count,
    test_count: b.test_count,
    cheapest_standalone_test_gbp: b.cheapest_standalone_test_gbp,
  };
}

type Resolution =
  | { kind: "match"; biomarker: BiomarkerEntry; alternatives?: BiomarkerEntry[] }
  | { kind: "ambiguous"; candidates: BiomarkerEntry[] }
  | { kind: "none"; suggestions: BiomarkerEntry[] };

/**
 * Exact match on name, abbreviation or synonym first (also ignoring spaces, so
 * "ca125" finds "CA-125"); then a single partial match. When several
 * biomarkers share an exact key, the one offered by the most providers wins,
 * the rest come back as alternatives, and a true tie is reported as ambiguous.
 * Biomarkers whose names contain the query as a whole word (for example
 * "HDL %" or "Non-HDL Cholesterol" for "hdl") are also returned as
 * alternatives, so a caller can see what it did not get.
 */
async function resolveBiomarker(input: string): Promise<Resolution> {
  const all = await biomarkers();
  if (UUID_RE.test(input)) {
    const hit = all.find((b) => b.id === input.toLowerCase());
    return hit ? { kind: "match", biomarker: hit } : { kind: "none", suggestions: [] };
  }
  const q = normalise(input);
  if (!q) return { kind: "none", suggestions: [] };
  const qc = q.replace(/ /g, "");
  const rank = (a: BiomarkerEntry, b: BiomarkerEntry) => b.provider_count - a.provider_count || b.test_count - a.test_count;

  let exact = all.filter((b) => b.keys.includes(q));
  if (!exact.length && qc.length >= 3) exact = all.filter((b) => b.keys.some((k) => k.replace(/ /g, "") === qc));

  if (exact.length) {
    const ranked = [...exact].sort(rank);
    if (ranked.length > 1 && ranked[0].provider_count === ranked[1].provider_count && ranked[0].test_count === ranked[1].test_count) {
      return { kind: "ambiguous", candidates: ranked.slice(0, 10) };
    }
    const chosen = ranked[0];
    const wordRe = new RegExp(`(^| )${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}( |$)`);
    const related = all
      .filter((b) => b !== chosen && !ranked.includes(b) && b.keys.some((k) => wordRe.test(k)))
      .sort(rank);
    return { kind: "match", biomarker: chosen, alternatives: [...ranked.slice(1), ...related].slice(0, 8) };
  }

  const words = q.split(" ");
  const partial = all
    .filter((b) => b.keys.some((k) => words.every((w) => k.includes(w))))
    .sort(rank);
  if (partial.length === 1) return { kind: "match", biomarker: partial[0] };
  if (partial.length > 1) return { kind: "ambiguous", candidates: partial.slice(0, 10) };

  const loose = all
    .filter((b) => b.keys.some((k) => words.some((w) => w.length >= 3 && k.includes(w)) || (qc.length >= 3 && k.replace(/ /g, "").includes(qc))))
    .sort(rank)
    .slice(0, 10);
  return { kind: "none", suggestions: loose };
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async function handleIndex(): Promise<ApiResult> {
  const [cov, providers, bms] = await Promise.all([
    supabase.from("api_v1_coverage").select("*").maybeSingle(),
    supabase.from("api_v1_providers").select("id", { count: "exact", head: true }),
    biomarkers(),
  ]);
  if (cov.error) throw cov.error;
  const c = (cov.data ?? {}) as Row;
  return {
    status: 200,
    body: {
      name: "myhealth checkup public comparison API",
      description:
        "Live prices, biomarkers, sample methods and turnaround times for UK private blood tests and cancer screening, compared across providers.",
      documentation: `${SITE}/llms.txt`,
      webmcp_manifest: `${FN_BASE}/.well-known/web-mcp.json`,
      mcp_endpoint: `${FN_BASE}/mcp`,
      coverage: {
        standalone_tests: c.standalone_tests ?? null,
        addon_tests: c.addon_tests ?? null,
        providers: providers.count ?? null,
        biomarkers_compared: bms.length,
        biomarkers_offered_by_two_or_more_providers: bms.filter((b) => b.provider_count >= 2).length,
      },
      known_gaps: {
        standalone_tests_without_biomarker_list: c.standalone_tests_without_biomarker_list ?? null,
        standalone_tests_without_matched_biomarkers: c.standalone_tests_without_matched_biomarkers ?? null,
        tests_with_stale_price_check: c.tests_with_stale_price_check ?? null,
      },
      endpoints: [
        { path: "/tests", description: "Search, filter and sort tests.", params: ["search", "category", "provider", "max_cost", "collection (home_kit | clinic_visit)", "include_addons", "sort (price | price_desc | name | turnaround)", "limit", "offset"] },
        { path: "/tests/{id}", description: "One test with its full cost breakdown and biomarker list." },
        { path: "/providers", description: "Providers with accreditation notes and price ranges.", params: ["id"] },
        { path: "/categories", description: "Categories with live tests." },
        { path: "/biomarkers", description: "Biomarkers we compare, with coverage and cheapest standalone test.", params: ["search", "min_providers", "limit", "offset"] },
        { path: "/compare/tests", description: "Compare a named test across providers and find the lowest total expected cost.", params: ["q", "include_addons"] },
        { path: "/compare/biomarker", description: "Every test and provider that measures one biomarker, cheapest first.", params: ["biomarker", "include_addons"] },
        { path: "/compare/biomarkers", description: "Tests that measure all of several biomarkers in one sample, cheapest first.", params: ["biomarkers (comma-separated, up to 10)"] },
      ],
      base_url: FN_BASE,
    },
  };
}

async function handleTests(p: URLSearchParams): Promise<ApiResult> {
  const rawSearch = p.get("search") ?? p.get("q");
  const search = cleanText(rawSearch);
  if (rawSearch && rawSearch.trim() && !search) {
    throw new ApiError(400, "invalid_search", "search needs at least two letters or digits.");
  }
  const rawCategory = p.get("category");
  const category = cleanSlug(rawCategory ? rawCategory.trim().replace(/[\s_]+/g, "-").replace(/'/g, "") : null);
  if (rawCategory && rawCategory.trim() && !category) {
    throw new ApiError(400, "invalid_category", "Unknown category. Call /categories for the list.");
  }
  const rawProvider = p.get("provider");
  const providerText = (p.get("provider") ?? "").replace(/[^A-Za-z0-9 -]/g, "").replace(/\s+/g, " ").trim().slice(0, 60) || null;
  const provider = cleanSlug(providerText?.replace(/\s+/g, "-") ?? null);
  if (rawProvider && rawProvider.trim() && !provider) {
    throw new ApiError(400, "invalid_provider", "Unknown provider. Call /providers for the list.");
  }
  const maxCost = p.get("max_cost") ?? p.get("max_price");
  if (maxCost && !Number.isFinite(Number(maxCost))) {
    throw new ApiError(400, "invalid_max_cost", "max_cost must be a number in GBP.");
  }
  const collection = cleanSlug(p.get("collection"));
  const COLLECTIONS = ["home-kit", "homekit", "home", "clinic-visit", "clinicvisit", "clinic"];
  if (collection && !COLLECTIONS.includes(collection)) {
    throw new ApiError(400, "invalid_collection", "collection must be home_kit or clinic_visit.");
  }
  const includeAddons = boolParam(p.get("include_addons"), false);
  const sort = cleanSlug(p.get("sort")) ?? "price";
  if (!["price", "price-desc", "pricedesc", "name", "turnaround"].includes(sort)) {
    throw new ApiError(400, "invalid_sort", "sort must be price, price_desc, name or turnaround.");
  }
  const limit = intParam(p.get("limit"), DEFAULT_LIMIT, 1, MAX_LIMIT);
  const offset = intParam(p.get("offset"), 0, 0, 5000);

  let q = supabase.from("api_v1_tests").select(TEST_COLUMNS, { count: "exact" });
  if (search) q = q.ilike("test_name", `%${escapeLike(search)}%`);
  if (category) q = q.eq("category", category);
  // Accept a provider id ("randox") or a name ("Randox Health"). Inputs are
  // reduced to letters, digits, spaces and hyphens above, so the filter
  // string cannot break out of its quotes.
  if (provider && providerText) {
    q = q.or(`provider_id.eq.${provider},provider_id.ilike.*${provider}*,provider_name.ilike."*${providerText}*"`);
  }
  if (maxCost && Number.isFinite(Number(maxCost))) q = q.lte("total_expected_cost_gbp", Number(maxCost));
  if (collection === "home-kit" || collection === "homekit" || collection === "home") q = q.eq("home_kit_available", true);
  if (collection === "clinic-visit" || collection === "clinicvisit" || collection === "clinic") q = q.eq("clinic_visit_available", true);
  if (!includeAddons) q = q.eq("is_addon", false);

  if (sort === "name") q = q.order("test_name", { ascending: true });
  else if (sort === "turnaround") q = q.order("turnaround_days", { ascending: true, nullsFirst: false });
  else q = q.order("total_expected_cost_gbp", { ascending: sort !== "price-desc" && sort !== "pricedesc" });
  q = q.order("id", { ascending: true }).range(offset, offset + limit - 1);

  const { data, error, count } = await q;
  // PostgREST rejects a range that starts past the last row. Treat it as an empty page.
  const pastEnd = !!error && (error as { code?: string }).code === "PGRST103";
  if (error && !pastEnd) throw error;
  let total = count ?? null;
  if (pastEnd) {
    let cq = supabase.from("api_v1_tests").select("id", { count: "exact", head: true });
    if (search) cq = cq.ilike("test_name", `%${escapeLike(search)}%`);
    if (category) cq = cq.eq("category", category);
    if (provider && providerText) {
      cq = cq.or(`provider_id.eq.${provider},provider_id.ilike.*${provider}*,provider_name.ilike."*${providerText}*"`);
    }
    if (maxCost) cq = cq.lte("total_expected_cost_gbp", Number(maxCost));
    if (!includeAddons) cq = cq.eq("is_addon", false);
    total = (await cq).count ?? null;
  }
  return {
    status: 200,
    body: {
      query: { search, category, provider: providerText, max_cost: maxCost ? Number(maxCost) : null, collection, include_addons: includeAddons, sort, limit, offset },
      total,
      results: pastEnd ? [] : asRows(data).map(shapeTest),
    },
  };
}

async function handleTest(id: string): Promise<ApiResult> {
  if (!UUID_RE.test(id)) throw new ApiError(400, "invalid_id", "Test id must be a UUID from /tests.");
  const { data, error } = await supabase.from("api_v1_tests").select(TEST_COLUMNS).eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) throw new ApiError(404, "not_found", "No live test with that id.");

  const { data: links, error: e2 } = await supabase
    .from("api_v1_biomarker_offers")
    .select("biomarker_id")
    .eq("test_id", id);
  if (e2) throw e2;
  const all = await biomarkers();
  const byId = new Map(all.map((b) => [b.id, b]));
  const matched = (links ?? [])
    .map((l: Row) => byId.get(String(l.biomarker_id)))
    .filter((b): b is BiomarkerEntry => !!b)
    .map((b) => ({ id: b.id, name: b.name, abbreviation: b.abbreviation }));

  return { status: 200, body: { result: { ...shapeTest(data as unknown as Row), biomarkers_matched: matched } } };
}

async function handleProviders(p: URLSearchParams, pathId?: string): Promise<ApiResult> {
  const rawId = pathId ?? p.get("id");
  const id = cleanSlug(rawId);
  if (rawId && rawId.trim() && !id) throw new ApiError(404, "not_found", "No provider with that id. Call /providers for the list.");
  let q = supabase
    .from("api_v1_providers")
    .select("*")
    .order("name", { ascending: true });
  if (id) q = q.eq("id", id);
  const { data, error } = await q;
  if (error) throw error;
  if (id && !(data ?? []).length) throw new ApiError(404, "not_found", "No provider with that id. Call /providers for the list.");
  const results = (data ?? []).map(shapeProvider);
  return { status: 200, body: pathId ? { result: results[0] } : { total: results.length, results } };
}

async function handleCategories(): Promise<ApiResult> {
  const { data, error } = await supabase
    .from("api_v1_categories")
    .select("category, test_count, provider_count")
    .order("test_count", { ascending: false });
  if (error) throw error;
  return { status: 200, body: { total: (data ?? []).length, results: data ?? [] } };
}

async function handleBiomarkers(p: URLSearchParams): Promise<ApiResult> {
  const search = cleanText(p.get("search") ?? p.get("q"));
  const minProviders = intParam(p.get("min_providers"), 1, 1, 20);
  const limit = intParam(p.get("limit"), 50, 1, 200);
  const offset = intParam(p.get("offset"), 0, 0, 5000);
  let all = (await biomarkers()).filter((b) => b.provider_count >= minProviders);
  if (search) {
    const words = normalise(search).split(" ");
    all = all.filter((b) => b.keys.some((k) => words.every((w) => k.includes(w))));
  }
  all = [...all].sort((a, b) => b.provider_count - a.provider_count || b.test_count - a.test_count || a.name.localeCompare(b.name));
  return {
    status: 200,
    body: {
      query: { search, min_providers: minProviders, limit, offset },
      total: all.length,
      results: all.slice(offset, offset + limit).map(publicBiomarker),
    },
  };
}

async function handleCompareTests(p: URLSearchParams): Promise<ApiResult> {
  const term = cleanText(p.get("q") ?? p.get("test") ?? p.get("search"));
  if (!term) throw new ApiError(400, "missing_q", "Pass the test name in q, for example ?q=vitamin d.");
  const includeAddons = boolParam(p.get("include_addons"), false);

  let q = supabase
    .from("api_v1_tests")
    .select(TEST_COLUMNS)
    .ilike("test_name", `%${escapeLike(term)}%`)
    .order("total_expected_cost_gbp", { ascending: true })
    .limit(300);
  if (!includeAddons) q = q.eq("is_addon", false);
  const { data, error } = await q;
  if (error) throw error;
  const rows = asRows(data);

  const perProvider = new Map<string, Row[]>();
  for (const r of rows) {
    const k = String(r.provider_id);
    if (!perProvider.has(k)) perProvider.set(k, []);
    perProvider.get(k)!.push(r);
  }
  const providers = [...perProvider.values()]
    .map((list) => {
      const best = pickCheapest(list)!;
      return {
        provider: { id: best.provider_id, name: best.provider_name },
        cheapest: shapeTest(best),
        matching_tests: list.length,
      };
    })
    .sort((a, b) => (a.cheapest.price.total_expected_cost_gbp ?? 1e9) - (b.cheapest.price.total_expected_cost_gbp ?? 1e9));

  return {
    status: 200,
    body: {
      query: { q: term, include_addons: includeAddons },
      match_note:
        "Tests are matched by name. Tests with similar names can measure different biomarkers, so compare biomarkers.count, or use /compare/biomarker for a like-for-like comparison.",
      total_matches: rows.length,
      provider_count: providers.length,
      cheapest: providers[0]?.cheapest ?? null,
      providers,
      results: rows.slice(0, 50).map(shapeTest),
    },
  };
}

async function offersFor(biomarkerIds: string[], includeAddons: boolean): Promise<Row[]> {
  let q = supabase
    .from("api_v1_biomarker_offers")
    .select(OFFER_COLUMNS)
    .in("biomarker_id", biomarkerIds)
    .order("total_expected_cost_gbp", { ascending: true })
    .limit(5000);
  if (!includeAddons) q = q.eq("is_addon", false);
  const { data, error } = await q;
  if (error) throw error;
  return asRows(data);
}

async function handleCompareBiomarker(p: URLSearchParams): Promise<ApiResult> {
  const input = cleanText(p.get("biomarker") ?? p.get("q") ?? p.get("id"), 80);
  if (!input) throw new ApiError(400, "missing_biomarker", "Pass a biomarker name, abbreviation or id, for example ?biomarker=ferritin.");
  const includeAddons = boolParam(p.get("include_addons"), true);

  const res = await resolveBiomarker(input);
  if (res.kind === "ambiguous") {
    return {
      status: 200,
      body: {
        status: "ambiguous",
        query: { biomarker: input },
        message: "More than one biomarker matches. Call again with one of these ids or names.",
        candidates: res.candidates.map(publicBiomarker),
      },
    };
  }
  if (res.kind === "none") {
    throw new ApiError(404, "biomarker_not_found", "No live test measures a biomarker by that name.", {
      suggestions: res.suggestions.map(publicBiomarker),
    });
  }

  const b = res.biomarker;
  const offers = (await offersFor([b.id], includeAddons)).sort(byCost);
  const standalone = pickCheapest(offers.filter((o) => o.is_addon !== true));
  const addon = pickCheapest(offers.filter((o) => o.is_addon === true));

  const perProvider = new Map<string, Row[]>();
  for (const o of offers) {
    const k = String(o.provider_id);
    if (!perProvider.has(k)) perProvider.set(k, []);
    perProvider.get(k)!.push(o);
  }
  const byProvider = [...perProvider.values()]
    .map((list) => {
      const s = pickCheapest(list.filter((o) => o.is_addon !== true));
      const a = pickCheapest(list.filter((o) => o.is_addon === true));
      return {
        provider: { id: list[0].provider_id, name: list[0].provider_name },
        tests_measuring_it: list.length,
        cheapest_standalone: s ? shapeOffer(s) : null,
        cheapest_addon: a ? shapeOffer(a) : null,
      };
    })
    .sort(
      (x, y) =>
        (x.cheapest_standalone?.total_expected_cost_gbp ?? 1e9) - (y.cheapest_standalone?.total_expected_cost_gbp ?? 1e9),
    );

  const costs = offers.map((o) => num(o.total_expected_cost_gbp)).filter((n): n is number => n !== null);
  return {
    status: 200,
    body: {
      status: "ok",
      query: { biomarker: input, include_addons: includeAddons },
      biomarker: publicBiomarker(b),
      other_possible_matches: (res.alternatives ?? []).map(publicBiomarker),
      summary: {
        provider_count: byProvider.length,
        test_count: offers.length,
        cheapest_standalone: standalone ? shapeOffer(standalone) : null,
        cheapest_addon: addon ? shapeOffer(addon) : null,
        total_expected_cost_range_gbp: costs.length ? [Math.min(...costs), Math.max(...costs)] : null,
      },
      notes: [
        "Panel tests measure other biomarkers as well. biomarkers_in_test shows how many.",
        "Add-on tests are bought with a base test, not on their own.",
        "Cheapest picks skip prices not re-checked for 7 days (price_check_stale) unless nothing else exists.",
      ],
      by_provider: byProvider,
      offers: offers.slice(0, 100).map(shapeOffer),
    },
  };
}

async function handleCompareBiomarkers(p: URLSearchParams): Promise<ApiResult> {
  const joined = p.getAll("biomarkers").join(",") || p.get("q") || "";
  const raw = joined.split(",").map((s) => cleanText(s, 60)).filter((s): s is string => !!s);
  const inputs = [...new Set(raw)].slice(0, 10);
  if (inputs.length < 2) {
    throw new ApiError(400, "need_two_biomarkers", "Pass two to ten biomarkers, comma-separated, for example ?biomarkers=ferritin,vitamin d,b12.");
  }

  const resolved: { input: string; biomarker: BiomarkerEntry; alternatives: BiomarkerEntry[] }[] = [];
  const unresolved: Row[] = [];
  for (const input of inputs) {
    const r = await resolveBiomarker(input);
    if (r.kind === "match") resolved.push({ input, biomarker: r.biomarker, alternatives: r.alternatives ?? [] });
    else if (r.kind === "ambiguous") unresolved.push({ input, reason: "ambiguous", candidates: r.candidates.slice(0, 5).map(publicBiomarker) });
    else unresolved.push({ input, reason: "not_found", suggestions: r.suggestions.slice(0, 5).map(publicBiomarker) });
  }
  const ids = [...new Set(resolved.map((r) => r.biomarker.id))];
  if (!ids.length) {
    throw new ApiError(404, "biomarkers_not_found", "None of those biomarkers could be matched.", { unresolved });
  }

  const offers = await offersFor(ids, false);
  const byTest = new Map<string, { row: Row; covered: Set<string> }>();
  for (const o of offers) {
    const k = String(o.test_id);
    if (!byTest.has(k)) byTest.set(k, { row: o, covered: new Set() });
    byTest.get(k)!.covered.add(String(o.biomarker_id));
  }
  const nameOf = new Map(resolved.map((r) => [r.biomarker.id, r.biomarker.name]));
  const shaped = [...byTest.values()].map(({ row, covered }) => ({
    ...shapeOffer(row),
    covers: [...covered].map((id) => nameOf.get(id)).filter(Boolean),
    covers_count: covered.size,
  }));

  const freshFirst = (a: { price_check_stale: boolean; total_expected_cost_gbp: number | null }, b: { price_check_stale: boolean; total_expected_cost_gbp: number | null }) =>
    Number(a.price_check_stale) - Number(b.price_check_stale) || (a.total_expected_cost_gbp ?? 1e9) - (b.total_expected_cost_gbp ?? 1e9);
  const full = shaped.filter((t) => t.covers_count === ids.length).sort(freshFirst);
  const partial = full.length
    ? []
    : shaped
        .sort((a, b) => b.covers_count - a.covers_count || (a.total_expected_cost_gbp ?? 1e9) - (b.total_expected_cost_gbp ?? 1e9))
        .slice(0, 20);

  const cheapestEach = resolved.map(({ input, biomarker }) => {
    const best = pickCheapest(offers.filter((o) => String(o.biomarker_id) === biomarker.id));
    return { input, biomarker: { id: biomarker.id, name: biomarker.name }, cheapest_standalone: best ? shapeOffer(best) : null };
  });

  return {
    status: 200,
    body: {
      query: { biomarkers: inputs },
      resolved: resolved.map(({ input, biomarker, alternatives }) => ({
        input,
        biomarker: { id: biomarker.id, name: biomarker.name, abbreviation: biomarker.abbreviation },
        other_possible_matches: alternatives.map((a) => ({ id: a.id, name: a.name })),
      })),
      unresolved,
      complete: unresolved.length === 0,
      full_coverage_count: full.length,
      full_coverage: full.slice(0, 50),
      best_partial_coverage: partial,
      cheapest_per_biomarker: cheapestEach,
      notes: [
        "full_coverage lists single tests that measure every resolved biomarker from one sample, cheapest first, with prices checked in the last 7 days ahead of stale ones.",
        "If complete is false, some requested biomarkers could not be matched, so full_coverage covers only the resolved ones.",
        "Add-on tests are left out here because they cannot be bought on their own.",
      ],
    },
  };
}

// ---------------------------------------------------------------------------
// Routing, caching, rate limiting
// ---------------------------------------------------------------------------

async function route(path: string, params: URLSearchParams): Promise<ApiResult> {
  const parts = path.split("/").filter(Boolean);
  const [a, b] = parts;
  if (!a) return handleIndex();
  if (a === "tests" && !b && params.get("id")) return handleTest(String(params.get("id")));
  if (a === "tests" && !b) return handleTests(params);
  if (a === "tests" && b && parts.length === 2) return handleTest(b);
  if (a === "providers" && parts.length <= 2) return handleProviders(params, b);
  if (a === "categories" && !b) return handleCategories();
  if (a === "biomarkers" && !b) return handleBiomarkers(params);
  if (a === "compare" && b === "tests" && parts.length === 2) return handleCompareTests(params);
  if (a === "compare" && b === "biomarker" && parts.length === 2) return handleCompareBiomarker(params);
  if (a === "compare" && b === "biomarkers" && parts.length === 2) return handleCompareBiomarkers(params);
  throw new ApiError(404, "unknown_endpoint", "Unknown endpoint. See the index at / for the list.");
}

/** Strip the function prefix, an optional /v1 and any .json suffix. */
function normalisePath(pathname: string): string {
  let p = pathname;
  const i = p.indexOf("/public-api");
  if (i >= 0) p = p.slice(i + "/public-api".length);
  p = p.replace(/\.json$/i, "").replace(/\/+$/, "");
  p = p.replace(/^\/v1(?=\/|$)/, "");
  return p || "/";
}

const responseCache = new Map<string, { status: number; text: string; expires: number }>();

function cacheGet(key: string) {
  const hit = responseCache.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    responseCache.delete(key);
    return null;
  }
  return hit;
}

function cacheSet(key: string, status: number, text: string) {
  if (responseCache.size >= CACHE_MAX_ENTRIES) {
    const oldest = responseCache.keys().next().value;
    if (oldest !== undefined) responseCache.delete(oldest);
  }
  responseCache.set(key, { status, text, expires: Date.now() + CACHE_TTL_MS });
}

const buckets = new Map<string, { count: number; windowStart: number }>();

async function clientKey(req: Request): Promise<string> {
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`mhc-public-api:${ip}`));
  return Array.from(new Uint8Array(digest).slice(0, 12), (x) => x.toString(16).padStart(2, "0")).join("");
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now - b.windowStart > 60_000) {
    if (buckets.size > 10_000) buckets.clear();
    buckets.set(key, { count: 1, windowStart: now });
    return false;
  }
  b.count += 1;
  return b.count > RATE_LIMIT_PER_MINUTE;
}

const BASE_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, accept, authorization, apikey, x-client-info",
  "Access-Control-Max-Age": "86400",
  "X-Content-Type-Options": "nosniff",
  "Content-Type": "application/json; charset=utf-8",
};

function respond(req: Request, status: number, text: string, extra: Record<string, string> = {}): Response {
  const headers = new Headers({ ...BASE_HEADERS, ...extra });
  if (status === 200) {
    headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
  } else {
    headers.set("Cache-Control", "no-store");
  }
  return new Response(req.method === "HEAD" ? null : text, { status, headers });
}

async function meta(): Promise<Row> {
  let lastChecked: string | null = null;
  try {
    lastChecked = await dataLastCheckedAt();
  } catch {
    lastChecked = null;
  }
  return {
    api: "myhealth checkup public comparison API",
    version: API_VERSION,
    generated_at: new Date().toISOString(),
    data_last_checked_at: lastChecked,
    currency: "GBP",
    source: SITE,
    attribution: "Free to use. Please credit myhealth checkup (myhealthcheckup.co.uk) when you use this data.",
    ordering: "Results are ordered by price or by the sort you choose. Providers cannot pay to change the order.",
    links: "Provider links go straight to the provider's own page.",
    disclaimer: DISCLAIMER,
    known_limitations: KNOWN_LIMITATIONS,
  };
}

async function envelope(result: ApiResult): Promise<string> {
  return JSON.stringify({ meta: await meta(), ...result.body });
}

function describeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object") {
    const e = err as { code?: string; message?: string; details?: string };
    return [e.code, e.message, e.details].filter(Boolean).join(" | ") || JSON.stringify(err);
  }
  return String(err);
}

/** Runs a GET route through the response cache. Shared by the REST routes and MCP tools/call. */
async function runRoute(path: string, rawParams: URLSearchParams): Promise<{ status: number; text: string; cache: "HIT" | "MISS" }> {
  // Sorted query string so equivalent requests share a cache entry.
  const params = new URLSearchParams([...rawParams.entries()].sort(([a], [b]) => a.localeCompare(b)));
  const cacheKey = `${path}?${params.toString()}`;
  const cached = cacheGet(cacheKey);
  if (cached) return { status: cached.status, text: cached.text, cache: "HIT" };

  try {
    const result = await route(path, params);
    const text = await envelope(result);
    if (result.status === 200) cacheSet(cacheKey, result.status, text);
    return { status: result.status, text, cache: "MISS" };
  } catch (err) {
    if (err instanceof ApiError) {
      return {
        status: err.status,
        text: JSON.stringify({ meta: await meta(), error: { code: err.code, message: err.message, ...err.extra }, documentation: `${SITE}/llms.txt` }),
        cache: "MISS",
      };
    }
    console.error("public-api error", path, describeError(err));
    return {
      status: 500,
      text: JSON.stringify({ meta: await meta(), error: { code: "internal_error", message: "Something went wrong. Try again shortly." } }),
      cache: "MISS",
    };
  }
}

// ---------------------------------------------------------------------------
// Tool definitions: one source for the MCP server (POST /mcp) and the WebMCP
// manifest (GET /.well-known/web-mcp.json). public/.well-known/web-mcp.json on
// the site is a copy of the manifest this function serves; regenerate it from
// the live endpoint when a tool changes.
// ---------------------------------------------------------------------------

interface ToolDef {
  name: string;
  title: string;
  description: string;
  path: string;
  inputSchema: Row;
}

const CATEGORY_HINT =
  "Category slug, for example general-health, vitamins, hormones, thyroid, heart, mens-health, womens-health, cancer-screening, fertility, diabetes, gut. Call list_categories for the full list.";

const TOOLS: ToolDef[] = [
  {
    name: "search_tests",
    title: "Search private blood tests",
    description:
      "Search live UK private blood tests and cancer screening tests. Returns the headline price and the total expected cost in GBP (adding the published collection fee for clinic-only tests), the full biomarker list, sample method, home kit or clinic options, turnaround and a direct link to the provider page, each with the date the price was last checked. Ordered by total expected cost unless you choose another sort.",
    path: "/tests",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Words in the test name, for example 'thyroid', 'vitamin d', 'well woman'." },
        category: { type: "string", description: CATEGORY_HINT },
        provider: { type: "string", description: "Provider id or name, for example 'medichecks', 'randox', 'Goodbody Clinic'. Call list_providers for the list." },
        max_cost: { type: "number", description: "Highest total expected cost in GBP." },
        collection: { type: "string", enum: ["home_kit", "clinic_visit"], description: "Only tests you can take with a home kit, or only tests with a clinic visit." },
        include_addons: { type: "boolean", description: "Include add-on tests that must be bought with a base test. Default false." },
        sort: { type: "string", enum: ["price", "price_desc", "name", "turnaround"], description: "Default price (lowest total expected cost first)." },
        limit: { type: "integer", minimum: 1, maximum: 100, description: "Default 25." },
        offset: { type: "integer", minimum: 0, description: "For paging." },
      },
    },
  },
  {
    name: "get_test",
    title: "Get one test",
    description: "Full record for one test by id (from search_tests): cost breakdown, every listed biomarker, the biomarkers we have matched to our biomarker library, sample method, turnaround and provider link.",
    path: "/tests",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Test id (UUID) from search_tests." } },
      required: ["id"],
    },
  },
  {
    name: "list_providers",
    title: "List providers",
    description:
      "UK private testing providers we compare, with legal name, Companies House number where known, accreditation findings from public registers (UKAS, CQC, MHRA) with the date we checked them, number of tests and price range.",
    path: "/providers",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Optional provider id, for example 'medichecks'." } },
    },
  },
  {
    name: "list_categories",
    title: "List categories",
    description: "Test categories with the number of live tests and providers in each.",
    path: "/categories",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "list_biomarkers",
    title: "List biomarkers",
    description:
      "Biomarkers we compare across providers, with synonyms, how many providers and tests measure each one, and the cheapest standalone test price. Use it to find the right biomarker name before calling compare_biomarker.",
    path: "/biomarkers",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Part of a biomarker name, abbreviation or synonym, for example 'b12', 'cholesterol', 'tsh'." },
        min_providers: { type: "integer", minimum: 1, description: "Only biomarkers offered by at least this many providers. Default 1." },
        limit: { type: "integer", minimum: 1, maximum: 200, description: "Default 50." },
        offset: { type: "integer", minimum: 0 },
      },
    },
  },
  {
    name: "compare_tests",
    title: "Compare a test across providers",
    description:
      "Compare a named test across providers and find the lowest total expected cost. Matches on test name, so similar names can hide different biomarker lists; check biomarkers.count or use compare_biomarker for a like-for-like comparison.",
    path: "/compare/tests",
    inputSchema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Test name, for example 'vitamin d', 'thyroid', 'full blood count'." },
        include_addons: { type: "boolean", description: "Include add-on tests. Default false." },
      },
      required: ["q"],
    },
  },
  {
    name: "compare_biomarker",
    title: "Compare one biomarker across providers",
    description:
      "Every live test and provider that measures one biomarker, cheapest first, with the cheapest standalone test and the cheapest add-on per provider. This compares like with like even when providers name their tests differently.",
    path: "/compare/biomarker",
    inputSchema: {
      type: "object",
      properties: {
        biomarker: { type: "string", description: "Biomarker name, abbreviation, synonym or id, for example 'ferritin', 'HbA1c', 'PSA', 'vitamin d'." },
        include_addons: { type: "boolean", description: "Include add-on tests. Default true; they are labelled." },
      },
      required: ["biomarker"],
    },
  },
  {
    name: "find_tests_by_biomarkers",
    title: "Find one test for several biomarkers",
    description:
      "Find single tests that measure all of the biomarkers you list from one sample, cheapest first, plus the cheapest standalone test for each biomarker. If no single test covers them all, returns the tests that cover the most.",
    path: "/compare/biomarkers",
    inputSchema: {
      type: "object",
      properties: {
        biomarkers: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          maxItems: 10,
          description: "Two to ten biomarker names, for example ['ferritin', 'vitamin d', 'hba1c']. A comma-separated string also works.",
        },
      },
      required: ["biomarkers"],
    },
  },
];

const SERVER_INSTRUCTIONS =
  "Live comparison data for UK private blood tests and cancer screening from myhealth checkup (myhealthcheckup.co.uk). " +
  "Quote total_expected_cost_gbp as the price to pay where it differs from price_gbp, and give the last_checked_at date with any price. " +
  "Add-on tests (is_addon: true) cannot be bought on their own. " +
  "Treat prices with price_check_stale: true as out of date. " +
  "compare_biomarker returns other_possible_matches; mention them when the user's term could mean more than one biomarker. " +
  "Tell users to confirm the final price on the provider's page. " +
  "This data compares tests. It is not medical advice, and myhealth checkup is not a medical provider.";

function toolParams(tool: ToolDef, args: Row): URLSearchParams {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(args ?? {})) {
    if (v === null || v === undefined) continue;
    params.set(k, Array.isArray(v) ? v.map(String).join(",") : String(v));
  }
  return params;
}

function webMcpManifest() {
  return {
    schema: "web-mcp-2025-01",
    name: "myhealth checkup",
    description:
      "Live, independent comparison of UK private blood tests and cancer screening: prices with published fees, full biomarker lists, sample methods, turnaround and provider accreditation. Ordered by price. Providers cannot pay to rank.",
    documentation: `${SITE}/llms.txt`,
    mcp_endpoint: `${FN_BASE}/mcp`,
    instructions: SERVER_INSTRUCTIONS,
    tools: TOOLS.map((t) => ({
      name: t.name,
      title: t.title,
      description: t.description,
      inputSchema: t.inputSchema,
      url: `${FN_BASE}${t.path}.json`,
      method: "GET",
      annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
    })),
  };
}

function mcpServerCard() {
  return {
    $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
    protocolVersion: MCP_PROTOCOL_VERSIONS[0],
    serverInfo: {
      name: "myhealth-checkup-public",
      title: "myhealth checkup",
      version: API_VERSION,
      description:
        "Compare UK private blood test and cancer screening prices, biomarkers and providers. Read-only, no sign-in.",
      documentationUrl: `${SITE}/llms.txt`,
    },
    transport: { type: "streamable-http", endpoint: `${FN_BASE}/mcp` },
    capabilities: { tools: { listChanged: false } },
    authentication: { required: false },
    tools: TOOLS.map((t) => t.name),
    webmcp_manifest: `${SITE}/.well-known/web-mcp.json`,
  };
}

// ---------------------------------------------------------------------------
// MCP over streamable HTTP (stateless, JSON responses, tools only)
// ---------------------------------------------------------------------------

const MCP_PROTOCOL_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];

interface JsonRpcRequest {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Row;
}

function rpcResult(id: JsonRpcRequest["id"], result: unknown) {
  return { jsonrpc: "2.0", id: id ?? null, result };
}

function rpcError(id: JsonRpcRequest["id"], code: number, message: string) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

async function handleRpc(raw: unknown): Promise<unknown | null> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return rpcError(null, -32600, "Invalid request");
  const msg = raw as JsonRpcRequest;
  const isNotification = msg.id === undefined || msg.id === null;
  if (msg.jsonrpc !== "2.0" || typeof msg.method !== "string") {
    return isNotification ? null : rpcError(msg.id, -32600, "Invalid request");
  }
  if (isNotification) return null;

  switch (msg.method) {
    case "initialize": {
      const requested = String((msg.params as Row | undefined)?.protocolVersion ?? "");
      const version = MCP_PROTOCOL_VERSIONS.includes(requested) ? requested : MCP_PROTOCOL_VERSIONS[0];
      return rpcResult(msg.id, {
        protocolVersion: version,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "myhealth-checkup-public", title: "myhealth checkup", version: API_VERSION },
        instructions: SERVER_INSTRUCTIONS,
      });
    }
    case "ping":
      return rpcResult(msg.id, {});
    case "tools/list":
      return rpcResult(msg.id, {
        tools: TOOLS.map((t) => ({
          name: t.name,
          title: t.title,
          description: t.description,
          inputSchema: t.inputSchema,
          annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
        })),
      });
    case "tools/call": {
      const name = String((msg.params as Row | undefined)?.name ?? "");
      const args = ((msg.params as Row | undefined)?.arguments ?? {}) as Row;
      const tool = TOOLS.find((t) => t.name === name);
      if (!tool) return rpcError(msg.id, -32602, `Unknown tool: ${name}`);
      const required = ((tool.inputSchema.required as string[] | undefined) ?? []);
      const missing = required.filter((k) => {
        const v = (args ?? {})[k];
        return v === undefined || v === null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && !v.length);
      });
      if (missing.length) {
        return rpcResult(msg.id, {
          content: [{ type: "text", text: `Missing required argument: ${missing.join(", ")}` }],
          isError: true,
        });
      }
      const out = await runRoute(tool.path, toolParams(tool, args));
      let structured: unknown = null;
      try {
        structured = JSON.parse(out.text);
      } catch {
        structured = null;
      }
      return rpcResult(msg.id, {
        content: [{ type: "text", text: out.text }],
        ...(structured && typeof structured === "object" && !Array.isArray(structured) ? { structuredContent: structured } : {}),
        isError: out.status !== 200,
      });
    }
    default:
      return rpcError(msg.id, -32601, `Method not found: ${msg.method}`);
  }
}

const MCP_HEADERS: Record<string, string> = {
  ...BASE_HEADERS,
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, accept, authorization, apikey, x-client-info, mcp-session-id, mcp-protocol-version, last-event-id",
  "Access-Control-Expose-Headers": "mcp-session-id",
  "Cache-Control": "no-store",
};

async function handleMcp(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: MCP_HEADERS });
  if (req.method === "DELETE") return new Response(null, { status: 405, headers: { ...MCP_HEADERS, Allow: "POST" } });
  if (req.method !== "POST") {
    // Stateless server: no server-initiated stream to offer on GET.
    return new Response(JSON.stringify(rpcError(null, -32000, "Use POST for MCP requests.")), {
      status: 405,
      headers: { ...MCP_HEADERS, Allow: "POST, OPTIONS" },
    });
  }

  const raw = await req.text();
  if (raw.length > 64_000) {
    return new Response(JSON.stringify(rpcError(null, -32600, "Request too large")), { status: 413, headers: MCP_HEADERS });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify(rpcError(null, -32700, "Parse error")), { status: 400, headers: MCP_HEADERS });
  }

  if (Array.isArray(body) && !body.length) {
    return new Response(JSON.stringify(rpcError(null, -32600, "Invalid request")), { status: 400, headers: MCP_HEADERS });
  }
  const messages = (Array.isArray(body) ? body : [body]).slice(0, 20) as unknown[];
  const replies = (await Promise.all(messages.map(handleRpc))).filter((r) => r !== null);
  if (!replies.length) return new Response(null, { status: 202, headers: MCP_HEADERS });
  const payload = Array.isArray(body) ? replies : replies[0];
  return new Response(JSON.stringify(payload), { status: 200, headers: MCP_HEADERS });
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function logLine(req: Request, path: string, status: number, cache: string, started: number) {
  console.log(JSON.stringify({ path, method: req.method, status, cache, ms: Date.now() - started, ua: (req.headers.get("user-agent") ?? "").slice(0, 120) }));
}

Deno.serve(async (req) => {
  const started = Date.now();
  const url = new URL(req.url);
  const path = normalisePath(url.pathname);

  const key = await clientKey(req);
  if (req.method !== "OPTIONS" && rateLimited(key)) {
    return respond(
      req,
      429,
      JSON.stringify({ error: { code: "rate_limited", message: `Limit is ${RATE_LIMIT_PER_MINUTE} requests a minute. Try again shortly.` } }),
      { "Retry-After": "60" },
    );
  }

  if (path === "/mcp") {
    const res = await handleMcp(req);
    logLine(req, path, res.status, "-", started);
    return res;
  }

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: BASE_HEADERS });
  if (req.method !== "GET" && req.method !== "HEAD") {
    return respond(req, 405, JSON.stringify({ error: { code: "method_not_allowed", message: "Read-only API. Use GET." } }), {
      Allow: "GET, HEAD, OPTIONS",
    });
  }

  if (path === "/.well-known/web-mcp") return respond(req, 200, JSON.stringify(webMcpManifest(), null, 2));
  if (path === "/.well-known/mcp") return respond(req, 200, JSON.stringify(mcpServerCard(), null, 2));

  const out = await runRoute(path, url.searchParams);
  logLine(req, path, out.status, out.cache, started);
  return respond(req, out.status, out.text, { "X-Cache": out.cache });
});
