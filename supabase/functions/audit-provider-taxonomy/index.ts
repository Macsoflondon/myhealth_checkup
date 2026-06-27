// Server-side taxonomy audit. Invoked automatically after every scraper batch
// (and exposed to admins via the dashboard). Flags any active product without
// a category mapping, or a provider whose catalogue is >60% only mapped to
// `general-health` — both signals that aliases need tightening.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GENERAL_THRESHOLD = 0.6;

interface ProviderStat {
  provider: string;
  active: number;
  orphan: number;
  onlyGeneral: number;
  specific: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const authHeader = req.headers.get("Authorization") ?? "";

  // Auth: service-role (server-to-server) OR signed-in admin.
  const isServiceRole = authHeader === `Bearer ${serviceKey}`;
  if (!isServiceRole) {
    if (!authHeader || !anonKey) {
      return json({ error: "Unauthorized" }, 401);
    }
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userErr } = await userClient.auth.getUser();
    if (userErr || !user) return json({ error: "Unauthorized" }, 401);
    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Admin only" }, 403);
  }

  const sb = createClient(supabaseUrl, serviceKey);

  const { data: categories, error: catErr } = await sb
    .from("categories")
    .select("id,slug");
  if (catErr) return json({ error: catErr.message }, 500);
  const generalId = categories?.find((c) => c.slug === "general-health")?.id;

  const { data: tests, error: tErr } = await sb
    .from("provider_tests")
    .select("id,provider_id,test_name,category_ids")
    .eq("is_active", true)
    .limit(5000);
  if (tErr) return json({ error: tErr.message }, 500);

  const byProvider = new Map<string, ProviderStat>();
  const orphans: { id: string; provider_id: string; test_name: string }[] = [];

  for (const t of tests ?? []) {
    const cats: string[] = (t.category_ids as string[] | null) ?? [];
    const slot = byProvider.get(t.provider_id) ?? {
      provider: t.provider_id,
      active: 0,
      orphan: 0,
      onlyGeneral: 0,
      specific: 0,
    };
    slot.active++;
    if (cats.length === 0) {
      slot.orphan++;
      orphans.push({
        id: t.id,
        provider_id: t.provider_id,
        test_name: t.test_name,
      });
    } else if (cats.length === 1 && cats[0] === generalId) {
      slot.onlyGeneral++;
    } else {
      slot.specific++;
    }
    byProvider.set(t.provider_id, slot);
  }

  const providers = [...byProvider.values()].sort((a, b) =>
    a.provider.localeCompare(b.provider)
  );

  // Persist alerts for providers that need attention.
  const alertRows: Array<Record<string, unknown>> = [];
  for (const p of providers) {
    const generalRatio = p.active === 0 ? 0 : p.onlyGeneral / p.active;
    if (p.orphan > 0) {
      alertRows.push({
        provider_id: p.provider,
        alert_type: "taxonomy_orphans",
        severity: "warning",
        message:
          `${p.orphan} of ${p.active} active tests have no category mapping after re-crawl.`,
        current_count: p.orphan,
        expected_min: 0,
      });
    }
    if (generalRatio > GENERAL_THRESHOLD) {
      alertRows.push({
        provider_id: p.provider,
        alert_type: "taxonomy_general_only",
        severity: "warning",
        message:
          `${p.onlyGeneral}/${p.active} (${Math.round(generalRatio * 100)}%) of catalogue collapsed to general-health only — tighten aliases.`,
        current_count: p.onlyGeneral,
        expected_min: Math.floor(p.active * (1 - GENERAL_THRESHOLD)),
      });
    }
  }

  if (alertRows.length > 0) {
    const { error: insErr } = await sb.from("scraper_alerts").insert(alertRows);
    if (insErr) console.error("[audit] alert insert error:", insErr.message);
  }

  const totalOrphans = orphans.length;
  const status = totalOrphans === 0 && alertRows.length === 0 ? "ok" : "issues";

  return json({
    status,
    auditedAt: new Date().toISOString(),
    totals: {
      providers: providers.length,
      activeTests: tests?.length ?? 0,
      orphans: totalOrphans,
      alerts: alertRows.length,
    },
    providers,
    orphans: orphans.slice(0, 50),
  });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
