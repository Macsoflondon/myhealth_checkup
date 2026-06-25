// One-off admin action: re-parse `provider_tests.test_name` + description and
// re-derive `category` in place using the canonical categoriser. Mirrors the
// logic in medical-diagnosis-scraper.determineCategory but applied to existing
// rows so we don't need a full purge + re-scrape to fix miscategorised tests
// (e.g. cardiovascular panels sitting under "Liver Health").

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getErrorMessage } from "../_shared/errors.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NormalizeBody {
  dryRun?: boolean;
  providerId?: string;
}

interface ProviderTestRow {
  id: string;
  provider_id: string;
  test_name: string;
  description: string | null;
  category: string | null;
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&pound;/g, "£")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
}

/**
 * Canonical categoriser. Order matters: more specific buckets first so a
 * Cardiovascular panel that *mentions* liver markers in its description still
 * resolves to "Heart Health" rather than "Liver Function".
 *
 * Categorisation is based primarily on the TEST NAME, with the description as
 * a tiebreaker. This avoids broad panels being dragged into a narrow category
 * just because the description lists liver/kidney markers alongside others.
 */
function determineCategory(testName: string, description: string | null): string {
  const name = (testName ?? "").toLowerCase();
  const desc = (description ?? "").toLowerCase();

  // Name-driven matches (high confidence)
  if (/cancer|tumour|psa|ca[\s-]?125|cea|colorectal|fit\s*test/.test(name)) return "Cancer Screening";
  if (/heart|cardio|cholesterol|lipid|cardiac|hdl|ldl|triglyceride|apo[ab]/.test(name)) return "Heart Health";
  if (/diabetes|glucose|hba1c|insulin\b/.test(name)) return "Diabetes";
  if (/thyroid|tsh|\bt3\b|\bt4\b/.test(name)) return "Thyroid";
  if (/fertility|amh|ovarian/.test(name)) return "Fertility";
  if (/menopause|female|women|pcos|prolactin|oestrogen|estradiol/.test(name)) return "Women's Health";
  if (/testosterone|prostate|men'?s|male hormone/.test(name)) return "Men's Health";
  if (/\bsti\b|\bstd\b|sexual|hepatitis|\bhiv\b|chlamydia|gonorrh/.test(name)) return "Sexual Health";
  if (/allergy|intolerance|igg|ige/.test(name)) return "Allergy";
  if (/sport|fitness|performance|active\b/.test(name)) return "Sports & Fitness";
  if (/vitamin|mineral|\bb12\b|folate|\bd3\b/.test(name)) return "Vitamins & Minerals";
  if (/iron|ferritin|anaemia|anemia/.test(name)) return "Iron & Anaemia";
  if (/liver|hepatic|alt\b|ast\b|ggt\b|bilirubin|albumin|globulin/.test(name)) return "Liver Function";
  if (/kidney|renal|urea|creatinine|egfr|uric acid|gout/.test(name)) return "Kidney Function";
  if (/hormone|cortisol|dhea/.test(name)) return "Hormones";

  // Fallback: description hints (lower confidence)
  if (/cancer|tumour|psa\b|ca\s*125/.test(desc)) return "Cancer Screening";
  if (/cardio|cholesterol|lipid|cardiac/.test(desc)) return "Heart Health";
  if (/diabetes|glucose|hba1c/.test(desc)) return "Diabetes";
  if (/thyroid/.test(desc)) return "Thyroid";

  return "General Health";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const authHeader = req.headers.get("Authorization") ?? "";

  // Auth: service role OR admin JWT
  const isServiceRole = serviceKey && authHeader === `Bearer ${serviceKey}`;
  if (!isServiceRole) {
    if (!authHeader || !supabaseUrl || !anonKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: user.id, _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  const body: NormalizeBody = req.method === "POST"
    ? await req.json().catch(() => ({}))
    : {};
  const dryRun = Boolean(body.dryRun);

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // Paginate through all active rows (default limit is 1000)
    const PAGE = 1000;
    let from = 0;
    const allRows: ProviderTestRow[] = [];
    while (true) {
      let query = supabase
        .from("provider_tests")
        .select("id, provider_id, test_name, description, category")
        .eq("is_active", true)
        .range(from, from + PAGE - 1);
      if (body.providerId) query = query.eq("provider_id", body.providerId);
      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) break;
      allRows.push(...(data as ProviderTestRow[]));
      if (data.length < PAGE) break;
      from += PAGE;
    }

    const changes: Array<{ id: string; provider_id: string; from: string; to: string; test_name: string }> = [];
    const updates: Array<{ id: string; category: string; test_name: string }> = [];

    for (const row of allRows) {
      const cleanName = decodeHtmlEntities(row.test_name ?? "").trim();
      const newCategory = determineCategory(cleanName, row.description);
      const oldCategory = row.category ?? "";
      if (newCategory !== oldCategory || cleanName !== row.test_name) {
        changes.push({
          id: row.id,
          provider_id: row.provider_id,
          from: oldCategory,
          to: newCategory,
          test_name: cleanName,
        });
        updates.push({ id: row.id, category: newCategory, test_name: cleanName });
      }
    }

    // Build a category-shift summary
    const shiftCounts = new Map<string, number>();
    for (const c of changes) {
      const key = `${c.from || "∅"} → ${c.to}`;
      shiftCounts.set(key, (shiftCounts.get(key) ?? 0) + 1);
    }
    const shifts = Object.fromEntries([...shiftCounts.entries()].sort((a, b) => b[1] - a[1]));

    if (dryRun) {
      return new Response(
        JSON.stringify({
          dryRun: true,
          scanned: allRows.length,
          wouldUpdate: changes.length,
          shifts,
          sample: changes.slice(0, 20),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    }

    // Apply updates in chunks
    const CHUNK = 100;
    let applied = 0;
    for (let i = 0; i < updates.length; i += CHUNK) {
      const slice = updates.slice(i, i + CHUNK);
      // Per-row update so we only touch changed columns
      await Promise.all(slice.map((u) =>
        supabase
          .from("provider_tests")
          .update({ category: u.category, test_name: u.test_name, updated_at: new Date().toISOString() })
          .eq("id", u.id)
      ));
      applied += slice.length;
    }

    return new Response(
      JSON.stringify({
        success: true,
        scanned: allRows.length,
        updated: applied,
        shifts,
        sample: changes.slice(0, 20),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    console.error("[normalize-test-categories] error:", getErrorMessage(err));
    return new Response(
      JSON.stringify({ error: getErrorMessage(err) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
