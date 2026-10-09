/**
 * Command centre: the AI OS home. The AI briefing (or the rule-based
 * insights when Claude is not connected), everything that needs attention,
 * headline figures from every source, and the state of each data source.
 *
 * Facts and insights come from src/lib/os/insights.ts, so the briefing, the
 * attention list and the tiles quote the same numbers. Each block loads and
 * fails on its own: a failed RPC shows an error in its tile or panel only,
 * and the briefing never holds up the rest of the page.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  ErrorNote,
  KpiGrid,
  KpiTile,
  Limitations,
  LoadingRows,
  Panel,
  StatusPill,
  type StatusTone,
} from "@/components/os/ui";
import {
  useBriefing,
  useClicksSummary,
  useOsRange,
  useOsWindow,
  usePluginSnapshots,
  usePluginStatus,
  useRevenueSummary,
  useSyncLog,
} from "@/hooks/os/useOs";
import {
  formatAgo,
  formatDateTime,
  formatDelta,
  formatGbp,
  formatInt,
  type Delta,
} from "@/lib/os/format";
import {
  buildFacts,
  buildInsights,
  formatFactValue,
  latestSiteChecks,
  NETWORK_NAMES,
  toInsightInputs,
  type Insight,
  type InsightInput,
} from "@/lib/os/insights";
import type {
  ClicksSummary,
  OsBriefResponse,
  OsFact,
  OsInsightSeverity,
  OsPluginStatus,
  OsStatusResponse,
  PluginSnapshotRow,
  PluginSyncLogRow,
  RevenueSummary,
} from "@/lib/os/types";
import { Link } from "@/lib/router-compat";
import {
  getOsPlugin,
  OS_PLUGINS,
  type OsPluginDefinition,
} from "../../../../supabase/functions/_shared/os/catalog";
import type {
  Ga4Daily,
  GscDaily,
  MetricoolFollowers,
  MetricoolPosts,
  SiteStatusChecks,
  SocialNetwork,
  StripeDaily,
} from "../../../../supabase/functions/_shared/os/contract";

const PLUGINS_HREF = "/control/plugins";
/** Insights shown in place of the AI briefing when it is off or failed. */
const FALLBACK_INSIGHTS = 5;
/** How often relative times and day counts on this page move on. */
const CLOCK_TICK_MS = 60_000;

const SEVERITY_PILL: Record<
  OsInsightSeverity,
  { tone: StatusTone; label: string }
> = {
  critical: { tone: "error", label: "Critical" },
  warning: { tone: "warn", label: "Warning" },
  info: { tone: "idle", label: "Note" },
  positive: { tone: "ok", label: "Good news" },
};

const LINK_LABELS: Record<string, string> = {
  "/control/plugins": "Open Plugins",
  "/control/clicks": "Open Provider clicks",
  "/control/revenue": "Open Revenue",
  "/control/traffic": "Open Traffic and search",
  "/control/social": "Open Social media",
};

const AI_OFF_NOTE =
  "AI briefing is off: add an Anthropic API key in Plugins to turn it on.";

const LIMITATIONS = [
  "Insights come from fixed rules in src/lib/os/insights.ts. They flag problems and changes; they do not explain causes.",
  "Provider clicks and commission are live and include today so far. Google Analytics, Search Console and social figures cover complete days up to their last hourly sync.",
  "Google Analytics 4 (GA4) user totals add up each day's users, so someone who visits on two days counts twice.",
  ...(getOsPlugin("ai_briefing")?.limitations ?? []),
];

