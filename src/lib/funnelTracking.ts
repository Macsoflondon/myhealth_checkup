import { supabase } from "@/integrations/supabase/client";
import { hasConsent } from "@/lib/consent";

/**
 * Quiz and provider-click funnel events (public.funnel_events).
 *
 * - Runs only after the visitor accepts analytics cookies. The session id
 *   lives in sessionStorage, which UK PECR treats the same as a cookie.
 * - The id lasts for one browser-tab session. The cross-session id this
 *   module used to keep in localStorage ("mhc_anon_id") is no longer
 *   created, and any existing one is deleted.
 * - Never throws and never blocks the UI. supabase-js reports a refused
 *   insert (for example an RLS rejection) as `error` rather than throwing,
 *   so that case is checked explicitly.
 */

const SESSION_KEY = "mhc_session_id";
const LEGACY_ANON_KEY = "mhc_anon_id";

export type FunnelStage = "quiz_start" | "quiz_complete" | "provider_click";

function sessionId(): string | null {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // Storage blocked (private browsing, strict settings): skip the event.
    return null;
  }
}

function dropLegacyAnonymousId(): void {
  try {
    localStorage.removeItem(LEGACY_ANON_KEY);
  } catch {
    // Nothing to remove, or storage blocked.
  }
}

function warnInDev(message: string, detail: unknown): void {
  if (import.meta.env.DEV) console.warn(message, detail);
}

export async function trackFunnelEvent(
  funnel_stage: FunnelStage,
  options: {
    entity_type?: string;
    entity_id?: string;
    entity_name?: string;
    provider_id?: string;
    revenue_amount?: number;
    currency?: string;
  } = {},
): Promise<void> {
  if (typeof window === "undefined") return;
  dropLegacyAnonymousId();
  if (!hasConsent("analytics")) return;

  const session_id = sessionId();
  if (!session_id) return;

  try {
    const { error } = await supabase.from("funnel_events").insert({
      session_id,
      anonymous_id: null,
      funnel_stage,
      entity_type: options.entity_type ?? null,
      entity_id: options.entity_id ?? null,
      entity_name: options.entity_name ?? null,
      provider_id: options.provider_id ?? null,
      revenue_amount: options.revenue_amount ?? null,
      currency: options.currency ?? null,
    });
    if (error) warnInDev("Funnel tracking refused:", error.message);
  } catch (e) {
    warnInDev("Funnel tracking error:", e);
  }
}
