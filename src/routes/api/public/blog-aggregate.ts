import { createFileRoute } from "@tanstack/react-router";
import { timingSafeEqual } from "crypto";

/**
 * Scheduled provider blog aggregation.
 * Called by pg_cron with a dedicated scheduler secret in the
 * `x-cron-secret` header (BLOG_AGGREGATE_SECRET), never a public key.
 */
function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/blog-aggregate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["BLOG_AGGREGATE_SECRET"];
        const provided = request.headers.get("x-cron-secret") ?? "";
        if (!expected || expected.length < 32 || !secretMatches(provided, expected)) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { runBlogAggregation } =
          await import("@/lib/blog/aggregator.server");
        const result = await runBlogAggregation();
        return Response.json(result);
      },
    },
  },
});
