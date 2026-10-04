import { createFileRoute } from "@tanstack/react-router";
import { clientIp } from "@/lib/mcp/rate-limit";
import { handleRetestSubscribe } from "@/lib/retest-reminder/retest-reminder-core";

export const Route = createFileRoute("/api/public/retest-reminder/subscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { subscribeDeps } = await import("@/lib/retest-reminder/retest-reminder.server");
          return await handleRetestSubscribe(request, clientIp(request.headers), subscribeDeps());
        } catch {
          console.error("retest-reminder-subscribe: request failed");
          return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
        }
      },
    },
  },
});
