import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";

/** Shared helpers for every MCP tool. */

export type ToolTextResult = {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
  structuredContent?: Record<string, unknown>;
};

export const PRICE_NOTE =
  "Prices are the provider's own published prices on the date shown in updated_at and can change. Confirm the final price on the provider's page. For comparison only; not medical advice.";

export function anonClient(): SupabaseClient {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export function userClient(ctx: ToolContext): SupabaseClient {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export function ok(payload: Record<string, unknown>): ToolTextResult {
  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    structuredContent: payload,
  };
}

export function fail(message: string): ToolTextResult {
  return {
    content: [{ type: "text", text: `Error: ${message}` }],
    isError: true,
  };
}

/** Escapes LIKE wildcards so user keywords match literally. */
export function escapeLike(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

/** Builds a quoted PostgREST ilike operand containing a literal keyword. */
export function ilikeContains(keyword: string): string {
  const escaped = escapeLike(keyword)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
  return `"%${escaped}%"`;
}

export const FREE_TEXT_MAX = 200;

export function truncate(value: unknown, max = FREE_TEXT_MAX): string | null {
  if (value == null) return null;
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const IPV4_RE = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
const IPV6_RE = /\b(?:[0-9a-f]{1,4}:){2,7}[0-9a-f]{0,4}\b/gi;

/** Masks email and IP addresses, then truncates. */
export function maskPii(value: unknown, max = FREE_TEXT_MAX): string | null {
  const text = truncate(value, 10_000);
  if (text == null) return null;
  const masked = text
    .replace(EMAIL_RE, "[email masked]")
    .replace(IPV4_RE, "[ip masked]")
    .replace(IPV6_RE, "[ip masked]");
  return truncate(masked, max);
}

export type AccreditationFlags = {
  lab_ukas_accredited: boolean | null;
  lab_cqc_regulated: boolean | null;
  lab_iso15189: boolean | null;
};

/**
 * Inclusion rules: UKAS-accredited and CQC-regulated must be confirmed true.
 * ISO 15189 applies where relevant, so unknown is allowed but an explicit false excludes.
 */
export function inclusionFailures(flags: AccreditationFlags): string[] {
  const reasons: string[] = [];
  if (flags.lab_ukas_accredited !== true)
    reasons.push("UKAS accreditation not confirmed");
  if (flags.lab_cqc_regulated !== true)
    reasons.push("CQC registration not confirmed");
  if (flags.lab_iso15189 === false) reasons.push("ISO 15189 recorded as absent");
  return reasons;
}

export function toNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function biomarkerNames(list: unknown): string[] {
  if (!Array.isArray(list)) return [];
  return list
    .map((item: unknown) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object" && "name" in item) {
        const name = (item as { name: unknown }).name;
        return typeof name === "string" ? name.trim() : "";
      }
      return "";
    })
    .filter((s) => s.length > 0);
}

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
