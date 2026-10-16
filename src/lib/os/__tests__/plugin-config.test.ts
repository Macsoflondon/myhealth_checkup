import { describe, expect, it } from "vitest";
import {
  checkSecretValue,
  configToForm,
  errorText,
  formatList,
  formatMap,
  formToConfig,
  parseList,
  parseMap,
  pluginState,
  sameFormValues,
  secretState,
  summariseSync,
} from "@/lib/os/plugin-config";
import {
  getOsPlugin,
  type OsPluginDefinition,
} from "../../../../supabase/functions/_shared/os/catalog";

function plugin(id: string): OsPluginDefinition {
  const p = getOsPlugin(id);
  if (!p) throw new Error(`No catalogue entry for ${id}`);
  return p;
}

/**
 * A plugin with one field of each type. No catalogue plugin uses a map field
 * today, so the map tests use this one.
 */
const FORM_PLUGIN: Pick<OsPluginDefinition, "id" | "config" | "defaultConfig"> =
  {
    id: "form_test",
    config: [
      { key: "account_id", label: "Account", help: "", type: "text" },
      { key: "regions", label: "Regions", help: "", type: "list" },
      { key: "aliases", label: "Aliases", help: "", type: "map" },
    ],
    defaultConfig: {
      account_id: "1001",
      regions: ["north", "south"],
      aliases: {},
    },
  };

const READY = {
  enabled: true,
  ready: true,
  missing_secrets: [] as string[],
  missing_config: [] as string[],
};

describe("parseList", () => {
  it("trims, drops empty items and keeps the first of any repeats", () => {
    expect(parseList(" north, south ,, north ,east,")).toEqual([
      "north",
      "south",
      "east",
    ]);
  });

  it("returns an empty list for blank text", () => {
    expect(parseList("")).toEqual([]);
    expect(parseList(" , ,")).toEqual([]);
  });

  it("accepts line breaks from a pasted list", () => {
    expect(parseList("https://a.example/\nhttps://b.example/")).toEqual([
      "https://a.example/",
      "https://b.example/",
    ]);
  });

  it("formats a saved list back to comma-separated text", () => {
    expect(formatList(["north", " south ", "", 3])).toBe("north, south, 3");
    expect(formatList(undefined)).toBe("");
  });
});

describe("parseMap", () => {
  it("reads key=value lines, ignoring blank lines and spaces", () => {
    expect(parseMap("12345=medichecks\n\n  678 = randox \r\n")).toEqual({
      ok: true,
      value: { "12345": "medichecks", "678": "randox" },
    });
  });

  it("splits on the first = only", () => {
    expect(parseMap("a=b=c")).toEqual({ ok: true, value: { a: "b=c" } });
  });

  it("rejects a line without = and names it", () => {
    const result = parseMap("12345=medichecks\n678 randox");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Line 2");
      expect(result.error).toContain("678 randox");
      expect(result.error).toContain('no "="');
    }
  });

  it("rejects a line with nothing on one side of =", () => {
    const result = parseMap("=medichecks");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("Line 1");
  });

  it("rejects a repeated key and names both lines", () => {
    const result = parseMap("1=medichecks\n1=randox");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("Line 2");
      expect(result.error).toContain("line 1");
    }
  });

  it("keeps a __proto__ key as data", () => {
    const result = parseMap("__proto__=x");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(
        Object.prototype.hasOwnProperty.call(result.value, "__proto__"),
      ).toBe(true);
    }
  });

  it("formats a saved map back to lines", () => {
    expect(formatMap({ "1": "medichecks", "2": 7, "3": null })).toBe(
      "1=medichecks\n2=7",
    );
    expect(formatMap(["not", "a", "map"])).toBe("");
  });
});

