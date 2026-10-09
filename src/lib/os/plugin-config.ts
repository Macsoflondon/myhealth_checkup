/**
 * Pure helpers for the Plugins section of the AI OS dashboard: config form
 * values to and from os_plugin_settings.config, checks on a credential
 * before it goes to Vault, and the status each plugin card shows.
 *
 * Type-only imports, so vitest and node load this file without the app.
 */
import type {
  OsPluginConfigField,
  OsPluginDefinition,
} from "../../../supabase/functions/_shared/os/catalog";
import type {
  OsPluginStatus,
  OsSecretSource,
  OsSyncResult,
} from "../../../supabase/functions/_shared/os/contract";
import { AFFILIATE_PROVIDERS } from "@/lib/affiliate/affiliate-config";
import type { PluginSyncLogRow } from "./types";

/**
 * Map fields whose values must be one of our provider ids, so a typo
 * ("randox-health") cannot file conversions under a provider that does not
 * exist and count them twice next to a CSV import.
 */
const PROVIDER_VALUE_FIELDS: Record<string, string> = {
  awin: "advertiser_map",
};

// ---------------------------------------------------------------------------
// Field values
// ---------------------------------------------------------------------------

/** Form text for each config field, keyed by field key. */
export type ConfigFormValues = Record<string, string>;

type FieldType = OsPluginConfigField["type"];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function scalarText(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return null;
}

/** Text field: the trimmed string. */
export function parseText(text: string): string {
  return text.trim();
}

export function formatText(value: unknown): string {
  return scalarText(value) ?? "";
}

/**
 * List field: "a, b,, a" -> ["a", "b"]. Splits on commas (and line breaks,
 * for pasted lists), trims each item, drops empty items and keeps the first
 * of any repeats.
 */
export function parseList(text: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const part of text.split(/[,\r\n]+/)) {
    const item = part.trim();
    if (item === "" || seen.has(item)) continue;
    seen.add(item);
    out.push(item);
  }
  return out;
}

export function formatList(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map(scalarText)
      .filter((v): v is string => v !== null && v.trim() !== "")
      .map((v) => v.trim())
      .join(", ");
  }
  return scalarText(value) ?? "";
}

export type MapParseResult =
  { ok: true; value: Record<string, string> } | { ok: false; error: string };

const PREVIEW_MAX = 40;

function preview(line: string): string {
  const chars = Array.from(line);
  return chars.length <= PREVIEW_MAX
    ? line
    : `${chars.slice(0, PREVIEW_MAX - 1).join("")}…`;
}

/**
 * Map field: one "key=value" per line. Blank lines are ignored and both
 * sides are trimmed. The value runs from the first "=" to the end of the
 * line. A line without "=", with nothing on one side, or repeating an
 * earlier key fails with an error that names the line.
 */
export function parseMap(text: string): MapParseResult {
  const entries = new Map<string, { value: string; line: number }>();
  const lines = text.split(/\r\n|\r|\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;
    const n = i + 1;
    const eq = line.indexOf("=");
    if (eq === -1) {
      return {
        ok: false,
        error: `Line ${n} ("${preview(line)}") has no "=". Write each line as key=value.`,
      };
    }
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (key === "" || value === "") {
      return {
        ok: false,
        error: `Line ${n} ("${preview(line)}") needs text on both sides of "=".`,
      };
    }
    const earlier = entries.get(key);
    if (earlier) {
      return {
        ok: false,
        error: `Line ${n} repeats "${preview(key)}", which line ${earlier.line} already sets. Keep one of them.`,
      };
    }
    entries.set(key, { value, line: n });
  }
  // fromEntries defines own properties, so a "__proto__" key stays data.
  return {
    ok: true,
    value: Object.fromEntries(
      Array.from(entries, ([k, v]) => [k, v.value] as const),
    ),
  };
}

export function formatMap(value: unknown): string {
  if (!isRecord(value)) return "";
  const lines: string[] = [];
  for (const [k, v] of Object.entries(value)) {
    const text = scalarText(v);
    if (k.trim() === "" || text === null || text.trim() === "") continue;
    lines.push(`${k.trim()}=${text.trim()}`);
  }
  return lines.join("\n");
}

function formatValue(type: FieldType, value: unknown): string {
  if (type === "list") return formatList(value);
  if (type === "map") return formatMap(value);
  return formatText(value);
}

