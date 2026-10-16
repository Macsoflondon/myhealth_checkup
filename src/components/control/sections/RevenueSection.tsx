/**
 * Revenue: affiliate commission from os_revenue_summary, over the
 * conversions imported as CSV on /admin/affiliate. Reversed conversions are
 * shown but never counted. Commission has no part in provider ranking.
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
} from "@/components/os/ui";
import { useOsRange, useOsWindow, useRevenueSummary } from "@/hooks/os/useOs";
import { downloadCsv, toCsv } from "@/lib/os/csv";
import {
  formatDate,
  formatDelta,
  formatGbp,
  formatInt,
  formatShare,
  providerName,
} from "@/lib/os/format";
import { previousCovered, type OsWindow } from "@/lib/os/range";
import type { RevenueSummary } from "@/lib/os/types";
import { Link } from "@/lib/router-compat";
import { getOsPlugin } from "../../../../supabase/functions/_shared/os/catalog";

const CONVERSIONS_SOURCE = "Affiliate conversions (CSV import)";

const SOURCE_NAMES: Record<string, string> = {
  csv: "CSV import",
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

export default function RevenueSection() {
  const [range] = useOsRange();
  const win = useOsWindow(range);
  const revenue = useRevenueSummary(range);

  return (
    <div className="space-y-6">
      <p className="rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
        Commission is what the affiliate network reports, not cash received.
        Reversed conversions are listed but never count as revenue. Commission
        never affects how providers rank on myhealth checkup.
      </p>

      {revenue.data ? (
        <AffiliateRevenue summary={revenue.data} win={win} />
      ) : revenue.error ? (
        <ErrorNote error={revenue.error} />
      ) : (
        <RevenueLoading />
      )}

      <ImportPanel />

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
}: {
  summary: RevenueSummary;
  win: OsWindow;
}) {
  const { totals, previous } = summary;
  const covered = previousCovered(summary.earliest_converted_at, previous.from);
  const source = {
    label: CONVERSIONS_SOURCE,
    updatedAt: summary.last_imported_at,
    window: win.label,
  };

  // Nothing has ever been imported: zeros here would only mean "not set up
  // yet", so say that instead.
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
            <Button asChild variant="outline" size="sm" className="h-10">
              <Link to="/admin/affiliate">Import a network report</Link>
            </Button>
          }
        >
          Revenue shows here once you upload an affiliate network report as a
          CSV file on the Affiliate admin page.
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
            delta={formatDelta(
              totals.commission_gbp,
              covered ? previous.commission_gbp : null,
            )}
            hint={
              covered
                ? `Previous ${win.days} days to the same time of day: ${formatGbp(previous.commission_gbp)}`
                : `Conversion records start after the previous ${win.days} days began`
            }
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
            delta={formatDelta(
              totals.conversions,
              covered ? previous.conversions : null,
            )}
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
// Shared bits
// ---------------------------------------------------------------------------

function ImportPanel() {
  return (
    <Panel
      title="Import a network report"
      subtitle="Conversions on this page come from CSV imports."
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
