// resolve-section-mapping
// Admin-only: upsert a per-provider section -> canonical_category rule
// and backfill canonical_category on existing active provider_tests rows
// for that (provider_id, source_section) pair.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CANONICAL_CATEGORIES = new Set([
  "womens-health", "mens-health", "fertility", "sexual-health", "thyroid",
  "heart", "gut", "vitamins", "hormones", "cancer-screening",
  "sports-performance", "at-home", "general-health",
]);

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) {
      return json({ error: "Unauthorized" }, 401);
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Caller-bound client to identify the user
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);

    // Admin check
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: roleRows, error: roleErr } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .limit(1);
    if (roleErr) return json({ error: roleErr.message }, 500);
    if (!roleRows || roleRows.length === 0) return json({ error: "Forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const {
      provider_id,
      source_section,
      canonical_category,
      backfill = true,
      mark_reviewed = true,
    } = body ?? {};

    if (!provider_id || !source_section || !canonical_category) {
      return json({ error: "provider_id, source_section, canonical_category required" }, 400);
    }
    if (!CANONICAL_CATEGORIES.has(canonical_category)) {
      return json({ error: `Unknown canonical_category '${canonical_category}'` }, 400);
    }

    const section = norm(String(source_section));
    if (!section) return json({ error: "Invalid source_section" }, 400);

    // Upsert rule
    const { error: upsertErr } = await admin
      .from("provider_section_category_map")
      .upsert(
        {
          provider_id,
          source_section: section,
          canonical_category,
          needs_review: !mark_reviewed,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "provider_id,source_section" }
      );
    if (upsertErr) return json({ error: `Rule upsert failed: ${upsertErr.message}` }, 500);

    let updated_rows = 0;
    if (backfill) {
      // Update active rows where normalized source_section matches.
      // Server-side normalization isn't trivial via PostgREST; fetch ids then patch.
      const { data: candidates, error: fetchErr } = await admin
        .from("provider_tests")
        .select("id, source_section, category")
        .eq("provider_id", provider_id)
        .eq("is_active", true)
        .limit(5000);
      if (fetchErr) return json({ error: fetchErr.message }, 500);

      const ids = (candidates ?? [])
        .filter((r: any) => norm(r.source_section ?? r.category ?? "") === section)
        .map((r: any) => r.id);

      if (ids.length > 0) {
        const { error: updErr, count } = await admin
          .from("provider_tests")
          .update({ canonical_category }, { count: "exact" })
          .in("id", ids);
        if (updErr) return json({ error: `Backfill failed: ${updErr.message}` }, 500);
        updated_rows = count ?? ids.length;
      }
    }

    return json({
      ok: true,
      provider_id,
      source_section: section,
      canonical_category,
      updated_rows,
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