describe("configToForm and formToConfig", () => {
  it("starts from the catalogue defaults", () => {
    expect(configToForm(plugin("site_status"), null)).toEqual({
      urls: "https://www.myhealthcheckup.co.uk/, https://myhealthcheckup.co.uk/",
    });
    expect(configToForm(FORM_PLUGIN, null)).toEqual({
      account_id: "1001",
      regions: "north, south",
      aliases: "",
    });
  });

  it("overlays saved values on the defaults", () => {
    const form = configToForm(FORM_PLUGIN, {
      account_id: 42,
      aliases: { "1": "medichecks" },
    });
    expect(form).toEqual({
      account_id: "42",
      regions: "north, south",
      aliases: "1=medichecks",
    });
  });

  it("stores only values that differ from the default", () => {
    const form = configToForm(FORM_PLUGIN, null);
    expect(formToConfig(FORM_PLUGIN, form, null)).toEqual({
      ok: true,
      config: {},
    });
    expect(
      formToConfig(FORM_PLUGIN, { ...form, regions: "north" }, null),
    ).toEqual({ ok: true, config: { regions: ["north"] } });
  });

  it("keeps saved keys the form does not show", () => {
    const ai = plugin("ai_briefing");
    expect(formToConfig(ai, {}, { note: "kept" })).toEqual({
      ok: true,
      config: { note: "kept" },
    });
  });

  it("stores an emptied field that has a default", () => {
    expect(
      formToConfig(plugin("search_console"), { site_url: " " }, null),
    ).toEqual({ ok: true, config: { site_url: "" } });
  });

  it("returns the map error against its field", () => {
    const result = formToConfig(
      FORM_PLUGIN,
      { account_id: "42", regions: "north", aliases: "12345 medichecks" },
      null,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors)).toEqual(["aliases"]);
      expect(result.errors.aliases).toContain("Line 1");
    }
  });

  it("stores a parsed map", () => {
    expect(
      formToConfig(
        FORM_PLUGIN,
        { account_id: "1001", regions: "north, south", aliases: "1=randox" },
        null,
      ),
    ).toEqual({ ok: true, config: { aliases: { "1": "randox" } } });
  });

  it("compares form values", () => {
    expect(sameFormValues({ a: "1" }, { a: "1" })).toBe(true);
    expect(sameFormValues({ a: "1" }, { a: "2" })).toBe(false);
    expect(sameFormValues({ a: "" }, {})).toBe(true);
  });
});

describe("pluginState", () => {
  const ga4 = plugin("ga4");

  it("shows native plugins as Live", () => {
    expect(pluginState(plugin("provider_clicks"), null, null, null)).toEqual({
      tone: "ok",
      label: "Live",
    });
  });

  it("shows Connected after a successful sync or when snapshots exist", () => {
    expect(
      pluginState(ga4, READY, { status: "ok", trigger: "cron" }, null),
    ).toEqual({ tone: "ok", label: "Connected" });
    expect(pluginState(ga4, READY, null, "2026-10-09T10:00:00Z").label).toBe(
      "Connected",
    );
  });

  it("shows a ready service plugin as Connected", () => {
    expect(pluginState(plugin("ai_briefing"), READY, null, null).label).toBe(
      "Connected",
    );
  });

  it("shows Needs credentials when a secret is missing", () => {
    expect(
      pluginState(
        ga4,
        {
          ...READY,
          ready: false,
          missing_secrets: ["GOOGLE_SERVICE_ACCOUNT_JSON"],
        },
        null,
        null,
      ),
    ).toEqual({ tone: "warn", label: "Needs credentials" });
  });

  it("shows Needs settings ahead of an older failure", () => {
    expect(
      pluginState(
        ga4,
        { ...READY, ready: false, missing_config: ["GA4 property ID"] },
        { status: "error", trigger: "cron" },
        null,
      ),
    ).toEqual({ tone: "warn", label: "Needs settings" });
  });

  it("shows Turned off when the plugin is disabled", () => {
    expect(pluginState(ga4, { ...READY, enabled: false }, null, null)).toEqual({
      tone: "idle",
      label: "Turned off",
    });
  });

  it("shows Last sync failed after a failed sync", () => {
    expect(
      pluginState(
        ga4,
        READY,
        { status: "error", trigger: "manual" },
        "2026-10-09T10:00:00Z",
      ),
    ).toEqual({ tone: "error", label: "Last sync failed" });
  });

  it("shows Last test failed after a failed connection test", () => {
    expect(
      pluginState(ga4, READY, { status: "error", trigger: "test" }, null).label,
    ).toBe("Last test failed");
  });

  it("shows Not synced yet before the first sync", () => {
    expect(pluginState(ga4, READY, null, null)).toEqual({
      tone: "idle",
      label: "Not synced yet",
    });
    expect(
      pluginState(ga4, READY, { status: "ok", trigger: "test" }, null).label,
    ).toBe("Not synced yet");
  });

  it("shows Status unknown when the edge function did not answer", () => {
    expect(pluginState(ga4, null, null, null)).toEqual({
      tone: "idle",
      label: "Status unknown",
    });
    expect(
      pluginState(ga4, undefined, { status: "error", trigger: "cron" }, null)
        .label,
    ).toBe("Last sync failed");
  });
});

