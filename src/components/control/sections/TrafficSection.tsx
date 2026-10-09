/**
 * Traffic and search: Google Analytics 4 and Google Search Console, read from
 * the os-plugins snapshots. Third-party series end at their own latest
 * complete day, so every window here is anchored on the series, not on today.
 */
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  BarList,
  DailyChart,
  DataTable,
  EmptyState,
  ErrorNote,
  KpiGrid,
  KpiTile,
  Limitations,
  LoadingRows,
  Panel,
  StatusPill,
  type SourceInfo,
} from "@/components/os/ui";
import { useOsRange, usePluginStatus, useSnapshot } from "@/hooks/os/useOs";
import { providerForHost } from "@/lib/affiliate/affiliate-config";
import {
  formatAgo,
  formatDay,
  formatDelta,
  formatInt,
  formatShare,
  providerName,
} from "@/lib/os/format";
import {
  lastNDays,
  previousNDays,
  rangeDays,
  snapshotRangeKey,
} from "@/lib/os/range";
import { ctr, daySpan, ratio, sumBy, weightedPosition } from "@/lib/os/series";
import type { OsStatusResponse } from "@/lib/os/types";
import { Link } from "@/lib/router-compat";
import { getOsPlugin } from "../../../../supabase/functions/_shared/os/catalog";
import type {
  Ga4Channels,
  Ga4Daily,
  Ga4OutboundClicks,
  Ga4TopPages,
  GscDaily,
  GscTopPages,
  GscTopQueries,
  OsRangeKey,
} from "../../../../supabase/functions/_shared/os/contract";

const GA4 = "Google Analytics 4";
const GSC = "Google Search Console";
const OTHER_SITES = "__other__";
const TOP_ROWS = 10;
/** The sync runs hourly; older than this means it has stopped or is failing. */
const STALE_AFTER_MS = 6 * 60 * 60 * 1000;

const GA4_TAG_NOTE =
  "This codebase does not load a GA4 tag. src/lib/analytics.ts forwards events to gtag only if a tag is already on the page, so GA4 holds data only if the tag is added another way, for example through Google Tag Manager, and only for visitors who accept analytics cookies.";

function limitationsOf(pluginId: string): string[] {
  return getOsPlugin(pluginId)?.limitations ?? [];
}

type Snapshot<T> = {
  isLoading: boolean;
  error: unknown;
  data: T | null;
  fetchedAt: string | null;
};

// ---------------------------------------------------------------------------
// Connection state
// ---------------------------------------------------------------------------

type Connection = "connected" | "off" | "not_connected" | "unknown";

function connectionOf(
  status: OsStatusResponse | undefined,
  pluginId: string,
): Connection {
  const plugin = status?.plugins.find((p) => p.plugin_id === pluginId);
  if (!plugin) return "unknown";
  if (!plugin.enabled) return "off";
  return plugin.ready ? "connected" : "not_connected";
}

/**
 * Readable names of the settings a plugin still needs. Credentials are
 * listed only when the plugin has a single credential group, since with
 * several groups any one of them is enough.
 */
