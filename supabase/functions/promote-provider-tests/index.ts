// promote-provider-tests
// Promotes rows from provider_tests into tests_master + provider_test_mapping.
// Fuzzy-matches test names within the same canonical_category using pg_trgm.
// Creates new tests_master entries when no match is found, then upserts the mapping.
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProviderTestRow {
  id: string;
  provider_id: string;
  provider_test_id: string | null;
  test_name: string;
  description: string | null;
  price: number | null;
  base_price: number | null;
  url: string | null;
  image_url: string | null;
  canonical_category: string | null;
  category: string | null;
  source_section: string | null;
  biomarker_count: number | null;
  biomarkers_list: unknown;
  sample_type: string | null;
  turnaround_days_text: string | null;
  home_kit_available: boolean | null;
  clinic_visit_available: boolean | null;
}

function normaliseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(blood\s*test|home\s*test\s*kit|home\s*kit|test\s*kit|panel|profile|screen|screening)\b/gi, "")
    .replace(/\s*\|.*$/g, "")
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTurnaroundDays(text: string | null): number | null {
  if (!text) return null;
  const m = text.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Auth: require service-role bearer (cron/internal calls). Admin JWTs go through
  // run-all-scrapers / scrape-and-verify, which call this with the service key.
  const authHeader = req.headers.get("Authorization") ?? "";
  if (authHeader !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const body = await req.json().catch(() => ({}));
  const sinceIso: string =
    body.since ||
    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const providerFilter: string | undefined = body.provider_id;

  // Fetch candidate rows
  let q = supabase
    .from("provider_tests")
    .select(
      "id,provider_id,provider_test_id,test_name,description,price,base_price,url,image_url,canonical_category,category,source_section,biomarker_count,biomarkers_list,sample_type,turnaround_days_text,home_kit_available,clinic_visit_available"
    )
    .eq("is_active", true)
    .gte("updated_at", sinceIso);
  if (providerFilter) q = q.eq("provider_id", providerFilter);

  const { data: rows, error: rowsErr } = await q.limit(5000);
  if (rowsErr) {
    return new Response(JSON.stringify({ error: rowsErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let masterCreated = 0;
  let mappingsUpserted = 0;
  let skipped = 0;
  const errors: { id: string; msg: string }[] = [];

  for (const row of (rows as ProviderTestRow[]) || []) {
    try {
      if (!row.canonical_category || !row.url || !row.provider_test_id) {
        skipped++;
        continue;
      }
      const normName = normaliseName(row.test_name);
      if (!normName) {
        skipped++;
        continue;
      }

      // Fuzzy-match within same category (trigram similarity)
      const { data: match } = await supabase.rpc("pg_trgm_test_match" as never, {} as never).maybeSingle().then(
        () => ({ data: null }),
        () => ({ data: null })
      );

      // Use a direct query for similarity — no RPC needed
      const { data: candidates } = await supabase
        .from("tests_master")
        .select("id,test_name")
        .eq("category", row.canonical_category)
        .eq("is_active", true)
        .limit(50);

      let masterId: string | null = null;
      if (candidates && candidates.length > 0) {
        const scored = candidates
          .map((c) => ({
            id: c.id as string,
            score: similarity(normName, normaliseName(c.test_name as string)),
          }))
          .sort((a, b) => b.score - a.score);
        if (scored[0] && scored[0].score >= 0.7) {
          masterId = scored[0].id;
        }
      }

      if (!masterId) {
        // Create new tests_master entry
        const biomarkers = Array.isArray(row.biomarkers_list)
          ? row.biomarkers_list
          : [];
        const { data: newMaster, error: insertErr } = await supabase
          .from("tests_master")
          .insert({
            test_name: row.test_name,
            category: row.canonical_category,
            description: row.description || `${row.test_name} from provider.`,
            biomarkers,
            sample_type: row.sample_type,
            typical_turnaround_days: parseTurnaroundDays(row.turnaround_days_text),
            is_active: true,
          })
          .select("id")
          .single();
        if (insertErr) {
          errors.push({ id: row.id, msg: `master insert: ${insertErr.message}` });
          continue;
        }
        masterId = newMaster.id as string;
        masterCreated++;
      }

      // Upsert mapping
      const { error: mapErr } = await supabase
        .from("provider_test_mapping")
        .upsert(
          {
            provider_id: row.provider_id,
            test_master_id: masterId,
            provider_test_id: row.provider_test_id,
            provider_test_name: row.test_name,
            current_price: row.price ?? row.base_price,
            provider_url: row.url,
            sample_collection_method: row.clinic_visit_available
              ? row.home_kit_available
                ? "Home Kit or Clinic"
                : "Clinic"
              : "Home Kit",
            turnaround_time_days: parseTurnaroundDays(row.turnaround_days_text),
            availability_status: "available",
            last_scraped_at: new Date().toISOString(),
          },
          { onConflict: "provider_id,test_master_id" }
        );
      if (mapErr) {
        errors.push({ id: row.id, msg: `mapping upsert: ${mapErr.message}` });
        continue;
      }
      mappingsUpserted++;
    } catch (e) {
      errors.push({ id: row.id, msg: String(e) });
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      processed: rows?.length || 0,
      master_created: masterCreated,
      mappings_upserted: mappingsUpserted,
      skipped,
      errors: errors.slice(0, 20),
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

// Lightweight Dice coefficient (bigram) similarity — close enough to trigram for our needs
function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const bigrams = (s: string) => {
    const out = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const g = s.slice(i, i + 2);
      out.set(g, (out.get(g) || 0) + 1);
    }
    return out;
  };
  const A = bigrams(a), B = bigrams(b);
  let inter = 0, total = 0;
  for (const [k, v] of A) {
    total += v;
    if (B.has(k)) inter += Math.min(v, B.get(k)!);
  }
  for (const v of B.values()) total += v;
  return total === 0 ? 0 : (2 * inter) / total;
}
