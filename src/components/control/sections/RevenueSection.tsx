/**
 * Revenue: affiliate commission from os_revenue_summary (CSV imports and the
 * Awin sync), plus the Stripe and Awin plugin snapshots. Reversed conversions
 * are shown but never counted. Commission has no part in provider ranking.
 */
import { Download } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  BarList,
  DailyChart,
  DataTable,
  DeltaText,
  EmptyState,
  ErrorNote,
  KpiGrid,
  KpiTile,
  Limitations,
  LoadingRows,
  Panel,
  SourceLine,
  StatusPill,
} from "@/components/os/ui";
import {
  usePluginStatus,
  useOsRange,
  useOsWindow,
  useRevenueSummary,
  useSnapshot,
} from "@/hooks/os/useOs";
import { downloadCsv, toCsv } from "@/lib/os/csv";
import {
  formatAgo,
  formatDate,
  formatDay,
  formatDelta,
  formatGbp,
  formatInt,
  formatShare,
  providerName,
  type Delta,
} from "@/lib/os/format";
import {
  addDays,
  lastNDays,
  previousNDays,
  type OsWindow,
} from "@/lib/os/range";
import type { OsStatusResponse, RevenueSummary } from "@/lib/os/types";
import { Link } from "@/lib/router-compat";
import { getOsPlugin } from "../../../../supabase/functions/_shared/os/catalog";
import type {
  AwinSummary,
  StripeDaily,
} from "../../../../supabase/functions/_shared/os/contract";

const CONVERSIONS_SOURCE = "Affiliate conversions (CSV import and Awin sync)";

const SOURCE_NAMES: Record<string, string> = {
  csv: "CSV import",
  awin: "Awin sync",
};

function sourceName(source: string): string {
  return SOURCE_NAMES[source] ?? source;
}

/** Whole pounds on round values (axis ticks), pence otherwise. */
function gbpAxis(n: number): string {
  return Number.isInteger(n) ? formatGbp(n, { whole: true }) : formatGbp(n);
}

/**
 * A money figure for a KPI tile. One size smaller on phones so a five-figure
 * amount with pence fits a half-width tile instead of being cut off.
 */
function Money({ value }: { value: number }) {
  const text = formatGbp(value);
  return (
    <span className="text-xl sm:text-2xl" title={text}>
      {text}
    </span>
  );
}

function count(n: number, one: string, many: string): string {
  return `${formatInt(n)} ${n === 1 ? one : many}`;
}

function limitationsOf(id: string): string[] {
  return getOsPlugin(id)?.limitations ?? [];
}

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

export default function RevenueSection() {
  const [range] = useOsRange();
  const win = useOsWindow(range);
  const revenue = useRevenueSummary(range);
  const stripe = useSnapshot<StripeDaily>("stripe", "daily");
  const awin = useSnapshot<AwinSummary>("awin", "summary");
  const status = usePluginStatus();

  return (
    <div className="space-y-6">
      <p className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
        Commission is what the affiliate network reports, not cash received.
        Reversed conversions are listed but never count as revenue. Commission
        never affects how providers rank on myhealth checkup.
      </p>

      {revenue.data ? (
        <AffiliateRevenue
          summary={revenue.data}
          win={win}
          awin={awin.data}
          awinFetchedAt={awin.fetchedAt}
        />
      ) : revenue.error ? (
        <ErrorNote error={revenue.error} />
      ) : (
        <RevenueLoading />
      )}

      <StripePanel
        data={stripe.data}
        fetchedAt={stripe.fetchedAt}
        loading={stripe.isLoading}
        error={stripe.error}
        connection={connectionOf(status.data, "stripe")}
        days={win.days}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <AwinPanel
          data={awin.data}
          fetchedAt={awin.fetchedAt}
          loading={awin.isLoading}
          error={awin.error}
          connection={connectionOf(status.data, "awin")}
        />
        <ImportPanel />
      </div>

      <Limitations items={limitationsOf("conversion_import")} />
    </div>
  );
}

