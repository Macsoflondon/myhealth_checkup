import { supabase } from "@/integrations/supabase/client";

// Generates or retrieves a persistent anonymous session ID
function getSessionId(): string {
  const key = "mhc_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// Generates or retrieves a persistent anonymous user ID (survives sessions)
function getAnonymousId(): string {
  const key = "mhc_anon_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export async function trackFunnelEvent(
  funnel_stage: "quiz_start" | "quiz_complete" | "provider_click",
  options: {
    entity_type?: string;
    entity_id?: string;
    entity_name?: string;
    provider_id?: string;
    revenue_amount?: number;
    currency?: string;
  } = {}
) {
  try {
    await supabase.from("funnel_events").insert({
      session_id: getSessionId(),
      anonymous_id: getAnonymousId(),
      funnel_stage,
      entity_type: options.entity_type ?? null,
      entity_id: options.entity_id ?? null,
      entity_name: options.entity_name ?? null,
      provider_id: options.provider_id ?? null,
      revenue_amount: options.revenue_amount ?? null,
      currency: options.currency ?? null,
    });
  } catch (e) {
    // Silently fail — never block UI for analytics
    console.warn("Funnel tracking error:", e);
  }
}