type QueryState<T> = { data: T | undefined; error: unknown; loading: boolean };

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CommandSection() {
  const [range] = useOsRange();
  const win = useOsWindow(range);
  const now = useNow(CLOCK_TICK_MS);
  const clicks = useClicksSummary(range);
  const revenue = useRevenueSummary(range);
  const snapshots = usePluginSnapshots();
  const status = usePluginStatus();
  const syncLog = useSyncLog();

  const rows = snapshots.data;
  const input = useMemo<InsightInput>(
    () => ({
      range,
      windowLabel: win.label,
      now,
      clicks: clicks.data ?? null,
      revenue: revenue.data ?? null,
      ga4Daily: snapshotPayload<Ga4Daily>(rows, "ga4", "daily"),
      gscDaily: snapshotPayload<GscDaily>(rows, "search_console", "daily"),
      followers: snapshotPayload<MetricoolFollowers>(
        rows,
        "metricool",
        "followers",
      ),
      posts: snapshotPayload<MetricoolPosts>(rows, "metricool", "posts"),
      stripe: snapshotPayload<StripeDaily>(rows, "stripe", "daily"),
      site: snapshotPayload<SiteStatusChecks>(rows, "site_status", "checks"),
      snapshotsFetchedAt: rows ? fetchedAtByDataset(rows) : undefined,
      pluginStatus: status.data ?? null,
    }),
    [range, win.label, now, clicks.data, revenue.data, rows, status.data],
  );
  const facts = useMemo(() => buildFacts(input), [input]);
  const insights = useMemo(() => buildInsights(input, facts), [input, facts]);
  const briefInsights = useMemo(() => toInsightInputs(insights), [insights]);

  // Ask Claude only once every source has answered, so one page view makes
  // one briefing request rather than one per arriving query.
  const settled =
    !clicks.isLoading &&
    !revenue.isLoading &&
    !snapshots.isLoading &&
    !status.isLoading;
  const aiAvailable = status.data?.ai_available === true;
  const briefing = useBriefing(facts, briefInsights, aiAvailable && settled);

  const clicksState: QueryState<ClicksSummary> = {
    data: clicks.data,
    error: clicks.error,
    loading: clicks.isLoading,
  };
  const revenueState: QueryState<RevenueSummary> = {
    data: revenue.data,
    error: revenue.error,
    loading: revenue.isLoading,
  };
  const snapshotState: QueryState<PluginSnapshotRow[]> = {
    data: rows,
    error: snapshots.error,
    loading: snapshots.isLoading,
  };
  const statusState: QueryState<OsStatusResponse> = {
    data: status.data,
    error: status.error,
    loading: status.isLoading,
  };
  const incomplete =
    (!!clicks.error && !clicks.data) ||
    (!!revenue.error && !revenue.data) ||
    (!!snapshots.error && !rows) ||
    (!!status.error && !status.data);
  const nowIso = now.toISOString();

  return (
    <div className="space-y-6">
      <BriefingPanel
        loading={!settled}
        status={statusState}
        brief={briefing.data}
        briefLoading={aiAvailable && briefing.isLoading}
        briefError={briefing.error}
        facts={facts}
        insights={insights}
        windowLabel={win.label}
        nowIso={nowIso}
      />

      <Panel
        title="Needs attention"
        subtitle="Problems first, then changes worth knowing about."
        source={{
          label: "Fixed rules applied to the figures on this page",
          updatedAt: nowIso,
          window: win.label,
        }}
      >
        {insights.length > 0 ? (
          <InsightList items={insights} />
        ) : settled ? (
          <EmptyState title="Nothing needs attention">
            No rule found a problem or a notable change in the figures that
            loaded.
          </EmptyState>
        ) : null}
        {!settled && (
          <div className={insights.length > 0 ? "mt-3" : undefined}>
            <LoadingRows rows={insights.length > 0 ? 1 : 4} />
          </div>
        )}
        {settled && incomplete && (
          <p className="mt-3 text-xs text-muted-foreground">
            Some figures did not load, so this list may be incomplete. The
            panels below show which.
          </p>
        )}
      </Panel>

      <section aria-labelledby="command-headlines" className="space-y-2">
        <h2 id="command-headlines" className="sr-only">
          Headline figures
        </h2>
        <KpiGrid>
          {headlineTiles({
            facts,
            clicks: clicksState,
            revenue: revenueState,
            snapshots: snapshotState,
            status: statusState,
            site: input.site ?? null,
            windowLabel: win.label,
            now,
          }).map(({ key, to, ...tile }) => (
            <TileLink key={key} to={to}>
              <KpiTile {...tile} />
            </TileLink>
          ))}
        </KpiGrid>
        <p className="text-[11px] leading-snug text-muted-foreground">
          Clicks and commission come live from our own database for the{" "}
          {win.label}. Google Analytics 4, Search Console and Metricool figures
          come from the last hourly sync and cover complete days. Site status is
          the latest hourly check.
        </p>
      </section>

      <DataSourcesPanel
        rows={sourceRows({
          clicks: clicksState,
          revenue: revenueState,
          snapshots: rows,
          status: statusState,
          syncLog: syncLog.data,
          brief: briefing.data,
          now,
        })}
        status={statusState}
      />

      <Limitations items={LIMITATIONS} />
    </div>
  );
}