function missingSettings(
  status: OsStatusResponse | undefined,
  pluginId: string,
): string[] {
  const plugin = status?.plugins.find((p) => p.plugin_id === pluginId);
  const def = getOsPlugin(pluginId);
  if (!plugin || !def) return [];
  const labels = new Map<string, string>();
  for (const field of def.config) labels.set(field.key, field.label);
  for (const group of def.secretGroups) {
    for (const secret of group.secrets) labels.set(secret.key, secret.label);
  }
  const keys = [
    ...plugin.missing_config,
    ...(def.secretGroups.length === 1 ? plugin.missing_secrets : []),
  ];
  return [...new Set(keys.map((k) => labels.get(k) ?? k))];
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export default function TrafficSection() {
  const [range] = useOsRange();
  const days = rangeDays(range);
  const key = snapshotRangeKey(range);
  const status = usePluginStatus();

  const ga4Daily = useSnapshot<Ga4Daily>("ga4", "daily");
  const ga4Pages = useSnapshot<Ga4TopPages>("ga4", "top_pages");
  const ga4Channels = useSnapshot<Ga4Channels>("ga4", "channels");
  const ga4Outbound = useSnapshot<Ga4OutboundClicks>("ga4", "outbound_clicks");
  const gscDaily = useSnapshot<GscDaily>("search_console", "daily");
  const gscQueries = useSnapshot<GscTopQueries>(
    "search_console",
    "top_queries",
  );
  const gscPages = useSnapshot<GscTopPages>("search_console", "top_pages");

  const ga4Connection = connectionOf(status.data, "ga4");
  const gscConnection = connectionOf(status.data, "search_console");

  return (
    <div className="space-y-10">
      <Part
        id="traffic-ga4"
        title={GA4}
        intro="Visits to the site as Google Analytics 4 (GA4) recorded them."
      >
        {ga4Daily.isLoading ? (
          <PartLoading
            kpis={["Sessions", "Users", "Engaged sessions", "Key events"]}
            chart="Sessions per day"
          />
        ) : ga4Daily.error ? (
          <ErrorNote error={ga4Daily.error} />
        ) : ga4Daily.data ? (
          <Ga4Body
            daily={ga4Daily}
            pages={ga4Pages}
            channels={ga4Channels}
            outbound={ga4Outbound}
            days={days}
            rangeKey={key}
            connection={ga4Connection}
          />
        ) : (
          <NotSyncedState
            name={GA4}
            connection={ga4Connection}
            missing={missingSettings(status.data, "ga4")}
            needs="a Google service account key with Viewer access to the GA4 property, and the GA4 property ID"
          />
        )}
        <Limitations items={[GA4_TAG_NOTE, ...limitationsOf("ga4")]} />
      </Part>

      <Part
        id="traffic-gsc"
        title={GSC}
        intro="How the site appears in Google search results."
      >
        {gscDaily.isLoading ? (
          <PartLoading
            kpis={[
              "Clicks",
              "Impressions",
              "Click-through rate",
              "Average position",
            ]}
            chart="Search clicks per day"
          />
        ) : gscDaily.error ? (
          <ErrorNote error={gscDaily.error} />
        ) : gscDaily.data ? (
          <GscBody
            daily={gscDaily}
            queries={gscQueries}
            pages={gscPages}
            days={days}
            rangeKey={key}
            connection={gscConnection}
          />
        ) : (
          <NotSyncedState
            name={GSC}
            connection={gscConnection}
            missing={missingSettings(status.data, "search_console")}
            needs="a Google service account with access to the Search Console property, or the Lovable Search Console connector, and the property address exactly as Search Console lists it"
          />
        )}
        <Limitations items={limitationsOf("search_console")} />
      </Part>
    </div>
  );
}

function Part({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="min-w-0 space-y-4">
      <div>
        <h2 id={id} className="text-lg font-semibold leading-tight">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{intro}</p>
      </div>
      {children}
    </section>
  );
}

function PartLoading({ kpis, chart }: { kpis: string[]; chart: string }) {
  return (
    <>
      <KpiGrid>
        {kpis.map((label) => (
          <KpiTile key={label} label={label} value={null} loading />
        ))}
      </KpiGrid>
      <Panel title={chart}>
        <LoadingRows rows={6} />
      </Panel>
    </>
  );
}

// ---------------------------------------------------------------------------
// Windows
// ---------------------------------------------------------------------------

type DailyWindow<T> = {
  current: T[];
  previous: T[];
  /** The series reaches back far enough for a full previous window. */
  hasPrevious: boolean;
  firstDay: string;
  lastDay: string;
  /** Days the current window really covers (fewer than asked on a short series). */
  covered: number;
};

function dailyWindow<T extends { date: string }>(
  all: readonly T[],
  days: number,
): DailyWindow<T> | null {
  if (all.length === 0) return null;
  const current = lastNDays(all, days);
  if (current.length === 0) return null;
  const span = daySpan(all);
  return {
    current,
    previous: previousNDays(all, days),
    hasPrevious: span >= days * 2,
    firstDay: all[0].date,
    lastDay: current[current.length - 1].date,
    covered: Math.min(days, span),
  };
}

function windowText(win: DailyWindow<{ date: string }>, days: number): string {
  return win.covered < days
    ? `${win.covered} days to ${formatDay(win.lastDay)} (no earlier data)`
    : `${days} days to ${formatDay(win.lastDay)}`;
}

/** Sum for the previous window, or null when the series does not reach it. */
function previousOr<T>(win: DailyWindow<T>, sum: (rows: T[]) => number) {
  return win.hasPrevious ? sum(win.previous) : null;
}

function NoComparisonNote({
  win,
  days,
  name,
}: {
  win: DailyWindow<{ date: string }>;
  days: number;
  name: string;
}) {
  if (win.hasPrevious) return null;
  return (
    <p className="text-xs text-muted-foreground">
      Changes need {days * 2} days of history. {name} data here starts on{" "}
      {formatDay(win.firstDay)}, so there is no previous period to compare.
    </p>
  );
}

// ---------------------------------------------------------------------------
// Google Analytics 4
// ---------------------------------------------------------------------------

function Ga4Body({
  daily,
  pages,
  channels,
  outbound,
  days,
  rangeKey,
  connection,
}: {
  daily: Snapshot<Ga4Daily>;
  pages: Snapshot<Ga4TopPages>;
  channels: Snapshot<Ga4Channels>;
  outbound: Snapshot<Ga4OutboundClicks>;
  days: number;
  rangeKey: OsRangeKey;
  connection: Connection;
}) {
  const all = daily.data?.days ?? [];
  const win = dailyWindow(all, days);
  const hasSessions = sumBy(all, "sessions") > 0;
  const rangedSource = (updatedAt: string | null): SourceInfo => ({
    label: GA4,
    updatedAt,
    window: `last ${days} complete days`,
  });

  if (!win || !hasSessions) {
    return (
      <>
        <SyncNote
          name={GA4}
          fetchedAt={daily.fetchedAt}
          connection={connection}
        />
        <Panel
          title="Sessions"
          source={{ label: GA4, updatedAt: daily.fetchedAt }}
        >
          <EmptyState title="GA4 has no visits on record">
            The last sync worked, but GA4 returned no sessions for this
            property. GA4 holds data only when a GA4 tag on the site sends it,
            and this codebase does not load one. See Known limitations below.
          </EmptyState>
        </Panel>
      </>
    );
  }

  const source: SourceInfo = {
    label: GA4,
    updatedAt: daily.fetchedAt,
    window: windowText(win, days),
  };
  const sessions = sumBy(win.current, "sessions");
  const users = sumBy(win.current, "users");
  const engaged = sumBy(win.current, "engaged_sessions");
  const keyEvents = sumBy(win.current, "key_events");
  const engagementRate = ratio(engaged, sessions);
  const previousLabel = `Previous ${days} days`;

  return (
    <>
      <SyncNote
        name={GA4}
        fetchedAt={daily.fetchedAt}
        connection={connection}
      />

      <div className="space-y-2">
        <KpiGrid>
          <KpiTile
            label="Sessions"
            value={formatInt(sessions)}
            delta={formatDelta(
              sessions,
              previousOr(win, (r) => sumBy(r, "sessions")),
            )}
            hint={
              win.hasPrevious
                ? `${previousLabel}: ${formatInt(sumBy(win.previous, "sessions"))}`
                : undefined
            }
          />
          <KpiTile
            label="Users"
            value={formatInt(users)}
            delta={formatDelta(
              users,
              previousOr(win, (r) => sumBy(r, "users")),
            )}
            hint="Each day's users added up"
          />
          <KpiTile
            label="Engaged sessions"
            value={formatInt(engaged)}
            delta={formatDelta(
              engaged,
              previousOr(win, (r) => sumBy(r, "engaged_sessions")),
            )}
            hint={
              engagementRate === null
                ? undefined
                : `Engagement rate ${formatShare(engagementRate)}`
            }
          />
          <KpiTile
            label="Key events"
            value={formatInt(keyEvents)}
            delta={formatDelta(
              keyEvents,
              previousOr(win, (r) => sumBy(r, "key_events")),
            )}
            hint="Actions marked as goals in GA4"
          />
        </KpiGrid>
        <p className="text-xs text-muted-foreground">
          Users adds up each day's users, so someone who returns on another day
          counts again. An engaged session lasts longer than 10 seconds,
          includes a key event or views two or more pages. Engagement rate is
          engaged sessions divided by sessions.
        </p>
        <NoComparisonNote win={win} days={days} name="GA4" />
      </div>

      <Panel
        title="Sessions per day"
        subtitle="Complete days only. GA4 figures for today appear tomorrow."
        source={source}
      >
        <DailyChart
          data={win.current.map((d) => ({ day: d.date, sessions: d.sessions }))}
          series={[{ key: "sessions", label: "Sessions", color: "series1" }]}
          format={formatInt}
          ariaLabel={`GA4 sessions per day, ${windowText(win, days)}`}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Top pages"
          subtitle={`Pages with the most page views, top ${TOP_ROWS}.`}
          source={rangedSource(pages.fetchedAt)}
        >
          <Ga4TopPagesList data={pages.data} rangeKey={rangeKey} />
        </Panel>

        <Panel
          title="Channels"
          subtitle="How visitors arrived, grouped by GA4's default channels such as Organic Search, Direct and Referral."
          source={rangedSource(channels.fetchedAt)}
        >
          <Ga4ChannelsTable data={channels.data} rangeKey={rangeKey} />
        </Panel>
      </div>

      {outbound.data?.available ? (
        <Panel
          title="Outbound clicks to providers"
          subtitle="Clicks on links to other sites, as GA4 enhanced measurement records them. Sites that are not providers share one row, Other sites."
          source={rangedSource(outbound.fetchedAt)}
        >
          <div className="space-y-2">
            <OutboundList data={outbound.data} rangeKey={rangeKey} />
            <p className="text-xs text-muted-foreground">
              Our own click log is the main record of provider clicks. GA4
              counts only visitors who accept analytics cookies.
            </p>
            <Link
              to="/control/clicks"
              className="inline-flex min-h-10 items-center text-sm font-medium underline underline-offset-2"
            >
              Compare with Provider clicks
            </Link>
          </div>
        </Panel>
      ) : null}
    </>
  );
}

/** For a dataset the last sync did not write. */
function NotInSync({ what }: { what: string }) {
  return (
    <p className="py-4 text-center text-xs text-muted-foreground">
      The last sync did not include {what}.
    </p>
  );
}

function Ga4TopPagesList({
  data,
  rangeKey,
}: {
  data: Ga4TopPages | null;
  rangeKey: OsRangeKey;
}) {
  const rows = data?.ranges?.[rangeKey];
  if (!rows) {
    return <NotInSync what="top pages" />;
  }
  const top = [...rows]
    .filter((r) => Number.isFinite(r.views))
    .sort((a, b) => b.views - a.views || a.path.localeCompare(b.path))
    .slice(0, TOP_ROWS);
  return (
    <BarList
      emptyText="No page views in this period."
      items={top.map((r) => ({
        key: r.path,
        label: (
          <span className="font-mono text-xs" title={r.path}>
            {r.path}
          </span>
        ),
        value: r.views,
        display: formatInt(r.views),
        meta: `${formatInt(r.sessions)} ${r.sessions === 1 ? "session" : "sessions"}`,
      }))}
    />
  );
}

function Ga4ChannelsTable({
  data,
  rangeKey,
}: {
  data: Ga4Channels | null;
  rangeKey: OsRangeKey;
}) {
  const rows = data?.ranges?.[rangeKey];
  if (!rows) {
    return <NotInSync what="channels" />;
  }
  const sorted = [...rows].sort(
    (a, b) => b.sessions - a.sessions || a.channel.localeCompare(b.channel),
  );
  return (
    <DataTable
      emptyText="No sessions in this period."
      columns={[
        { key: "channel", label: "Channel" },
        { key: "sessions", label: "Sessions", align: "right" },
        { key: "keyEvents", label: "Key events", align: "right" },
      ]}
      rows={sorted.map((r) => ({
        key: r.channel,
        cells: {
          channel: r.channel,
          sessions: formatInt(r.sessions),
          keyEvents: formatInt(r.key_events),
        },
      }))}
    />
  );
}

type OutboundItem = { id: string; clicks: number };

/**
 * GA4 outbound clicks per provider. Several domains for one provider (www,
 * alternative domains) are added together; every other domain goes into
 * one "Other sites" row.
 */
function outboundItems(
  rows: readonly { domain: string; clicks: number }[],
): OutboundItem[] {
  const totals = new Map<string, number>();
  for (const row of rows) {
    if (!Number.isFinite(row.clicks) || row.clicks <= 0) continue;
    const id = providerForHost(row.domain ?? "") ?? OTHER_SITES;
    totals.set(id, (totals.get(id) ?? 0) + row.clicks);
  }
  return [...totals.entries()]
    .map(([id, clicks]) => ({ id, clicks }))
    .sort((a, b) => {
      if ((a.id === OTHER_SITES) !== (b.id === OTHER_SITES)) {
        return a.id === OTHER_SITES ? 1 : -1;
      }
      return b.clicks - a.clicks || a.id.localeCompare(b.id);
    });
}

function OutboundList({
  data,
  rangeKey,
}: {
  data: Ga4OutboundClicks;
  rangeKey: OsRangeKey;
}) {
  const rows = data.ranges?.[rangeKey];
  if (!rows) {
    return <NotInSync what="outbound clicks" />;
  }
  return (
    <BarList
      emptyText="GA4 recorded no clicks to other sites in this period."
      items={outboundItems(rows).map((item) => ({
        key: item.id,
        label:
          item.id === OTHER_SITES ? (
            "Other sites"
          ) : (
            <Link
              to={`/provider/${encodeURIComponent(item.id)}`}
              className="flex min-h-10 items-center underline-offset-2 hover:underline"
            >
              <span className="truncate">{providerName(item.id)}</span>
            </Link>
          ),
        value: item.clicks,
        display: formatInt(item.clicks),
      }))}
    />
  );
}

// ---------------------------------------------------------------------------
// Google Search Console
// ---------------------------------------------------------------------------

const GSC_LAG = "Google reports 2 to 3 days late";

function formatPosition(n: number | null | undefined): string {
  return n === null || n === undefined || !Number.isFinite(n)
    ? "–"
    : n.toFixed(1);
}

/** The path of a Search Console page address, or the address as given. */
function pagePath(page: string): string {
  try {
    const url = new URL(page);
    return `${url.pathname}${url.search}` || "/";
  } catch {
    return page;
  }
}

function GscBody({
  daily,
  queries,
  pages,
  days,
  rangeKey,
  connection,
}: {
  daily: Snapshot<GscDaily>;
  queries: Snapshot<GscTopQueries>;
  pages: Snapshot<GscTopPages>;
  days: number;
  rangeKey: OsRangeKey;
  connection: Connection;
}) {
  const all = daily.data?.days ?? [];
  const win = dailyWindow(all, days);
  const hasImpressions = sumBy(all, "impressions") > 0;
  const rangedSource = (updatedAt: string | null): SourceInfo => ({
    label: GSC,
    updatedAt,
    window: `last ${days} days Google has reported (${GSC_LAG})`,
  });

  if (!win || !hasImpressions) {
    return (
      <>
        <SyncNote
          name={GSC}
          fetchedAt={daily.fetchedAt}
          connection={connection}
        />
        <Panel
          title="Search performance"
          source={{ label: GSC, updatedAt: daily.fetchedAt }}
        >
          <EmptyState
            title="Search Console returned no search data"
            action={<PluginsButton />}
          >
            The last sync worked, but Google returned no clicks or impressions
            for this property. Check that the property address in Plugins
            matches Search Console exactly, including https and www.
          </EmptyState>
        </Panel>
      </>
    );
  }

  const source: SourceInfo = {
    label: GSC,
    updatedAt: daily.fetchedAt,
    window: `${windowText(win, days)} (${GSC_LAG})`,
  };
  const clicks = sumBy(win.current, "clicks");
  const impressions = sumBy(win.current, "impressions");
  const rate = ctr(clicks, impressions);
  const position = weightedPosition(win.current);

  const prevClicks = previousOr(win, (r) => sumBy(r, "clicks"));
  const prevImpressions = previousOr(win, (r) => sumBy(r, "impressions"));
  const prevRate =
    prevClicks === null || prevImpressions === null
      ? null
      : ctr(prevClicks, prevImpressions);
  const prevPosition = win.hasPrevious ? weightedPosition(win.previous) : null;

  return (
    <>
      <SyncNote
        name={GSC}
        fetchedAt={daily.fetchedAt}
        connection={connection}
      />

      <div className="space-y-2">
        <KpiGrid>
          <KpiTile
            label="Clicks"
            value={formatInt(clicks)}
            delta={formatDelta(clicks, prevClicks)}
            hint={
              prevClicks === null
                ? undefined
                : `Previous ${days} days: ${formatInt(prevClicks)}`
            }
          />
          <KpiTile
            label="Impressions"
            value={formatInt(impressions)}
            delta={formatDelta(impressions, prevImpressions)}
            hint="Times the site appeared in results"
          />
          <KpiTile
            label="Click-through rate"
            value={formatShare(rate)}
            delta={formatDelta(rate, prevRate)}
            hint="Clicks divided by impressions"
          />
          <KpiTile
            label="Average position"
            value={formatPosition(position)}
            delta={formatDelta(position, prevPosition)}
            goodWhen="down"
            hint="1 is the top result, so lower is better"
          />
        </KpiGrid>
        <p className="text-xs text-muted-foreground">
          Average position weights each day by its impressions, as Search
          Console does.
        </p>
        <NoComparisonNote win={win} days={days} name="Search Console" />
      </div>

      <Panel
        title="Search clicks per day"
        subtitle="Clicks from Google search results to the site."
        source={source}
      >
        <DailyChart
          data={win.current.map((d) => ({ day: d.date, clicks: d.clicks }))}
          series={[{ key: "clicks", label: "Clicks", color: "series1" }]}
          format={formatInt}
          ariaLabel={`Google search clicks per day, ${windowText(win, days)}`}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="Top queries"
          subtitle={`Searches that showed the site, top ${TOP_ROWS} by clicks.`}
          source={rangedSource(queries.fetchedAt)}
        >
          <GscTable
            rows={queries.data?.ranges?.[rangeKey]?.map((r) => ({
              ...r,
              label: r.query,
            }))}
            labelHeader="Query"
            missing="top queries"
          />
        </Panel>

        <Panel
          title="Top pages"
          subtitle={`Pages people reached from Google search, top ${TOP_ROWS} by clicks.`}
          source={rangedSource(pages.fetchedAt)}
        >
          <GscTable
            rows={pages.data?.ranges?.[rangeKey]?.map((r) => ({
              ...r,
              label: r.page,
            }))}
            labelHeader="Page"
            missing="top pages"
            asPath
          />
        </Panel>
      </div>
    </>
  );
}

type GscTableRow = {
  label: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

function GscTable({
  rows,
  labelHeader,
  missing,
  asPath = false,
}: {
  rows: GscTableRow[] | undefined;
  labelHeader: string;
  /** What the table lists, for when the last sync did not write it. */
  missing: string;
  asPath?: boolean;
}) {
  if (!rows) return <NotInSync what={missing} />;
  const top = [...rows]
    .sort(
      (a, b) =>
        b.clicks - a.clicks ||
        b.impressions - a.impressions ||
        a.label.localeCompare(b.label),
    )
    .slice(0, TOP_ROWS);
  return (
    <DataTable
      emptyText="No search data in this period."
      columns={[
        { key: "label", label: labelHeader },
        { key: "clicks", label: "Clicks", align: "right" },
        { key: "impressions", label: "Impressions", align: "right" },
        { key: "ctr", label: "CTR", align: "right" },
        { key: "position", label: "Position", align: "right" },
      ]}
      rows={top.map((r) => ({
        key: r.label,
        cells: {
          label: asPath ? (
            <span className="break-all font-mono text-xs" title={r.label}>
              {pagePath(r.label)}
            </span>
          ) : (
            <span className="break-words">{r.label}</span>
          ),
          clicks: formatInt(r.clicks),
          impressions: formatInt(r.impressions),
          ctr: formatShare(r.ctr),
          position: formatPosition(r.position),
        },
      }))}
    />
  );
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function PluginsButton() {
  return (
    <Button asChild variant="outline" size="sm" className="h-10">
      <Link to="/control/plugins">Open Plugins</Link>
    </Button>
  );
}

function NotSyncedState({
  name,
  connection,
  missing,
  needs,
}: {
  name: string;
  connection: Connection;
  missing: string[];
  /** What the plugin needs, completing "It needs ...". */
  needs: string;
}) {
  const copy: Record<Connection, { title: string; body: string }> = {
    not_connected: {
      title: `${name} is not connected`,
      body: `Connect it in Plugins. It needs ${needs}. Figures appear here after the first sync.`,
    },
    off: {
      title: `${name} is turned off`,
      body: `Turn it on in Plugins. Figures appear here after the next sync.`,
    },
    connected: {
      title: `${name} has not synced yet`,
      body: `It is connected. Run a sync in Plugins, or wait for the hourly sync.`,
    },
    unknown: {
      title: `No ${name} data yet`,
      body: `Connect it in Plugins, or run a sync there if it is already connected. It needs ${needs}.`,
    },
  };
  const { title, body } = copy[connection];
  return (
    <EmptyState title={title} action={<PluginsButton />}>
      <p>{body}</p>
      {connection === "not_connected" && missing.length > 0 && (
        <p className="mt-1">Still missing: {missing.join(", ")}.</p>
      )}
    </EmptyState>
  );
}

/** Warns when the figures shown may be out of date. */
function SyncNote({
  name,
  fetchedAt,
  connection,
}: {
  name: string;
  fetchedAt: string | null;
  connection: Connection;
}) {
  const notes: string[] = [];
  if (connection === "off") {
    notes.push(
      `${name} is turned off in Plugins. These figures come from its last sync.`,
    );
  } else if (connection === "not_connected") {
    notes.push(
      `${name} is missing a setting or credential in Plugins. These figures come from its last sync.`,
    );
  }
  const fetchedMs = fetchedAt ? Date.parse(fetchedAt) : Number.NaN;
  if (Number.isFinite(fetchedMs) && Date.now() - fetchedMs > STALE_AFTER_MS) {
    notes.push(
      `Last synced ${formatAgo(fetchedAt)}. The sync runs every hour, so check the sync log in Plugins.`,
    );
  }
  if (notes.length === 0) return null;
  return (
    <ul className="flex flex-col items-start gap-2">
      {notes.map((note) => (
        <li key={note} className="max-w-full">
          <StatusPill tone="warn">{note}</StatusPill>
        </li>
      ))}
    </ul>
  );
}
