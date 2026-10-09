/**
 * One plugin from the AI OS catalogue: status, last sync and test, dataset
 * freshness, test and sync buttons, the settings form and write-only
 * credential fields.
 *
 * Credentials go to Vault through os_set_plugin_secret and never come back.
 * The credential inputs are uncontrolled (the value never enters React
 * state), cleared after a successful save, and the settled mutation is
 * removed from the React Query cache so the value does not linger there.
 */
import {
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Loader2,
  PlugZap,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ErrorNote,
  Limitations,
  LoadingRows,
  StatusPill,
} from "@/components/os/ui";
import {
  usePluginSettings,
  usePluginSnapshots,
  usePluginStatus,
  useSavePluginSettings,
  useSecretStatus,
  useSetPluginSecret,
  useSyncLog,
  useSyncPlugins,
  useTestPlugin,
} from "@/hooks/os/useOs";
import { formatAgo, formatDateTime, formatInt } from "@/lib/os/format";
import {
  checkSecretValue,
  configToForm,
  errorText,
  formToConfig,
  pluginState,
  sameFormValues,
  secretState,
  TRIGGER_LABEL,
  type ConfigFormValues,
  type SecretState,
} from "@/lib/os/plugin-config";
import type {
  OsPluginStatus,
  PluginSettingsRow,
  PluginSyncLogRow,
} from "@/lib/os/types";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import {
  OS_PLUGINS,
  secretScope,
  type OsPluginConfigField,
  type OsPluginDefinition,
  type OsPluginKind,
  type OsPluginSecret,
} from "../../../supabase/functions/_shared/os/catalog";

/** Rows useSyncLog reads (fetchSyncLog(50)), newest first. */
export const SYNC_LOG_ROWS = 50;

/** os_plugin_sync_log keeps rows for this long (cron clean-up). */
const LOG_RETENTION_DAYS = 90;

const KIND_LABEL: Record<OsPluginKind, string> = {
  native: "Built in",
  sync: "Hourly sync",
  service: "On demand",
};

const INTERNAL_LINK_LABEL: Record<string, string> = {
  "/admin/affiliate": "Import conversions on the Affiliate admin page",
};

// The shared Input is styled for the public site (white, navy placeholder).
// Match the dashboard surface and keep placeholders visibly lighter.
const INPUT_CLASS =
  "bg-background text-foreground placeholder:text-muted-foreground";

const ROSE_TEXT = "text-rose-800 dark:text-rose-300";

function recordsText(n: number): string {
  return `${formatInt(n)} ${n === 1 ? "record" : "records"}`;
}

