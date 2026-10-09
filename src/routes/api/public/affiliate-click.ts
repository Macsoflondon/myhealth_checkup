import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { clientIp, createRateLimiter } from "@/lib/mcp/rate-limit";
import { AFFILIATE_PLACEMENTS } from "@/lib/affiliate/affiliate-tracking";
import {
  AFFILIATE_BURST_THRESHOLD,
  classifyTraffic,
} from "@/lib/affiliate/traffic-quality";

/**
 * Logs one outbound affiliate click. No IP, user agent or account data is
 * stored. The IP is used only for the in-memory rate limit (30 per minute)
 * and the burst counter; the user agent only to label automated traffic
 * (traffic_flag), then both are discarded.
 */
export const AFFILIATE_CLICK_RATE_LIMIT = 30;
const limiter = createRateLimiter(AFFILIATE_CLICK_RATE_LIMIT, 60_000);
const burstCounter = createRateLimiter(AFFILIATE_BURST_THRESHOLD, 60_000);

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

export async function handleAffiliateClick(
  request: Request,
): Promise<Response> {
  const ip = clientIp(request.headers);
  const { allowed, retryAfterSeconds } = limiter.check(ip);
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
  // Without a real address every request shares one bucket, so skip the
  // burst label rather than flag genuine visitors together.
  const overBurst = ip !== "unknown" && !burstCounter.check(ip).allowed;
  const traffic_flag = classifyTraffic(
    request.headers.get("user-agent"),
    overBurst,
  );

  // Insert only, no .select(): anon has no read access to this table.
  let { error } = await supabase
    .from("affiliate_clicks")
    .insert({ ...parsed.data, traffic_flag });
  // Deploys can run ahead of the migration that adds traffic_flag. Never
  // lose the click over the label: retry without it.
  if (error && /traffic_flag/.test(`${error.message} ${error.details ?? ""}`)) {
    ({ error } = await supabase.from("affiliate_clicks").insert(parsed.data));
  }
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
