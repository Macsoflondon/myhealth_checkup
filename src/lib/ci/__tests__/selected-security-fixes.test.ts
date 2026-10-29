// @vitest-environment node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { transpileModule, ModuleKind } from "typescript";
import { describe, expect, it, vi } from "vitest";

type Result = { data?: unknown; error?: unknown; count?: number };
type Handler = (request: Request) => Promise<Response>;

function loadHandler(name: string, createClient: () => unknown) {
  const source = readFileSync(resolve(`supabase/functions/${name}/index.ts`), "utf8")
    .replace(/^import[\s\S]*?from\s+["'][^"']+["'];/gm, "");
  const holder: { handler?: Handler } = {};
  runInNewContext(transpileModule(source, { compilerOptions: { module: ModuleKind.None } }).outputText, {
    Deno: { env: { get: () => "test-config" }, serve: (handler: Handler) => { holder.handler = handler; } },
    createClient, Request, Response, URL, TextEncoder, crypto, console,
    buildBundle: vi.fn(() => ({ entry: [] })), validateBundle: (bundle: unknown) => bundle,
  });
  if (!holder.handler) throw new Error("Missing handler");
  return holder.handler;
}

function mockClient(results: Record<string, Result>) {
  const calls: { table: string; method: string; args: unknown[] }[] = [];
  const client = {
    auth: {
      getUser: async () => ({ data: { user: { id: "verified-user" } } }),
      getClaims: async () => ({ data: { claims: { sub: "verified-user" } } }),
    },
    from(table: string) {
      const chain: Record<string, unknown> = {};
      for (const method of ["select", "eq", "is", "order", "limit", "gte", "insert", "update"]) {
        chain[method] = (...args: unknown[]) => { calls.push({ table, method, args }); return chain; };
      }
      chain.maybeSingle = async () => results[table] ?? {};
      chain.then = (resolveResult: (result: Result) => unknown) => Promise.resolve(results[table] ?? {}).then(resolveResult);
      return chain;
    },
    rpc: async () => ({}),
  };
  return { client, calls };
}

describe("FHIR shared export consent", () => {
  const grant = { id: "grant", user_id: "owner", status: "active", expires_at: "2099-01-01" };
  const request = () => new Request(`https://example.test/fhir-export/shared/${"a".repeat(64)}`);

  it.each([
    { data: null },
    { data: { consent_given: true, consent_withdrawn_date: "2026-10-29" } },
    { data: { consent_given: false, consent_withdrawn_date: null } },
    { error: { message: "unavailable" } },
  ])("blocks private reads when latest consent is inactive or unavailable", async (consent) => {
    const { client, calls } = mockClient({ data_sharing_grants: { data: grant }, user_consents: consent });
    const response = await loadHandler("fhir-export", () => client)(request());
    expect(response.status).toBe(403);
    expect(calls.some((call) => ["uploaded_test_results", "biomarker_readings"].includes(call.table))).toBe(false);
    expect(calls.some((call) => call.table === "user_consents" && call.method === "eq" && call.args[0] === "consent_given")).toBe(false);
  });

  it("preserves consented sharing without caching health data", async () => {
    const { client } = mockClient({ data_sharing_grants: { data: grant }, user_consents: { data: { consent_given: true, consent_withdrawn_date: null } } });
    const response = await loadHandler("fhir-export", () => client)(request());
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("withdraws every active consent and does not report success on failure", async () => {
    const { client, calls } = mockClient({ user_consents: { error: { message: "unavailable" } } });
    const response = await loadHandler("fhir-export", () => client)(new Request("https://example.test/fhir-export/consent", {
      method: "POST", headers: { Authorization: "Bearer test" }, body: JSON.stringify({ grant: false }),
    }));
    expect(response.status).toBe(500);
    expect(calls.some((call) => call.method === "update")).toBe(true);
    expect(calls.some((call) => call.method === "limit")).toBe(false);
    expect(calls.some((call) => call.method === "eq" && call.args[0] === "user_id" && call.args[1] === "verified-user")).toBe(true);
  });
});

describe("translation quota identity", () => {
  it("uses the same verified identity despite forged forwarding headers", async () => {
    const { client, calls } = mockClient({ api_rate_limits: { count: 300 } });
    const handler = loadHandler("translate", () => client);
    for (const ip of ["1.2.3.4", "5.6.7.8"]) {
      const response = await handler(new Request("https://example.test/translate", { method: "POST",
        headers: { Authorization: "Bearer test", "x-forwarded-for": ip }, body: JSON.stringify({ texts: ["Hello"], language: "fr" }),
      }));
      expect(response.status).toBe(429);
    }
    expect(calls.filter((call) => call.method === "eq").map((call) => call.args)).toEqual([
      ["client_key", "translate:user:verified-user"], ["client_key", "translate:user:verified-user"],
    ]);
  });

  it("fails closed when quota storage is unavailable", async () => {
    const { client } = mockClient({ api_rate_limits: { error: { message: "unavailable" } } });
    const response = await loadHandler("translate", () => client)(new Request("https://example.test/translate", { method: "POST",
      headers: { Authorization: "Bearer test" }, body: JSON.stringify({ texts: ["Hello"], language: "fr" }),
    }));
    expect(response.status).toBe(503);
  });
});