import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { clientIp, createRateLimiter } from "@/lib/mcp/rate-limit";
import { AFFILIATE_PLACEMENTS } from "@/lib/affiliate/affiliate-tracking";

/**
 * Logs one outbound affiliate click. No IP, user agent or account data is
 * stored; the IP is used only for the in-memory rate limit (30 per minute).
 */
export const AFFILIATE_CLICK_RATE_LIMIT = 30;
const limiter = createRateLimiter(AFFILIATE_CLICK_RATE_LIMIT, 60_000);

export const affiliateClickSchema = z.object({
  click_id: z.string().uuid(),
  provider_id: z.string().regex(/^[a-z0-9-]{1,64}$/),
  test_id: z.string().max(200).nullable(),
  source_page: z
    .string()
    .min(1)
    .max(300)
    .regex(/^\/[^?#]*$/),
  placement: z.enum(AFFILIATE_PLACEMENTS),
  destination_host: z
    .string()
    .min(1)
    .max(253)
    .regex(/^[a-z0-9.-]+$/),
});

export async function handleAffiliateClick(request: Request): Promise<Response> {
  const { allowed, retryAfterSeconds } = limiter.check(
    clientIp(request.headers),
  );
  if (!allowed) {
    return new Response(null, {
      status: 429,
      headers: { "retry-after": String(retryAfterSeconds) },
    });
  }
  let body: unknown;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = affiliateClickSchema.safeParse(body);
  if (!parsed.success) return new Response(null, { status: 400 });

  const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ??
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return new Response(null, { status: 503 });

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  // Insert only, no .select(): anon has no read access to this table.
  const { error } = await supabase.from("affiliate_clicks").insert(parsed.data);
  if (error) return new Response(null, { status: 502 });
  return new Response(null, { status: 204 });
}

export const Route = createFileRoute("/api/public/affiliate-click")({
  server: {
    handlers: {
      POST: ({ request }) => handleAffiliateClick(request),
    },
  },
});
