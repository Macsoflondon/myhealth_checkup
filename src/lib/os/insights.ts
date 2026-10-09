/**
 * Facts and rule-based insights for the AI OS Command centre.
 *
 * Pure: no React, no Supabase and no clock. The caller passes `now`, so one
 * input always gives the same facts and insights.
 *
 * Facts are the figures the dashboard shows. They are also the only numbers
 * the AI briefing may state: the os-plugins number check drops any line
 * whose numbers are not in the facts it cites. A source that is not
 * connected produces no facts at all, so nothing downstream can mistake
 * "not connected" for zero.
 *
 * Insights are fixed rules over the same input. Each one cites the ids of
 * the facts behind it, and the list is ordered critical, warning, info,
 * positive, keeping rule order within a severity.
 */
import {
  AFFILIATE_PROVIDERS,
  type AffiliateProviderConfig,
} from "@/lib/affiliate/affiliate-config";
import {
  formatDate,
  formatDateTime,
  formatDay,
  formatGbp,
  formatInt,
  providerName,
} from "@/lib/os/format";
import {
  addDays,
  lastNDays,
  osWindow,
  previousNDays,
  rangeDays,
  type OsRange,
} from "@/lib/os/range";
import type {
  ClicksSummary,
  OsFact,
  OsInsightInput,
  OsInsightSeverity,
  OsPluginStatus,
  OsStatusResponse,
  RevenueSummary,
} from "@/lib/os/types";
import {
  getOsPlugin,
  OS_PLUGINS,
  type OsPluginDefinition,
} from "../../../supabase/functions/_shared/os/catalog";
import type {
  Ga4Daily,
  GscDaily,
  MetricoolFollowers,
  MetricoolPosts,
  OsFactUnit,
  SiteCheck,
  SiteStatusChecks,
  SocialNetwork,
  StripeDaily,
} from "../../../supabase/functions/_shared/os/contract";

// ---------------------------------------------------------------------------
// Thresholds (each rule names the constant it uses)
// ---------------------------------------------------------------------------

/** Rule 2: warn when the newest click of any kind is older than this. */
export const STALE_CLICKS_DAYS = 2;
/** Rule 4: smallest change in qualified clicks worth a line, in percent. */
export const CLICK_CHANGE_MIN_PCT = 20;
/** Rule 4: the previous period needs at least this many qualified clicks. */
export const CLICK_CHANGE_MIN_PREVIOUS = 10;
/** Rule 5: share of qualified clicks to one provider that counts as concentrated. */
export const CONCENTRATION_MIN_SHARE_PCT = 60;
/** Rule 5: fewer qualified clicks than this are too few to read a share from. */
export const CONCENTRATION_MIN_QUALIFIED = 20;
/** Rule 9: a connected plugin whose newest data is older than this has stopped syncing. */
export const STALE_SYNC_HOURS = 3;
/** Rule 10: smallest change in GA4 sessions worth a line, in percent. */
export const GA4_CHANGE_MIN_PCT = 20;
/** Rule 10: the previous window needs at least this many sessions. */
export const GA4_CHANGE_MIN_PREVIOUS = 50;
/** Metricool posts payloads hold at most this many posts. */
export const POSTS_CAP = 200;

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const SOURCE = {
  clicks: "First-party click log",
  revenue: "Affiliate conversions",
  ga4: "Google Analytics 4",
  gsc: "Google Search Console",
  social: "Metricool",
  stripe: "Stripe",
  site: "Site status checks",
  plugins: "Plugin status",
  affiliate: "Affiliate link settings",
} as const;

const NETWORKS: readonly SocialNetwork[] = ["facebook", "instagram", "tiktok"];

export const NETWORK_NAMES: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
};

const SEVERITY_RANK: Record<OsInsightSeverity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
  positive: 3,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type InsightInput = {
  range: OsRange;
  /** Window of the first-party figures, e.g. "last 28 days". */
  windowLabel: string;
  now: Date;
  clicks?: ClicksSummary | null;
  revenue?: RevenueSummary | null;
  ga4Daily?: Ga4Daily | null;
  gscDaily?: GscDaily | null;
  followers?: MetricoolFollowers | null;
  posts?: MetricoolPosts | null;
  stripe?: StripeDaily | null;
  site?: SiteStatusChecks | null;
  /**
   * fetched_at of each snapshot, keyed "plugin/dataset". Leave it out while
   * the snapshots are loading or failed to load: rule 9 then stays silent
   * rather than calling every plugin unsynced.
   */
  snapshotsFetchedAt?: Record<string, string | null>;
  pluginStatus?: OsStatusResponse | null;
  /** Affiliate link settings. Defaults to AFFILIATE_PROVIDERS. */
  affiliateProviders?: Readonly<
    Record<string, Pick<AffiliateProviderConfig, "subIdParam">>
  >;
};

export type Insight = OsInsightInput & { id: string; href?: string };

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function isNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function timeOf(iso: string | null | undefined): number | null {
  if (typeof iso !== "string") return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
}

/** Rounds half away from zero to one decimal place, never returning -0. */
export function round1(n: number): number {
  const r = Math.round(Math.abs(n) * 10) / 10;
  return n < 0 && r !== 0 ? -r : r;
}

