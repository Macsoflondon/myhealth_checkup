/**
 * Provider clicks: qualified clicks from our pages to provider sites, read
 * live from os_clicks_summary. Automated traffic is counted, shown and kept
 * out of the qualified figures. GA4 outbound clicks, when connected, give an
 * independent cross-check.
 */
import { Download } from "lucide-react";
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
  SourceLine,
  StatusPill,
  type SourceInfo,
} from "@/components/os/ui";
import {
  useClicksSummary,
  useOsRange,
  useOsWindow,
  useSnapshot,
} from "@/hooks/os/useOs";
import { providerForHost } from "@/lib/affiliate/affiliate-config";
import { downloadCsv, toCsv } from "@/lib/os/csv";
import {
  daysSince,
  formatAgo,
  formatDateTime,
  formatDelta,
  formatInt,
  formatShare,
  placementName,
  providerName,
} from "@/lib/os/format";
import { snapshotRangeKey, type OsRange, type OsWindow } from "@/lib/os/range";
import type { ClickExclusionReason, ClicksSummary } from "@/lib/os/types";
import { Link } from "@/lib/router-compat";
import { getOsPlugin } from "../../../../supabase/functions/_shared/os/catalog";
import type { Ga4OutboundClicks } from "../../../../supabase/functions/_shared/os/contract";

const SOURCE_LABEL = "First-party click log";
const DAY_MS = 86_400_000;
/** Warn when the newest click of any kind is older than this. */
const QUIET_AFTER_MS = 2 * DAY_MS;

const REASON_LABEL: Record<ClickExclusionReason, string> = {
  burst: "Fast repeat sweep",
  headless: "Automation browser",
  bot: "Crawler",
};
const REASON_ORDER: ClickExclusionReason[] = ["burst", "headless", "bot"];

export default function ClicksSection() {
  const [range] = useOsRange();
  const win = useOsWindow(range);
  const clicks = useClicksSummary(range);
  const ga4 = useSnapshot<Ga4OutboundClicks>("ga4", "outbound_clicks");
  const limitations = getOsPlugin("provider_clicks")?.limitations ?? [];

  return (
    <div className="space-y-6">
      {clicks.data ? (
        <ClicksBody
          summary={clicks.data}
          win={win}
          range={range}
          ga4={ga4.data}
          ga4FetchedAt={ga4.fetchedAt}
        />
      ) : clicks.error ? (
        <ErrorNote error={clicks.error} />
      ) : (
        <ClicksLoading />
      )}
      <Limitations items={limitations} />
    </div>
  );
}

function ClicksLoading() {
  return (
    <>
      <KpiGrid>
        <KpiTile label="Qualified clicks" value={null} loading />
        <KpiTile label="All recorded clicks" value={null} loading />
        <KpiTile label="Excluded as automated" value={null} loading />
        <KpiTile label="Last qualified click" value={null} loading />
      </KpiGrid>
      <Panel title="Clicks per day">
        <LoadingRows rows={6} />
      </Panel>
    </>
  );
}

