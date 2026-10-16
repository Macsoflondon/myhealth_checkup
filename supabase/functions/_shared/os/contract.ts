/**
 * Request, response and snapshot payload shapes shared by the os-plugins
 * edge function and the Crux Control dashboard. Pure types and constants:
 * no imports, no runtime APIs.
 */

// ---------------------------------------------------------------------------
// Ranges
// ---------------------------------------------------------------------------

/** Day counts every ranged snapshot carries. The dashboard offers the same three. */
export const OS_RANGE_DAYS = [7, 28, 90] as const;
export type OsRangeDays = (typeof OS_RANGE_DAYS)[number];
export type OsRangeKey = "7" | "28" | "90";
export type OsRanged<T> = Record<OsRangeKey, T>;

// ---------------------------------------------------------------------------
// Edge function: requests and responses
// ---------------------------------------------------------------------------

export type OsSyncTrigger = "cron" | "manual";

export type OsStatusRequest = { action: "status" };
export type OsSyncRequest = {
  action: "sync";
  /** Limit to these plugin ids; all sync plugins when omitted. */
  plugins?: string[];
  trigger?: OsSyncTrigger;
};
export type OsTestRequest = { action: "test"; plugin: string };
export type OsBriefRequest = {
  action: "brief";
  facts: OsFact[];
  insights: OsInsightInput[];
};
export type OsRequest =
  OsStatusRequest | OsSyncRequest | OsTestRequest | OsBriefRequest;

export type OsSecretSource = "env" | "vault" | null;

export type OsPluginStatus = {
  plugin_id: string;
  enabled: boolean;
  /** True when every required config field is set and one secret group is complete. */
  ready: boolean;
  secrets: { key: string; scope: string; source: OsSecretSource }[];
  missing_secrets: string[];
  missing_config: string[];
};

export type OsStatusResponse = {
  plugins: OsPluginStatus[];
  ai_available: boolean;
  checked_at: string;
};

export type OsSyncResult = {
  plugin_id: string;
  status: "ok" | "error" | "skipped";
  records: number | null;
  message: string | null;
  duration_ms: number;
};

export type OsSyncResponse = { results: OsSyncResult[] };

export type OsTestResponse = {
  plugin_id: string;
  ok: boolean;
  message: string;
  duration_ms: number;
};

// ---------------------------------------------------------------------------
// AI briefing
// ---------------------------------------------------------------------------

export type OsFactUnit = "count" | "gbp" | "percent" | "days" | "text";

/**
 * One figure the dashboard shows. The briefing may only state numbers that
 * appear in the facts it cites.
 */
export type OsFact = {
  /** Stable id, e.g. "clicks.qualified". */
  id: string;
  label: string;
  value: number | string;
  unit: OsFactUnit;
  /** Human window, e.g. "last 28 days". */
  period: string;
  source: string;
};

export type OsInsightSeverity = "critical" | "warning" | "info" | "positive";

export type OsInsightInput = {
  severity: OsInsightSeverity;
  title: string;
  detail: string;
  fact_ids: string[];
};

export type OsBriefPoint = { text: string; fact_ids: string[] };

export type OsBriefResponse = {
  /**
   * ai: Claude wrote it and every surviving point passed the number check.
   * unavailable: no ANTHROPIC_API_KEY. failed: the call or the check failed.
   * The dashboard falls back to the rule-based insights for both.
   */
  mode: "ai" | "unavailable" | "failed";
  headline: string | null;
  points: OsBriefPoint[];
  /** Points removed because they cited an unknown fact or a number not in their facts. */
  dropped: number;
  model: string | null;
  generated_at: string;
  reason?: string;
};

// ---------------------------------------------------------------------------
// Snapshot payloads (os_plugin_snapshots.payload), one per plugin dataset
// ---------------------------------------------------------------------------

export type SiteCheck = {
  url: string;
  checked_at: string;
  /** HTTP status of the final response, null when the request failed. */
  status: number | null;
  ok: boolean;
  latency_ms: number | null;
  final_url: string | null;
  /** Plain description of what is wrong, null when ok. */
  problem: string | null;
};

/** site_status / checks */
export type SiteStatusChecks = {
  latest: SiteCheck[];
  /** Newest first, at most 72 entries per address. */
  history: SiteCheck[];
};

export type Ga4Day = {
  date: string;
  sessions: number;
  users: number;
  new_users: number;
  engaged_sessions: number;
  page_views: number;
  key_events: number;
};

/** ga4 / daily: up to 90 complete days, oldest first. */
export type Ga4Daily = { property_id: string; days: Ga4Day[] };

/** ga4 / top_pages */
export type Ga4TopPages = {
  ranges: OsRanged<{ path: string; views: number; sessions: number }[]>;
};

/** ga4 / channels */
export type Ga4Channels = {
  ranges: OsRanged<{ channel: string; sessions: number; key_events: number }[]>;
};

/** ga4 / outbound_clicks: GA4 "click" events with a link domain. */
export type Ga4OutboundClicks = {
  available: boolean;
  ranges: OsRanged<{ domain: string; clicks: number }[]>;
};

export type GscRow = {
  clicks: number;
  impressions: number;
  /** 0 to 1 */
  ctr: number;
  position: number;
};

/** search_console / daily: oldest first. */
export type GscDaily = {
  site_url: string;
  days: (GscRow & { date: string })[];
};

/** search_console / top_queries */
export type GscTopQueries = {
  ranges: OsRanged<(GscRow & { query: string })[]>;
};

/** search_console / top_pages */
export type GscTopPages = {
  ranges: OsRanged<(GscRow & { page: string })[]>;
};
