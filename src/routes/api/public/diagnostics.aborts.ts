import { createFileRoute } from "@tanstack/react-router";
import { getInFlightSnapshot, getRecentAborts } from "@/lib/abort-diagnostics";

/**
 * Read-only trace of recent aborted socket closes, used to diagnose homepage
 * blank-screen reports. Requires the ABORT_DIAGNOSTICS_TOKEN secret unless the
 * server is running in development.
 */
export const Route = createFileRoute("/api/public/diagnostics/aborts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const token = process.env["ABORT_DIAGNOSTICS_TOKEN"];
        const isDev = process.env["NODE_ENV"] !== "production";
        const provided =
          request.headers.get("x-diagnostics-token") ??
          new URL(request.url).searchParams.get("token");

        if (!isDev && (!token || provided !== token)) {
          return new Response("Not found", { status: 404 });
        }

        return Response.json(
          {
            generatedAt: new Date().toISOString(),
            inFlight: getInFlightSnapshot(),
            recentAborts: getRecentAborts(),
          },
          { headers: { "cache-control": "no-store" } },
        );
      },
    },
  },
});