function ClicksBody({
  summary,
  win,
  range,
  ga4,
  ga4FetchedAt,
}: {
  summary: ClicksSummary;
  win: OsWindow;
  range: OsRange;
  ga4: Ga4OutboundClicks | null;
  ga4FetchedAt: string | null;
}) {
  const source: SourceInfo = {
    label: SOURCE_LABEL,
    updatedAt: summary.generated_at,
    window: win.label,
  };
  const { totals } = summary;

  return (
    <>
      <div className="space-y-2">
        <KpiGrid>
          <KpiTile
            label="Qualified clicks"
            value={formatInt(totals.qualified)}
            delta={formatDelta(totals.qualified, summary.previous.qualified)}
            hint={`Previous ${win.days} days: ${formatInt(summary.previous.qualified)}`}
          />
          <KpiTile
            label="All recorded clicks"
            value={formatInt(totals.raw)}
            hint="Includes automated traffic"
          />
          <KpiTile
            label="Excluded as automated"
            value={formatInt(totals.excluded)}
            hint={exclusionBreakdown(totals.excluded_by_reason)}
          />
          <LastClickTile summary={summary} />
        </KpiGrid>
        <SourceLine source={source} />
      </div>

      {totals.raw === 0 ? (
        <EmptyState
          title="No provider clicks in this period"
          action={
            <Button asChild variant="outline" size="sm" className="h-10">
              <Link to="/control/command">Check site status</Link>
            </Button>
          }
        >
          Clicks only arrive while the public site is published and serving
          pages. The Command centre shows whether it is.
        </EmptyState>
      ) : (
        <>
          <Panel
            title="Clicks per day"
            subtitle="London calendar days. Today is still in progress."
            source={source}
            actions={
              <CsvButton
                label="Download CSV of clicks per day"
                onClick={() => downloadDaily(summary, win)}
              />
            }
          >
            <DailyChart
              data={summary.daily}
              series={[
                { key: "qualified", label: "Qualified", color: "series1" },
                {
                  key: "excluded",
                  label: "Excluded as automated",
                  color: "neutral",
                },
              ]}
              format={formatInt}
              ariaLabel={`Qualified and excluded provider clicks per day, ${win.label}`}
            />
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title="By provider"
              subtitle="Qualified clicks to each provider's site."
              source={source}
              actions={
                <CsvButton
                  label="Download CSV of clicks by provider"
                  onClick={() => downloadByProvider(summary, win)}
                />
              }
            >
              <BarList
                emptyText="No qualified clicks in this period."
                items={summary.by_provider.map((p) => ({
                  key: p.provider_id,
                  label: (
                    <Link
                      to={`/provider/${encodeURIComponent(p.provider_id)}`}
                      className="flex min-h-10 items-center underline-offset-2 hover:underline"
                    >
                      <span className="truncate">
                        {providerName(p.provider_id)}
                      </span>
                    </Link>
                  ),
                  value: p.clicks,
                  display: formatInt(p.clicks),
                  meta: `${formatShare(p.share)} of qualified clicks`,
                }))}
              />
            </Panel>

            <Panel
              title="By placement"
              subtitle="Where on the page the qualified click happened."
              source={source}
            >
              <BarList
                emptyText="No qualified clicks in this period."
                items={summary.by_placement.map((p) => ({
                  key: p.placement,
                  label: placementName(p.placement),
                  value: p.clicks,
                  display: formatInt(p.clicks),
                  meta: `${formatShare(p.share)} of qualified clicks`,
                }))}
              />
            </Panel>

            <Panel
              title="Top pages"
              subtitle="Our pages that sent the most qualified clicks."
              source={source}
            >
              <BarList
                emptyText="No qualified clicks in this period."
                items={summary.top_pages.map((p) => ({
                  key: p.source_page,
                  label: (
                    <span className="font-mono text-xs" title={p.source_page}>
                      {p.source_page}
                    </span>
                  ),
                  value: p.clicks,
                  display: formatInt(p.clicks),
                }))}
              />
            </Panel>

            <Panel
              title="Top tests"
              subtitle="Tests with the most qualified clicks, top 10."
              source={source}
            >
              <DataTable
                emptyText="No qualified clicks on a specific test in this period."
                columns={[
                  { key: "test", label: "Test" },
                  { key: "provider", label: "Provider" },
                  { key: "clicks", label: "Clicks", align: "right" },
                ]}
                rows={summary.top_tests.map((t) => ({
                  key: `${t.provider_id}:${t.test_id}`,
                  cells: {
                    test: t.test_name ?? (
                      <span className="break-all font-mono text-xs">
                        {t.test_id}
                      </span>
                    ),
                    provider: providerName(t.provider_id),
                    clicks: formatInt(t.clicks),
                  },
                }))}
              />
            </Panel>
          </div>

          <ExcludedPanel summary={summary} source={source} />
        </>
      )}

      {ga4?.available ? (
        <Ga4CrossCheck
          ga4={ga4}
          fetchedAt={ga4FetchedAt}
          range={range}
          win={win}
          summary={summary}
        />
      ) : null}
    </>
  );
}