function datasetLabel(dataset: string): string {
  const words = dataset.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function secretLabel(plugin: OsPluginDefinition, key: string): string {
  for (const group of plugin.secretGroups) {
    for (const s of group.secrets) if (s.key === key) return s.label;
  }
  return key;
}

/** Other plugins that read the same Vault entry. */
function sharedWith(
  plugin: OsPluginDefinition,
  secret: OsPluginSecret,
): string[] {
  const scope = secretScope(plugin, secret);
  if (scope === plugin.id) return [];
  return OS_PLUGINS.filter(
    (p) =>
      p.id !== plugin.id &&
      p.secretGroups.some((g) =>
        g.secrets.some(
          (s) => s.key === secret.key && secretScope(p, s) === scope,
        ),
      ),
  ).map((p) => p.name);
}

/** Replaces a credential in a message, in case an error ever echoes it. */
function withoutValue(text: string, value: string): string {
  const v = value.trim();
  return v.length >= 4 ? text.split(v).join("[hidden]") : text;
}

function latestInstant(values: string[]): string | null {
  let best: string | null = null;
  let bestT = -Infinity;
  for (const v of values) {
    const t = Date.parse(v);
    if (Number.isFinite(t) && t > bestT) {
      best = v;
      bestT = t;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Small pieces shared with the section
// ---------------------------------------------------------------------------

export function LogStatusPill({
  row,
}: {
  row: Pick<PluginSyncLogRow, "status" | "trigger">;
}) {
  if (row.status === "ok") {
    return (
      <StatusPill tone="ok">
        {row.trigger === "test" ? "Passed" : "Synced"}
      </StatusPill>
    );
  }
  if (row.status === "error") {
    return <StatusPill tone="error">Failed</StatusPill>;
  }
  return <StatusPill tone="idle">Skipped</StatusPill>;
}

function Ago({ iso }: { iso: string }) {
  return (
    <time dateTime={iso} title={formatDateTime(iso)}>
      {formatAgo(iso)}
    </time>
  );
}

function LogFact({ row }: { row: PluginSyncLogRow }) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <Ago iso={row.started_at} />
        {row.trigger !== "test" && (
          <>
            <span aria-hidden>·</span>
            <span>{TRIGGER_LABEL[row.trigger] ?? row.trigger}</span>
          </>
        )}
        <LogStatusPill row={row} />
        {row.records !== null && (
          <span className="text-muted-foreground">
            {recordsText(row.records)}
          </span>
        )}
      </div>
      {row.message && (
        <p
          className={cn(
            "break-words",
            row.status === "error" ? ROSE_TEXT : "text-muted-foreground",
          )}
        >
          {row.message}
        </p>
      )}
    </div>
  );
}

function KindBadge({ kind }: { kind: OsPluginKind }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {KIND_LABEL[kind]}
    </span>
  );
}

function DocsLink({ url }: { url: string }) {
  const className =
    "inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline";
  if (url.startsWith("/") && !url.startsWith("//")) {
    return (
      <Link to={url} className={className}>
        {INTERNAL_LINK_LABEL[url] ?? `Open ${url}`}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      API documentation
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h4>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

export function PluginCard({ plugin }: { plugin: OsPluginDefinition }) {
  const headingId = useId();
  const status = usePluginStatus();
  const log = useSyncLog();
  const snapshots = usePluginSnapshots();
  const test = useTestPlugin();
  const sync = useSyncPlugins();

  const native = plugin.kind === "native";
  // edgeInvoke does not validate the body, so check the list exists.
  const statusPlugins = status.data?.plugins;
  const entry: OsPluginStatus | null = Array.isArray(statusPlugins)
    ? (statusPlugins.find((p) => p.plugin_id === plugin.id) ?? null)
    : null;

  const logRows = useMemo(
    () => (log.data ?? []).filter((r) => r.plugin_id === plugin.id),
    [log.data, plugin.id],
  );
  const snapRows = useMemo(
    () => (snapshots.data ?? []).filter((r) => r.plugin_id === plugin.id),
    [snapshots.data, plugin.id],
  );
  const latestFetch = latestInstant(snapRows.map((r) => r.fetched_at));
  const lastSync = logRows.find((r) => r.trigger !== "test");
  const lastTest = logRows.find((r) => r.trigger === "test");
  const logTruncated = (log.data?.length ?? 0) >= SYNC_LOG_ROWS;

  const checking =
    !native && (status.isLoading || log.isLoading || snapshots.isLoading);
  const state = checking
    ? null
    : pluginState(plugin, entry, logRows[0], latestFetch);

  const missing =
    entry && entry.enabled
      ? [
          ...entry.missing_secrets.map((k) => secretLabel(plugin, k)),
          ...entry.missing_config,
        ]
      : [];

  async function onTest() {
    try {
      const r = await test.mutateAsync(plugin.id);
      if (r.ok) {
        toast.success(`${plugin.name}: connection works.`, {
          description: r.message,
        });
      } else {
        toast.error(`${plugin.name}: connection test failed.`, {
          description: r.message,
        });
      }
    } catch (e) {
      toast.error(`${plugin.name}: the test did not run.`, {
        description: errorText(e),
      });
    }
  }

  async function onSync() {
    try {
      const res = await sync.mutateAsync([plugin.id]);
      const r = Array.isArray(res?.results)
        ? res.results.find((x) => x.plugin_id === plugin.id)
        : undefined;
      if (!r) {
        toast.error(`${plugin.name} did not sync.`, {
          description:
            "The os-plugins function returned no result for this plugin.",
        });
      } else if (r.status === "ok") {
        const parts = [
          r.records !== null ? `${recordsText(r.records)}.` : null,
          r.message,
        ].filter((p): p is string => Boolean(p));
        toast.success(`${plugin.name} synced.`, {
          description: parts.length > 0 ? parts.join(" ") : undefined,
        });
      } else if (r.status === "skipped") {
        toast.info(`${plugin.name} did not sync.`, {
          description: r.message ?? undefined,
        });
      } else {
        toast.error(`${plugin.name} sync failed.`, {
          description: r.message ?? undefined,
        });
      }
    } catch (e) {
      toast.error(`${plugin.name} did not sync.`, {
        description: errorText(e),
      });
    }
  }

  const noRow = log.isLoading
    ? "Loading"
    : log.error
      ? "The sync log did not load."
      : logTruncated
        ? `None in the latest ${SYNC_LOG_ROWS} log entries`
        : `None in the last ${LOG_RETENTION_DAYS} days`;

  return (
    <article
      aria-labelledby={headingId}
      className="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4 sm:p-5"
    >
      <header className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3 id={headingId} className="text-sm font-semibold leading-tight">
            {plugin.name}
          </h3>
          <KindBadge kind={plugin.kind} />
          {state ? (
            <StatusPill tone={state.tone}>{state.label}</StatusPill>
          ) : (
            <StatusPill tone="idle">Checking</StatusPill>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{plugin.summary}</p>
        {missing.length > 0 && (
          <p className="text-xs text-amber-900 dark:text-amber-300">
            Still needed: {missing.join(", ")}.
            {entry &&
              entry.missing_secrets.length > 0 &&
              plugin.secretGroups.length > 1 &&
              " Any one complete set of credentials is enough."}
          </p>
        )}
      </header>

      {!native && (
        <dl className="grid grid-cols-1 gap-x-4 gap-y-1 text-xs sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-y-2">
          {plugin.kind === "sync" && (
            <>
              <dt className="font-medium text-muted-foreground">Last sync</dt>
              <dd className="mb-2 min-w-0 sm:mb-0">
                {lastSync ? <LogFact row={lastSync} /> : noRow}
              </dd>
            </>
          )}
          <dt className="font-medium text-muted-foreground">
            Last connection test
          </dt>
          <dd className="mb-2 min-w-0 sm:mb-0">
            {lastTest ? <LogFact row={lastTest} /> : noRow}
          </dd>
          {plugin.datasets.length > 0 && (
            <>
              <dt className="font-medium text-muted-foreground">Datasets</dt>
              <dd className="min-w-0">
                <ul className="space-y-0.5">
                  {plugin.datasets.map((d) => {
                    const snap = snapRows.find((r) => r.dataset === d);
                    return (
                      <li key={d}>
                        <span className="font-medium">{datasetLabel(d)}</span>{" "}
                        <span className="text-muted-foreground">
                          {snap ? (
                            <>
                              updated <Ago iso={snap.fetched_at} />
                            </>
                          ) : snapshots.isLoading ? (
                            "loading"
                          ) : snapshots.error ? (
                            "could not be read"
                          ) : (
                            "not fetched yet"
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </>
          )}
        </dl>
      )}

      {!native && (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() => void onTest()}
            disabled={test.isPending}
          >
            {test.isPending ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : (
              <PlugZap aria-hidden />
            )}
            {test.isPending ? "Testing" : "Test connection"}
          </Button>
          {plugin.kind === "sync" && (
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => void onSync()}
              disabled={sync.isPending}
            >
              {sync.isPending ? (
                <Loader2 className="animate-spin" aria-hidden />
              ) : (
                <RefreshCw aria-hidden />
              )}
              {sync.isPending ? "Syncing" : "Sync now"}
            </Button>
          )}
        </div>
      )}

      {!native && (
        <details className="group rounded-lg border">
          <summary className="flex min-h-10 cursor-pointer list-none select-none items-center gap-2 px-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
            <ChevronRight
              className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90 motion-reduce:transition-none"
              aria-hidden
            />
            Settings and credentials
          </summary>
          <div className="space-y-6 border-t px-3 py-4">
            <SettingsBlock plugin={plugin} />
            <CredentialsBlock
              plugin={plugin}
              entry={entry}
              statusKnown={Boolean(status.data)}
              statusLoading={status.isLoading}
            />
          </div>
        </details>
      )}

      <footer className="mt-auto space-y-2">
        <Limitations items={plugin.limitations} />
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground/80">Privacy:</span>{" "}
          {plugin.privacy}
        </p>
        {plugin.docsUrl && <DocsLink url={plugin.docsUrl} />}
      </footer>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

function SettingsBlock({ plugin }: { plugin: OsPluginDefinition }) {
  const settings = usePluginSettings();

  if (settings.isLoading) {
    return (
      <div className="space-y-2">
        <SubHeading>Settings</SubHeading>
        <LoadingRows rows={3} />
      </div>
    );
  }
  if (settings.error) {
    return (
      <div className="space-y-2">
        <SubHeading>Settings</SubHeading>
        <ErrorNote
          error={
            new Error(
              `The saved settings did not load. This page hides the form so a save cannot overwrite them. ${errorText(settings.error)}`,
            )
          }
        />
      </div>
    );
  }
  const row = settings.data?.find((r) => r.plugin_id === plugin.id) ?? null;
  // Remount when the saved row changes so the form starts from it.
  return (
    <SettingsForm key={row?.updated_at ?? "none"} plugin={plugin} row={row} />
  );
}

function SettingsForm({
  plugin,
  row,
}: {
  plugin: OsPluginDefinition;
  row: PluginSettingsRow | null;
}) {
  const switchId = useId();
  const initialEnabled = row?.enabled ?? true;
  const initialValues = useMemo(
    () => configToForm(plugin, row?.config),
    [plugin, row],
  );
  const [enabled, setEnabled] = useState(initialEnabled);
  const [values, setValues] = useState<ConfigFormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const save = useSavePluginSettings();

  const dirty =
    enabled !== initialEnabled || !sameFormValues(values, initialValues);

  function setValue(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = formToConfig(plugin, values, row?.config);
    if (!parsed.ok) {
      setErrors(parsed.errors);
      return;
    }
    setErrors({});
    try {
      await save.mutateAsync({
        plugin_id: plugin.id,
        enabled,
        config: parsed.config,
      });
      toast.success(`${plugin.name} settings saved.`);
    } catch (err) {
      toast.error(`${plugin.name} settings were not saved.`, {
        description: errorText(err),
      });
    }
  }

  const enabledHelp =
    plugin.kind === "service"
      ? "When off, the dashboard does not call this service."
      : "When off, the hourly sync skips this plugin.";

  return (
    <form onSubmit={(e) => void onSubmit(e)} noValidate className="space-y-4">
      <SubHeading>Settings</SubHeading>

      <div className="flex min-h-10 items-center justify-between gap-3">
        <div className="min-w-0">
          <Label htmlFor={switchId}>Turned on</Label>
          <p className="mt-1 text-xs text-muted-foreground">{enabledHelp}</p>
        </div>
        <Switch
          id={switchId}
          checked={enabled}
          onCheckedChange={setEnabled}
          className="relative after:absolute after:-inset-2"
        />
      </div>

      {plugin.config.map((field) => (
        <ConfigFieldInput
          key={field.key}
          field={field}
          value={values[field.key] ?? ""}
          error={errors[field.key] ?? null}
          onChange={(v) => setValue(field.key, v)}
        />
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          className="h-10"
          disabled={save.isPending || !dirty}
        >
          {save.isPending && <Loader2 className="animate-spin" aria-hidden />}
          Save settings
        </Button>
        <span className="text-xs text-muted-foreground">
          {row
            ? `Last saved ${formatDateTime(row.updated_at)}.`
            : "Using the built-in defaults. Nothing saved yet."}
        </span>
      </div>
    </form>
  );
}

function ConfigFieldInput({
  field,
  value,
  error,
  onChange,
}: {
  field: OsPluginConfigField;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const describedBy = error ? `${helpId} ${errorId}` : helpId;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {field.label}
        {field.required && (
          <span className="font-normal text-muted-foreground"> (required)</span>
        )}
      </Label>
      {field.type === "map" ? (
        <Textarea
          id={id}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? "key=value"}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className="font-mono text-base md:text-sm"
        />
      ) : (
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          autoComplete="off"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={INPUT_CLASS}
        />
      )}
      <p id={helpId} className="text-xs text-muted-foreground">
        {field.help}
      </p>
      {error && (
        <p id={errorId} role="alert" className={cn("text-xs", ROSE_TEXT)}>
          {error}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

function CredentialsBlock({
  plugin,
  entry,
  statusKnown,
  statusLoading,
}: {
  plugin: OsPluginDefinition;
  entry: OsPluginStatus | null;
  statusKnown: boolean;
  statusLoading: boolean;
}) {
  const vault = useSecretStatus();

  if (plugin.secretGroups.length === 0) {
    return (
      <div className="space-y-2">
        <SubHeading>Credentials</SubHeading>
        <p className="text-xs text-muted-foreground">
          This plugin needs no credentials.
        </p>
      </div>
    );
  }

  const multiple = plugin.secretGroups.length > 1;

  return (
    <div className="space-y-3">
      <SubHeading>Credentials</SubHeading>
      <p className="text-xs text-muted-foreground">
        Supabase Vault stores what you save here, encrypted. This page cannot
        show a saved value again: to change one, paste a new value. An edge
        function environment variable with the same name takes precedence over
        Vault.
      </p>
      {vault.error && (
        <ErrorNote
          error={
            new Error(
              `The list of saved credentials did not load, so Vault dates are missing. ${errorText(vault.error)}`,
            )
          }
        />
      )}
      {multiple && (
        <p className="text-xs font-medium">Any one of these sets is enough.</p>
      )}
      {plugin.secretGroups.map((group, i) => (
        <fieldset
          key={group.label}
          className="min-w-0 space-y-4 rounded-lg border p-3"
        >
          <legend className="px-1 text-xs font-medium">
            {multiple ? `Set ${i + 1}: ${group.label}` : group.label}
          </legend>
          {group.secrets.map((secret) => {
            const scope = secretScope(plugin, secret);
            const found =
              statusKnown && entry
                ? entry.secrets.find(
                    (s) => s.key === secret.key && s.scope === scope,
                  )
                : undefined;
            const vaultRow = vault.data?.find(
              (r) => r.plugin_id === scope && r.secret_key === secret.key,
            );
            return (
              <SecretField
                key={secret.key}
                plugin={plugin}
                secret={secret}
                state={secretState(
                  found ? found.source : undefined,
                  vault.data ? (vaultRow?.updated_at ?? null) : undefined,
                )}
                checking={statusLoading || vault.isLoading}
              />
            );
          })}
        </fieldset>
      ))}
    </div>
  );
}

function SecretStatus({
  state,
  checking,
}: {
  state: SecretState;
  checking: boolean;
}) {
  if (checking) return <StatusPill tone="idle">Checking</StatusPill>;
  switch (state.kind) {
    case "env":
      return (
        <StatusPill tone="ok">Set in the edge function environment</StatusPill>
      );
    case "vault":
      return (
        <StatusPill tone="ok">
          {state.savedAt
            ? `Saved in Vault ${formatDateTime(state.savedAt)}`
            : "Saved in Vault"}
        </StatusPill>
      );
    case "unset":
      return <StatusPill tone="idle">Not set</StatusPill>;
    case "not_in_vault":
      return <StatusPill tone="idle">Not in Vault</StatusPill>;
    case "unknown":
      return <StatusPill tone="idle">Unknown</StatusPill>;
  }
}

function SecretField({
  plugin,
  secret,
  state,
  checking,
}: {
  plugin: OsPluginDefinition;
  secret: OsPluginSecret;
  state: SecretState;
  checking: boolean;
}) {
  const id = useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [hasValue, setHasValue] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();
  const setSecret = useSetPluginSecret();
  const shared = useMemo(() => sharedWith(plugin, secret), [plugin, secret]);

  const scope = secretScope(plugin, secret);
  const inVault =
    state.kind === "vault" ||
    (state.kind === "env" && state.vaultSavedAt !== null);
  const pending = setSecret.isPending;

  function field(): HTMLInputElement | HTMLTextAreaElement | null {
    return secret.multiline ? areaRef.current : inputRef.current;
  }

  /**
   * Sends one value to Vault. The value travels as a mutation variable, so
   * the settled mutation is dropped from the cache straight away.
   */
  async function store(value: string): Promise<void> {
    const vars = { scope, key: secret.key, value };
    try {
      await setSecret.mutateAsync(vars);
    } finally {
      setSecret.reset();
      const cache = qc.getMutationCache();
      const settled = cache.findAll({
        predicate: (mutation) => mutation.state.variables === vars,
      });
      for (const mutation of settled) cache.remove(mutation);
    }
  }

  async function onSave() {
    const value = field()?.value ?? "";
    const problem = checkSecretValue(secret.key, value);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    try {
      await store(value);
      const el = field();
      if (el) el.value = "";
      setHasValue(false);
      toast.success(`${secret.label} saved to Vault.`);
    } catch (e) {
      setError(`Not saved. ${withoutValue(errorText(e), value)}`);
    }
  }

  async function onRemove() {
    const parts = [`Remove ${secret.label} from Vault?`];
    if (shared.length > 0) {
      parts.push(
        `${joinNames(shared)} ${shared.length === 1 ? "uses" : "use"} it too.`,
      );
    }
    parts.push(
      state.kind === "env"
        ? "The edge function environment variable stays in use."
        : "Syncs that need it stop until you save it again.",
    );
    if (!window.confirm(parts.join(" "))) return;
    setError(null);
    try {
      await store("");
      toast.success(`${secret.label} removed from Vault.`);
    } catch (e) {
      setError(`Not removed. ${errorText(e)}`);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (hasValue && !pending) void onSave();
    }
  }

  const note =
    state.kind === "env" && state.vaultSavedAt
      ? `The function ignores the Vault copy saved ${formatDateTime(state.vaultSavedAt)} while the environment variable is set.`
      : state.kind === "not_in_vault"
        ? "This page could not check the edge function environment."
        : state.kind === "unknown"
          ? "Neither the status check nor the Vault list answered."
          : null;

  const inputProps = {
    id,
    autoComplete: "off",
    spellCheck: false,
    autoCapitalize: "off",
    autoCorrect: "off",
    "data-1p-ignore": "true",
    "data-lpignore": "true",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${helpId} ${errorId}` : helpId,
    placeholder:
      state.kind === "vault" || state.kind === "env"
        ? "Paste a new value to replace it"
        : "Paste the value",
  } as const;

  return (
    <div className="min-w-0 space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor={id}>{secret.label}</Label>
        <SecretStatus state={state} checking={checking} />
      </div>
      <div id={helpId} className="space-y-1 text-xs text-muted-foreground">
        <p>{secret.help}</p>
        {note && <p>{note}</p>}
        {shared.length > 0 ? (
          <p>
            Shared with {joinNames(shared)}. Saving or removing it here changes
            it there too.
          </p>
        ) : (
          scope !== plugin.id && (
            <p>Shared with other plugins that use the same credential.</p>
          )
        )}
      </div>
      {secret.multiline ? (
        <Textarea
          ref={areaRef}
          rows={4}
          onChange={(e) => setHasValue(e.target.value.trim() !== "")}
          className="font-mono text-base md:text-xs"
          {...inputProps}
        />
      ) : (
        <Input
          ref={inputRef}
          type="password"
          onChange={(e) => setHasValue(e.target.value.trim() !== "")}
          onKeyDown={onKeyDown}
          className={INPUT_CLASS}
          {...inputProps}
        />
      )}
      {error && (
        <p id={errorId} role="alert" className={cn("text-xs", ROSE_TEXT)}>
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={() => void onSave()}
          disabled={!hasValue || pending}
        >
          {pending && <Loader2 className="animate-spin" aria-hidden />}
          Save to Vault
        </Button>
        {inVault && (
          <Button
            type="button"
            variant="ghost"
            className={cn("h-10", ROSE_TEXT)}
            onClick={() => void onRemove()}
            disabled={pending}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