/** The current time, moved on every `intervalMs`. */
function useNow(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

function snapshotPayload<T>(
  rows: readonly PluginSnapshotRow[] | undefined,
  pluginId: string,
  dataset: string,
): T | null {
  const payload = rows?.find(
    (r) => r.plugin_id === pluginId && r.dataset === dataset,
  )?.payload;
  return payload !== null && typeof payload === "object"
    ? (payload as T)
    : null;
}

function fetchedAtByDataset(
  rows: readonly PluginSnapshotRow[],
): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const r of rows) out[`${r.plugin_id}/${r.dataset}`] = r.fetched_at;
  return out;
}

function newestFetch(
  rows: readonly PluginSnapshotRow[] | undefined,
  pluginId: string,
): string | null {
  let newest: string | null = null;
  let newestMs = -Infinity;
  for (const r of rows ?? []) {
    if (r.plugin_id !== pluginId) continue;
    const t = Date.parse(r.fetched_at);
    if (Number.isFinite(t) && t > newestMs) {
      newest = r.fetched_at;
      newestMs = t;
    }
  }
  return newest;
}

/** Text ending in a full stop. */
function sentence(text: string): string {
  const t = text.trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

/** An error's message as one sentence. */
function errorSentence(error: unknown): string {
  return sentence(
    error instanceof Error && error.message.trim() !== ""
      ? error.message
      : "Something went wrong",
  );
}

// ---------------------------------------------------------------------------
// AI briefing
// ---------------------------------------------------------------------------

function BriefingPanel({
  loading,
  status,
  brief,
  briefLoading,
  briefError,
  facts,
  insights,
  windowLabel,
  nowIso,
}: {
  loading: boolean;
  status: QueryState<OsStatusResponse>;
  brief: OsBriefResponse | undefined;
  briefLoading: boolean;
  briefError: unknown;
  facts: OsFact[];
  insights: Insight[];
  windowLabel: string;
  nowIso: string;
}) {
  if (loading || briefLoading) {
    return (
      <Panel
        title="AI briefing"
        subtitle={
          briefLoading
            ? "Claude is writing a summary of the figures on this page."
            : "Loading the figures."
        }
      >
        <LoadingRows rows={4} />
      </Panel>
    );
  }

  if (brief && brief.mode === "ai" && brief.points.length > 0) {
    return <AiBriefing brief={brief} facts={facts} />;
  }

  const aiAvailable = status.data?.ai_available === true;
  let note: string;
  let showPluginsLink = false;
  if (!status.data && status.error) {
    note = `The AI briefing could not be checked: ${errorSentence(status.error)} Showing the rule-based insights instead.`;
  } else if (!aiAvailable) {
    note = AI_OFF_NOTE;
    showPluginsLink = true;
  } else if (briefError) {
    note = `The AI briefing failed: ${errorSentence(briefError)} Showing the rule-based insights instead.`;
  } else if (!brief) {
    note =
      "There are no figures for Claude to summarise yet, so the rule-based insights are shown.";
  } else if (brief.mode === "unavailable") {
    note = AI_OFF_NOTE;
    showPluginsLink = true;
  } else {
    const removed =
      brief.dropped > 0 ? ` (${formatInt(brief.dropped)} removed)` : "";
    note = `The AI briefing failed: ${sentence(brief.reason || "No reason was given")}${removed} Showing the rule-based insights instead.`;
  }

  const shown = insights.slice(0, FALLBACK_INSIGHTS);
  return (
    <Panel
      title="AI briefing"
      actions={<StatusPill tone="idle">Rule-based</StatusPill>}
      source={{
        label: "Rule-based insights from the figures on this page",
        updatedAt: nowIso,
        window: windowLabel,
      }}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2">
          <p className="min-w-0 flex-1 text-xs text-muted-foreground">{note}</p>
          {showPluginsLink && (
            <Button asChild variant="outline" size="sm" className="h-10">
              <Link to={PLUGINS_HREF}>Open Plugins</Link>
            </Button>
          )}
        </div>
        {shown.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No rule found a problem or a notable change in the figures that
            loaded.
          </p>
        ) : (
          <InsightList items={shown} />
        )}
        {insights.length > shown.length && (
          <p className="text-xs text-muted-foreground">
            The top {formatInt(shown.length)} of {formatInt(insights.length)}.
            Needs attention lists them all.
          </p>
        )}
      </div>
    </Panel>
  );
}

