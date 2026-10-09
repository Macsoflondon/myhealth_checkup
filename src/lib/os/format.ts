/** Number, money, percentage and time formatting for the AI OS dashboard (en-GB). */

const intFmt = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const gbpFmt = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});
const gbpWholeFmt = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export function formatInt(n: number | null | undefined): string {
  return n === null || n === undefined || Number.isNaN(n)
    ? "–"
    : intFmt.format(n);
}

export function formatGbp(
  n: number | null | undefined,
  opts: { whole?: boolean } = {},
): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "–";
  return (opts.whole ? gbpWholeFmt : gbpFmt).format(n);
}

/** 0.1234 -> "12.3%". */
export function formatShare(
  ratio: number | null | undefined,
  digits = 1,
): string {
  if (ratio === null || ratio === undefined || Number.isNaN(ratio)) return "–";
  return `${(ratio * 100).toFixed(digits)}%`;
}

export type Delta = {
  /** Change as a ratio of the previous value, null when there is no base. */
  ratio: number | null;
  direction: "up" | "down" | "flat" | "none";
  text: string;
};

/**
 * Change from previous to current. With a zero or missing base there is no
 * meaningful percentage, so the text says "new" or "no change" instead.
 */
export function formatDelta(
  current: number | null | undefined,
  previous: number | null | undefined,
): Delta {
  if (
    current === null ||
    current === undefined ||
    previous === null ||
    previous === undefined
  ) {
    return { ratio: null, direction: "none", text: "no comparison" };
  }
  if (previous === 0) {
    if (current === 0)
      return { ratio: 0, direction: "flat", text: "no change" };
    return {
      ratio: null,
      direction: current > 0 ? "up" : "down",
      text: "new this period",
    };
  }
  // Divide by the size of the base so a negative base (a Stripe net loss)
  // still reads as up when the figure improves.
  const ratio = (current - previous) / Math.abs(previous);
  if (Math.abs(ratio) < 0.005) {
    return { ratio: 0, direction: "flat", text: "no change" };
  }
  const pct = Math.abs(ratio * 100);
  const shown = pct >= 10 ? pct.toFixed(0) : pct.toFixed(1);
  return {
    ratio,
    direction: ratio > 0 ? "up" : "down",
    text: `${ratio > 0 ? "+" : "−"}${shown}% vs previous`,
  };
}

const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
const dateFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  day: "numeric",
  month: "short",
  year: "numeric",
});
const dayFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "UTC",
  day: "numeric",
  month: "short",
});

/** "9 Oct, 14:05" in London time. */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "–";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "–" : dateTimeFmt.format(d);
}

/** "9 Oct 2026" in London time. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "–";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "–" : dateFmt.format(d);
}

/** Axis label for a YYYY-MM-DD calendar day: "9 Oct". */
export function formatDay(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return dayFmt.format(new Date(Date.UTC(y, m - 1, d)));
}

/** "just now", "12 min ago", "3 h ago", "2 days ago". */
export function formatAgo(
  iso: string | null | undefined,
  now: Date = new Date(),
): string {
  if (!iso) return "never";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "never";
  const secs = Math.max(0, Math.round((now.getTime() - t) / 1000));
  if (secs < 60) return "just now";
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return `${days} days ago`;
}

/** Whole days between an instant and now, rounded down. */
export function daysSince(
  iso: string | null | undefined,
  now: Date = new Date(),
): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor((now.getTime() - t) / 86_400_000);
}

/** Readable provider name from a provider id slug. */
const PROVIDER_NAMES: Record<string, string> = {
  medichecks: "Medichecks",
  randox: "Randox Health",
  "goodbody-clinic": "Goodbody Clinic",
  "lola-health": "Lola Health",
  "london-medical-laboratory": "London Medical Laboratory",
  "london-health-company": "London Health Company",
  clinilabs: "Clinilabs",
  "medical-diagnosis": "Medical Diagnosis",
};

export function providerName(id: string): string {
  if (PROVIDER_NAMES[id]) return PROVIDER_NAMES[id];
  return id
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

const PLACEMENT_NAMES: Record<string, string> = {
  card: "Test cards",
  detail: "Test detail pages",
  comparison: "Comparison tables",
  quiz: "Test finder and quiz",
  provider_page: "Provider pages",
  unattributed: "No matching click",
};

export function placementName(id: string): string {
  return PLACEMENT_NAMES[id] ?? id;
}
