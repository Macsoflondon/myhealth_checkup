import { useCallback, useMemo } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "@/lib/router-compat";
import {
  fetchBriefing,
  fetchClicksSummary,
  fetchPluginSettings,
  fetchPluginSnapshots,
  fetchPluginStatus,
  fetchRevenueSummary,
  fetchSecretStatus,
  fetchSyncLog,
  savePluginSettings,
  setPluginSecret,
  syncPlugins,
  testPlugin,
} from "@/api/supabase/os.api";
import {
  isOsRange,
  osWindow,
  parseOsRange,
  type OsRange,
} from "@/lib/os/range";
import type { OsFact, OsInsightInput, PluginSnapshotRow } from "@/lib/os/types";

const MIN = 60_000;

export const osKeys = {
  all: ["os"] as const,
  clicks: (from: string, to: string) => ["os", "clicks", from, to] as const,
  revenue: (from: string, to: string) => ["os", "revenue", from, to] as const,
  snapshots: ["os", "snapshots"] as const,
  settings: ["os", "settings"] as const,
  syncLog: ["os", "sync-log"] as const,
  status: ["os", "status"] as const,
  secrets: ["os", "secrets"] as const,
  brief: (key: string) => ["os", "brief", key] as const,
};

const RANGE_STORAGE_KEY = "mhc-os-range";

/** The range last picked in this tab, so links between sections keep it. */
function rememberedRange(): OsRange | null {
  try {
    const v = window.sessionStorage.getItem(RANGE_STORAGE_KEY);
    return isOsRange(v) ? v : null;
  } catch {
    return null;
  }
}

function rememberRange(range: OsRange): void {
  try {
    window.sessionStorage.setItem(RANGE_STORAGE_KEY, range);
  } catch {
    // Storage blocked: the range still lives in the address.
  }
}

/**
 * Dashboard range (7d | 28d | 90d), shared by every section. ?range= wins;
 * without it, the range last picked in this tab, so a link from one section
 * to another opens the same period.
 */
export function useOsRange(): [OsRange, (next: OsRange) => void] {
  const [params, setParams] = useSearchParams();
  const fromUrl = params.get("range");
  const range = isOsRange(fromUrl)
    ? fromUrl
    : typeof window === "undefined"
      ? parseOsRange(null)
      : (rememberedRange() ?? parseOsRange(null));
  const setRange = useCallback(
    (next: OsRange) => {
      rememberRange(next);
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          p.set("range", next);
          return p;
        },
        { replace: true },
      );
    },
    [setParams],
  );
  return [range, setRange];
}

/**
 * The current window. Cheap to compute on each render; its boundaries only
 * move at London midnight, so query keys stay stable within a day.
 */
export function useOsWindow(range: OsRange) {
  return osWindow(range);
}

export function useClicksSummary(range: OsRange) {
  const w = useOsWindow(range);
  return useQuery({
    queryKey: osKeys.clicks(w.from.toISOString(), w.to.toISOString()),
    queryFn: () => fetchClicksSummary(w.from, w.to),
    staleTime: 2 * MIN,
    refetchInterval: 5 * MIN,
  });
}

export function useRevenueSummary(range: OsRange) {
  const w = useOsWindow(range);
  return useQuery({
    queryKey: osKeys.revenue(w.from.toISOString(), w.to.toISOString()),
    queryFn: () => fetchRevenueSummary(w.from, w.to),
    staleTime: 5 * MIN,
  });
}

export function usePluginSnapshots() {
  return useQuery({
    queryKey: osKeys.snapshots,
    queryFn: fetchPluginSnapshots,
    staleTime: 5 * MIN,
  });
}

/** One dataset's snapshot, typed by the caller from the shared contract. */
export function useSnapshot<T>(pluginId: string, dataset: string) {
  const q = usePluginSnapshots();
  const row = useMemo<PluginSnapshotRow | undefined>(
    () =>
      q.data?.find((r) => r.plugin_id === pluginId && r.dataset === dataset),
    [q.data, pluginId, dataset],
  );
  return {
    isLoading: q.isLoading,
    error: q.error,
    data: (row?.payload ?? null) as T | null,
    fetchedAt: row?.fetched_at ?? null,
  };
}

export function usePluginSettings() {
  return useQuery({
    queryKey: osKeys.settings,
    queryFn: fetchPluginSettings,
    staleTime: 5 * MIN,
  });
}

export function useSyncLog() {
  return useQuery({
    queryKey: osKeys.syncLog,
    queryFn: () => fetchSyncLog(50),
    staleTime: MIN,
  });
}

export function usePluginStatus() {
  return useQuery({
    queryKey: osKeys.status,
    queryFn: fetchPluginStatus,
    staleTime: 5 * MIN,
    retry: 0,
  });
}

export function useSecretStatus() {
  return useQuery({
    queryKey: osKeys.secrets,
    queryFn: fetchSecretStatus,
    staleTime: 5 * MIN,
  });
}

export function useSyncPlugins() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (plugins?: string[]) => syncPlugins(plugins),
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: osKeys.snapshots });
      void qc.invalidateQueries({ queryKey: osKeys.syncLog });
      void qc.invalidateQueries({ queryKey: ["os", "revenue"] });
    },
  });
}

export function useTestPlugin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (pluginId: string) => testPlugin(pluginId),
    onSettled: () => void qc.invalidateQueries({ queryKey: osKeys.syncLog }),
  });
}

export function useSavePluginSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: Parameters<typeof savePluginSettings>[0]) =>
      savePluginSettings(v),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: osKeys.settings });
      void qc.invalidateQueries({ queryKey: osKeys.status });
    },
  });
}

export function useSetPluginSecret() {
  const qc = useQueryClient();
  return useMutation({
    // The value is a credential: drop the settled mutation (and its
    // variables) from the cache as soon as nothing observes it.
    gcTime: 0,
    mutationFn: (v: { scope: string; key: string; value: string }) =>
      setPluginSecret(v.scope, v.key, v.value),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: osKeys.secrets });
      void qc.invalidateQueries({ queryKey: osKeys.status });
    },
  });
}

/**
 * The AI briefing for one range, written at most once an hour. The figures
 * refresh every few minutes, but a new briefing is only asked for when the
 * range or the hour changes, and the previous one stays on screen while it
 * is written. The result carries the facts that were sent, so its citations
 * show the figures Claude actually saw.
 */
export function useBriefing(
  facts: OsFact[],
  insights: OsInsightInput[],
  enabled: boolean,
  range: OsRange,
) {
  const hour = Math.floor(Date.now() / (60 * MIN));
  return useQuery({
    queryKey: osKeys.brief(`${range}:${hour}`),
    queryFn: async () => ({
      facts,
      brief: await fetchBriefing(facts, insights),
    }),
    enabled: enabled && facts.length > 0,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: 60 * MIN,
    retry: 0,
  });
}