function LastClickTile({ summary }: { summary: ClicksSummary }) {
  const lastAny = summary.last_click_at;
  const lastAnyMs = lastAny ? new Date(lastAny).getTime() : Number.NaN;
  const quiet =
    Number.isFinite(lastAnyMs) && Date.now() - lastAnyMs > QUIET_AFTER_MS;
  const quietDays = daysSince(lastAny);
  const pill =
    quiet && quietDays !== null ? (
      <StatusPill tone="warn">
        No clicks for {quietDays} {quietDays === 1 ? "day" : "days"}
      </StatusPill>
    ) : null;

  const lastQualified = summary.last_qualified_click_at;
  if (!lastQualified) {
    return (
      <KpiTile
        label="Last qualified click"
        value="None"
        hint={
          <div className="space-y-1">
            <div>None in this period</div>
            {pill}
          </div>
        }
      />
    );
  }
  return (
    <KpiTile
      label="Last qualified click"
      value={formatAgo(lastQualified)}
      hint={
        <div className="space-y-1">
          <div>{formatDateTime(lastQualified)} London time</div>
          {pill}
        </div>
      }
    />
  );
}

function ExcludedPanel({
  summary,
  source,
}: {
  summary: ClicksSummary;
  source: SourceInfo;
}) {
  const { method, totals, excluded_bursts: bursts } = summary;
  const flaggedOnly = totals.excluded - (totals.excluded_by_reason.burst ?? 0);

  let emptyText = "No automated traffic in this period.";
  if (totals.excluded > 0) {
    emptyText =
      flaggedOnly > 0
        ? `No fast repeat sweeps in this period. The ${formatInt(totals.excluded)} excluded clicks came from automation browsers or crawlers.`
        : "No fast repeat sweeps in this period.";
  }

  return (
    <Panel
      title="Automated traffic excluded"
      subtitle={`${formatInt(totals.excluded)} of ${formatInt(totals.raw)} recorded clicks left out of qualified clicks.`}
      source={source}
    >
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          When {formatInt(method.burst_min_clicks)} or more clicks hit one page
          within {formatInt(method.burst_window_seconds)} seconds of each other,
          we count them as an automated sweep and leave them out of qualified
          clicks. Clicks flagged on arrival as coming from an automation
          browser, a crawler or a single connection clicking faster than a
          person can are left out too, and every excluded click stays in the
          recorded total.
        </p>
        <DataTable
          emptyText={emptyText}
          columns={[
            { key: "page", label: "Page" },
            { key: "when", label: "When (London time)" },
            { key: "clicks", label: "Clicks", align: "right" },
            { key: "providers", label: "Providers" },
          ]}
          rows={bursts.map((b) => ({
            key: `${b.source_page}:${b.started_at}`,
            cells: {
              page: (
                <span className="break-all font-mono text-xs">
                  {b.source_page}
                </span>
              ),
              when: `${formatDateTime(b.started_at)} to ${formatDateTime(b.ended_at)}`,
              clicks: formatInt(b.clicks),
              providers: b.providers.map(providerName).join(", "),
            },
          }))}
        />
        {bursts.length >= 5 && (
          <p className="text-xs text-muted-foreground">
            The five largest sweeps are shown.
          </p>
        )}
      </div>
    </Panel>
  );
}

type CrossCheckRow = { providerId: string; ga4: number | null; ours: number };

/**
 * GA4 outbound clicks per provider next to our qualified clicks. Domains that
 * belong to no provider are skipped; several domains for one provider (www,
 * alternative domains) are added together.
 */
function crossCheckRows(
  ga4Rows: readonly { domain: string; clicks: number }[],
  byProvider: ClicksSummary["by_provider"],
): CrossCheckRow[] {
  const ga4 = new Map<string, number>();
  for (const row of ga4Rows) {
    const id = providerForHost(row.domain ?? "");
    if (!id || !Number.isFinite(row.clicks)) continue;
    ga4.set(id, (ga4.get(id) ?? 0) + row.clicks);
  }
  const ours = new Map(byProvider.map((p) => [p.provider_id, p.clicks]));
  const ids = new Set([...ga4.keys(), ...ours.keys()]);
  return [...ids]
    .map((id) => ({
      providerId: id,
      ga4: ga4.get(id) ?? null,
      ours: ours.get(id) ?? 0,
    }))
    .sort(
      (a, b) =>
        b.ours - a.ours ||
        (b.ga4 ?? 0) - (a.ga4 ?? 0) ||
        a.providerId.localeCompare(b.providerId),
    );
}

