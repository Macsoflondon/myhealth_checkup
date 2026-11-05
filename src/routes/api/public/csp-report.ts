import { createFileRoute } from "@tanstack/react-router";

/**
 * Receives Content-Security-Policy violation reports (legacy report-uri and
 * Reporting API report-to). Logs only the directive, blocked origin and
 * document path — never query strings, cookies or request bodies beyond
 * those fields — so violations are visible in server logs.
 */
const MAX_BODY_BYTES = 16_384;

type Summary = { directive: string; blocked: string; page: string };

const originOnly = (value: unknown): string => {
  if (typeof value !== "string" || value === "") return "unknown";
  try {
    const u = new URL(value);
    return u.origin === "null" ? value.slice(0, 40) : u.origin;
  } catch {
    return value.slice(0, 40);
  }
};

const pathOnly = (value: unknown): string => {
  if (typeof value !== "string") return "unknown";
  try {
    return new URL(value).pathname.slice(0, 200);
  } catch {
    return "unknown";
  }
};

const summarise = (entry: unknown): Summary | null => {
  if (entry == null || typeof entry !== "object") return null;
  const record = entry as Record<string, unknown>;
  const body = (record["csp-report"] ?? record["body"] ?? record) as Record<string, unknown>;
  if (body == null || typeof body !== "object") return null;
  return {
    directive: String(body["effective-directive"] ?? body["effectiveDirective"] ?? body["violated-directive"] ?? "unknown").slice(0, 60),
    blocked: originOnly(body["blocked-uri"] ?? body["blockedURL"]),
    page: pathOnly(body["document-uri"] ?? body["documentURL"]),
  };
};

export const Route = createFileRoute("/api/public/csp-report")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const text = await request.text();
        if (text.length > MAX_BODY_BYTES) return new Response(null, { status: 413 });
        let parsed: unknown;
        try {
          parsed = JSON.parse(text);
        } catch {
          return new Response(null, { status: 400 });
        }
        const entries = Array.isArray(parsed) ? parsed.slice(0, 20) : [parsed];
        for (const entry of entries) {
          const s = summarise(entry);
          if (s) console.warn(`[csp-violation] ${new Date().toISOString()} directive=${s.directive} blocked=${s.blocked} page=${s.page}`);
        }
        return new Response(null, { status: 204 });
      },
    },
  },
});
