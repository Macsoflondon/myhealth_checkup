import { createFileRoute } from "@tanstack/react-router";

/**
 * Scheduled provider blog aggregation.
 * Called by pg_cron with the Supabase anon key in the `apikey` header.
 */
export const Route = createFileRoute("/api/public/blog-aggregate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const anonKey = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
        const provided = request.headers.get("apikey");
        if (!anonKey || provided !== anonKey) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { runBlogAggregation } = await import("@/lib/blog/aggregator.server");
        const result = await runBlogAggregation();
        return Response.json(result);
      },
    },
  },
});