function AiBriefing({
  brief,
  facts,
}: {
  brief: OsBriefResponse;
  facts: OsFact[];
}) {
  const byId = new Map(facts.map((f) => [f.id, f]));
  return (
    <Panel
      title="AI briefing"
      actions={<StatusPill tone="ok">Written by Claude</StatusPill>}
      source={{
        label: `Claude, model ${brief.model ?? "not reported"}`,
        updatedAt: brief.generated_at,
      }}
    >
      <div className="space-y-4">
        {brief.headline && (
          <p className="text-base font-semibold leading-snug">
            {brief.headline}
          </p>
        )}
        <ul className="space-y-3">
          {brief.points.map((point, i) => {
            const cited = point.fact_ids
              .map((id) => byId.get(id))
              .filter((f): f is OsFact => f !== undefined);
            return (
              <li key={`${i}:${point.text}`} className="min-w-0">
                <p className="text-sm leading-relaxed">{point.text}</p>
                <p className="mt-1 break-words text-xs text-muted-foreground">
                  {cited.length > 0
                    ? `From: ${cited.map(citeFact).join(" · ")}`
                    : "The figures this line cites are no longer on the page."}
                </p>
              </li>
            );
          })}
        </ul>
        <p className="text-[11px] leading-snug text-muted-foreground">
          Written by Claude from the figures on this page. Lines whose numbers
          did not match a figure were removed ({formatInt(brief.dropped)}{" "}
          removed).
        </p>
      </div>
    </Panel>
  );
}

function citeFact(f: OsFact): string {
  const period = f.period ? ` (${f.period})` : "";
  return `${f.label}: ${formatFactValue(f)}${period}`;
}

// ---------------------------------------------------------------------------
// Insight list
// ---------------------------------------------------------------------------

