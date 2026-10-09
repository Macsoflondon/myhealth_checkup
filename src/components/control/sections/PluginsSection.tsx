/**
 * Plugins: where admins connect the AI OS data sources. Lists every plugin in
 * the catalogue by category with its status, settings and write-only
 * credential fields, and shows the latest sync attempts from
 * os_plugin_sync_log. The catalogue drives the page, so it still renders
 * when the os-plugins edge function does not answer.
 */
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  LogStatusPill,
  PluginCard,
  SYNC_LOG_ROWS,
} from "@/components/os/PluginCard";
import {
  DataTable,
  ErrorNote,
  LoadingRows,
  Panel,
  SourceLine,
} from "@/components/os/ui";
import { usePluginStatus, useSyncLog, useSyncPlugins } from "@/hooks/os/useOs";
import { formatDateTime, formatInt } from "@/lib/os/format";
import {
  errorText,
  summariseSync,
  TRIGGER_LABEL,
} from "@/lib/os/plugin-config";
import {
  getOsPlugin,
  OS_PLUGINS,
  type OsPluginCategory,
} from "../../../../supabase/functions/_shared/os/catalog";

const CATEGORIES: { id: OsPluginCategory; label: string }[] = [
  { id: "clicks", label: "Clicks" },
  { id: "traffic", label: "Traffic" },
  { id: "social", label: "Social" },
  { id: "revenue", label: "Revenue" },
  { id: "platform", label: "Platform" },
];

function pluginName(id: string): string {
  return getOsPlugin(id)?.name ?? id;
}

export default function PluginsSection() {
  const status = usePluginStatus();
  const syncAll = useSyncPlugins();

  async function onSyncAll() {
    try {
      const res = await syncAll.mutateAsync(undefined);
      if (!Array.isArray(res?.results)) {
        toast.error("The sync answer was not readable.", {
          description: "Check the sync history below for what ran.",
        });
        return;
      }
      const summary = summariseSync(res.results);
      const failed = res.results
        .filter((r) => r.status === "error")
        .map((r) => pluginName(r.plugin_id));
      if (failed.length > 0) {
        toast.error(summary, {
          description: `Failed: ${failed.join(", ")}. The sync history below has the reasons.`,
        });
      } else {
        toast.success(summary);
      }
    } catch (e) {
      toast.error("The sync did not run.", { description: errorText(e) });
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-prose text-sm text-muted-foreground">
            Plugins pull figures from other services into this dashboard once an
            hour. Credentials you save here go into Supabase Vault, which keeps
            them encrypted, and this page cannot read them back. Nothing on this
            page changes what visitors see on the public site.
          </p>
          <Button
            type="button"
            className="h-10 w-full shrink-0 sm:w-auto"
            onClick={() => void onSyncAll()}
            disabled={syncAll.isPending}
          >
            {syncAll.isPending ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : (
              <RefreshCw aria-hidden />
            )}
            {syncAll.isPending ? "Syncing" : "Sync all now"}
          </Button>
        </div>

        {status.error ? (
          <ErrorNote
            error={
              new Error(
                `The os-plugins edge function did not answer, so each plugin's status is unknown. Settings and saved credentials below still load from the database. If you have not deployed it yet, deploy os-plugins in Supabase. Details: ${errorText(status.error)}`,
              )
            }
          />
        ) : status.data ? (
          <SourceLine
            source={{
              label: "Plugin status from the os-plugins edge function",
              updatedAt: status.data.checked_at,
            }}
          />
        ) : null}
      </div>

      {CATEGORIES.map((c) => {
        const plugins = OS_PLUGINS.filter((p) => p.category === c.id);
        if (plugins.length === 0) return null;
        const headingId = `plugins-${c.id}`;
        return (
          <section key={c.id} aria-labelledby={headingId} className="space-y-3">
            <h2 id={headingId} className="text-lg font-semibold">
              {c.label}
            </h2>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {plugins.map((p) => (
                <PluginCard key={p.id} plugin={p} />
              ))}
            </div>
          </section>
        );
      })}

      <SyncHistory />
    </div>
  );
}

function SyncHistory() {
  const log = useSyncLog();
  const rows = log.data ?? [];

  return (
    <Panel
      title="Sync history"
      subtitle={`The latest ${SYNC_LOG_ROWS} attempts: hourly and manual syncs, and connection tests. The sync skips plugins that are turned off or not set up and logs nothing for them.`}
      source={{
        label: "Plugin sync log",
        window: "entries kept for 90 days",
        updatedAt: log.dataUpdatedAt
          ? new Date(log.dataUpdatedAt).toISOString()
          : null,
      }}
    >
      {log.isLoading ? (
        <LoadingRows rows={5} />
      ) : log.error ? (
        <ErrorNote error={log.error} />
      ) : (
        <DataTable
          columns={[
            { key: "time", label: "Time" },
            { key: "plugin", label: "Plugin" },
            { key: "trigger", label: "Trigger" },
            { key: "status", label: "Status" },
            { key: "records", label: "Records", align: "right" },
            { key: "message", label: "Message" },
          ]}
          rows={rows.map((r) => ({
            key: String(r.id),
            cells: {
              time: (
                <time
                  dateTime={r.started_at}
                  className="whitespace-nowrap tabular-nums"
                >
                  {formatDateTime(r.started_at)}
                </time>
              ),
              plugin: pluginName(r.plugin_id),
              trigger: (
                <span className="whitespace-nowrap">
                  {TRIGGER_LABEL[r.trigger] ?? r.trigger}
                </span>
              ),
              status: <LogStatusPill row={r} />,
              records: formatInt(r.records),
              message: r.message ? (
                <span className="block min-w-[12rem] max-w-prose whitespace-normal break-words text-xs">
                  {r.message}
                </span>
              ) : (
                <span className="text-muted-foreground">–</span>
              ),
            },
          }))}
          emptyText="No sync attempts yet. Select Sync all now, or wait for the hourly run."
        />
      )}
    </Panel>
  );
}