function RevenueLoading() {
  return (
    <>
      <KpiGrid>
        <KpiTile label="Commission" value={null} loading />
        <KpiTile label="Confirmed" value={null} loading />
        <KpiTile label="Pending" value={null} loading />
        <KpiTile label="Reversed" value={null} loading />
      </KpiGrid>
      <Panel title="Commission per day">
        <LoadingRows rows={6} />
      </Panel>
    </>
  );
}

// ---------------------------------------------------------------------------
// Affiliate commission
// ---------------------------------------------------------------------------

function AffiliateRevenue({
  summary,
  win,
  awin,
  awinFetchedAt,
}: {
  summary: RevenueSummary;
  win: OsWindow;
  awin: AwinSummary | null;
  awinFetchedAt: string | null;
}) {
  const { totals, previous } = summary;
  const source = {
    label: CONVERSIONS_SOURCE,
    updatedAt: summary.last_imported_at,
    window: win.label,
  };

  // Nothing has ever been imported or synced: zeros here would only mean
  // "not set up yet", so say that instead.
  if (
    summary.last_imported_at === null &&
    totals.conversions === 0 &&
    totals.reversed === 0
  ) {
    return (
      <Panel title="Affiliate commission">
        <EmptyState
          title="No affiliate revenue recorded yet"
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild variant="outline" size="sm" className="h-10">
                <Link to="/admin/affiliate">Import a network report</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-10">
                <Link to="/control/plugins">Connect Awin in Plugins</Link>
              </Button>
            </div>
          }
        >
          Revenue appears here after someone imports an affiliate network report
          on the Affiliate admin page, or after Awin is connected and has
          synced.
          {awin && (
            <>
              {" "}
              The last Awin sync ({formatAgo(awinFetchedAt)}) found{" "}
              {count(awin.transactions_seen, "transaction", "transactions")}.
            </>
          )}
        </EmptyState>
      </Panel>
    );
  }

  const matchedShare =
    totals.conversions > 0 ? totals.attributed / totals.conversions : null;
  // Rows with only reversed conversions carry nothing that counts.
  const byProvider = summary.by_provider.filter((p) => p.conversions > 0);
  const bySource = summary.by_source.filter((s) => s.conversions > 0);

  return (
    <>
      <div className="space-y-3">
        <KpiGrid>
          <KpiTile
            label="Commission"
            value={<Money value={totals.commission_gbp} />}
            delta={formatDelta(totals.commission_gbp, previous.commission_gbp)}
            hint={`Previous ${win.days} days: ${formatGbp(previous.commission_gbp)}`}
          />
          <KpiTile
            label="Confirmed"
            value={<Money value={totals.commission_confirmed_gbp} />}
            hint={count(totals.confirmed, "conversion", "conversions")}
          />
          <KpiTile
            label="Pending"
            value={<Money value={totals.commission_pending_gbp} />}
            hint={`${formatInt(totals.pending)} awaiting the network`}
          />
          <KpiTile
            label="Reversed"
            value={<Money value={totals.commission_reversed_gbp} />}
            hint={`${count(totals.reversed, "conversion", "conversions")}, not counted`}
          />
        </KpiGrid>
        <KpiGrid>
          <KpiTile
            label="Conversions"
            value={formatInt(totals.conversions)}
            delta={formatDelta(totals.conversions, previous.conversions)}
            hint="Confirmed and pending"
          />
          <KpiTile
            label="Order value"
            value={<Money value={totals.order_value_gbp} />}
            hint="Where the network reported one"
          />
          <KpiTile
            label="Matched to a click"
            value={matchedShare === null ? "None" : formatShare(matchedShare)}
            hint={
              matchedShare === null
                ? "No conversions in this period"
                : `${formatInt(totals.attributed)} of ${formatInt(totals.conversions)}. Unmatched means the provider did not send back the click reference we add to each link.`
            }
          />
          {totals.missing_commission > 0 && (
            <KpiTile
              label="Missing commission amount"
              value={formatInt(totals.missing_commission)}
              hint={
                <div className="space-y-1">
                  <StatusPill tone="warn">Amount not reported</StatusPill>
                  <div>These count as £0 until the network reports one.</div>
                </div>
              }
            />
          )}
        </KpiGrid>
        <SourceLine source={source} />
        {summary.last_converted_at && (
          <p className="text-[11px] text-muted-foreground">
            Latest conversion on record: {formatDate(summary.last_converted_at)}
          </p>
        )}
      </div>

      <Panel
        title="Commission per day"
        subtitle="Confirmed and pending commission by London calendar day. Reversed conversions are left out."
        source={source}
        actions={
          <CsvButton
            label="Download CSV of commission per day"
            onClick={() => downloadDaily(summary, win)}
          />
        }
      >
        <DailyChart
          data={summary.daily}
          series={[
            { key: "commission_gbp", label: "Commission", color: "series1" },
          ]}
          format={gbpAxis}
          ariaLabel={`Affiliate commission per day, ${win.label}`}
        />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          title="By provider"
          subtitle="Confirmed and pending conversions."
          source={source}
          actions={
            <CsvButton
              label="Download CSV of revenue by provider"
              onClick={() => downloadByProvider(byProvider, win)}
            />
          }
        >
          <DataTable
            emptyText="No conversions in this period."
            columns={[
              { key: "provider", label: "Provider" },
              { key: "conversions", label: "Conversions", align: "right" },
              { key: "commission", label: "Commission", align: "right" },
              { key: "order", label: "Order value", align: "right" },
            ]}
            rows={byProvider.map((p) => ({
              key: p.provider_id,
              cells: {
                provider: providerName(p.provider_id),
                conversions: formatInt(p.conversions),
                commission: formatGbp(p.commission_gbp),
                order: formatGbp(p.order_value_gbp),
              },
            }))}
          />
        </Panel>

        <Panel
          title="By source"
          subtitle="How each conversion reached us."
          source={source}
        >
          <BarList
            emptyText="No conversions in this period."
            items={bySource.map((s) => ({
              key: s.source,
              label: sourceName(s.source),
              value: s.commission_gbp,
              display: formatGbp(s.commission_gbp),
              meta: count(s.conversions, "conversion", "conversions"),
            }))}
          />
        </Panel>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Stripe
// ---------------------------------------------------------------------------

type StripeDay = StripeDaily["days"][number];

function sumOf(rows: readonly StripeDay[], key: keyof Omit<StripeDay, "date">) {
  return rows.reduce((total, row) => total + (Number(row[key]) || 0), 0);
}

/** Rounds to pence so float sums do not show stray fractions. */
function pence(n: number): number {
  return Math.round(n * 100) / 100;
}

function StripePanel({
  data,
  fetchedAt,
  loading,
  error,
  connection,
  days,
}: {
  data: StripeDaily | null;
  fetchedAt: string | null;
  loading: boolean;
  error: unknown;
  connection: Connection;
  days: number;
}) {
  const limitations = limitationsOf("stripe");
  const title = "Stripe";
  const subtitle = "Payments made to us directly.";

  if (loading) {
    return (
      <Panel title={title} subtitle={subtitle}>
        <LoadingRows rows={4} />
      </Panel>
    );
  }
  if (error) {
    return (
      <Panel title={title} subtitle={subtitle}>
        <ErrorNote error={error} />
      </Panel>
    );
  }
  if (!data) {
    return (
      <Panel title={title} subtitle={subtitle}>
        <NotSyncedState name="Stripe" connection={connection} />
      </Panel>
    );
  }

  const series = Array.isArray(data.days)
    ? [...data.days].sort((a, b) => a.date.localeCompare(b.date))
    : [];
  const sourceFor = (windowLabel?: string) => ({
    label: "Stripe",
    updatedAt: fetchedAt,
    window: windowLabel,
  });
  const notes = (
    <>
      {data.truncated && (
        <StatusPill tone="warn">
          Stopped at the transaction limit, so totals may be short
        </StatusPill>
      )}
      {data.non_gbp_skipped > 0 && (
        <p className="text-xs text-muted-foreground">
          {count(data.non_gbp_skipped, "transaction", "transactions")} in other
          currencies left out.
        </p>
      )}
    </>
  );

  if (series.length === 0) {
    return (
      <Panel title={title} subtitle={subtitle} source={sourceFor()}>
        <div className="space-y-3">
          <EmptyState title="No Stripe transactions in the last 90 days">
            The last Stripe sync found no balance transactions in GBP.
          </EmptyState>
          {notes}
          <Limitations items={limitations} />
        </div>
      </Panel>
    );
  }

  const current = lastNDays(series, days);
  const before = previousNDays(series, days);
  const end = series[series.length - 1].date;
  // Compare only when the data reaches back over the whole previous window.
  const hasPrevious = series[0].date <= addDays(end, -(2 * days - 1));
  const gross = pence(sumOf(current, "gross"));
  const refunds = pence(sumOf(current, "refunds"));
  const fees = pence(sumOf(current, "fees"));
  const net = pence(sumOf(current, "net"));
  const payments = sumOf(current, "count");
  const windowLabel = `last ${days} days to ${formatDay(end)}`;

  return (
    <Panel title={title} subtitle={subtitle} source={sourceFor(windowLabel)}>
      <div className="space-y-4">
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Figure
            label="Gross"
            value={formatGbp(gross)}
            delta={
              hasPrevious
                ? formatDelta(gross, pence(sumOf(before, "gross")))
                : undefined
            }
            hint={count(payments, "transaction", "transactions")}
          />
          <Figure label="Refunds" value={formatGbp(refunds)} />
          <Figure label="Fees" value={formatGbp(fees)} />
          <Figure
            label="Net"
            value={formatGbp(net)}
            delta={
              hasPrevious
                ? formatDelta(net, pence(sumOf(before, "net")))
                : undefined
            }
            hint="After fees and refunds"
          />
        </dl>
        {!hasPrevious && (
          <p className="text-xs text-muted-foreground">
            No comparison: the Stripe data does not reach back over the previous{" "}
            {days} days.
          </p>
        )}
        <DailyChart
          data={current.map((d) => ({ day: d.date, net: d.net }))}
          series={[{ key: "net", label: "Net", color: "series1" }]}
          format={gbpAxis}
          ariaLabel={`Stripe net revenue per day, ${windowLabel}`}
        />
        {notes}
        <Limitations items={limitations} />
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Awin
// ---------------------------------------------------------------------------

function AwinPanel({
  data,
  fetchedAt,
  loading,
  error,
  connection,
}: {
  data: AwinSummary | null;
  fetchedAt: string | null;
  loading: boolean;
  error: unknown;
  connection: Connection;
}) {
  const limitations = limitationsOf("awin");
  const title = "Awin sync";
  const subtitle = "What the last pull from the Awin affiliate network did.";

  if (loading) {
    return (
      <Panel title={title} subtitle={subtitle}>
        <LoadingRows rows={4} />
      </Panel>
    );
  }
  if (error) {
    return (
      <Panel title={title} subtitle={subtitle}>
        <ErrorNote error={error} />
      </Panel>
    );
  }
  if (!data) {
    return (
      <Panel title={title} subtitle={subtitle}>
        <div className="space-y-3">
          <NotSyncedState name="Awin" connection={connection} />
          <Limitations items={limitations} />
        </div>
      </Panel>
    );
  }

  const unmapped = Array.isArray(data.unmapped_advertisers)
    ? data.unmapped_advertisers
    : [];
  const syncWindow = data.window
    ? `sync window ${formatDate(data.window.from)} to ${formatDate(data.window.to)}`
    : undefined;

  return (
    <Panel
      title={title}
      subtitle={subtitle}
      source={{ label: "Awin", updatedAt: fetchedAt, window: syncWindow }}
    >
      <div className="space-y-4">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Figure
            label="Transactions seen"
            value={formatInt(data.transactions_seen)}
          />
          <Figure label="Stored" value={formatInt(data.upserted)} />
          <Figure label="Matched to a click" value={formatInt(data.matched)} />
          <Figure label="Rejected" value={formatInt(data.rejected)} />
          <Figure
            label="Non-GBP skipped"
            value={formatInt(data.non_gbp_skipped)}
          />
        </dl>
        <p className="text-xs text-muted-foreground">
          Stored conversions update existing rows rather than add duplicates.
          Rejected rows were missing a provider, reference, status or date, or
          appeared twice in one sync.
        </p>
        {unmapped.length > 0 && (
          <div className="space-y-2 rounded-lg border border-amber-600/30 bg-amber-500/5 p-3">
            <StatusPill tone="warn">
              {count(unmapped.length, "advertiser", "advertisers")} not mapped
              to a provider
            </StatusPill>
            <p className="break-all font-mono text-xs">{unmapped.join(", ")}</p>
            <p className="text-xs text-muted-foreground">
              Their conversions are stored as awin-&lt;id&gt; until you map
              them. Add each one under Advertiser to provider on the Awin
              plugin.
            </p>
            <Button asChild variant="outline" size="sm" className="h-10">
              <Link to="/control/plugins">Map advertisers in Plugins</Link>
            </Button>
          </div>
        )}
        <Limitations items={limitations} />
      </div>
    </Panel>
  );
}

/** A labelled figure inside a panel, smaller than a KPI tile so it fits. */
function Figure({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: Delta;
  hint?: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="text-lg font-semibold tabular-nums">{value}</dd>
      {delta && (
        <dd className="text-xs">
          <DeltaText delta={delta} />
        </dd>
      )}
      {hint && <dd className="text-xs text-muted-foreground">{hint}</dd>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function NotSyncedState({
  name,
  connection,
}: {
  name: string;
  connection: Connection;
}) {
  const action = (
    <Button asChild variant="outline" size="sm" className="h-10">
      <Link to="/control/plugins">Open Plugins</Link>
    </Button>
  );
  const copy: Record<Connection, { title: string; body: ReactNode }> = {
    not_connected: {
      title: `${name} is not connected`,
      body: `Connect ${name} in Plugins. Figures appear after the first sync.`,
    },
    off: {
      title: `${name} is turned off`,
      body: `Turn ${name} on in Plugins. Figures appear after the next sync.`,
    },
    connected: {
      title: `${name} has not synced yet`,
      body: `${name} is connected. Run a sync in Plugins, or wait for the hourly sync.`,
    },
    unknown: {
      title: `No ${name} data yet`,
      body: `Connect ${name} in Plugins, or run a sync there if it is already connected.`,
    },
  };
  const { title, body } = copy[connection];
  return (
    <EmptyState title={title} action={action}>
      {body}
    </EmptyState>
  );
}

function ImportPanel() {
  return (
    <Panel
      title="Import a network report"
      subtitle="For networks without a sync."
    >
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Download the transactions report from the affiliate network and upload
          the CSV file on the Affiliate admin page. Importing the same report
          again updates its rows instead of adding duplicates.
        </p>
        <Button asChild variant="outline" size="sm" className="h-10">
          <Link to="/admin/affiliate">Open the import page</Link>
        </Button>
      </div>
    </Panel>
  );
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

function downloadDaily(summary: RevenueSummary, win: OsWindow) {
  const csv = toCsv(summary.daily, [
    { header: "Day (Europe/London)", value: (d) => d.day },
    { header: "Conversions", value: (d) => d.conversions },
    { header: "Commission (GBP)", value: (d) => d.commission_gbp },
  ]);
  downloadCsv(`revenue-daily-${win.firstDay}-to-${win.lastDay}.csv`, csv);
}

function downloadByProvider(
  rows: RevenueSummary["by_provider"],
  win: OsWindow,
) {
  const csv = toCsv(rows, [
    { header: "Provider id", value: (p) => p.provider_id },
    { header: "Provider", value: (p) => providerName(p.provider_id) },
    { header: "Conversions", value: (p) => p.conversions },
    { header: "Commission (GBP)", value: (p) => p.commission_gbp },
    { header: "Order value (GBP)", value: (p) => p.order_value_gbp },
  ]);
  downloadCsv(`revenue-by-provider-${win.firstDay}-to-${win.lastDay}.csv`, csv);
}
