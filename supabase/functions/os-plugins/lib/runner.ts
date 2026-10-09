// Sync and test orchestration for os-plugins: works out which plugins are
// ready, runs their adapters with time limits, stores the snapshots and
// writes one sync-log row per attempt. Plugins that are turned off or not set
// up are skipped before any outbound call.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";
import {
  OS_PLUGINS,
  type OsPluginDefinition,
} from "../../_shared/os/catalog.ts";
import type {
  OsPluginStatus,
  OsSyncResult,
  OsSyncTrigger,
  OsTestResponse,
} from "../../_shared/os/contract.ts";
import { getAdapter } from "../adapters/index.ts";
import type {
  AdapterContext,
  AdapterResult,
  PluginAdapter,
  RpcClient,
} from "../adapters/types.ts";
import { createHttp, errorText, redact } from "./http.ts";
import {
  assessReadiness,
  createVaultReader,
  describeMissing,
  effectiveConfig,
  type Readiness,
  type ResolvedSecrets,
  resolvePluginSecrets,
  type VaultReader,
} from "./secrets.ts";

export type ServiceDb = SupabaseClient;

export const SYNC_TIMEOUT_MS = 60_000;
export const TEST_TIMEOUT_MS = 30_000;
export const MANUAL_COOLDOWN_MS = 60_000;
const MESSAGE_MAX = 2000;

const DATASET_RE = /^[a-z0-9_]{1,60}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** A table the function depends on could not be read. */
export class StoreReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoreReadError";
  }
}

class TimeLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeLimitError";
  }
}

type PluginSettings = { enabled: boolean; config: Record<string, unknown> };

export type Runtime = {
  db: ServiceDb;
  rpc: RpcClient;
  settings: Map<string, PluginSettings>;
  vault: VaultReader;
};

export type PluginState = {
  plugin: OsPluginDefinition;
  enabled: boolean;
  config: Record<string, unknown>;
  secrets: ResolvedSecrets;
  readiness: Readiness;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Trims to `max` characters without splitting a surrogate pair. */
export function clip(text: string, max = MESSAGE_MAX): string {
  const chars = Array.from(text);
  if (chars.length <= max) return text;
  return `${chars.slice(0, max - 1).join("")}…`;
}

function sentence(text: string): string {
  const t = text.trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

function secretList(state: PluginState): string[] {
  return Object.values(state.secrets.values);
}

/** Error text safe for the sync log and the dashboard. */
function failureMessage(e: unknown, secrets: string[]): string {
  const raw = errorText(e, "The plugin failed without a message.");
  return clip(redact(raw, secrets));
}

function withTimeLimit<T>(
  work: Promise<T>,
  ms: number,
  message: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const limit = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeLimitError(message)), ms);
  });
  return Promise.race([work, limit]).finally(() => clearTimeout(timer));
}

function rpcClient(db: ServiceDb): RpcClient {
  return {
    rpc: (fn, args) => db.rpc(fn, args),
  };
}

export async function createRuntime(db: ServiceDb): Promise<Runtime> {
  const { data, error } = await db
    .from("os_plugin_settings")
    .select("plugin_id, enabled, config");
  if (error) {
    throw new StoreReadError(
      `Could not read plugin settings: ${clip(error.message, 200)}`,
    );
  }
  const settings = new Map<string, PluginSettings>();
  for (const row of (data ?? []) as Record<string, unknown>[]) {
    if (typeof row.plugin_id !== "string") continue;
    settings.set(row.plugin_id, {
      enabled: row.enabled !== false,
      config: isRecord(row.config) ? row.config : {},
    });
  }
  const rpc = rpcClient(db);
  return { db, rpc, settings, vault: createVaultReader(rpc) };
}

export async function pluginState(
  runtime: Runtime,
  plugin: OsPluginDefinition,
): Promise<PluginState> {
  const saved = runtime.settings.get(plugin.id);
  const config = effectiveConfig(plugin, saved?.config);
  const secrets = await resolvePluginSecrets(plugin, runtime.vault);
  return {
    plugin,
    enabled: saved?.enabled ?? true,
    config,
    secrets,
    readiness: assessReadiness(plugin, config, secrets.values),
  };
}