/** Comparable form of a value, so "differs from the default" ignores layout. */
function canonical(type: FieldType, value: unknown): string {
  if (type === "list") return JSON.stringify(parseList(formatList(value)));
  if (type === "map") {
    const parsed = parseMap(formatMap(value));
    const entries = parsed.ok ? Object.entries(parsed.value) : [];
    entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return JSON.stringify(entries);
  }
  return formatText(value).trim();
}

type ConfigPlugin = Pick<OsPluginDefinition, "id" | "config" | "defaultConfig">;

function hasOwn(obj: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Initial form text: the catalogue default for each field, replaced by the
 * saved value where one exists (the same overlay the edge function uses).
 */
export function configToForm(
  plugin: ConfigPlugin,
  saved: Record<string, unknown> | null | undefined,
): ConfigFormValues {
  const values: ConfigFormValues = {};
  for (const field of plugin.config) {
    const raw =
      saved && hasOwn(saved, field.key)
        ? saved[field.key]
        : plugin.defaultConfig[field.key];
    values[field.key] = formatValue(field.type, raw);
  }
  return values;
}

export type ConfigParseResult =
  | { ok: true; config: Record<string, unknown> }
  | { ok: false; errors: Record<string, string> };

/**
 * Form text back to os_plugin_settings.config. Stores only fields whose value
 * differs from the catalogue default, so a corrected default still reaches
 * fields nobody changed. Saved keys the form does not show are kept.
 * Required fields may be left empty: the plugin then reports "Needs
 * settings" instead of blocking the save, so an admin can still turn it off.
 */
export function formToConfig(
  plugin: ConfigPlugin,
  values: ConfigFormValues,
  saved: Record<string, unknown> | null | undefined,
): ConfigParseResult {
  const fieldKeys = new Set(plugin.config.map((f) => f.key));
  const config: Record<string, unknown> = {};
  if (saved) {
    for (const [k, v] of Object.entries(saved)) {
      if (!fieldKeys.has(k)) config[k] = v;
    }
  }

  const errors: Record<string, string> = {};
  for (const field of plugin.config) {
    const text = values[field.key] ?? "";
    let parsed: unknown;
    if (field.type === "list") {
      parsed = parseList(text);
    } else if (field.type === "map") {
      const result = parseMap(text);
      if (!result.ok) {
        errors[field.key] = result.error;
        continue;
      }
      if (PROVIDER_VALUE_FIELDS[plugin.id] === field.key) {
        const unknown = Object.values(result.value).filter(
          (v) => !Object.prototype.hasOwnProperty.call(AFFILIATE_PROVIDERS, v),
        );
        if (unknown.length > 0) {
          errors[field.key] =
            `Use a provider id from this list: ${Object.keys(AFFILIATE_PROVIDERS).join(", ")}. Not recognised: ${[...new Set(unknown)].join(", ")}.`;
          continue;
        }
      }
      parsed = result.value;
    } else {
      parsed = parseText(text);
    }
    const isDefault =
      canonical(field.type, parsed) ===
      canonical(field.type, plugin.defaultConfig[field.key]);
    if (!isDefault) config[field.key] = parsed;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, config };
}

/** True when the form text matches what configToForm produced. */
export function sameFormValues(
  a: ConfigFormValues,
  b: ConfigFormValues,
): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    if ((a[k] ?? "") !== (b[k] ?? "")) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

/** Vault rejects longer values (os_set_plugin_secret). */
export const SECRET_MAX_CHARS = 16384;

/**
 * Checks a credential before it goes to Vault. Returns a plain error, or
 * null when the value can be saved. The message never repeats the value.
 */
export function checkSecretValue(key: string, value: string): string | null {
  const v = value.trim();
  if (v === "") {
    return "Paste a value first. Saving an empty value would remove the stored one.";
  }
  if (Array.from(v).length > SECRET_MAX_CHARS) {
    return `Vault accepts up to ${SECRET_MAX_CHARS.toLocaleString("en-GB")} characters.`;
  }
  if (key.endsWith("_JSON")) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(v);
    } catch {
      return "Paste the whole JSON key file, from the opening { to the closing }.";
    }
    if (!isRecord(parsed)) {
      return "Paste the whole JSON key file, from the opening { to the closing }.";
    }
    const serviceAccount =
      key.includes("SERVICE_ACCOUNT") || parsed.type === "service_account";
    if (
      serviceAccount &&
      (typeof parsed.client_email !== "string" ||
        typeof parsed.private_key !== "string")
    ) {
      return "This JSON has no client_email or private_key. Download a new key for the service account and paste the whole file.";
    }
  }
  return null;
}

