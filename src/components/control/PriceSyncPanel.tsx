import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Loader2,
  Play,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  fetchPriceSyncStatus,
  requestPriceSync,
  type PriceSyncRequestResult,
  type PriceSyncStatusRow,
} from "@/api/supabase/priceSync.api";
import { getProviderName } from "@/constants/providers";

const STATUS_KEY = ["price-sync-status"];

const londonTime = (iso: string | null, withDate = false) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        ...(withDate ? { day: "numeric", month: "short" } : {}),
      })
    : "never";

function CycleBadge({ status }: { status: string | undefined }) {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-emerald-600 hover:bg-emerald-600">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Synced
        </Badge>
      );
    case "partial":
      return (
        <Badge className="bg-amber-500 hover:bg-amber-500">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Partly synced
        </Badge>
      );
    case "error":
    case "failed":
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Failed
        </Badge>
      );
    case undefined:
      return (
        <Badge variant="outline">
          <Clock className="mr-1 h-3 w-3" />
          No runs yet
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function describeResult(result: PriceSyncRequestResult): {
  ok: boolean;
  message: string;
} {
  const queued = result.queued.map((q) => {
    const name = getProviderName(q.provider_id);
    const span =
      q.jobs > 1
        ? `${q.jobs} requests from ${londonTime(q.first_run_at)} to ${londonTime(q.last_run_at)}`
        : `request at ${londonTime(q.first_run_at)}`;
    return `${name}: ${span}.`;
  });
  const skipped = result.skipped.map(
    (s) => `${getProviderName(s.provider_id)}: ${s.reason}`,
  );
  const lines = [
    ...queued,
    ...(result.feeds_refreshing && queued.length
      ? [
          "Shopify feeds are being fetched first, so those providers start in two minutes.",
        ]
      : []),
    ...skipped,
  ];
  return { ok: queued.length > 0, message: lines.join(" ") };
}

function ProviderRow({
  row,
  busy,
  disabled,
  onSync,
}: {
  row: PriceSyncStatusRow;
  busy: boolean;
  disabled: boolean;
  onSync: () => void;
}) {
  const cycle = row.last_cycle;
  const queued = row.queued_jobs > 0;
  return (
    <li className="flex flex-col gap-3 border-t px-4 py-3 first:border-t-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">
            {getProviderName(row.provider_id)}
          </span>
          <CycleBadge status={cycle?.status} />
          {queued && (
            <Badge variant="secondary">
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              {row.queued_jobs} queued, next at {londonTime(row.next_job_at)}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {row.active_tests} active tests
          {cycle
            ? ` · last sync ${londonTime(cycle.finished_at ?? cycle.started_at, true)}: ${cycle.tests_seen} checked, ${cycle.tests_updated} updated, ${cycle.tests_new} new`
            : ""}
          {cycle && cycle.errors > 0
            ? `, ${cycle.errors} ${cycle.errors === 1 ? "error" : "errors"}`
            : ""}
          {row.next_scheduled_at
            ? ` · next scheduled ${londonTime(row.next_scheduled_at)}`
            : ""}
        </p>
        {row.last_request_failure && (
          <p className="text-xs text-destructive">
            Last manual sync: {row.last_request_failed_jobs} of its requests
            failed. {row.last_request_failure}
          </p>
        )}
      </div>
      <Button
        size="sm"
        variant="outline"
        className="h-10 shrink-0 self-start sm:self-center"
        disabled={disabled || queued}
        onClick={onSync}
      >
        {busy ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Play className="mr-2 h-4 w-4" />
        )}
        Sync now
      </Button>
    </li>
  );
}

/**
 * Manual controls for the live mhc-* price sync. Each button queues the same
 * jobs pg_cron runs every six hours, keeping their spacing; results land in
 * scrape_runs like any scheduled run.
 */
export function PriceSyncPanel() {
  const queryClient = useQueryClient();
  const status = useQuery({
    queryKey: STATUS_KEY,
    queryFn: fetchPriceSyncStatus,
    staleTime: 0,
    refetchInterval: (query) =>
      (query.state.data ?? []).some((r) => r.queued_jobs > 0) ? 15_000 : 60_000,
  });

  const sync = useMutation({
    mutationFn: (providerId: string | undefined) =>
      requestPriceSync(providerId),
    onSuccess: (result) => {
      const { ok, message } = describeResult(result);
      if (ok) toast.success("Price sync queued", { description: message });
      else toast.info("Nothing queued", { description: message });
    },
    onError: (err) =>
      toast.error("Price sync not queued", {
        description: err instanceof Error ? err.message : String(err),
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: STATUS_KEY }),
  });

  const rows = status.data ?? [];
  const busyProvider = sync.isPending ? (sync.variables ?? "all") : null;

  return (
    <section
      aria-labelledby="price-sync-heading"
      className="overflow-hidden rounded-xl border bg-card"
    >
      <div className="flex flex-col gap-3 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="price-sync-heading" className="text-sm font-semibold">
            Price sync
          </h2>
          <p className="text-xs text-muted-foreground">
            Runs the same mhc-* jobs as the six-hourly schedule. Results appear
            here within a few minutes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-10"
            onClick={() => void status.refetch()}
            disabled={status.isFetching}
            aria-label="Refresh price sync status"
          >
            <RefreshCw
              className={`h-4 w-4 ${status.isFetching ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            size="sm"
            className="h-10"
            disabled={sync.isPending}
            onClick={() => sync.mutate(undefined)}
          >
            {busyProvider === "all" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="mr-2 h-4 w-4" />
            )}
            Sync all providers
          </Button>
        </div>
      </div>

      {status.isError ? (
        <p role="alert" className="px-4 py-3 text-sm text-destructive">
          Price sync status could not be loaded:{" "}
          {status.error instanceof Error
            ? status.error.message
            : String(status.error)}
        </p>
      ) : status.isLoading ? (
        <p className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading price sync status
        </p>
      ) : (
        <ul>
          {rows.map((row) => (
            <ProviderRow
              key={row.provider_id}
              row={row}
              busy={busyProvider === row.provider_id}
              disabled={sync.isPending}
              onSync={() => sync.mutate(row.provider_id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