export function toStatus(state: PluginState): OsPluginStatus {
  return {
    plugin_id: state.plugin.id,
    enabled: state.enabled,
    ready: state.readiness.ready,
    secrets: state.secrets.sources,
    missing_secrets: state.readiness.missing_secrets,
    missing_config: state.readiness.missing_config,
  };
}

/** Catalogue plugins of kind "sync" that have a registered adapter. */
export function syncPlugins(): OsPluginDefinition[] {
  return OS_PLUGINS.filter((p) => p.kind === "sync" && getAdapter(p.id));
}

function buildContext(
  runtime: Runtime,
  state: PluginState,
  previous: Record<string, unknown>,
  now: Date,
): AdapterContext {
  return {
    plugin: state.plugin,
    config: state.config,
    secrets: state.secrets.values,
    http: createHttp(fetch, secretList(state)),
    db: runtime.rpc,
    previous,
    now,
  };
}

async function writeLog(
  runtime: Runtime,
  row: {
    plugin_id: string;
    trigger: OsSyncTrigger | "test";
    status: "ok" | "error";
    started_at: Date;
    records: number | null;
    message: string | null;
  },
): Promise<void> {
  const { error } = await runtime.db.from("os_plugin_sync_log").insert({
    plugin_id: row.plugin_id,
    trigger: row.trigger,
    status: row.status,
    started_at: row.started_at.toISOString(),
    finished_at: new Date().toISOString(),
    records: row.records,
    message: row.message === null ? null : clip(row.message),
  });
  if (error) {
    console.error(
      `[os-plugins] sync log insert failed for ${row.plugin_id}: ${error.message}`,
    );
  }
}

/** Stores each returned dataset; returns warnings for anything left out. */
async function saveDatasets(
  runtime: Runtime,
  plugin: OsPluginDefinition,
  out: AdapterResult,
): Promise<string[]> {
  const warnings: string[] = [];
  const fetchedAt = new Date().toISOString();
  const rows: Record<string, unknown>[] = [];
  const seen = new Set<string>();
  for (const d of Array.isArray(out.datasets) ? out.datasets : []) {
    if (
      !d ||
      typeof d.dataset !== "string" ||
      !DATASET_RE.test(d.dataset) ||
      !plugin.datasets.includes(d.dataset)
    ) {
      warnings.push(
        `Ignored a dataset the catalogue does not list (${String(d?.dataset)}).`,
      );
      continue;
    }
    if (d.payload === undefined || d.payload === null) {
      warnings.push(`Dataset ${d.dataset} came back empty and was not saved.`);
      continue;
    }
    if (seen.has(d.dataset)) continue;
    seen.add(d.dataset);
    rows.push({
      plugin_id: plugin.id,
      dataset: d.dataset,
      payload: d.payload,
      period_start:
        typeof d.period_start === "string" && DATE_RE.test(d.period_start)
          ? d.period_start
          : null,
      period_end:
        typeof d.period_end === "string" && DATE_RE.test(d.period_end)
          ? d.period_end
          : null,
      fetched_at: fetchedAt,
    });
  }
  if (rows.length === 0) return warnings;
  const { error } = await runtime.db
    .from("os_plugin_snapshots")
    .upsert(rows, { onConflict: "plugin_id,dataset" });
  if (error) {
    throw new Error(`Could not save the results: ${clip(error.message, 300)}`);
  }
  return warnings;
}

