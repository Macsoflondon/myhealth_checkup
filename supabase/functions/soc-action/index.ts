// SOC reversible admin actions.
// Admin-only. Every action is safe to re-run and reversible (or a no-op if already applied).

import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BodySchema = z.object({
  incident_id: z.string().uuid(),
  action: z.enum([
    "acknowledge_scraper_alerts_for_entity",
    "resolve_operational_alerts_for_entity",
    "reverse_acknowledge_scraper_alerts_for_entity",
    "reverse_resolve_operational_alerts_for_entity",
  ]),
});

function jsonResp(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResp({ error: "method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !serviceKey || !anonKey) return jsonResp({ error: "server not configured" }, 500);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return jsonResp({ error: "not authenticated" }, 401);

  // Admin check via caller token
  const callerClient = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } }, auth: { persistSession: false },
  });
  const { data: userData, error: userErr } = await callerClient.auth.getUser();
  if (userErr || !userData.user) return jsonResp({ error: "not authenticated" }, 401);
  const { data: isAdminRow, error: roleErr } = await callerClient.rpc("has_role", {
    _user_id: userData.user.id, _role: "admin",
  });
  if (roleErr || !isAdminRow) return jsonResp({ error: "admin only" }, 403);

  const parsed = BodySchema.safeParse(await req.json());
  if (!parsed.success) return jsonResp({ error: parsed.error.flatten().fieldErrors }, 400);
  const { incident_id, action } = parsed.data;

  const service = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data: incident } = await service.from("soc_incidents")
    .select("id, source, entity").eq("id", incident_id).maybeSingle();
  if (!incident) return jsonResp({ error: "incident not found" }, 404);

  let affected = 0;
  const detail: Record<string, unknown> = { action, entity: incident.entity };

  switch (action) {
    case "acknowledge_scraper_alerts_for_entity": {
      if (incident.source !== "scraper-alert") return jsonResp({ error: "action requires scraper-alert source" }, 400);
      const [providerId, alertType] = (incident.entity ?? "").split(":");
      if (!providerId || !alertType) return jsonResp({ error: "cannot parse entity" }, 400);
      const { data, error } = await service.from("scraper_alerts")
        .update({ acknowledged: true })
        .eq("provider_id", providerId).eq("alert_type", alertType)
        .eq("acknowledged", false).select("id");
      if (error) return jsonResp({ error: error.message }, 500);
      affected = data?.length ?? 0;
      break;
    }
    case "reverse_acknowledge_scraper_alerts_for_entity": {
      if (incident.source !== "scraper-alert") return jsonResp({ error: "action requires scraper-alert source" }, 400);
      const [providerId, alertType] = (incident.entity ?? "").split(":");
      if (!providerId || !alertType) return jsonResp({ error: "cannot parse entity" }, 400);
      const { data, error } = await service.from("scraper_alerts")
        .update({ acknowledged: false })
        .eq("provider_id", providerId).eq("alert_type", alertType)
        .eq("acknowledged", true).select("id");
      if (error) return jsonResp({ error: error.message }, 500);
      affected = data?.length ?? 0;
      break;
    }
    case "resolve_operational_alerts_for_entity": {
      if (incident.source !== "operational-alert") return jsonResp({ error: "action requires operational-alert source" }, 400);
      const [src, entType, entName] = (incident.entity ?? "").split(":");
      const query = service.from("operational_alerts").update({ is_resolved: true })
        .eq("source", src).eq("entity_type", entType).eq("entity_name", entName)
        .eq("is_resolved", false).select("id");
      const { data, error } = await query;
      if (error) return jsonResp({ error: error.message }, 500);
      affected = data?.length ?? 0;
      break;
    }
    case "reverse_resolve_operational_alerts_for_entity": {
      if (incident.source !== "operational-alert") return jsonResp({ error: "action requires operational-alert source" }, 400);
      const [src, entType, entName] = (incident.entity ?? "").split(":");
      const query = service.from("operational_alerts").update({ is_resolved: false })
        .eq("source", src).eq("entity_type", entType).eq("entity_name", entName)
        .eq("is_resolved", true).select("id");
      const { data, error } = await query;
      if (error) return jsonResp({ error: error.message }, 500);
      affected = data?.length ?? 0;
      break;
    }
  }

  detail.affected = affected;
  await service.from("soc_incident_events").insert({
    incident_id, actor_id: userData.user.id, event_type: "note",
    detail: { note: `Action executed: ${action}`, ...detail },
  });

  return jsonResp({ ok: true, action, affected });
});
