// Contract every os-plugins adapter implements. Adapters receive resolved
// config and credentials, call their API through ctx.http (timeouts, errors
// with secrets redacted), and return normalised snapshot payloads matching
// supabase/functions/_shared/os/contract.ts.
import type { OsPluginDefinition } from "../../_shared/os/catalog.ts";
import type { Http } from "../lib/http.ts";

/** Minimal service-role client surface adapters may use. */
export type RpcClient = {
  rpc(
    fn: string,
    args: Record<string, unknown>,
  ): PromiseLike<{ data: unknown; error: { message: string } | null }>;
};

export type AdapterContext = {
  plugin: OsPluginDefinition;
  /** defaultConfig from the catalogue overlaid with os_plugin_settings.config. */
  config: Record<string, unknown>;
  /** Credentials by key: edge function env first, then Vault. */
  secrets: Record<string, string>;
  http: Http;
  /** Service-role client, for adapters that write rows (Awin). */
  db: RpcClient;
  /** Previous payload of each of this plugin's datasets, keyed by dataset. */
  previous: Record<string, unknown>;
  now: Date;
};

export type DatasetOutput = {
  dataset: string;
  payload: unknown;
  /** YYYY-MM-DD bounds of the data, when the dataset covers a period. */
  period_start?: string | null;
  period_end?: string | null;
};

export type AdapterResult = {
  datasets: DatasetOutput[];
  /** Items processed, recorded in the sync log. */
  records: number;
  /** Non-fatal problems, joined into the sync log message. */
  warnings?: string[];
};

export type PluginAdapter = {
  id: string;
  sync(ctx: AdapterContext): Promise<AdapterResult>;
  /** One cheap authenticated call proving the credentials work. Returns a short success message. */
  test(ctx: AdapterContext): Promise<string>;
};

/** Thrown for a missing or invalid config value; the sync log shows the message. */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export function requireString(
  config: Record<string, unknown>,
  key: string,
  label: string,
): string {
  const v = config[key];
  if (typeof v === "string" && v.trim() !== "") return v.trim();
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  throw new ConfigError(`${label} is not set.`);
}

export function stringList(
  config: Record<string, unknown>,
  key: string,
): string[] {
  const v = config[key];
  if (Array.isArray(v)) {
    return v.map((x) => String(x).trim()).filter((x) => x !== "");
  }
  if (typeof v === "string") {
    return v
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x !== "");
  }
  return [];
}

export function stringMap(
  config: Record<string, unknown>,
  key: string,
): Record<string, string> {
  const v = config[key];
  const out: Record<string, string> = {};
  if (v && typeof v === "object" && !Array.isArray(v)) {
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (k.trim() && typeof val === "string" && val.trim()) {
        out[k.trim()] = val.trim();
      }
    }
  }
  return out;
}