async function runOne(
  runtime: Runtime,
  state: PluginState,
  adapter: PluginAdapter,
  previous: Record<string, unknown>,
  trigger: OsSyncTrigger,
  now: Date,
): Promise<OsSyncResult> {
  const started = new Date();
  const secrets = secretList(state);
  try {
    const out = await withTimeLimit(
      adapter.sync(buildContext(runtime, state, previous, now)),
      SYNC_TIMEOUT_MS,
      `The sync took longer than ${SYNC_TIMEOUT_MS / 1000} s and was stopped.`,
    );
    const warnings = [
      ...(Array.isArray(out.warnings) ? out.warnings : []),
      ...(await saveDatasets(runtime, state.plugin, out)),
    ].filter((w) => typeof w === "string" && w.trim() !== "");
    const message =
      warnings.length > 0
        ? clip(redact(warnings.map(sentence).join(" "), secrets))
        : null;
    const records =
      typeof out.records === "number" && Number.isFinite(out.records)
        ? Math.max(0, Math.round(out.records))
        : null;
    await writeLog(runtime, {
      plugin_id: state.plugin.id,
      trigger,
      status: "ok",
      started_at: started,
      records,
      message,
    });
    return {
      plugin_id: state.plugin.id,
      status: "ok",
      records,
      message,
      duration_ms: Date.now() - started.getTime(),
    };
  } catch (e) {
    const message = failureMessage(e, secrets);
    await writeLog(runtime, {
      plugin_id: state.plugin.id,
      trigger,
      status: "error",
      started_at: started,
      records: null,
      message,
    });
    return {
      plugin_id: state.plugin.id,
      status: "error",
      records: null,
      message,
      duration_ms: Date.now() - started.getTime(),
    };
  }
}

function skipped(pluginId: string, message: string): OsSyncResult {
  return {
    plugin_id: pluginId,
    status: "skipped",
    records: null,
    message,
    duration_ms: 0,
  };
}

/** Plugin ids with a manual sync started within the cooldown window. */
async function recentManualSyncs(
  runtime: Runtime,
  ids: string[],
  now: Date,
): Promise<Map<string, number>> {
  const since = new Date(now.getTime() - MANUAL_COOLDOWN_MS).toISOString();
  const { data, error } = await runtime.db
    .from("os_plugin_sync_log")
    .select("plugin_id, started_at")
    .eq("trigger", "manual")
    .gte("started_at", since)
    .in("plugin_id", ids);
  if (error) {
    throw new StoreReadError(
      `Could not read the sync log: ${clip(error.message, 200)}`,
    );
  }
  const latest = new Map<string, number>();
  for (const row of (data ?? []) as Record<string, unknown>[]) {
    if (typeof row.plugin_id !== "string") continue;
    const t = Date.parse(String(row.started_at));
    if (!Number.isFinite(t)) continue;
    latest.set(row.plugin_id, Math.max(latest.get(row.plugin_id) ?? 0, t));
  }
  return latest;
}

async function loadPrevious(
  runtime: Runtime,
  ids: string[],
): Promise<Map<string, Record<string, unknown>>> {
  const out = new Map<string, Record<string, unknown>>();
  if (ids.length === 0) return out;
  const { data, error } = await runtime.db
    .from("os_plugin_snapshots")
    .select("plugin_id, dataset, payload")
    .in("plugin_id", ids);
  if (error) {
    throw new StoreReadError(
      `Could not read the previous results: ${clip(error.message, 200)}`,
    );
  }
  for (const row of (data ?? []) as Record<string, unknown>[]) {
    if (typeof row.plugin_id !== "string" || typeof row.dataset !== "string") {
      continue;
    }
    const prev = out.get(row.plugin_id) ?? {};
    prev[row.dataset] = row.payload;
    out.set(row.plugin_id, prev);
  }
  return out;
}

/**
 * Syncs the requested plugins (all sync plugins when `pluginIds` is
 * undefined). Results come back in catalogue order.
 */
