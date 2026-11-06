import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { clientIp } from "@/lib/mcp/rate-limit";
import {
  AFFILIATE_PLACEMENTS,
  buildAffiliateUrl,
  isAffiliatePlacement,
  newClickId,
  sanitiseSourcePage,
} from "@/lib/affiliate/affiliate-tracking";
import { AFFILIATE_PROVIDERS } from "@/lib/affiliate/affiliate-config";
import {
  AFFILIATE_CLICKS_PER_WINDOW,
  hashVisitor,
  isCatalogueTestId,
  verifiedProviderUrl,
} from "@/lib/affiliate/click-redirect";
import { classifyTraffic } from "@/lib/affiliate/traffic-quality";

/**
 * The only write path for booking clicks. Anonymous visitors have no direct
 * database write access; this handler validates against the catalogue,
 * rate-limits on a salted IP hash (20 per 10 minutes) and writes with the
 * server-only key. Stored: provider, test, time, bot flag, plus the route
 * and placement label. No IP, user agent or account data.
 */
const MAX_CLICK_BODY_BYTES = 4_096;

export const affiliateClickSchema = z.object({
  click_id: z.string().uuid(),
  provider_id: z.string().regex(/^[a-z0-9-]{1,64}$/),
  test_id: z.string().max(200).nullable(),
  source_page: z.string().min(1).max(300).regex(/^\/[^?#]*$/),
  placement: z.enum(AFFILIATE_PLACEMENTS),
  // Accepted for older clients but ignored: the server derives the host.
  destination_host: z.string().max(253).optional(),
});

type Admin = (typeof import("@/integrations/supabase/client.server"))["supabaseAdmin"];

async function adminClient(): Promise<Admin | null> {
  if (!process.env["SUPABASE_SERVICE_ROLE_KEY"]) return null;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function withinRateLimit(admin: Admin, request: Request): Promise<boolean> {
  const ip = clientIp(request.headers);
  const secret = process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "";
  const ipHash = await hashVisitor(ip, secret);
  const { data, error } = await admin.rpc("affiliate_click_rate_hit", {
    p_ip_hash: ipHash,
    p_limit: AFFILIATE_CLICKS_PER_WINDOW,
  });
  return !error && data === true;
}

async function lookupTest(admin: Admin, testId: string) {
  const { data } = await admin
    .from("provider_tests")
    .select("id, provider_id, url, is_active")
    .eq("id", testId)
    .maybeSingle();
  return data && data.is_active !== false ? data : null;
}

async function record(
  admin: Admin,
  row: {
    click_id: string;
    provider_id: string;
    test_id: string | null;
    source_page: string;
    placement: (typeof AFFILIATE_PLACEMENTS)[number];
    destination_host: string;
  },
  request: Request,
): Promise<boolean> {
  const traffic_flag = classifyTraffic(request.headers.get("user-agent"), false);
  const { error } = await admin.from("affiliate_clicks").insert({ ...row, traffic_flag });
  return !error;
}

export type AffiliateClickRow = {
  click_id: string;
  provider_id: string;
  test_id: string | null;
  source_page: string;
  placement: (typeof AFFILIATE_PLACEMENTS)[number];
  destination_host: string;
};

export type AffiliateBeaconDeps = {
  lookupTest: (testId: string) => Promise<{ id: string; provider_id: string; url: string | null } | null>;
  withinLimit: (request: Request) => Promise<boolean>;
  insert: (row: AffiliateClickRow) => Promise<boolean>;
};

/** Host recorded for a click: never the browser's claim. */
export function serverDestinationHost(
  providerId: string,
  catalogueUrl: string | null,
): string | null {
  if (catalogueUrl !== null) {
    return verifiedProviderUrl(catalogueUrl, providerId)?.hostname.toLowerCase() ?? null;
  }
  return AFFILIATE_PROVIDERS[providerId]?.hosts[0] ?? null;
}

/**
 * POST beacon: provider-level links. Provider and test must exist in the
 * catalogue. Any destination_host in the body is ignored; the server derives it.
 */
export async function handleAffiliateBeacon(
  request: Request,
  deps: AffiliateBeaconDeps,
): Promise<Response> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_CLICK_BODY_BYTES) return new Response(null, { status: 413 });
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_CLICK_BODY_BYTES) return new Response(null, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = affiliateClickSchema.safeParse(body);
  if (!parsed.success) return new Response(null, { status: 400 });
  const { click_id, provider_id, source_page, placement } = parsed.data;
  if (!Object.prototype.hasOwnProperty.call(AFFILIATE_PROVIDERS, provider_id)) {
    return new Response(null, { status: 400 });
  }

  let testId: string | null = null;
  let catalogueUrl: string | null = null;
  if (parsed.data.test_id !== null) {
    if (!isCatalogueTestId(parsed.data.test_id)) return new Response(null, { status: 400 });
    const test = await deps.lookupTest(parsed.data.test_id);
    if (!test || test.provider_id !== provider_id) return new Response(null, { status: 400 });
    testId = test.id;
    catalogueUrl = test.url ?? "";
  }
  const destination_host = serverDestinationHost(provider_id, catalogueUrl);
  if (!destination_host) return new Response(null, { status: 400 });
  if (!(await deps.withinLimit(request))) {
    return new Response(null, { status: 429, headers: { "retry-after": "600" } });
  }
  const ok = await deps.insert({ click_id, provider_id, test_id: testId, source_page, placement, destination_host });
  return new Response(null, { status: ok ? 204 : 502 });
}

export async function handleAffiliateClick(request: Request): Promise<Response> {
  const admin = await adminClient();
  if (!admin) return new Response(null, { status: 503 });
  return handleAffiliateBeacon(request, {
    lookupTest: (id) => lookupTest(admin, id),
    withinLimit: (req) => withinRateLimit(admin, req),
    insert: (row) => record(admin, row, request),
  });
}

/**
 * GET redirect: /api/public/affiliate-click?test=<uuid>&pl=<placement>&src=<path>.
 * Redirects only to the catalogue's own URL for that test; a URL in the
 * request is never used. Over the rate limit the visitor is still sent to
 * the provider, but the click is not recorded.
 */
export async function handleAffiliateRedirect(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const testId = params.get("test");
  if (!isCatalogueTestId(testId)) return new Response("Unknown test", { status: 400 });
  const admin = await adminClient();
  if (!admin) return new Response(null, { status: 503 });
  const test = await lookupTest(admin, testId);
  const destination = test ? verifiedProviderUrl(test.url, test.provider_id) : null;
  if (!test || !destination) return new Response("Unknown test", { status: 404 });

  const pl = params.get("pl");
  const placement = isAffiliatePlacement(pl) ? pl : "card";
  const clickId = newClickId();
  if (await withinRateLimit(admin, request)) {
    await record(
      admin,
      {
        click_id: clickId,
        provider_id: test.provider_id,
        test_id: test.id,
        source_page: sanitiseSourcePage(params.get("src") ?? "/"),
        placement,
        destination_host: destination.hostname.toLowerCase(),
      },
      request,
    );
  }
  const location = buildAffiliateUrl(destination.toString(), test.provider_id, clickId);
  return new Response(null, {
    status: 302,
    headers: { location, "cache-control": "no-store", "referrer-policy": "no-referrer" },
  });
}

export const Route = createFileRoute("/api/public/affiliate-click")({
  server: {
    handlers: {
      GET: ({ request }) => handleAffiliateRedirect(request),
      POST: ({ request }) => handleAffiliateClick(request),
    },
  },
});
