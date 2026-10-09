/**
 * Shapes returned by the AI OS summary RPCs (see
 * supabase/migrations/20261009160000_ai_os_dashboard.sql) and the snapshot
 * rows the dashboard reads. Plugin payload shapes live in the shared contract.
 */
export type {
  OsBriefResponse,
  OsFact,
  OsInsightInput,
  OsInsightSeverity,
  OsPluginStatus,
  OsRangeKey,
  OsStatusResponse,
  OsSyncResponse,
  OsSyncResult,
  OsTestResponse,
} from "../../../supabase/functions/_shared/os/contract";

export type ClickExclusionReason = "burst" | "headless" | "bot";

export type ClicksSummary = {
  from: string;
  to: string;
  generated_at: string;
  method: {
    burst_window_seconds: number;
    burst_min_clicks: number;
    timezone: string;
  };
  totals: {
    raw: number;
    qualified: number;
    excluded: number;
    excluded_by_reason: Partial<Record<ClickExclusionReason, number>>;
  };
  previous: { raw: number; qualified: number };
  daily: { day: string; qualified: number; excluded: number }[];
  by_provider: { provider_id: string; clicks: number; share: number | null }[];
  by_placement: { placement: string; clicks: number; share: number | null }[];
  top_pages: { source_page: string; clicks: number }[];
  top_tests: {
    provider_id: string;
    test_id: string;
    test_name: string | null;
    clicks: number;
  }[];
  excluded_bursts: {
    source_page: string;
    started_at: string;
    ended_at: string;
    clicks: number;
    providers: string[];
  }[];
  last_click_at: string | null;
  last_qualified_click_at: string | null;
};

export type RevenueSummary = {
  from: string;
  to: string;
  generated_at: string;
  totals: {
    conversions: number;
    pending: number;
    confirmed: number;
    reversed: number;
    commission_gbp: number;
    commission_confirmed_gbp: number;
    commission_pending_gbp: number;
    commission_reversed_gbp: number;
    order_value_gbp: number;
    attributed: number;
    unattributed: number;
    missing_commission: number;
  };
  previous: { conversions: number; commission_gbp: number };
  daily: { day: string; conversions: number; commission_gbp: number }[];
  by_provider: {
    provider_id: string;
    conversions: number;
    commission_gbp: number;
    order_value_gbp: number;
  }[];
  by_source: { source: string; conversions: number; commission_gbp: number }[];
  last_converted_at: string | null;
  last_imported_at: string | null;
};

export type PluginSnapshotRow = {
  plugin_id: string;
  dataset: string;
  payload: unknown;
  period_start: string | null;
  period_end: string | null;
  fetched_at: string;
};

export type PluginSettingsRow = {
  plugin_id: string;
  enabled: boolean;
  config: Record<string, unknown>;
  updated_at: string;
  updated_by: string | null;
};

export type PluginSyncLogRow = {
  id: number;
  plugin_id: string;
  trigger: "cron" | "manual" | "test";
  status: "ok" | "error" | "skipped";
  started_at: string;
  finished_at: string | null;
  records: number | null;
  message: string | null;
};

export type SecretStatusRow = {
  plugin_id: string;
  secret_key: string;
  updated_at: string;
};
