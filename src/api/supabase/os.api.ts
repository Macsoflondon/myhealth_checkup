import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { edgeInvoke } from "@/lib/edgeInvoke";
import type {
  ClicksSummary,
  OsBriefResponse,
  OsFact,
  OsInsightInput,
  OsStatusResponse,
  OsSyncResponse,
  OsTestResponse,
  PluginSettingsRow,
  PluginSnapshotRow,
  PluginSyncLogRow,
  RevenueSummary,
  SecretStatusRow,
} from "@/lib/os/types";

// The AI OS tables and RPCs are not in the generated types until the
// migration is applied, so use an untyped view of the client.
const db = supabase as unknown as SupabaseClient;

const FUNCTION = "os-plugins";

async function rpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await db.rpc(name, args);
  if (error) throw new Error(error.message);
  return data as T;
}

export function fetchClicksSummary(
  from: Date,
  to: Date,
): Promise<ClicksSummary> {
  return rpc<ClicksSummary>("os_clicks_summary", {
    p_from: from.toISOString(),
    p_to: to.toISOString(),
  });
}

export function fetchRevenueSummary(
  from: Date,
  to: Date,
): Promise<RevenueSummary> {
  return rpc<RevenueSummary>("os_revenue_summary", {
    p_from: from.toISOString(),
    p_to: to.toISOString(),
  });
}

/** Every plugin snapshot in one request (a few dozen rows at most). */
export async function fetchPluginSnapshots(): Promise<PluginSnapshotRow[]> {
  const { data, error } = await db
    .from("os_plugin_snapshots")
    .select(
      "plugin_id, dataset, payload, period_start, period_end, fetched_at",
    );
  if (error) throw new Error(error.message);
  return (data ?? []) as PluginSnapshotRow[];
}

export async function fetchPluginSettings(): Promise<PluginSettingsRow[]> {
  const { data, error } = await db
    .from("os_plugin_settings")
    .select("plugin_id, enabled, config, updated_at, updated_by");
  if (error) throw new Error(error.message);
  return (data ?? []) as PluginSettingsRow[];
}

export async function savePluginSettings(row: {
  plugin_id: string;
  enabled: boolean;
  config: Record<string, unknown>;
}): Promise<void> {
  const { error } = await db
    .from("os_plugin_settings")
    .upsert(row, { onConflict: "plugin_id" });
  if (error) throw new Error(error.message);
}

export async function fetchSyncLog(limit = 50): Promise<PluginSyncLogRow[]> {
  const { data, error } = await db
    .from("os_plugin_sync_log")
    .select(
      "id, plugin_id, trigger, status, started_at, finished_at, records, message",
    )
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as PluginSyncLogRow[];
}

export function fetchSecretStatus(): Promise<SecretStatusRow[]> {
  return rpc<SecretStatusRow[]>("os_plugin_secret_status", {});
}

/** Stores a credential in Vault. An empty value removes it. Never read back. */
export async function setPluginSecret(
  scope: string,
  key: string,
  value: string,
): Promise<void> {
  await rpc<null>("os_set_plugin_secret", {
    p_plugin: scope,
    p_key: key,
    p_value: value,
  });
}

function invoke<T>(body: Record<string, unknown>): Promise<T> {
  return edgeInvoke<T>(FUNCTION, body);
}

export function fetchPluginStatus(): Promise<OsStatusResponse> {
  return invoke<OsStatusResponse>({ action: "status" });
}

export function syncPlugins(plugins?: string[]): Promise<OsSyncResponse> {
  return invoke<OsSyncResponse>({ action: "sync", plugins, trigger: "manual" });
}

export function testPlugin(plugin: string): Promise<OsTestResponse> {
  return invoke<OsTestResponse>({ action: "test", plugin });
}

export function fetchBriefing(
  facts: OsFact[],
  insights: OsInsightInput[],
): Promise<OsBriefResponse> {
  return invoke<OsBriefResponse>({ action: "brief", facts, insights });
}
