// Fixed-window, in-memory rate limiter for the public MCP function.
// State lives per edge isolate, so the limit is best-effort, not global.

export const PUBLIC_RATE_LIMIT = 60;
export const PUBLIC_RATE_WINDOW_MS = 60_000;

type Bucket = { count: number; windowStart: number };

export type RateLimiter = {
  check: (
    key: string,
    now?: number,
  ) => { allowed: boolean; retryAfterSeconds: number };
  size: () => number;
};

export function createRateLimiter(
  limit: number = PUBLIC_RATE_LIMIT,
  windowMs: number = PUBLIC_RATE_WINDOW_MS,
): RateLimiter {
  const buckets = new Map<string, Bucket>();

  const sweep = (now: number): void => {
    for (const [key, b] of buckets) {
      if (now - b.windowStart >= windowMs) buckets.delete(key);
    }
  };

  return {
    check: (key, now = Date.now()) => {
      if (buckets.size > 10_000) sweep(now);
      const existing = buckets.get(key);
      if (!existing || now - existing.windowStart >= windowMs) {
        buckets.set(key, { count: 1, windowStart: now });
        return { allowed: true, retryAfterSeconds: 0 };
      }
      existing.count += 1;
      if (existing.count > limit) {
        const retry = Math.max(
          1,
          Math.ceil((existing.windowStart + windowMs - now) / 1000),
        );
        return { allowed: false, retryAfterSeconds: retry };
      }
      return { allowed: true, retryAfterSeconds: 0 };
    },
    size: () => buckets.size,
  };
}

/** Only infrastructure-overwritten headers may identify the client. */
export function clientIp(headers: Headers): string | null {
  for (const name of ["cf-connecting-ip", "x-real-ip"]) {
    const value = headers.get(name)?.trim();
    if (!value) continue;
    if (isIpLiteral(value)) return value;
  }
  return null;
}

function isIpLiteral(value: string): boolean {
  if (/^(?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3}$/.test(value)) {
    return value.split(".").every((part) => Number(part) <= 255);
  }
  if (!value.includes(":") || !/^[\da-f:.]+$/i.test(value)) return false;
  try {
    // WHATWG URL validates compressed IPv6 and embedded IPv4 without Node APIs.
    return new URL(`http://[${value}]/`).hostname.startsWith("[");
  } catch {
    return false;
  }
}

type Handler = (request: Request) => Response | Promise<Response>;

export function withRateLimit(
  handler: Handler,
  limiter: RateLimiter = createRateLimiter(),
): Handler {
  return (request) => {
    // CORS preflights are free so browsers can still discover the server.
    if (request.method === "OPTIONS") return handler(request);
    const { allowed, retryAfterSeconds } = limiter.check(
      clientIp(request.headers) ?? "unknown",
    );
    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: "Too many requests. Limit is 60 per minute per IP address.",
        }),
        {
          status: 429,
          headers: {
            "content-type": "application/json",
            "retry-after": String(retryAfterSeconds),
            "access-control-allow-origin": "*",
          },
        },
      );
    }
    return handler(request);
  };
}

type DenoLike = { serve: (handler: Handler) => unknown };

// The generated function entry ends with Deno.serve(createSupabaseHandler(...))
// and offers no middleware hook, so wrap Deno.serve before that line runs.
// No-op outside Deno (Vite build, manifest extraction, unit tests).
export function installDenoServeRateLimit(
  target: unknown = globalThis,
): boolean {
  const deno = (target as { Deno?: DenoLike }).Deno;
  if (!deno || typeof deno.serve !== "function") return false;
  const original = deno.serve.bind(deno);
  const limiter = createRateLimiter();
  deno.serve = (handler: Handler) => original(withRateLimit(handler, limiter));
  return true;
}