function Ga4CrossCheck({
  ga4,
  fetchedAt,
  range,
  win,
  summary,
}: {
  ga4: Ga4OutboundClicks;
  fetchedAt: string | null;
  range: OsRange;
  win: OsWindow;
  summary: ClicksSummary;
}) {
  const rows = crossCheckRows(
    ga4.ranges?.[snapshotRangeKey(range)] ?? [],
    summary.by_provider,
  );
  return (
    <Panel
      title="Cross-check with Google Analytics"
      subtitle="Clicks to provider sites as Google Analytics 4 (GA4) recorded them, next to our qualified clicks."
      source={{
        label: "Google Analytics 4 outbound clicks",
        updatedAt: fetchedAt,
        window: `last ${win.days} complete days to yesterday`,
      }}
    >
      <div className="space-y-3">
        <DataTable
          emptyText="Neither source has clicks to a provider site in this period."
          columns={[
            { key: "provider", label: "Provider" },
            { key: "ga4", label: "GA4 outbound clicks", align: "right" },
            { key: "ours", label: "Our qualified clicks", align: "right" },
          ]}
          rows={rows.map((r) => ({
            key: r.providerId,
            cells: {
              provider: providerName(r.providerId),
              ga4: r.ga4 === null ? "None listed" : formatInt(r.ga4),
              ours: formatInt(r.ours),
            },
          }))}
        />
        <p className="text-xs text-muted-foreground">
          GA4 counts only visitors who accepted analytics cookies, and its
          window ends yesterday while ours includes today, so the two will
          differ. None listed means GA4 returned no row for that provider's
          site. Links to sites other than providers are left out.
        </p>
      </div>
    </Panel>
  );
}

function exclusionBreakdown(
  byReason: ClicksSummary["totals"]["excluded_by_reason"],
): string {
  const counts = new Map<string, number>(
    Object.entries(byReason).filter(
      (e): e is [string, number] => typeof e[1] === "number" && e[1] > 0,
    ),
  );
  if (counts.size === 0) return "None in this period";
  const known = REASON_ORDER.filter((r) => counts.has(r)).map(
    (r) => `${REASON_LABEL[r]}: ${formatInt(counts.get(r))}`,
  );
  const other = [...counts.keys()]
    .filter((k) => !(REASON_ORDER as string[]).includes(k))
    .map((k) => `${k}: ${formatInt(counts.get(k))}`);
  return [...known, ...other].join(" · ");
}

function CsvButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-10"
      onClick={onClick}
      aria-label={label}
    >
      <Download aria-hidden />
      Download CSV
    </Button>
  );
}

function downloadDaily(summary: ClicksSummary, win: OsWindow) {
  const csv = toCsv(summary.daily, [
    { header: "Day (Europe/London)", value: (d) => d.day },
    { header: "Qualified clicks", value: (d) => d.qualified },
    { header: "Excluded as automated", value: (d) => d.excluded },
  ]);
  downloadCsv(
    `provider-clicks-daily-${win.firstDay}-to-${win.lastDay}.csv`,
    csv,
  );
}

function downloadByProvider(summary: ClicksSummary, win: OsWindow) {
  const csv = toCsv(summary.by_provider, [
    { header: "Provider id", value: (p) => p.provider_id },
    { header: "Provider", value: (p) => providerName(p.provider_id) },
    { header: "Qualified clicks", value: (p) => p.clicks },
    {
      header: "Share of qualified clicks (%)",
      value: (p) =>
        p.share === null ? null : Math.round(p.share * 10_000) / 100,
    },
  ]);
  downloadCsv(
    `provider-clicks-by-provider-${win.firstDay}-to-${win.lastDay}.csv`,
    csv,
  );
}