function round2(n: number): number {
  const r = Math.round(Math.abs(n) * 100) / 100;
  return n < 0 && r !== 0 ? -r : r;
}

/** Percentage change from previous to current, one decimal place. */
function changePct(current: number, previous: number): number {
  return round1(((current - previous) / previous) * 100);
}

/** True when |current - previous| is at least minPct percent of previous. */
function changedBy(current: number, previous: number, minPct: number) {
  // Whole-number arithmetic, so 12 against 10 is exactly 20%.
  return Math.abs(current - previous) * 100 >= minPct * previous;
}

const pctFmt = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });

function pctText(n: number): string {
  return `${pctFmt.format(n)}%`;
}

function plural(n: number, one: string, many: string): string {
  return `${formatInt(n)} ${n === 1 ? one : many}`;
}

function sentence(text: string): string {
  const t = text.trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

function listText(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function sumOf<T>(rows: readonly T[], pick: (row: T) => unknown): number {
  let total = 0;
  for (const row of rows) {
    const v = pick(row);
    if (isNum(v)) total += v;
  }
  return total;
}

function byDate(a: { date: string }, b: { date: string }): number {
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

function dayCount(first: string, last: string): number {
  const [y1, m1, d1] = first.split("-").map(Number);
  const [y2, m2, d2] = last.split("-").map(Number);
  return (
    Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / DAY_MS) +
    1
  );
}

/** "9 Oct, 14:05 London time", or null for a missing or invalid instant. */
function londonTime(iso: string | null | undefined): string | null {
  return timeOf(iso) === null ? null : `${formatDateTime(iso)} London time`;
}

// ---------------------------------------------------------------------------
// Daily series windows (third-party data ends at its own latest day)
// ---------------------------------------------------------------------------

export type DailyWindow<T> = {
  current: T[];
  /** The same number of days just before `current`; null when the series does not reach back that far. */
  previous: T[] | null;
  /** First and last day of `current`, YYYY-MM-DD. */
  first: string;
  last: string;
  /** Days `current` really covers: fewer than asked on a short series. */
  covered: number;
};

/**
 * The last `days` days of a daily series and the window before them,
 * anchored on the series' own latest day. Rows with a malformed date are
 * ignored. Null when there are no usable rows.
 */
export function dailyWindow<T extends { date: string }>(
  rows: readonly T[] | null | undefined,
  days: number,
): DailyWindow<T> | null {
  if (!rows || !Array.isArray(rows)) return null;
  const sorted = (rows as readonly T[])
    .filter((r) => !!r && typeof r.date === "string" && ISO_DATE.test(r.date))
    .sort(byDate);
  if (sorted.length === 0) return null;
  const current = lastNDays(sorted, days);
  if (current.length === 0) return null;
  const first = current[0].date;
  const last = sorted[sorted.length - 1].date;
  const span = dayCount(sorted[0].date, last);
  return {
    current,
    previous: span >= days * 2 ? previousNDays(sorted, days) : null,
    first,
    last,
    covered: Math.min(days, span),
  };
}

/** "28 days to 8 Oct", or "10 days to 8 Oct (no earlier data)". */
function seriesPeriod(w: DailyWindow<unknown>, days: number): string {
  const base = `${w.covered} days to ${formatDay(w.last)}`;
  return w.covered < days ? `${base} (no earlier data)` : base;
}

// ---------------------------------------------------------------------------
// Derived figures, shared by facts and rules
// ---------------------------------------------------------------------------

type FollowerFigures = {
  network: SocialNetwork;
  latest: { date: string; value: number };
  /** Latest value on or before the window's start; null without one. */
  base: { date: string; value: number } | null;
};

type SyncState = {
  plugin: OsPluginDefinition;
  status: OsPluginStatus;
};

type StaleSync = {
  plugin: OsPluginDefinition;
  /** Newest fetched_at across the plugin's datasets; null when it never synced. */
  newest: string | null;
  hours: number | null;
};

type Derived = {
  days: number;
  ga4: {
    w: DailyWindow<Ga4Daily["days"][number]>;
    sessions: number;
    users: number;
    previousSessions: number | null;
  } | null;
  gsc: {
    w: DailyWindow<GscDaily["days"][number]>;
    clicks: number;
    impressions: number;
    previousClicks: number | null;
  } | null;
  followers: FollowerFigures[];
  posts: { count: number; networks: SocialNetwork[] } | null;
  stripe: {
    w: DailyWindow<StripeDaily["days"][number]>;
    net: number;
    gross: number;
  } | null;
  checks: SiteCheck[];
  failing: { check: SiteCheck; n: number }[];
  syncPlugins: SyncState[];
  notConnected: OsPluginDefinition[];
  stale: StaleSync[] | null;
};

function followerFigures(
  followers: MetricoolFollowers | null | undefined,
  days: number,
): FollowerFigures[] {
  const series =
    followers && Array.isArray(followers.series) ? followers.series : [];
  const out: FollowerFigures[] = [];
  for (const network of NETWORKS) {
    for (const s of series) {
      if (!s || s.network !== network || !Array.isArray(s.points)) continue;
      const points = s.points
        .filter(
          (p) =>
            !!p &&
            typeof p.date === "string" &&
            ISO_DATE.test(p.date) &&
            isNum(p.value),
        )
        .sort(byDate);
      if (points.length === 0) continue;
      const latest = points[points.length - 1];
      const cutoff = addDays(latest.date, -days);
      let base: { date: string; value: number } | null = null;
      for (const p of points) {
        if (p.date <= cutoff) base = p;
      }
      // A series shorter than the window starts from its first day.
      if (!base && points[0].date < latest.date) base = points[0];
      out.push({
        network,
        latest: { date: latest.date, value: latest.value },
        base: base ? { date: base.date, value: base.value } : null,
      });
      break;
    }
  }
  return out;
}

function postFigures(
  input: InsightInput,
): { count: number; networks: SocialNetwork[] } | null {
  const posts = input.posts;
  if (!posts || !Array.isArray(posts.posts)) return null;
  const from = osWindow(input.range, input.now).from.getTime();
  const to = input.now.getTime();
  const times = posts.posts
    .map((p) => (p ? timeOf(p.published_at) : null))
    .filter((t): t is number => t !== null);
  // At the cap the payload may stop short of the window's start.
  if (posts.posts.length >= POSTS_CAP) {
    const oldest = times.length > 0 ? Math.min(...times) : null;
    if (oldest === null || oldest > from) return null;
  }
  const networks = Array.isArray(posts.networks)
    ? NETWORKS.filter((n) => posts.networks.includes(n))
    : [];
  return {
    count: times.filter((t) => t >= from && t <= to).length,
    networks,
  };
}

/** The latest check per address, skipping malformed entries. */
export function latestSiteChecks(
  site: SiteStatusChecks | null | undefined,
): SiteCheck[] {
  const latest = site && Array.isArray(site.latest) ? site.latest : [];
  return latest.filter(
    (c) =>
      !!c &&
      typeof c.url === "string" &&
      typeof c.ok === "boolean" &&
      timeOf(c.checked_at) !== null,
  );
}

function syncPluginStates(
  status: OsStatusResponse | null | undefined,
): SyncState[] {
  const list = status && Array.isArray(status.plugins) ? status.plugins : [];
  const seen = new Set<string>();
  const out: SyncState[] = [];
  for (const st of list) {
    if (!st || typeof st.plugin_id !== "string" || seen.has(st.plugin_id)) {
      continue;
    }
    const plugin = getOsPlugin(st.plugin_id);
    if (plugin?.kind !== "sync") continue;
    seen.add(st.plugin_id);
    out.push({ plugin, status: st });
  }
  return out.sort(
    (a, b) => OS_PLUGINS.indexOf(a.plugin) - OS_PLUGINS.indexOf(b.plugin),
  );
}

function staleSyncs(
  input: InsightInput,
  states: readonly SyncState[],
): StaleSync[] | null {
  const fetched = input.snapshotsFetchedAt;
  if (!fetched) return null;
  const now = input.now.getTime();
  const out: StaleSync[] = [];
  for (const { plugin, status } of states) {
    if (!status.ready || !status.enabled || plugin.datasets.length === 0) {
      continue;
    }
    let newest: number | null = null;
    for (const dataset of plugin.datasets) {
      const t = timeOf(fetched[`${plugin.id}/${dataset}`]);
      if (t !== null && (newest === null || t > newest)) newest = t;
    }
    if (newest === null) {
      out.push({ plugin, newest: null, hours: null });
    } else if (now - newest > STALE_SYNC_HOURS * HOUR_MS) {
      out.push({
        plugin,
        newest: new Date(newest).toISOString(),
        hours: Math.floor((now - newest) / HOUR_MS),
      });
    }
  }
  return out;
}

function derive(input: InsightInput): Derived {
  const days = rangeDays(input.range);

  const ga4w = dailyWindow(input.ga4Daily?.days, days);
  const gscw = dailyWindow(input.gscDaily?.days, days);
  const stripew = dailyWindow(input.stripe?.days, days);

  const checks = latestSiteChecks(input.site);
  const syncPlugins = syncPluginStates(input.pluginStatus);

  return {
    days,
    ga4: ga4w && {
      w: ga4w,
      sessions: sumOf(ga4w.current, (d) => d.sessions),
      users: sumOf(ga4w.current, (d) => d.users),
      previousSessions: ga4w.previous
        ? sumOf(ga4w.previous, (d) => d.sessions)
        : null,
    },
    gsc: gscw && {
      w: gscw,
      clicks: sumOf(gscw.current, (d) => d.clicks),
      impressions: sumOf(gscw.current, (d) => d.impressions),
      previousClicks: gscw.previous
        ? sumOf(gscw.previous, (d) => d.clicks)
        : null,
    },
    followers: followerFigures(input.followers, days),
    posts: postFigures(input),
    stripe: stripew && {
      w: stripew,
      net: round2(sumOf(stripew.current, (d) => d.net)),
      gross: round2(sumOf(stripew.current, (d) => d.gross)),
    },
    checks,
    failing: checks
      .map((check, i) => ({ check, n: i + 1 }))
      .filter((x) => !x.check.ok),
    syncPlugins,
    notConnected: syncPlugins
      .filter((s) => !s.status.ready)
      .map((s) => s.plugin),
    stale: staleSyncs(input, syncPlugins),
  };
}

/** Leading provider by qualified clicks, only when it leads outright. */
function topProvider(
  clicks: ClicksSummary,
): { providerId: string; clicks: number } | null {
  const rows = (Array.isArray(clicks.by_provider) ? clicks.by_provider : [])
    .filter((p) => !!p && typeof p.provider_id === "string" && isNum(p.clicks))
    .sort(
      (a, b) =>
        b.clicks - a.clicks || a.provider_id.localeCompare(b.provider_id),
    );
  const [top, second] = rows;
  if (!top || top.clicks <= 0) return null;
  if (second && second.clicks === top.clicks) return null;
  return { providerId: top.provider_id, clicks: top.clicks };
}

function largestBurst(clicks: ClicksSummary) {
  const bursts = Array.isArray(clicks.excluded_bursts)
    ? clicks.excluded_bursts.filter(
        (b) =>
          !!b &&
          typeof b.source_page === "string" &&
          isNum(b.clicks) &&
          timeOf(b.started_at) !== null,
      )
    : [];
  let best: (typeof bursts)[number] | null = null;
  for (const b of bursts) {
    if (!best || b.clicks > best.clicks) best = b;
  }
  return best;
}

function siteStatusText(c: SiteCheck): string {
  return `${isNum(c.status) ? c.status : "No response"} at ${c.url}`;
}

function siteProblem(c: SiteCheck): string {
  if (c.problem && c.problem.trim() !== "") return sentence(c.problem);
  return isNum(c.status)
    ? `The host answered ${c.status}.`
    : "The request got no response.";
}

// ---------------------------------------------------------------------------
// Facts
// ---------------------------------------------------------------------------

/** Every figure the Command centre shows, for the page and the AI briefing. */
export function buildFacts(input: InsightInput): OsFact[] {
  return factsFrom(input, derive(input));
}

type AddFact = (
  id: string,
  label: string,
  value: number | string,
  unit?: OsFactUnit,
  period?: string,
) => void;

/** Adds facts from one source. Values that are not finite numbers or text are skipped. */
function factAdder(out: OsFact[], source: string, period: string): AddFact {
  return (id, label, value, unit = "count", factPeriod = period) => {
    const usable =
      typeof value === "number"
        ? Number.isFinite(value)
        : typeof value === "string" && value !== "";
    if (usable) {
      out.push({ id, label, value, unit, period: factPeriod, source });
    }
  };
}

function clickFacts(add: AddFact, input: InsightInput, d: Derived) {
  const c = input.clicks;
  if (!c || !c.totals || !c.previous) return;
  const { qualified, raw, excluded } = c.totals;
  const previous = c.previous.qualified;
  const allTime = "all recorded clicks";

  add("clicks.qualified", "Qualified provider clicks", qualified);
  add("clicks.raw", "All recorded provider clicks, automated included", raw);
  add("clicks.excluded", "Provider clicks excluded as automated", excluded);
  add(
    "clicks.previous_qualified",
    "Qualified provider clicks in the previous period",
    previous,
    "count",
    `previous ${d.days} days`,
  );
  if (isNum(qualified) && isNum(previous) && previous > 0) {
    add(
      "clicks.change_pct",
      "Change in qualified provider clicks against the previous period",
      changePct(qualified, previous),
      "percent",
    );
  }

  const lastAt = timeOf(c.last_click_at);
  if (lastAt !== null) {
    add(
      "clicks.last_click_at",
      "Last provider click of any kind",
      londonTime(c.last_click_at) ?? "",
      "text",
      allTime,
    );
    add(
      "clicks.days_since_last",
      "Whole days since the last provider click of any kind",
      Math.max(0, Math.floor((input.now.getTime() - lastAt) / DAY_MS)),
      "days",
      allTime,
    );
  }

  const top = topProvider(c);
  if (top && isNum(qualified) && qualified > 0) {
    const name = providerName(top.providerId);
    add(
      "clicks.top_provider",
      "Provider with the most qualified clicks",
      name,
      "text",
    );
    add(
      "clicks.top_provider_share",
      "Share of qualified clicks to the leading provider",
      round1((top.clicks / qualified) * 100),
      "percent",
    );
  }

  const burst = largestBurst(c);
  if (burst) {
    add(
      "clicks.largest_burst_clicks",
      "Clicks in the largest automated sweep",
      burst.clicks,
    );
    add(
      "clicks.largest_burst_page",
      "Page hit by the largest automated sweep",
      burst.source_page,
      "text",
    );
    add(
      "clicks.largest_burst_date",
      "Date of the largest automated sweep",
      formatDate(burst.started_at),
      "text",
    );
  }
}

function revenueFacts(add: AddFact, input: InsightInput, d: Derived) {
  const r = input.revenue;
  if (!r || !r.totals) return;
  const t = r.totals;
  add(
    "revenue.commission",
    "Affiliate commission, confirmed and pending",
    t.commission_gbp,
    "gbp",
  );
  add("revenue.conversions", "Affiliate conversions", t.conversions);
  add(
    "revenue.pending",
    "Commission awaiting confirmation",
    t.commission_pending_gbp,
    "gbp",
  );
  add(
    "revenue.unattributed",
    "Conversions not matched to a provider click",
    t.unattributed,
  );
  if (r.previous) {
    add(
      "revenue.previous_commission",
      "Affiliate commission in the previous period",
      r.previous.commission_gbp,
      "gbp",
      `previous ${d.days} days`,
    );
  }
  add(
    "revenue.last_imported_at",
    "Last conversion import",
    londonTime(r.last_imported_at) ?? "",
    "text",
    "all imports",
  );
}

function trafficFacts(addGa4: AddFact, addGsc: AddFact, d: Derived) {
  const before = `${d.days} days before that`;
  if (d.ga4) {
    const p = seriesPeriod(d.ga4.w, d.days);
    const prev = d.ga4.previousSessions;
    addGa4("ga4.sessions", "GA4 sessions", d.ga4.sessions, "count", p);
    addGa4(
      "ga4.users",
      "GA4 users, each day's users added up",
      d.ga4.users,
      "count",
      p,
    );
    if (prev !== null) {
      addGa4(
        "ga4.previous_sessions",
        "GA4 sessions in the previous window",
        prev,
        "count",
        before,
      );
      if (prev > 0) {
        addGa4(
          "ga4.sessions_change_pct",
          "Change in GA4 sessions against the previous window",
          changePct(d.ga4.sessions, prev),
          "percent",
          p,
        );
      }
    }
  }
  if (d.gsc) {
    const p = seriesPeriod(d.gsc.w, d.days);
    const prev = d.gsc.previousClicks;
    addGsc("gsc.clicks", "Clicks from Google Search", d.gsc.clicks, "count", p);
    addGsc(
      "gsc.impressions",
      "Impressions in Google Search",
      d.gsc.impressions,
      "count",
      p,
    );
    if (prev !== null) {
      addGsc(
        "gsc.previous_clicks",
        "Clicks from Google Search in the previous window",
        prev,
        "count",
        before,
      );
    }
  }
}

function socialFacts(add: AddFact, d: Derived) {
  for (const f of d.followers) {
    const name = NETWORK_NAMES[f.network];
    const id = `social.${f.network}`;
    add(
      `${id}.followers`,
      `${name} followers`,
      f.latest.value,
      "count",
      `on ${formatDay(f.latest.date)}`,
    );
    if (f.base) {
      add(
        `${id}.follower_change`,
        `Change in ${name} followers`,
        f.latest.value - f.base.value,
        "count",
        `${formatDay(f.base.date)} to ${formatDay(f.latest.date)}`,
      );
    }
  }
  if (d.followers.length > 0) {
    const names = d.followers.map((f) => NETWORK_NAMES[f.network]);
    add(
      "social.followers_total",
      `Followers across ${listText(names)}`,
      sumOf(d.followers, (f) => f.latest.value),
      "count",
      "latest daily totals",
    );
  }
  if (d.posts) {
    const names = d.posts.networks.map((n) => NETWORK_NAMES[n]);
    const label =
      names.length > 0
        ? `Posts published on ${listText(names)}`
        : "Social posts published";
    add("social.posts", label, d.posts.count);
  }
}

function stripeFacts(add: AddFact, d: Derived) {
  if (!d.stripe) return;
  const p = seriesPeriod(d.stripe.w, d.days);
  add(
    "stripe.net",
    "Stripe net revenue after fees and refunds",
    d.stripe.net,
    "gbp",
    p,
  );
  add("stripe.gross", "Stripe gross charges", d.stripe.gross, "gbp", p);
}

function siteFacts(add: AddFact, d: Derived) {
  d.checks.forEach((check, i) => {
    const id = `site.${i + 1}`;
    add(
      `${id}.status`,
      `Response from ${check.url}`,
      siteStatusText(check),
      "text",
    );
    add(
      `${id}.checked_at`,
      `When ${check.url} was last checked`,
      londonTime(check.checked_at) ?? "",
      "text",
    );
    if (!check.ok) {
      add(
        `${id}.problem`,
        `Problem at ${check.url}`,
        siteProblem(check),
        "text",
      );
    }
  });
}

function pluginFacts(add: AddFact, input: InsightInput, d: Derived) {
  if (input.pluginStatus) {
    const names = d.notConnected.map((p) => p.name);
    add("plugins.not_connected", "Data sources not connected", names.length);
    add(
      "plugins.not_connected_names",
      "Data sources not connected",
      names.join(", "),
      "text",
    );
  }
  for (const s of d.stale ?? []) {
    const id = `plugins.${s.plugin.id}`;
    if (s.newest === null || s.hours === null) {
      add(
        `${id}.last_synced`,
        `${s.plugin.name} newest data`,
        "never synced",
        "text",
      );
      continue;
    }
    add(
      `${id}.hours_since_sync`,
      `Hours since ${s.plugin.name} last synced`,
      s.hours,
    );
    add(
      `${id}.last_synced`,
      `${s.plugin.name} newest data`,
      londonTime(s.newest) ?? "",
      "text",
    );
  }
}

function affiliateFacts(add: AddFact, input: InsightInput) {
  const providers = Object.values(
    input.affiliateProviders ?? AFFILIATE_PROVIDERS,
  );
  if (providers.length === 0) return;
  add(
    "affiliate.providers",
    "Providers with affiliate link settings",
    providers.length,
  );
  add(
    "affiliate.subid_configured",
    "Providers whose links carry our click id",
    providers.filter(hasSubId).length,
  );
}

function factsFrom(input: InsightInput, d: Derived): OsFact[] {
  const out: OsFact[] = [];
  const period = input.windowLabel;
  const latest = "latest check";
  clickFacts(factAdder(out, SOURCE.clicks, period), input, d);
  revenueFacts(factAdder(out, SOURCE.revenue, period), input, d);
  trafficFacts(
    factAdder(out, SOURCE.ga4, period),
    factAdder(out, SOURCE.gsc, period),
    d,
  );
  socialFacts(factAdder(out, SOURCE.social, period), d);
  stripeFacts(factAdder(out, SOURCE.stripe, period), d);
  siteFacts(factAdder(out, SOURCE.site, latest), d);
  pluginFacts(factAdder(out, SOURCE.plugins, "now"), input, d);
  affiliateFacts(factAdder(out, SOURCE.affiliate, "now"), input);
  return out;
}

function hasSubId(p: Pick<AffiliateProviderConfig, "subIdParam">): boolean {
  return typeof p.subIdParam === "string" && p.subIdParam.trim() !== "";
}

/** A fact's value as the page shows it: "1,234", "£12.50", "64.3%", "5 days". */
export function formatFactValue(fact: OsFact): string {
  if (typeof fact.value === "string") return fact.value;
  switch (fact.unit) {
    case "gbp":
      return formatGbp(fact.value);
    case "percent":
      return pctText(fact.value);
    case "days":
      return plural(fact.value, "day", "days");
    default:
      return formatInt(fact.value);
  }
}

// ---------------------------------------------------------------------------
// Insight rules
// ---------------------------------------------------------------------------

type RuleContext = {
  input: InsightInput;
  d: Derived;
  facts: ReadonlyMap<string, OsFact>;
};

type Rule = (ctx: RuleContext) => Insight[];

/** The ids that exist in the facts, in the order given. */
function cite(ctx: RuleContext, ids: readonly string[]): string[] {
  return ids.filter((id) => ctx.facts.has(id));
}

function numFact(ctx: RuleContext, id: string): number | null {
  const v = ctx.facts.get(id)?.value;
  return isNum(v) ? v : null;
}

/** Rule 1 (critical): the latest site check failed. */
function siteDownRule(ctx: RuleContext): Insight[] {
  const { checks, failing } = ctx.d;
  if (failing.length === 0) return [];

  const groups = new Map<string, SiteCheck[]>();
  for (const { check } of failing) {
    const key = siteProblem(check);
    groups.set(key, [...(groups.get(key) ?? []), check]);
  }
  const detail = [...groups.entries()]
    .map(([problem, group]) => {
      const newest = group.reduce((a, b) =>
        (timeOf(b.checked_at) ?? 0) > (timeOf(a.checked_at) ?? 0) ? b : a,
      );
      return `${problem} Checked ${londonTime(newest.checked_at)} at ${listText(group.map((g) => g.url))}.`;
    })
    .join(" ");

  const title =
    failing.length === checks.length
      ? "The public site is not serving pages"
      : `${failing.length} of ${checks.length} site addresses are not serving pages`;

  return [
    {
      id: "site.down",
      severity: "critical",
      title,
      detail,
      fact_ids: cite(
        ctx,
        failing.flatMap(({ n }) => [
          `site.${n}.status`,
          `site.${n}.problem`,
          `site.${n}.checked_at`,
        ]),
      ),
      href: "/control/plugins",
    },
  ];
}

/** Rule 2 (warning): no provider click of any kind for over STALE_CLICKS_DAYS. */
function clicksStalledRule(ctx: RuleContext): Insight[] {
  const clicks = ctx.input.clicks;
  if (!clicks) return [];
  const siteDown = ctx.d.failing.length > 0;
  const next = siteDown
    ? "The public site is not serving pages, so clicks will stay at zero until it is back."
    : "Check that the public site is published and that the click endpoint, /api/public/affiliate-click, is reachable.";
  const siteIds = siteDown
    ? ctx.d.failing.flatMap(({ n }) => [`site.${n}.status`])
    : [];

  if (clicks.last_click_at === null || clicks.last_click_at === undefined) {
    return [
      {
        id: "clicks.stalled",
        severity: "warning",
        title: "No provider clicks recorded yet",
        detail: `The click log has no clicks at all. ${next}`,
        fact_ids: cite(ctx, ["clicks.raw", ...siteIds]),
        href: "/control/clicks",
      },
    ];
  }

  const last = timeOf(clicks.last_click_at);
  if (last === null) return [];
  const elapsed = ctx.input.now.getTime() - last;
  if (!(elapsed > STALE_CLICKS_DAYS * DAY_MS)) return [];
  const days = Math.floor(elapsed / DAY_MS);

  return [
    {
      id: "clicks.stalled",
      severity: "warning",
      title: `No provider clicks for ${plural(days, "day", "days")}`,
      detail: `The last click of any kind was at ${londonTime(clicks.last_click_at)}. ${next}`,
      fact_ids: cite(ctx, [
        "clicks.days_since_last",
        "clicks.last_click_at",
        ...siteIds,
      ]),
      href: "/control/clicks",
    },
  ];
}

/** Rule 3 (info): automated clicks were excluded from qualified clicks. */
function excludedClicksRule(ctx: RuleContext): Insight[] {
  const clicks = ctx.input.clicks;
  const excluded = clicks?.totals?.excluded;
  if (!clicks || !isNum(excluded) || excluded <= 0) return [];
  const burst = largestBurst(clicks);
  const lead = burst
    ? `The largest sweep was ${plural(burst.clicks, "click", "clicks")} on ${burst.source_page} on ${formatDate(burst.started_at)}.`
    : "They came from automation browsers or crawlers flagged on arrival.";
  return [
    {
      id: "clicks.excluded",
      severity: "info",
      title: `${plural(excluded, "automated click", "automated clicks")} excluded`,
      detail: `${lead} Excluded clicks stay in the recorded total and out of qualified clicks.`,
      fact_ids: cite(ctx, [
        "clicks.excluded",
        "clicks.raw",
        "clicks.largest_burst_clicks",
        "clicks.largest_burst_page",
        "clicks.largest_burst_date",
      ]),
      href: "/control/clicks",
    },
  ];
}

/** Rule 4 (warning or positive): qualified clicks moved by CLICK_CHANGE_MIN_PCT or more. */
function clickChangeRule(ctx: RuleContext): Insight[] {
  const clicks = ctx.input.clicks;
  const current = clicks?.totals?.qualified;
  const previous = clicks?.previous?.qualified;
  if (!isNum(current) || !isNum(previous)) return [];
  if (previous < CLICK_CHANGE_MIN_PREVIOUS) return [];
  if (!changedBy(current, previous, CLICK_CHANGE_MIN_PCT)) return [];
  const pct = changePct(current, previous);
  const up = current > previous;
  return [
    {
      id: "clicks.change",
      severity: up ? "positive" : "warning",
      title: `Qualified clicks ${up ? "up" : "down"} ${pctText(Math.abs(pct))}`,
      detail: `${plural(current, "qualified click", "qualified clicks")} in the ${ctx.input.windowLabel}, against ${formatInt(previous)} in the ${ctx.d.days} days before.`,
      fact_ids: cite(ctx, [
        "clicks.change_pct",
        "clicks.qualified",
        "clicks.previous_qualified",
      ]),
      href: "/control/clicks",
    },
  ];
}

/**
 * Rule 5 (info): one provider took CONCENTRATION_MIN_SHARE_PCT or more of
 * qualified clicks. Worded as a description of visitor choices only:
 * rankings stay independent of commercial results.
 */
function concentrationRule(ctx: RuleContext): Insight[] {
  const clicks = ctx.input.clicks;
  const qualified = clicks?.totals?.qualified;
  if (!clicks || !isNum(qualified)) return [];
  if (qualified < CONCENTRATION_MIN_QUALIFIED) return [];
  const top = topProvider(clicks);
  if (!top) return [];
  if (top.clicks * 100 < CONCENTRATION_MIN_SHARE_PCT * qualified) return [];
  const name = providerName(top.providerId);
  const share = round1((top.clicks / qualified) * 100);
  return [
    {
      id: "clicks.concentration",
      severity: "info",
      title: `${name} received ${pctText(share)} of qualified clicks`,
      detail: `${formatInt(top.clicks)} of ${formatInt(qualified)} qualified clicks in the ${ctx.input.windowLabel} went to ${name}. This describes where visitors chose to click. Rankings and listings stay independent of it.`,
      fact_ids: cite(ctx, [
        "clicks.top_provider",
        "clicks.top_provider_share",
        "clicks.qualified",
      ]),
      href: "/control/clicks",
    },
  ];
}

/** Rule 6 (info): no provider's links carry our click id. */
function subIdRule(ctx: RuleContext): Insight[] {
  const providers = Object.values(
    ctx.input.affiliateProviders ?? AFFILIATE_PROVIDERS,
  );
  if (providers.length === 0 || providers.some(hasSubId)) return [];
  const unattributed = numFact(ctx, "revenue.unattributed");
  const lead =
    unattributed !== null && unattributed > 0
      ? `${plural(unattributed, "conversion", "conversions")} in the ${ctx.input.windowLabel} could not be traced to a click. `
      : "";
  return [
    {
      id: "revenue.unmatched",
      severity: "info",
      title: "Conversions cannot be matched to clicks yet",
      detail: `${lead}Outbound provider links do not carry our click id, so a conversion cannot be traced to the page or test that sent the visitor. Set subIdParam for each network in src/lib/affiliate/affiliate-config.ts (Awin uses clickref).`,
      fact_ids: cite(ctx, [
        "affiliate.subid_configured",
        "affiliate.providers",
        "revenue.unattributed",
      ]),
      href: "/control/revenue",
    },
  ];
}

/** Rule 7 (info): the revenue summary loaded but nothing was ever imported. */
function noConversionsRule(ctx: RuleContext): Insight[] {
  const revenue = ctx.input.revenue;
  if (!revenue || !revenue.totals) return [];
  if (revenue.totals.conversions !== 0 || revenue.last_imported_at) return [];
  return [
    {
      id: "revenue.none",
      severity: "info",
      title: "No conversions recorded yet",
      detail:
        "No affiliate conversions have been imported or synced. Import a network report on the Affiliate admin page, or connect Awin in Plugins.",
      fact_ids: cite(ctx, ["revenue.conversions", "revenue.commission"]),
      href: "/control/revenue",
    },
  ];
}

/** Rule 8 (info): sync plugins that are not ready. */
function notConnectedRule(ctx: RuleContext): Insight[] {
  const missing = ctx.d.notConnected;
  if (!ctx.input.pluginStatus || missing.length === 0) return [];
  return [
    {
      id: "plugins.not_connected",
      severity: "info",
      title: `${plural(missing.length, "data source", "data sources")} not connected`,
      detail: `${listText(missing.map((p) => p.name))}. Add their credentials and settings in Plugins to bring their figures into the dashboard.`,
      fact_ids: cite(ctx, [
        "plugins.not_connected",
        "plugins.not_connected_names",
      ]),
      href: "/control/plugins",
    },
  ];
}

/** Rule 9 (warning): a connected plugin's newest data is older than STALE_SYNC_HOURS. */
function staleSyncRule(ctx: RuleContext): Insight[] {
  return (ctx.d.stale ?? []).map((s): Insight => {
    if (s.newest === null || s.hours === null) {
      return {
        id: `plugins.stale.${s.plugin.id}`,
        severity: "warning",
        title: `${s.plugin.name} has not synced yet`,
        detail:
          "It is connected but no data has arrived. Run a sync in Plugins, or wait for the hourly sync, and check the sync log if nothing appears.",
        fact_ids: cite(ctx, [`plugins.${s.plugin.id}.last_synced`]),
        href: "/control/plugins",
      };
    }
    return {
      id: `plugins.stale.${s.plugin.id}`,
      severity: "warning",
      title: `${s.plugin.name} has not synced for ${plural(s.hours, "hour", "hours")}`,
      detail: `Its newest data is from ${londonTime(s.newest)}. The sync runs hourly, so check the sync log in Plugins for an error.`,
      fact_ids: cite(ctx, [
        `plugins.${s.plugin.id}.hours_since_sync`,
        `plugins.${s.plugin.id}.last_synced`,
      ]),
      href: "/control/plugins",
    };
  });
}

/** Rule 10 (positive or warning): GA4 sessions moved by GA4_CHANGE_MIN_PCT or more. */
function ga4ChangeRule(ctx: RuleContext): Insight[] {
  const ga4 = ctx.d.ga4;
  if (!ga4 || ga4.previousSessions === null) return [];
  const previous = ga4.previousSessions;
  if (previous < GA4_CHANGE_MIN_PREVIOUS) return [];
  if (!changedBy(ga4.sessions, previous, GA4_CHANGE_MIN_PCT)) return [];
  const up = ga4.sessions > previous;
  const pct = changePct(ga4.sessions, previous);
  return [
    {
      id: "ga4.sessions_change",
      severity: up ? "positive" : "warning",
      title: `Website sessions ${up ? "up" : "down"} ${pctText(Math.abs(pct))}`,
      detail: `Google Analytics 4 (GA4) recorded ${plural(ga4.sessions, "session", "sessions")} in the ${seriesPeriod(ga4.w, ctx.d.days)}, against ${formatInt(previous)} in the ${ctx.d.days} days before.`,
      fact_ids: cite(ctx, [
        "ga4.sessions_change_pct",
        "ga4.sessions",
        "ga4.previous_sessions",
      ]),
      href: "/control/traffic",
    },
  ];
}

/** Rule 11 (positive): a network gained followers over the window. */
function followerGainRule(ctx: RuleContext): Insight[] {
  const out: Insight[] = [];
  for (const f of ctx.d.followers) {
    if (!f.base) continue;
    const gained = f.latest.value - f.base.value;
    if (!(gained > 0)) continue;
    const name = NETWORK_NAMES[f.network];
    out.push({
      id: `social.${f.network}.gained`,
      severity: "positive",
      title: `${name} gained ${plural(gained, "follower", "followers")}`,
      detail: `${name} followers went from ${formatInt(f.base.value)} on ${formatDay(f.base.date)} to ${formatInt(f.latest.value)} on ${formatDay(f.latest.date)}.`,
      fact_ids: cite(ctx, [
        `social.${f.network}.follower_change`,
        `social.${f.network}.followers`,
      ]),
      href: "/control/social",
    });
  }
  return out;
}

/** Every rule, in the order insights of equal severity are listed. */
const INSIGHT_RULES: readonly Rule[] = [
  siteDownRule,
  clicksStalledRule,
  excludedClicksRule,
  clickChangeRule,
  concentrationRule,
  subIdRule,
  noConversionsRule,
  notConnectedRule,
  staleSyncRule,
  ga4ChangeRule,
  followerGainRule,
];

/**
 * Rule-based insights, ordered critical, warning, info, positive. Pass the
 * facts from buildFacts(input) to skip building them twice.
 */
export function buildInsights(
  input: InsightInput,
  facts?: readonly OsFact[],
): Insight[] {
  const d = derive(input);
  const list = facts ?? factsFrom(input, d);
  const ctx: RuleContext = {
    input,
    d,
    facts: new Map(list.map((f) => [f.id, f])),
  };
  return INSIGHT_RULES.flatMap((rule) => rule(ctx)).sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
  );
}

/** The insight fields the os-plugins briefing accepts. */
export function toInsightInputs(
  insights: readonly Insight[],
): OsInsightInput[] {
  return insights.map(({ severity, title, detail, fact_ids }) => ({
    severity,
    title,
    detail,
    fact_ids,
  }));
}
