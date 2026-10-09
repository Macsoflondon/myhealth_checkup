// os-plugins: the AI OS (Crux Control) plugin service.
//
// Actions (POST JSON body { action, ... }):
// - status (admin): readiness of every sync and service plugin, with where
//   each credential was found (never its value).
// - sync (admin or the hourly cron): pulls each ready plugin's API into
//   os_plugin_snapshots and logs the attempt in os_plugin_sync_log.
// - test (admin): one cheap authenticated call for one plugin.
// - brief (admin): the AI briefing, number-checked against the facts sent.
//
// verify_jwt is off in config.toml because lib/auth.ts does its own checks:
// the service role key for the cron, or an admin with an MFA session.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.51.0";
import { getOsPlugin, OS_PLUGINS } from "../_shared/os/catalog.ts";
import type {
  OsStatusResponse,
  OsSyncResponse,
} from "../_shared/os/contract.ts";
import { internalErrorResponse } from "../_shared/errors.ts";
import { getAdapter } from "./adapters/index.ts";
import {
  type BriefInput,
  BriefInputError,
  parseBriefRequest,
  testAnthropicKey,
  unavailableBrief,
  writeBrief,
} from "./brief.ts";
import { authenticate, corsHeaders, FUNCTION_NAME, json } from "./lib/auth.ts";
import {
  createRuntime,
  pluginState,
  runSync,
  runTest,
  StoreReadError,
  syncPlugins,
  toStatus,
} from "./lib/runner.ts";
import { VaultReadError } from "./lib/secrets.ts";

const ACTIONS = ["status", "sync", "test", "brief"] as const;
type Action = (typeof ACTIONS)[number];

const AI_PLUGIN_ID = "ai_briefing";
const MAX_BODY_CHARS = 200_000;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function serviceDb() {
  const url = Deno.env.get("SUPABASE_URL") ?? "";
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (url === "" || key === "") {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Use POST." }, 405);
  }

  try {
    const auth = await authenticate(req);
    if (!auth.ok) return auth.response;
    const { caller } = auth;

    const raw = await req.text();
    if (raw.length > MAX_BODY_CHARS) {
      return json({ error: "The request is too large." }, 413);
    }
    let body: unknown;
    try {
      body = raw.trim() === "" ? {} : JSON.parse(raw);
    } catch {
      return json({ error: "The request body must be JSON." }, 400);
    }
    if (!isRecord(body) || typeof body.action !== "string") {
      return json({ error: "Say which action to run." }, 400);
    }
    if (!(ACTIONS as readonly string[]).includes(body.action)) {
      const name = body.action.slice(0, 40);
      return json({ error: `Unknown action "${name}".` }, 400);
    }
    const action = body.action as Action;
    if (caller.kind === "service" && action !== "sync") {
      return json({ error: "The service key may only run sync." }, 403);
    }

    const runtime = await createRuntime(serviceDb());

    switch (action) {
      case "status": {
        const plugins = OS_PLUGINS.filter(
          (p) => p.kind === "sync" || p.kind === "service",
        );
        const states = await Promise.all(
          plugins.map((p) => pluginState(runtime, p)),
        );
        const ai = states.find((s) => s.plugin.id === AI_PLUGIN_ID);
        const response: OsStatusResponse = {
          plugins: states.map(toStatus),
          ai_available: Boolean(ai && ai.enabled && ai.readiness.ready),
          checked_at: new Date().toISOString(),
        };
        return json(response);
      }

      case "sync": {
        let pluginIds: string[] | undefined;
        if (body.plugins !== undefined && body.plugins !== null) {
          if (
            !Array.isArray(body.plugins) ||
            !body.plugins.every((p) => typeof p === "string")
          ) {
            return json(
              { error: "plugins must be a list of plugin ids." },
              400,
            );
          }
          pluginIds = body.plugins as string[];
        }
        // The trigger follows the caller, whatever the body says.
        const trigger = caller.kind === "service" ? "cron" : "manual";
        const response: OsSyncResponse = {
          results: await runSync(runtime, pluginIds, trigger),
        };
        return json(response);
      }

      case "test": {
        const id = typeof body.plugin === "string" ? body.plugin : "";
        if (id === AI_PLUGIN_ID) {
          const plugin = getOsPlugin(AI_PLUGIN_ID);
          if (!plugin) return json({ error: "Unknown plugin." }, 400);
          return json(
            await runTest(runtime, plugin, (state) =>
              testAnthropicKey(state.secrets.values.ANTHROPIC_API_KEY ?? ""),
            ),
          );
        }
        const plugin = syncPlugins().find((p) => p.id === id);
        const adapter = plugin ? getAdapter(plugin.id) : undefined;
        if (!plugin || !adapter) {
          return json({ error: "Unknown plugin." }, 400);
        }
        return json(
          await runTest(runtime, plugin, (_state, ctx) => adapter.test(ctx)),
        );
      }

      case "brief": {
        let input: BriefInput;
        try {
          input = parseBriefRequest(body);
        } catch (e) {
          if (e instanceof BriefInputError) {
            return json({ error: e.message }, 400);
          }
          throw e;
        }
        const plugin = getOsPlugin(AI_PLUGIN_ID);
        if (!plugin) {
          return json(unavailableBrief("The AI briefing is not set up."));
        }
        const state = await pluginState(runtime, plugin);
        if (!state.enabled) {
          return json(
            unavailableBrief("The AI briefing is turned off in Plugins."),
          );
        }
        const apiKey = state.secrets.values.ANTHROPIC_API_KEY;
        if (!state.readiness.ready || !apiKey) {
          return json(
            unavailableBrief(
              "No Anthropic API key is set. Add one in Plugins.",
            ),
          );
        }
        return json(await writeBrief(input, apiKey));
      }

      default:
        return json({ error: "Unknown action." }, 400);
    }
  } catch (e) {
    if (e instanceof VaultReadError || e instanceof StoreReadError) {
      console.error(`[${FUNCTION_NAME}] ${e.message}`);
      return json({ error: e.message }, 502);
    }
    return internalErrorResponse(FUNCTION_NAME, e, corsHeaders);
  }
});