export type SecretState =
  /** The edge function environment sets it; a Vault copy, if any, is unused. */
  | { kind: "env"; vaultSavedAt: string | null }
  | { kind: "vault"; savedAt: string | null }
  | { kind: "unset" }
  /** Status unknown and not in Vault: the environment could not be checked. */
  | { kind: "not_in_vault" }
  /** Neither the status nor the Vault list answered. */
  | { kind: "unknown" };

/**
 * Where a credential is set.
 * @param source From the os-plugins status; undefined when the status is
 *   unknown.
 * @param vaultSavedAt Vault entry date; null when there is none, undefined
 *   when unknown.
 */
export function secretState(
  source: OsSecretSource | undefined,
  vaultSavedAt: string | null | undefined,
): SecretState {
  if (source === "env") {
    return { kind: "env", vaultSavedAt: vaultSavedAt ?? null };
  }
  if (source === "vault" || typeof vaultSavedAt === "string") {
    return { kind: "vault", savedAt: vaultSavedAt ?? null };
  }
  if (source === null) return { kind: "unset" };
  return vaultSavedAt === null ? { kind: "not_in_vault" } : { kind: "unknown" };
}

// ---------------------------------------------------------------------------
// Plugin status
// ---------------------------------------------------------------------------

export type PluginTone = "ok" | "warn" | "error" | "idle";

export type PluginStateLabel =
  | "Live"
  | "Connected"
  | "Needs credentials"
  | "Needs settings"
  | "Turned off"
  | "Last sync failed"
  | "Last test failed"
  | "Not synced yet"
  | "Status unknown";

export type PluginCardState = { tone: PluginTone; label: PluginStateLabel };

/**
 * The status pill for one plugin.
 * @param status The plugin's entry in the os-plugins status; null or
 *   undefined when the edge function did not answer.
 * @param lastLog The plugin's newest sync-log row of any trigger.
 * @param snapshotsFetchedAt The newest fetched_at of the plugin's snapshots.
 */
export function pluginState(
  plugin: Pick<OsPluginDefinition, "kind">,
  status:
    | Pick<
        OsPluginStatus,
        "enabled" | "ready" | "missing_secrets" | "missing_config"
      >
    | null
    | undefined,
  lastLog: Pick<PluginSyncLogRow, "status" | "trigger"> | null | undefined,
  snapshotsFetchedAt: string | null | undefined,
): PluginCardState {
  if (plugin.kind === "native") return { tone: "ok", label: "Live" };

  const failure: PluginCardState | null =
    lastLog?.status === "error"
      ? {
          tone: "error",
          label:
            lastLog.trigger === "test"
              ? "Last test failed"
              : "Last sync failed",
        }
      : null;

  if (!status) return failure ?? { tone: "idle", label: "Status unknown" };
  if (!status.enabled) return { tone: "idle", label: "Turned off" };
  // The sync skips a plugin that is not ready, so readiness outranks an
  // older failure.
  if (status.missing_secrets.length > 0) {
    return { tone: "warn", label: "Needs credentials" };
  }
  if (status.missing_config.length > 0 || !status.ready) {
    return { tone: "warn", label: "Needs settings" };
  }
  if (failure) return failure;
  if (plugin.kind === "service") return { tone: "ok", label: "Connected" };
  const synced =
    Boolean(snapshotsFetchedAt) ||
    (lastLog?.status === "ok" && lastLog.trigger !== "test");
  return synced
    ? { tone: "ok", label: "Connected" }
    : { tone: "idle", label: "Not synced yet" };
}

/** Readable names for os_plugin_sync_log.trigger. */
export const TRIGGER_LABEL: Record<PluginSyncLogRow["trigger"], string> = {
  cron: "Hourly",
  manual: "Manual",
  test: "Connection test",
};

/** A thrown value as one line of text for a toast or an inline note. */
export function errorText(e: unknown): string {
  return e instanceof Error && e.message ? e.message : "Something went wrong.";
}

/** "3 synced, 4 skipped, 1 failed" (zero counts left out). */
export function summariseSync(
  results: readonly Pick<OsSyncResult, "status">[],
): string {
  if (results.length === 0) return "No plugins to sync.";
  const count = (s: OsSyncResult["status"]) =>
    results.filter((r) => r.status === s).length;
  const parts: string[] = [];
  const ok = count("ok");
  const skipped = count("skipped");
  const failed = count("error");
  if (ok > 0) parts.push(`${ok} synced`);
  if (skipped > 0) parts.push(`${skipped} skipped`);
  if (failed > 0) parts.push(`${failed} failed`);
  return parts.join(", ");
}
