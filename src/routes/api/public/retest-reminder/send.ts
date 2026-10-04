import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";

function isServiceRole(header: string | null): boolean {
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!key || !header) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(`Bearer ${key}`);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/retest-reminder/send")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Cron/service-role guard: Authorization must equal Bearer <service role key>.
        if (!isServiceRole(request.headers.get("authorization"))) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        try {
          const { sendDueReminders } = await import("@/lib/retest-reminder/retest-reminder.server");
          return Response.json({ success: true, ...(await sendDueReminders()) });
        } catch {
          console.error("retest-reminder-send: run failed");
          return Response.json({ success: false, error: "Internal server error" }, { status: 500 });
        }
      },
    },
  },
});
