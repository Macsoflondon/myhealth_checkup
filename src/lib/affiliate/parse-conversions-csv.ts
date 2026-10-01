import { AFFILIATE_PROVIDERS } from "./affiliate-config";

/**
 * Parses an affiliate network CSV export into conversion rows.
 * Header names vary by network, so common aliases are accepted.
 * Dates accept ISO 8601 or UK DD/MM/YYYY (optionally with HH:MM[:SS]).
 */

export type ConversionStatus = "pending" | "confirmed" | "reversed";

export type ConversionRow = {
  click_id: string | null;
  provider_id: string;
  network_reference: string;
  status: ConversionStatus;
  order_value_gbp: number | null;
  commission_gbp: number | null;
  converted_at: string;
};

export type ParseResult = {
  rows: ConversionRow[];
  errors: string[];
  /** Rows dropped because a later row had the same provider and reference. */
  duplicatesDropped: number;
};

const ALIASES: Record<string, keyof ConversionRow> = {
  click_id: "click_id",
  clickid: "click_id",
  subid: "click_id",
  sub_id: "click_id",
  clickref: "click_id",
  utm_content: "click_id",
  provider_id: "provider_id",
  provider: "provider_id",
  network_reference: "network_reference",
  reference: "network_reference",
  order_id: "network_reference",
  order_reference: "network_reference",
  transaction_id: "network_reference",
  status: "status",
  order_value: "order_value_gbp",
  order_value_gbp: "order_value_gbp",
  sale_amount: "order_value_gbp",
  sale_value: "order_value_gbp",
  commission: "commission_gbp",
  commission_gbp: "commission_gbp",
  commission_amount: "commission_gbp",
  converted_at: "converted_at",
  date: "converted_at",
  transaction_date: "converted_at",
  click_date: "converted_at",
};

/** RFC 4180-style splitter: handles quotes, escaped quotes and CRLF. */
export function splitCsv(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((f) => f.trim() !== "")) out.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== "")) out.push(row);
  return out;
}

export function normaliseStatus(raw: string): ConversionStatus | null {
  const s = raw.trim().toLowerCase();
  if (!s || ["pending", "open", "unconfirmed", "awaiting"].includes(s))
    return "pending";
  if (["confirmed", "approved", "validated", "paid", "accepted"].includes(s))
    return "confirmed";
  if (
    [
      "reversed",
      "declined",
      "rejected",
      "cancelled",
      "canceled",
      "void",
    ].includes(s)
  )
    return "reversed";
  return null;
}

export function parseMoney(raw: string): number | null {
  const cleaned = raw.replace(/[£,\s]/g, "").replace(/GBP/i, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

export function parseDate(raw: string): string | null {
  const s = raw.trim();
  const uk =
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(
      s,
    );
  if (uk) {
    const [, d, m, y, hh = "0", mm = "0", ss = "0"] = uk;
    const date = new Date(
      Date.UTC(
        Number(y),
        Number(m) - 1,
        Number(d),
        Number(hh),
        Number(mm),
        Number(ss),
      ),
    );
    if (date.getUTCDate() !== Number(d) || date.getUTCMonth() !== Number(m) - 1)
      return null;
    return date.toISOString();
  }
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

export function parseConversionsCsv(
  text: string,
  defaultProviderId: string | null,
): ParseResult {
  const table = splitCsv(text.replace(/^\uFEFF/, ""));
  const errors: string[] = [];
  if (table.length < 2)
    return {
      rows: [],
      errors: ["The file has no data rows."],
      duplicatesDropped: 0,
    };

  const header = table[0].map(
    (h) =>
      ALIASES[
        h
          .trim()
          .toLowerCase()
          .replace(/[\s-]+/g, "_")
      ] ?? null,
  );
  for (const required of ["network_reference", "converted_at"] as const) {
    if (!header.includes(required))
      errors.push(`Missing a column for ${required.replace("_", " ")}.`);
  }
  if (!header.includes("provider_id") && !defaultProviderId)
    errors.push("Choose a provider, or include a provider column.");
  if (errors.length) return { rows: [], errors, duplicatesDropped: 0 };

  const rows: ConversionRow[] = [];
  table.slice(1).forEach((cells, idx) => {
    const line = idx + 2;
    const get = (k: keyof ConversionRow): string => {
      const i = header.indexOf(k);
      return i >= 0 ? (cells[i] ?? "").trim() : "";
    };
    const reference = get("network_reference");
    const convertedAt = parseDate(get("converted_at"));
    const status = normaliseStatus(get("status"));
    const provider = get("provider_id") || defaultProviderId || "";
    if (!reference) return void errors.push(`Row ${line}: no reference.`);
    if (!convertedAt)
      return void errors.push(`Row ${line}: date not recognised.`);
    if (!status) return void errors.push(`Row ${line}: status not recognised.`);
    if (!provider) return void errors.push(`Row ${line}: no provider.`);
    if (!Object.hasOwn(AFFILIATE_PROVIDERS, provider))
      return void errors.push(`Row ${line}: unknown provider "${provider}".`);
    const click = get("click_id");
    rows.push({
      click_id: click || null,
      provider_id: provider,
      network_reference: reference,
      status,
      order_value_gbp: parseMoney(get("order_value_gbp")),
      commission_gbp: parseMoney(get("commission_gbp")),
      converted_at: convertedAt,
    });
  });
  // Keep the last row for each (provider, reference) so one file never
  // updates the same conversion twice.
  const byKey = new Map<string, ConversionRow>();
  for (const r of rows) {
    const key = `${r.provider_id}\u0000${r.network_reference}`;
    byKey.delete(key);
    byKey.set(key, r);
  }
  const unique = [...byKey.values()];
  return {
    rows: unique,
    errors,
    duplicatesDropped: rows.length - unique.length,
  };
}
