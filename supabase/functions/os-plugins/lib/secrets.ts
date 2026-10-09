// Resolves plugin credentials and readiness. Credentials come from the edge
// function environment first, then from Vault (written by the dashboard
// through os_set_plugin_secret). Values never leave this function: status
// responses carry only where each credential was found.
import {
  type OsPluginDefinition,
  secretScope,
} from "../../_shared/os/catalog.ts";
import type { OsSecretSource } from "../../_shared/os/contract.ts";
import type { RpcClient } from "../adapters/types.ts";

/** Vault could not be read, so readiness is unknown. */
export class VaultReadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VaultReadError";
  }
}

export type VaultReader = {
  /** Decrypted credentials stored under one Vault scope, by key. */
  scope(scope: string): Promise<Record<string, string>>;
};

/** Reads each Vault scope at most once per request. */
export function createVaultReader(db: RpcClient): VaultReader {
  const cache = new Map<string, Promise<Record<string, string>>>();
  const load = async (scope: string): Promise<Record<string, string>> => {
    const { data, error } = await db.rpc("os_get_plugin_secrets", {
      p_plugin: scope,
    });
    if (error) {
      throw new VaultReadError(
        `Could not read stored credentials from Vault: ${error.message.slice(0, 200)}`,
      );
    }
    const out: Record<string, string> = {};
    if (data && typeof data === "object" && !Array.isArray(data)) {
      for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
        if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
      }
    }
    return out;
  };
  return {
    scope(scope: string) {
      let p = cache.get(scope);
      if (!p) {
        p = load(scope);
        cache.set(scope, p);
        // A failed read is not cached, so a later call can retry.
        p.catch(() => cache.delete(scope));
      }
      return p;
    },
  };
}

export type ResolvedSecrets = {
  values: Record<string, string>;
  sources: { key: string; scope: string; source: OsSecretSource }[];
};

export type EnvReader = (key: string) => string | undefined;

const denoEnv: EnvReader = (key) => Deno.env.get(key);

export async function resolvePluginSecrets(
  plugin: OsPluginDefinition,
  vault: VaultReader,
  env: EnvReader = denoEnv,
): Promise<ResolvedSecrets> {
  const values: Record<string, string> = {};
  const sources: ResolvedSecrets["sources"] = [];
  const seen = new Set<string>();
  for (const group of plugin.secretGroups) {
    for (const secret of group.secrets) {
      const scope = secretScope(plugin, secret);
      const id = `${scope}:${secret.key}`;
      if (seen.has(id)) continue;
      seen.add(id);

      let source: OsSecretSource = null;
      const fromEnv = (env(secret.key) ?? "").trim();
      if (fromEnv !== "") {
        values[secret.key] = fromEnv;
        source = "env";
      } else {
        const fromVault = (await vault.scope(scope))[secret.key];
        if (fromVault) {
          values[secret.key] = fromVault;
          source = "vault";
        }
      }
      sources.push({ key: secret.key, scope, source });
    }
  }
  return { values, sources };
}

export type Readiness = {
  ready: boolean;
  /** Keys still needed by the most complete credential group. */
  missing_secrets: string[];
  /** Labels of required config fields that are empty. */
  missing_config: string[];
};

function isFilled(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (typeof v === "number") return Number.isFinite(v);
  if (typeof v === "boolean") return true;
  if (Array.isArray(v)) return v.some((x) => String(x ?? "").trim() !== "");
  if (typeof v === "object") return Object.keys(v as object).length > 0;
  return false;
}

/** defaultConfig from the catalogue overlaid with the saved settings. */
export function effectiveConfig(
  plugin: OsPluginDefinition,
  saved: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  return { ...plugin.defaultConfig, ...(saved ?? {}) };
}

/**
 * Ready when every required config field has a value and at least one
 * credential group is complete. Plugins with no credential groups need none.
 */
export function assessReadiness(
  plugin: OsPluginDefinition,
  config: Record<string, unknown>,
  values: Record<string, string>,
): Readiness {
  const missing_config = plugin.config
    .filter((f) => f.required && !isFilled(config[f.key]))
    .map((f) => f.label);

  let missing_secrets: string[] = [];
  if (plugin.secretGroups.length > 0) {
    let best: string[] | null = null;
    for (const group of plugin.secretGroups) {
      const missing = group.secrets.map((s) => s.key).filter((k) => !values[k]);
      if (best === null || missing.length < best.length) best = missing;
      if (missing.length === 0) break;
    }
    missing_secrets = best ?? [];
  }

  return {
    ready: missing_config.length === 0 && missing_secrets.length === 0,
    missing_secrets,
    missing_config,
  };
}

/** Readable names for missing items, for skip and test messages. */
export function describeMissing(
  plugin: OsPluginDefinition,
  readiness: Readiness,
): string {
  const labels = new Map<string, string>();
  for (const group of plugin.secretGroups) {
    for (const s of group.secrets) labels.set(s.key, s.label);
  }
  const items = [
    ...readiness.missing_secrets.map((k) => labels.get(k) ?? k),
    ...readiness.missing_config,
  ];
  if (items.length === 0) return "";
  if (items.length === 1) return `${items[0]} is not set. Add it in Plugins.`;
  return `${items.join(", ")} are not set. Add them in Plugins.`;
}