function InsightList({ items }: { items: Insight[] }) {
  return (
    <ul className="divide-y">
      {items.map((item) => {
        const pill = SEVERITY_PILL[item.severity];
        return (
          <li
            key={item.id}
            className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-3"
          >
            <div className="shrink-0 sm:w-28 sm:pt-0.5">
              <StatusPill tone={pill.tone}>{pill.label}</StatusPill>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug">{item.title}</p>
              <p className="mt-0.5 break-words text-xs leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
              {item.href && (
                <Link
                  to={item.href}
                  className="mt-1 inline-flex min-h-10 items-center gap-1 text-xs font-medium underline-offset-2 hover:underline"
                >
                  {LINK_LABELS[item.href] ?? "Open"}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Headline tiles
// ---------------------------------------------------------------------------

type TileModel = {
  key: string;
  to: string;
  label: string;
  value: ReactNode;
  delta?: Delta;
  goodWhen?: "up" | "down";
  hint?: ReactNode;
  loading?: boolean;
};

function TileLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="block min-w-0 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&>div]:h-full hover:[&>div]:bg-muted/40"
    >
      {children}
    </Link>
  );
}

/** A quieter value for states such as "Not connected", sized to fit a phone. */
function QuietValue({ children }: { children: ReactNode }) {
  return (
    <span className="text-base font-medium text-muted-foreground">
      {children}
    </span>
  );
}

function numValue(f: OsFact | undefined): number | null {
  return f && typeof f.value === "number" ? f.value : null;
}

function errorTile(
  key: string,
  label: string,
  to: string,
  error: unknown,
): TileModel {
  return {
    key,
    label,
    to,
    value: <QuietValue>Not loaded</QuietValue>,
    hint: <ErrorNote error={error} />,
  };
}

/**
 * A third-party tile with no figures: says whether the plugin is not
 * connected, turned off or connected but waiting for data. Never a zero.
 */
function missingTile(
  key: string,
  label: string,
  pluginId: string,
  name: string,
  status: QueryState<OsStatusResponse>,
  hasSnapshot: boolean,
): TileModel {
  const st = status.data?.plugins.find((p) => p.plugin_id === pluginId);
  if (st?.ready && st.enabled) {
    return {
      key,
      label,
      to: PLUGINS_HREF,
      value: <QuietValue>No data yet</QuietValue>,
      hint: hasSnapshot
        ? `The last ${name} sync returned no figures. Check its settings in Plugins.`
        : "Connected. Figures appear after the next hourly sync.",
    };
  }
  if (st?.ready && !st.enabled) {
    return {
      key,
      label,
      to: PLUGINS_HREF,
      value: <QuietValue>Turned off</QuietValue>,
      hint: `Turn ${name} on in Plugins`,
    };
  }
  if (!st && !status.data) {
    return {
      key,
      label,
      to: PLUGINS_HREF,
      value: <QuietValue>No data</QuietValue>,
      hint: `Nothing has synced from ${name}. Check it in Plugins.`,
    };
  }
  return {
    key,
    label,
    to: PLUGINS_HREF,
    value: <QuietValue>Not connected</QuietValue>,
    hint: `Connect ${name} in Plugins`,
  };
}

function headlineTiles({
  facts,
  clicks,
  revenue,
  snapshots,
  status,
  site,
  windowLabel,
  now,
}: {
  facts: OsFact[];
  clicks: QueryState<ClicksSummary>;
  revenue: QueryState<RevenueSummary>;
  snapshots: QueryState<PluginSnapshotRow[]>;
  status: QueryState<OsStatusResponse>;
  site: SiteStatusChecks | null;
  windowLabel: string;
  now: Date;
}): TileModel[] {
  const f = new Map(facts.map((x) => [x.id, x]));
  const hasRows = (pluginId: string) =>
    (snapshots.data ?? []).some((r) => r.plugin_id === pluginId);

  /** Tile for a snapshot-backed source, in its loading or error state. */
  const snapshotFallback = (
    key: string,
    label: string,
    to: string,
  ): TileModel | null => {
    if (snapshots.loading) {
      return { key, label, to, value: null, loading: true };
    }
    if (!snapshots.data && snapshots.error) {
      return errorTile(key, label, to, snapshots.error);
    }
    return null;
  };

  // Qualified provider clicks
  const clicksLabel = "Qualified provider clicks";
  let clicksTile: TileModel;
  if (clicks.data) {
    const { totals, previous } = clicks.data;
    clicksTile = {
      key: "clicks",
      label: clicksLabel,
      to: "/control/clicks",
      value: formatInt(totals.qualified),
      delta: formatDelta(totals.qualified, previous.qualified),
      hint: `${formatInt(totals.raw)} recorded, ${formatInt(totals.excluded)} automated left out · ${windowLabel}`,
    };
  } else if (clicks.loading) {
    clicksTile = {
      key: "clicks",
      label: clicksLabel,
      to: "/control/clicks",
      value: null,
      loading: true,
    };
  } else {
    clicksTile = errorTile(
      "clicks",
      clicksLabel,
      "/control/clicks",
      clicks.error,
    );
  }

  // Affiliate commission
  const commissionLabel = "Commission";
  let commissionTile: TileModel;
  if (revenue.data) {
    const { totals, previous, last_imported_at } = revenue.data;
    commissionTile =
      totals.conversions === 0 && !last_imported_at
        ? {
            key: "commission",
            label: commissionLabel,
            to: "/control/revenue",
            value: <QuietValue>None recorded</QuietValue>,
            hint: "No conversions imported yet. Import a report or connect Awin.",
          }
        : {
            key: "commission",
            label: commissionLabel,
            to: "/control/revenue",
            value: formatGbp(totals.commission_gbp),
            delta: formatDelta(totals.commission_gbp, previous.commission_gbp),
            hint: `${formatInt(totals.conversions)} ${totals.conversions === 1 ? "conversion" : "conversions"}, ${formatGbp(totals.commission_pending_gbp)} pending · ${windowLabel}`,
          };
  } else if (revenue.loading) {
    commissionTile = {
      key: "commission",
      label: commissionLabel,
      to: "/control/revenue",
      value: null,
      loading: true,
    };
  } else {
    commissionTile = errorTile(
      "commission",
      commissionLabel,
      "/control/revenue",
      revenue.error,
    );
  }

  // GA4 sessions
  const ga4Label = "GA4 sessions";
  const sessions = f.get("ga4.sessions");
  const sessionsNow = numValue(sessions);
  const sessionsBefore = numValue(f.get("ga4.previous_sessions"));
  const ga4Tile: TileModel =
    sessions && sessionsNow !== null
      ? {
          key: "ga4",
          label: ga4Label,
          to: "/control/traffic",
          value: formatInt(sessionsNow),
          delta:
            sessionsBefore !== null
              ? formatDelta(sessionsNow, sessionsBefore)
              : undefined,
          hint: `Google Analytics 4 · ${sessions.period}`,
        }
      : (snapshotFallback("ga4", ga4Label, "/control/traffic") ??
        missingTile(
          "ga4",
          ga4Label,
          "ga4",
          "Google Analytics 4",
          status,
          hasRows("ga4"),
        ));

  // Search clicks
  const searchLabel = "Search clicks";
  const gscClicks = f.get("gsc.clicks");
  const gscNow = numValue(gscClicks);
  const gscBefore = numValue(f.get("gsc.previous_clicks"));
  const impressions = numValue(f.get("gsc.impressions"));
  const searchTile: TileModel =
    gscClicks && gscNow !== null
      ? {
          key: "search",
          label: searchLabel,
          to: "/control/traffic",
          value: formatInt(gscNow),
          delta:
            gscBefore !== null ? formatDelta(gscNow, gscBefore) : undefined,
          hint: `${impressions !== null ? `${formatInt(impressions)} impressions · ` : ""}${gscClicks.period}`,
        }
      : (snapshotFallback("search", searchLabel, "/control/traffic") ??
        missingTile(
          "search",
          searchLabel,
          "search_console",
          "Google Search Console",
          status,
          hasRows("search_console"),
        ));

  // Social followers
  const socialLabel = "Social followers";
  const total = f.get("social.followers_total");
  const totalValue = numValue(total);
  const perNetwork = (Object.keys(NETWORK_NAMES) as SocialNetwork[])
    .map((n) => {
      const v = numValue(f.get(`social.${n}.followers`));
      return v === null ? null : `${NETWORK_NAMES[n]} ${formatInt(v)}`;
    })
    .filter((s): s is string => s !== null);
  const socialTile: TileModel =
    total && totalValue !== null
      ? {
          key: "social",
          label: socialLabel,
          to: "/control/social",
          value: formatInt(totalValue),
          hint: perNetwork.join(" · "),
        }
      : (snapshotFallback("social", socialLabel, "/control/social") ??
        missingTile(
          "social",
          socialLabel,
          "metricool",
          "Metricool",
          status,
          hasRows("metricool"),
        ));

  // Site status
  const siteLabel = "Site status";
  const checks = latestSiteChecks(site);
  let siteTile: TileModel;
  if (checks.length > 0) {
    const failing = checks.filter((c) => !c.ok).length;
    const newest = checks.reduce((a, b) =>
      Date.parse(b.checked_at) > Date.parse(a.checked_at) ? b : a,
    );
    const checked = `checked ${formatAgo(newest.checked_at, now)}`;
    siteTile = {
      key: "site",
      label: siteLabel,
      to: PLUGINS_HREF,
      value:
        failing === 0 ? "Up" : failing === checks.length ? "Down" : "Problem",
      hint: (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <StatusPill tone={failing === 0 ? "ok" : "error"}>
            {failing === 0
              ? "Serving pages"
              : `${formatInt(failing)} of ${formatInt(checks.length)} addresses failing`}
          </StatusPill>
          <span title={formatDateTime(newest.checked_at)}>{checked}</span>
        </span>
      ),
    };
  } else {
    const siteStatus = status.data?.plugins.find(
      (p) => p.plugin_id === "site_status",
    );
    siteTile = snapshotFallback("site", siteLabel, PLUGINS_HREF) ?? {
      key: "site",
      label: siteLabel,
      to: PLUGINS_HREF,
      value: <QuietValue>Not checked yet</QuietValue>,
      hint:
        siteStatus && !siteStatus.ready
          ? "Add the addresses to check in Plugins."
          : "Checks run with the hourly sync. Run one now in Plugins.",
    };
  }

  return [
    clicksTile,
    commissionTile,
    ga4Tile,
    searchTile,
    socialTile,
    siteTile,
  ];
}

// ---------------------------------------------------------------------------
// Data sources strip
// ---------------------------------------------------------------------------

type SourceRow = {
  plugin: OsPluginDefinition;
  tone: StatusTone;
  label: string;
  detail: string;
};

/** Newest cron or manual sync per plugin; connection tests do not count. */
function latestSyncs(
  log: readonly PluginSyncLogRow[] | undefined,
): Map<string, PluginSyncLogRow> {
  const out = new Map<string, PluginSyncLogRow>();
  for (const row of log ?? []) {
    if (row.trigger === "test") continue;
    const seen = out.get(row.plugin_id);
    if (!seen || Date.parse(row.started_at) > Date.parse(seen.started_at)) {
      out.set(row.plugin_id, row);
    }
  }
  return out;
}

function nativeRow<T>(
  plugin: OsPluginDefinition,
  q: QueryState<T>,
  detail: (data: T) => string,
): SourceRow {
  if (q.data !== undefined) {
    return { plugin, tone: "ok", label: "Live", detail: detail(q.data) };
  }
  if (q.loading) {
    return { plugin, tone: "idle", label: "Checking", detail: "Loading" };
  }
  return {
    plugin,
    tone: "error",
    label: "Error",
    detail: "Could not be read. See the tiles above.",
  };
}

function syncRow(
  plugin: OsPluginDefinition,
  st: OsPluginStatus | undefined,
  status: QueryState<OsStatusResponse>,
  newest: string | null,
  lastSync: PluginSyncLogRow | undefined,
  now: Date,
): SourceRow {
  const updated = newest
    ? `Updated ${formatAgo(newest, now)}`
    : "Not synced yet";
  if (!st) {
    return status.loading
      ? { plugin, tone: "idle", label: "Checking", detail: updated }
      : { plugin, tone: "idle", label: "Unknown", detail: updated };
  }
  if (!st.ready) {
    const needs =
      st.missing_secrets.length > 0
        ? "Needs credentials"
        : st.missing_config.length > 0
          ? "Needs settings"
          : "Not set up";
    return {
      plugin,
      tone: "idle",
      label: "Not connected",
      detail: newest ? `${needs} · last data ${formatAgo(newest, now)}` : needs,
    };
  }
  if (!st.enabled) {
    return { plugin, tone: "idle", label: "Turned off", detail: updated };
  }
  if (lastSync?.status === "error") {
    return {
      plugin,
      tone: "error",
      label: "Error",
      detail: `Last sync failed ${formatAgo(lastSync.started_at, now)}`,
    };
  }
  return { plugin, tone: "ok", label: "Connected", detail: updated };
}

function sourceRows({
  clicks,
  revenue,
  snapshots,
  status,
  syncLog,
  brief,
  now,
}: {
  clicks: QueryState<ClicksSummary>;
  revenue: QueryState<RevenueSummary>;
  snapshots: readonly PluginSnapshotRow[] | undefined;
  status: QueryState<OsStatusResponse>;
  syncLog: readonly PluginSyncLogRow[] | undefined;
  brief: OsBriefResponse | undefined;
  now: Date;
}): SourceRow[] {
  const syncs = latestSyncs(syncLog);
  return OS_PLUGINS.map((plugin): SourceRow => {
    if (plugin.id === "provider_clicks") {
      return nativeRow(plugin, clicks, (d) =>
        d.last_click_at
          ? `Last click ${formatAgo(d.last_click_at, now)}`
          : "No clicks recorded yet",
      );
    }
    if (plugin.id === "conversion_import") {
      return nativeRow(plugin, revenue, (d) =>
        d.last_imported_at
          ? `Last import ${formatAgo(d.last_imported_at, now)}`
          : "Nothing imported yet",
      );
    }
    if (plugin.kind === "service") {
      if (!status.data) {
        return {
          plugin,
          tone: "idle",
          label: status.loading ? "Checking" : "Unknown",
          detail: "Used when this page opens",
        };
      }
      if (!status.data.ai_available) {
        return {
          plugin,
          tone: "idle",
          label: "Not connected",
          detail: "Needs an Anthropic API key",
        };
      }
      if (brief?.mode === "failed") {
        return {
          plugin,
          tone: "error",
          label: "Error",
          detail: `Last briefing failed ${formatAgo(brief.generated_at, now)}`,
        };
      }
      return {
        plugin,
        tone: "ok",
        label: "Connected",
        detail: brief
          ? `Last briefing ${formatAgo(brief.generated_at, now)}`
          : "Used when this page opens",
      };
    }
    return syncRow(
      plugin,
      status.data?.plugins.find((p) => p.plugin_id === plugin.id),
      status,
      newestFetch(snapshots, plugin.id),
      syncs.get(plugin.id),
      now,
    );
  });
}

function DataSourcesPanel({
  rows,
  status,
}: {
  rows: SourceRow[];
  status: QueryState<OsStatusResponse>;
}) {
  return (
    <Panel
      title="Data sources"
      subtitle="Where the figures come from and whether each source is working."
      actions={
        <Button asChild variant="outline" size="sm" className="h-10">
          <Link to={PLUGINS_HREF}>Manage plugins</Link>
        </Button>
      }
      source={{
        label: "Plugin status from the os-plugins function",
        updatedAt: status.data?.checked_at,
      }}
    >
      <div className="space-y-3">
        {!status.data && status.error ? (
          <ErrorNote error={status.error} />
        ) : null}
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <li
              key={r.plugin.id}
              className="flex min-h-10 min-w-0 items-center justify-between gap-2 rounded-lg border px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{r.plugin.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {r.detail}
                </p>
              </div>
              <StatusPill tone={r.tone}>{r.label}</StatusPill>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
