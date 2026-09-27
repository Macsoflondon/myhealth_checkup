// Contract tests for the public comparison API and its MCP server.
// Run against the deployed function (or a local one via PUBLIC_API_BASE):
//   deno test --allow-net --allow-env supabase/functions/public-api/index.test.ts

import { assert, assertEquals } from "jsr:@std/assert@1";

const BASE = Deno.env.get("PUBLIC_API_BASE") ??
  "https://clvuioagsgfadynuvodj.supabase.co/functions/v1/public-api";

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, body: await res.json(), headers: res.headers };
}

async function rpc(body: unknown) {
  const res = await fetch(`${BASE}/mcp`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: res.status === 202 ? null : await res.json() };
}

Deno.test("index reports coverage and every response carries meta", async () => {
  const { status, body, headers } = await get("/");
  assertEquals(status, 200);
  assert(body.coverage.tests > 0);
  assert(body.coverage.providers > 0);
  assert(typeof body.meta.data_last_checked_at === "string");
  assert(body.meta.disclaimer.includes("not a medical provider"));
  assertEquals(headers.get("access-control-allow-origin"), "*");
});

Deno.test("tests are ordered by total expected cost and exclude add-ons by default", async () => {
  const { body } = await get("/tests.json?limit=20");
  const costs = body.results.map((r: { price: { total_expected_cost_gbp: number } }) => r.price.total_expected_cost_gbp);
  assertEquals(costs, [...costs].sort((a: number, b: number) => a - b));
  assert(body.results.every((r: { is_addon: boolean }) => r.is_addon === false));
});

Deno.test("every listed test carries the mandatory transparency fields", async () => {
  const { body } = await get("/tests.json?limit=50");
  for (const t of body.results) {
    assert(t.name && t.provider.id, "name and provider");
    assert(typeof t.price.price_gbp === "number", "price");
    assert(Array.isArray(t.biomarkers.listed), "biomarkers");
    assert("text" in t.turnaround, "turnaround");
    assert("type" in t.sample, "sample method");
    assert(Array.isArray(t.sample.location_options), "location options");
    assert(typeof t.last_checked_at === "string", "last checked");
  }
});

Deno.test("compare_biomarker resolves a shared abbreviation and lists alternatives", async () => {
  const { body } = await get("/compare/biomarker.json?biomarker=b12");
  assertEquals(body.status, "ok");
  assert(body.summary.provider_count >= 2);
  assert(Array.isArray(body.other_possible_matches));
});

Deno.test("unknown biomarker returns 404 with a JSON error", async () => {
  const { status, body } = await get("/compare/biomarker.json?biomarker=zzzzzz");
  assertEquals(status, 404);
  assertEquals(body.error.code, "biomarker_not_found");
});

Deno.test("MCP handshake, tool list and a tool call", async () => {
  const init = await rpc({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "1" } } });
  assertEquals(init.body.result.protocolVersion, "2025-06-18");

  const note = await rpc({ jsonrpc: "2.0", method: "notifications/initialized" });
  assertEquals(note.status, 202);

  const list = await rpc({ jsonrpc: "2.0", id: 2, method: "tools/list" });
  const names = list.body.result.tools.map((t: { name: string }) => t.name);
  assert(names.includes("compare_biomarker"));
  assert(names.includes("find_tests_by_biomarkers"));

  const call = await rpc({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "compare_tests", arguments: { q: "vitamin d" } } });
  assertEquals(call.body.result.isError, false);
  assert(call.body.result.structuredContent.provider_count >= 1);
});

Deno.test("write methods are refused", async () => {
  const res = await fetch(`${BASE}/tests.json`, { method: "POST" });
  await res.body?.cancel();
  assertEquals(res.status, 405);
});