export async function runSync(
  runtime: Runtime,
  pluginIds: string[] | undefined,
  trigger: OsSyncTrigger,
): Promise<OsSyncResult[]> {
  const now = new Date();
  const plugins = syncPlugins().filter(
    (p) => pluginIds === undefined || pluginIds.includes(p.id),
  );
  if (plugins.length === 0) return [];

  const results = new Map<string, OsSyncResult>();
  const errorResult = (pluginId: string, message: string): OsSyncResult => ({
    plugin_id: pluginId,
    status: "error",
    records: null,
    message,
    duration_ms: 0,
  });

  type Loaded = {
    plugin: OsPluginDefinition;
    state: PluginState | null;
    error: unknown;
  };
  const loaded = await Promise.all(
    plugins.map(async (plugin): Promise<Loaded> => {
      try {
        const state = await pluginState(runtime, plugin);
        return { plugin, state, error: null };
      } catch (e) {
        return { plugin, state: null, error: e };
      }
    }),
  );

  const runnable: PluginState[] = [];
  for (const { plugin, state, error } of loaded) {
    if (state === null) {
      // Credentials could not be read: no outbound call, but log it.
      const message = failureMessage(error, []);
      await writeLog(runtime, {
        plugin_id: plugin.id,
        trigger,
        status: "error",
        started_at: now,
        records: null,
        message,
      });
      results.set(plugin.id, errorResult(plugin.id, message));
    } else if (!state.enabled) {
      results.set(plugin.id, skipped(plugin.id, "Turned off in Plugins."));
    } else if (!state.readiness.ready) {
      const missing = describeMissing(plugin, state.readiness);
      results.set(plugin.id, skipped(plugin.id, `Not set up yet. ${missing}`));
    } else {
      runnable.push(state);
    }
  }

  let toRun = runnable;
  if (trigger === "manual" && runnable.length > 0) {
    const recent = await recentManualSyncs(
      runtime,
      runnable.map((s) => s.plugin.id),
      now,
    );
    toRun = [];
    for (const state of runnable) {
      const last = recent.get(state.plugin.id);
      if (last === undefined) {
        toRun.push(state);
        continue;
      }
      const wait = Math.max(
        1,
        Math.ceil((last + MANUAL_COOLDOWN_MS - now.getTime()) / 1000),
      );
      const message =
        "A manual sync of this plugin started less than a minute ago. " +
        `Try again in ${wait} s.`;
      results.set(state.plugin.id, skipped(state.plugin.id, message));
    }
  }

  if (toRun.length > 0) {
    let previous: Map<string, Record<string, unknown>>;
    try {
      previous = await loadPrevious(
        runtime,
        toRun.map((s) => s.plugin.id),
      );
    } catch (e) {
      // Without the previous payloads an adapter would overwrite its history,
      // so nothing runs.
      const message = failureMessage(e, []);
      for (const state of toRun) {
        await writeLog(runtime, {
          plugin_id: state.plugin.id,
          trigger,
          status: "error",
          started_at: now,
          records: null,
          message,
        });
        results.set(state.plugin.id, errorResult(state.plugin.id, message));
      }
      previous = new Map();
      toRun = [];
    }

    const ran = await Promise.all(
      toRun.map((state) =>
        runOne(
          runtime,
          state,
          getAdapter(state.plugin.id) as PluginAdapter,
          previous.get(state.plugin.id) ?? {},
          trigger,
          now,
        ),
      ),
    );
    for (const r of ran) results.set(r.plugin_id, r);
  }

  return plugins
    .map((p) => results.get(p.id))
    .filter((r): r is OsSyncResult => r !== undefined);
}

/**
 * Runs one adapter's credential test. Not-ready plugins answer ok: false
 * with what is missing, without any outbound call.
 */
export async function runTest(
  runtime: Runtime,
  plugin: OsPluginDefinition,
  test: (state: PluginState, ctx: AdapterContext) => Promise<string>,
): Promise<OsTestResponse> {
  const state = await pluginState(runtime, plugin);
  if (!state.readiness.ready) {
    return {
      plugin_id: plugin.id,
      ok: false,
      message: `Not ready to test. ${describeMissing(plugin, state.readiness)}`,
      duration_ms: 0,
    };
  }
  const started = new Date();
  const secrets = secretList(state);
  try {
    const raw = await withTimeLimit(
      test(state, buildContext(runtime, state, {}, started)),
      TEST_TIMEOUT_MS,
      `The test took longer than ${TEST_TIMEOUT_MS / 1000} s and was stopped.`,
    );
    const message = clip(redact(String(raw || "Connected."), secrets));
    await writeLog(runtime, {
      plugin_id: plugin.id,
      trigger: "test",
      status: "ok",
      started_at: started,
      records: null,
      message,
    });
    return {
      plugin_id: plugin.id,
      ok: true,
      message,
      duration_ms: Date.now() - started.getTime(),
    };
  } catch (e) {
    const message = failureMessage(e, secrets);
    await writeLog(runtime, {
      plugin_id: plugin.id,
      trigger: "test",
      status: "error",
      started_at: started,
      records: null,
      message,
    });
    return {
      plugin_id: plugin.id,
      ok: false,
      message,
      duration_ms: Date.now() - started.getTime(),
    };
  }
}
