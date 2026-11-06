/** Matches QUIZ_EVENT_ENDPOINT in @/lib/quiz/quiz-event (kept literal so the browser bundle skips the server schema). */
const QUIZ_EVENT_ENDPOINT = "/api/public/quiz-event";
import { hasConsent } from "@/lib/consent";

/**
 * Quiz and provider-click funnel events (public.funnel_events).
 *
 * - Runs only after the visitor accepts analytics cookies. The session id
 *   lives in sessionStorage, which UK PECR treats the same as a cookie.
 * - The id lasts for one browser-tab session. The cross-session id this
 *   module used to keep in localStorage ("mhc_anon_id") is no longer
 *   created, and any existing one is deleted.
 * - Signed-in and signed-out visitors alike post to /api/public/quiz-event,
 *   the single write path; the browser never writes to the database.
 * - Never throws and never blocks the UI.
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
  options: { quiz_node_id?: string; provider_id?: string; test_id?: string } = {},
): Promise<void> {
  if (typeof window === "undefined") return;
  dropLegacyAnonymousId();
  if (!hasConsent("analytics")) return;

  const session_id = sessionId();
  if (!session_id) return;

  const body: Record<string, string> = {
    event: funnel_stage,
    session_id,
    occurred_at: new Date().toISOString(),
  };
  if (funnel_stage === "provider_click") {
    if (!options.provider_id || !options.test_id) return;
    body.provider_id = options.provider_id;
    body.test_id = options.test_id;
  } else {
    if (!options.quiz_node_id) return;
    body.quiz_node_id = options.quiz_node_id;
  }

  try {
    const res = await fetch(QUIZ_EVENT_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
      credentials: "omit",
    });
    if (!res.ok) warnInDev("Funnel tracking refused:", res.status);
  } catch (e) {
    warnInDev("Funnel tracking error:", e);
  }
}
