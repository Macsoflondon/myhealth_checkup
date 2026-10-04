import { createFileRoute } from "@tanstack/react-router";
import { UUID_RE, unsubscribePage } from "@/lib/retest-reminder/retest-reminder-core";

async function handle(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (UUID_RE.test(token)) {
    try {
      const { unsubscribeByToken } = await import("@/lib/retest-reminder/retest-reminder.server");
      await unsubscribeByToken(token);
    } catch {
      console.error("retest-reminder-unsubscribe: request failed");
    }
  }
  // Same neutral page whether or not the token matched.
  return unsubscribePage();
}

export const Route = createFileRoute("/api/public/retest-reminder/unsubscribe")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      // RFC 8058 one-click unsubscribe from mail clients.
      POST: ({ request }) => handle(request),
    },
  },
});