describe("summariseSync", () => {
  it("counts each outcome and leaves zeros out", () => {
    expect(
      summariseSync([
        { status: "ok" },
        { status: "ok" },
        { status: "ok" },
        { status: "skipped" },
        { status: "skipped" },
        { status: "error" },
      ]),
    ).toBe("3 synced, 2 skipped, 1 failed");
    expect(summariseSync([{ status: "skipped" }])).toBe("1 skipped");
    expect(summariseSync([])).toBe("No plugins to sync.");
  });
});

describe("errorText", () => {
  it("uses the error message, with a fallback for anything else", () => {
    expect(errorText(new Error("os-plugins [502]: Vault read failed"))).toBe(
      "os-plugins [502]: Vault read failed",
    );
    expect(errorText("nope")).toBe("Something went wrong.");
    expect(errorText(new Error(""))).toBe("Something went wrong.");
  });
});

describe("checkSecretValue", () => {
  it("refuses an empty value, which would remove the stored one", () => {
    expect(checkSecretValue("ANTHROPIC_API_KEY", "   ")).not.toBeNull();
  });

  it("accepts a plain token", () => {
    expect(checkSecretValue("ANTHROPIC_API_KEY", "abc123")).toBeNull();
  });

  it("checks a service account key without repeating it", () => {
    const key = "GOOGLE_SERVICE_ACCOUNT_JSON";
    const notJson = checkSecretValue(key, "{secret-text");
    expect(notJson).not.toBeNull();
    expect(notJson).not.toContain("secret-text");
    expect(checkSecretValue(key, '{"type":"service_account"}')).toContain(
      "client_email",
    );
    expect(
      checkSecretValue(key, '{"client_email":"a@b","private_key":"k"}'),
    ).toBeNull();
  });

  it("refuses values longer than Vault accepts", () => {
    expect(checkSecretValue("X_KEY", "a".repeat(16385))).not.toBeNull();
  });
});

describe("secretState", () => {
  it("reports where a credential is set", () => {
    expect(secretState("env", "2026-10-01T00:00:00Z")).toEqual({
      kind: "env",
      vaultSavedAt: "2026-10-01T00:00:00Z",
    });
    expect(secretState("vault", undefined)).toEqual({
      kind: "vault",
      savedAt: null,
    });
    expect(secretState(null, null)).toEqual({ kind: "unset" });
  });

  it("trusts the Vault list when the status has not caught up", () => {
    expect(secretState(null, "2026-10-01T00:00:00Z")).toEqual({
      kind: "vault",
      savedAt: "2026-10-01T00:00:00Z",
    });
  });

  it("says what it could not check", () => {
    expect(secretState(undefined, null)).toEqual({ kind: "not_in_vault" });
    expect(secretState(undefined, undefined)).toEqual({ kind: "unknown" });
  });
});
