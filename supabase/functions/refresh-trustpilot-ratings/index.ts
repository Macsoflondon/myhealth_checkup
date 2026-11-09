/**
 * refresh-trustpilot-ratings
 *
 * Scrapes provider Trustpilot pages for star rating and review count.
 * Writes one row per provider to public.provider_ratings (single source of
 * truth) and mirrors the values onto active provider_tests rows. Never
 * fabricates: a failed scrape keeps the last verified value and records why.
 *
 * Trustpilot rate-limits bursts, so each run handles the stalest providers
 * only (?limit=, default 2). pg_cron job refresh-provider-ratings runs it
 * every 3 hours through call_edge_with_service_role.
 *
 * Auth: service-role bearer only.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";

const JSON_HEADERS = { "Content-Type": "application/json" };

// provider_id -> candidate Trustpilot business slugs, tried in order.
export const PROVIDER_SLUGS: Record<string, string[]> = {
  medichecks: ["www.medichecks.com"],
  "medical-diagnosis": ["www.medical-diagnosis.co.uk", "medical-diagnosis.co.uk"],
  "lola-health": ["lolahealth.com", "www.lolahealth.com"],
  "london-medical-laboratory": ["londonmedicallaboratory.com", "www.londonmedicallaboratory.com"],
  "london-health-company": ["londonhealthcompany.co.uk"],
  "goodbody-clinic": ["goodbodyclinic.com"],
  clinilabs: ["clinilabs.co.uk", "www.clinilabs.co.uk"],
  randox: ["randoxhealth.com", "www.randoxhealth.com"],
};

const UA =
  "Mozilla/5.0 (compatible; myhealthcheckup-scraper/1.0; +https://myhealthcheckup.co.uk)";

export interface ParsedRating {
  rating: number | null;
  count: number | null;
}

function toNum(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

// Walk any JSON-LD shape (arrays, @graph, nested objects) for aggregateRating.
function findAggregate(node: unknown, depth = 0): ParsedRating | null {
  if (!node || typeof node !== "object" || depth > 6) return null;
  if (Array.isArray(node)) {
    for (const n of node) {
      const r = findAggregate(n, depth + 1);
      if (r) return r;
    }
    return null;
  }
  const o = node as Record<string, unknown>;
  const ar = o.aggregateRating as Record<string, unknown> | undefined;
  if (ar && typeof ar === "object") {
    const rating = toNum(ar.ratingValue);
    const count = toNum(ar.reviewCount ?? ar.ratingCount);
    if (rating !== null || count !== null) return { rating, count };
  }
  for (const v of Object.values(o)) {
    if (v && typeof v === "object") {
      const r = findAggregate(v, depth + 1);
      if (r) return r;
    }
  }
  return null;
}

export function parseTrustpilotHtml(html: string): ParsedRating {
  let rating: number | null = null;
  let count: number | null = null;
  for (const m of html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const r = findAggregate(JSON.parse(m[1].trim()));
      if (r) {
        rating = r.rating;
        count = r.count;
        break;
      }
    } catch {
      // malformed block
    }
  }
  // Fallback: Trustpilot's own meta tags.
  if (rating === null) {
    const t = html.match(/with\s+(\d(?:\.\d)?)\s*\/\s*5\s+on\s+Trustpilot/i);
    if (t) rating = toNum(t[1]);
  }
  if (count === null) {
    const c = html.match(/what\s+([\d,]+)\s+(?:people|customers)\s+have/i);
    if (c) count = toNum(c[1]);
  }
  if (rating !== null && (rating < 0 || rating > 5)) rating = null;
  if (count !== null && (count < 0 || !Number.isInteger(count))) count = null;
  return { rating, count };
}

async function fetchHtml(
  url: string,
): Promise<{ status: number; html: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-GB,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    return { status: res.status, html: res.ok ? await res.text() : "" };
  } catch {
    return { status: 0, html: "" };
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Deno.serve(async (req) => {
  const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!svc || (req.headers.get("Authorization") ?? "") !== `Bearer ${svc}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, svc, {
    auth: { persistSession: false },
  });

  const limitParam = Number(new URL(req.url).searchParams.get("limit"));
  const limit =
    Number.isInteger(limitParam) && limitParam > 0 && limitParam <= 8
      ? limitParam
      : 2;

  // Stalest first: providers never attempted, then oldest attempt.
  const { data: rows } = await supabase
    .from("provider_ratings")
    .select("provider_id, last_attempt_at");
  const lastAttempt = new Map<string, string | null>(
    (rows ?? []).map((r: { provider_id: string; last_attempt_at: string | null }) => [
      r.provider_id,
      r.last_attempt_at,
    ]),
  );
  const queue = Object.keys(PROVIDER_SLUGS)
    .sort((a, b) =>
      (lastAttempt.get(a) ?? "").localeCompare(lastAttempt.get(b) ?? ""),
    )
    .slice(0, limit);

  const results: Array<Record<string, unknown>> = [];

  for (const providerId of queue) {
    const nowIso = new Date().toISOString();
    let found: (ParsedRating & { url: string }) | null = null;
    const attempts: string[] = [];
    for (const slug of PROVIDER_SLUGS[providerId]) {
      const url = `https://uk.trustpilot.com/review/${slug}`;
      const { status, html } = await fetchHtml(url);
      const parsed = html
        ? parseTrustpilotHtml(html)
        : { rating: null, count: null };
      attempts.push(
        `${slug}: http ${status}${html && parsed.rating === null ? ", no rating on page" : ""}`,
      );
      // A published TrustScore needs a rating and at least one review.
      if (parsed.rating !== null && parsed.count !== null && parsed.count > 0) {
        found = { ...parsed, url };
        break;
      }
      // 403/429 means we are being rate-limited: stop, try again next run.
      if (status === 403 || status === 429) break;
      await sleep(4000);
    }

    try {
      if (found) {
        const { error } = await supabase.from("provider_ratings").upsert({
          provider_id: providerId,
          source: "trustpilot",
          source_url: found.url,
          rating: found.rating,
          review_count: found.count,
          checked_at: nowIso,
          last_attempt_at: nowIso,
          last_status: "ok",
          last_error: null,
          updated_at: nowIso,
        });
        if (error) throw error;
        const { error: mirrorErr } = await supabase
          .from("provider_tests")
          .update({
            trustpilot_rating: found.rating,
            trustpilot_review_count: found.count,
            trustpilot_last_checked: nowIso,
          })
          .eq("provider_id", providerId)
          .eq("is_active", true);
        if (mirrorErr) throw mirrorErr;
        results.push({
          providerId,
          ok: true,
          rating: found.rating,
          reviewCount: found.count,
          source: found.url,
        });
      } else {
        // Keep the last verified rating; record the failed attempt only.
        const patch = {
          last_attempt_at: nowIso,
          last_status: "no_data",
          last_error: attempts.join(" | ").slice(0, 1000),
          updated_at: nowIso,
        };
        const { error } = lastAttempt.has(providerId)
          ? await supabase
              .from("provider_ratings")
              .update(patch)
              .eq("provider_id", providerId)
          : await supabase
              .from("provider_ratings")
              .insert({ provider_id: providerId, source: "trustpilot", ...patch });
        if (error) throw error;
        results.push({ providerId, ok: false, reason: "no_data", attempts });
      }
    } catch (err) {
      const e = err as { message?: string };
      results.push({
        providerId,
        ok: false,
        error: e?.message ?? String(err),
        attempts,
      });
    }
    await sleep(5000);
  }

  return new Response(
    JSON.stringify({
      success: results.some((r) => r.ok),
      checked_at: new Date().toISOString(),
      results,
    }),
    { headers: JSON_HEADERS },
  );
});
