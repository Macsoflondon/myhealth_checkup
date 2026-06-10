// resolve-section-mapping
// Admin-only: upsert a per-provider section -> canonical_category rule
// and backfill canonical_category on existing active provider_tests rows
// for that (provider_id, source_section) pair.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const CANONICAL_CATEGORIES = new Set([
  "womens-health", "mens-health", "fertility", "sexual-health", "thyroid",
  "heart", "gut", "vitamins", "hormones", "cancer-screening",
  "sports-performance", "at-home", "general-health",
]);

export const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");

// Minimal interface our handler needs from a Supabase-like client.
export interface SbLike {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string } | null }; error: unknown }>;
  };
  from: (table: string) => any;
  rpc?: (fn: string, args: Record<string, unknown>) => any;
}

export interface HandlerDeps {
  userClientFor: (authHeader: string) => SbLike;
  adminClient: SbLike;
}

export function createHandler(deps: HandlerDeps) {
  return async (req: Request): Promise<Response> => {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      const authHeader = req.headers.get("Authorization") ?? "";
      if (!authHeader) return json({ error: "Unauthorized" }, 401);

      const userClient = deps.userClientFor(authHeader);
      const { data: userData, error: userErr } = await userClient.auth.getUser();
      if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);

      const admin = deps.adminClient;
      // Use has_role RPC via the user-scoped client so the AAL2/MFA check
      // inside has_role() is enforced (service-role queries bypass RLS and MFA).
      const { data: isAdmin, error: roleErr } = await (userClient as any).rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (roleErr) return json({ error: (roleErr as any).message ?? "role lookup failed" }, 500);
      if (!isAdmin) return json({ error: "Forbidden" }, 403);

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
      if (upsertErr) return json({ error: `Rule upsert failed: ${(upsertErr as any).message}` }, 500);

      let updated_rows = 0;
      if (backfill) {
        const { data: candidates, error: fetchErr } = await admin
          .from("provider_tests")
          .select("id, source_section, category")
          .eq("provider_id", provider_id)
          .eq("is_active", true)
          .limit(5000);
        if (fetchErr) return json({ error: (fetchErr as any).message }, 500);

        const ids = (candidates ?? [])
          .filter((r: any) => norm(r.source_section ?? r.category ?? "") === section)
          .map((r: any) => r.id);

        if (ids.length > 0) {
          const { error: updErr, count } = await admin
            .from("provider_tests")
            .update({ canonical_category }, { count: "exact" })
            .in("id", ids);
          if (updErr) return json({ error: `Backfill failed: ${(updErr as any).message}` }, 500);
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
  };
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Default runtime wiring — skipped during unit tests (no env)
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const ANON = Deno.env.get("SUPABASE_ANON_KEY");

if (SUPABASE_URL && SERVICE_ROLE && ANON) {
  const defaultHandler = createHandler({
    userClientFor: (authHeader: string) =>
      createClient(SUPABASE_URL, ANON, {
        global: { headers: { Authorization: authHeader } },
      }) as unknown as SbLike,
    adminClient: createClient(SUPABASE_URL, SERVICE_ROLE) as unknown as SbLike,
  });
  Deno.serve(defaultHandler);
}
