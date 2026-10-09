// Classifies one site-status response and merges check history. Pure: no
// imports beyond contract types, no Deno or browser APIs, so vitest covers it.
import type { SiteCheck } from "../../_shared/os/contract.ts";

/** Checks kept per address in the history, newest first (three days hourly). */
export const SITE_HISTORY_PER_URL = 72;

export type SiteResponseInput = {
  status: number;
  /** URL of the final response after redirects. */
  finalUrl: string;
  /** Response headers with lower-cased names. */
  headers: Record<string, string>;
  /** The first 4,000 characters of the body. */
  bodySnippet: string;
};

export type SiteVerdict = { ok: boolean; problem: string | null };

const NO_BUILD_ADVICE =
  "Lovable reports no published build. Republish the project in Lovable.";

function pageTitle(html: string): string | null {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return m ? m[1].replace(/\s+/g, " ").trim() : null;
}

/**
 * Lovable answers with its own placeholder page when the project has no
 * published build: 404, title "No published build" and the header
 * `x-lovable-serve-error: dwl_no_hash`. Other serve errors carry the same
 * header with a different code.
 */
function lovableServeError(
  headers: Record<string, string>,
  body: string,
): { noBuild: boolean; code: string | null } | null {
  const header = (headers["x-lovable-serve-error"] ?? "").trim();
  const title = pageTitle(body) ?? "";
  const noBuild =
    header === "dwl_no_hash" ||
    /no published build/i.test(title) ||
    (header !== "" && /no published build/i.test(body));
  if (noBuild) return { noBuild: true, code: header || null };
  if (header !== "") {
    // Only echo a short, code-like value back into the dashboard.
    const code = /^[A-Za-z0-9_.-]{1,40}$/.test(header) ? header : null;
    return { noBuild: false, code };
  }
  return null;
}

/**
 * ok only when the final status is 200 to 399 and the body is the real site,
 * not Lovable's placeholder.
 */
export function classifySiteResponse(input: SiteResponseInput): SiteVerdict {
  const { status } = input;
  const lovable = lovableServeError(input.headers, input.bodySnippet);
  if (lovable?.noBuild) {
    return {
      ok: false,
      problem: `The host answered ${status}: ${NO_BUILD_ADVICE}`,
    };
  }
  if (lovable) {
    const code = lovable.code ? ` (${lovable.code})` : "";
    return {
      ok: false,
      problem: `The host answered ${status}: Lovable could not serve the site${code}.`,
    };
  }
  if (status >= 200 && status <= 399) return { ok: true, problem: null };
  return { ok: false, problem: `The host answered ${status}.` };
}

/** Plain-object copy of fetch Headers with lower-cased names. */
export function headersToRecord(headers: {
  forEach(cb: (value: string, key: string) => void): void;
}): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    out[key.toLowerCase()] = value;
  });
  return out;
}

function isSiteCheck(v: unknown): v is SiteCheck {
  if (typeof v !== "object" || v === null) return false;
  const c = v as Record<string, unknown>;
  return (
    typeof c.url === "string" &&
    typeof c.checked_at === "string" &&
    Number.isFinite(Date.parse(c.checked_at)) &&
    typeof c.ok === "boolean" &&
    (c.status === null || typeof c.status === "number") &&
    (c.latency_ms === null || typeof c.latency_ms === "number") &&
    (c.final_url === null || typeof c.final_url === "string") &&
    (c.problem === null || typeof c.problem === "string")
  );
}

/**
 * This run's checks followed by the previous history, newest first, keeping
 * at most `perUrl` entries for each address still being checked. Addresses
 * removed from the config drop out of the history.
 */
export function mergeSiteHistory(
  latest: readonly SiteCheck[],
  previousHistory: unknown,
  perUrl: number = SITE_HISTORY_PER_URL,
): SiteCheck[] {
  const current = new Set(latest.map((c) => c.url));
  const earlier = Array.isArray(previousHistory)
    ? previousHistory.filter(isSiteCheck)
    : [];
  const newestFirst = [...latest, ...earlier].sort(
    (a, b) => Date.parse(b.checked_at) - Date.parse(a.checked_at),
  );
  const counts = new Map<string, number>();
  const out: SiteCheck[] = [];
  for (const check of newestFirst) {
    if (!current.has(check.url)) continue;
    const n = counts.get(check.url) ?? 0;
    if (n >= perUrl) continue;
    counts.set(check.url, n + 1);
    out.push(check);
  }
  return out;
}
