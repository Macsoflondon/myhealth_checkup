import { createFileRoute } from "@tanstack/react-router";
import { handleQuizEvent, QUIZ_EVENTS_PER_WINDOW } from "@/lib/quiz/quiz-event";
import {
  catalogueTest,
  loadAdmin,
  rpcRateHit,
  withinVisitorLimit,
} from "@/lib/server/visitor-rate-limit";

/** Browser requests from this site's own pages only (Origin must match host). */
export function isSameOriginRequest(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

/**
 * The only write path for quiz funnel events (signed-in and signed-out).
 * Anonymous visitors have no direct database write access.
 */
export const Route = createFileRoute("/api/public/quiz-event")({
  server: {
    handlers: {
      GET: () => new Response(null, { status: 405, headers: { allow: "POST" } }),
      POST: async ({ request }) => {
        // Only the site's own pages may record funnel events.
        if (!isSameOriginRequest(request)) return new Response(null, { status: 403 });
        const admin = await loadAdmin();
        if (!admin) return new Response(null, { status: 503 });
        const secret = process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "";
        return handleQuizEvent(request, {
          secret,
          withinLimit: (req) =>
            withinVisitorLimit(req, "quiz", QUIZ_EVENTS_PER_WINDOW, secret, rpcRateHit(admin)),
          testBelongsTo: async (testId, providerId) =>
            (await catalogueTest(admin, testId))?.provider_id === providerId,
          insert: async (row) => !(await admin.from("funnel_events").insert(row)).error,
        });
      },
    },
  },
});
