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
  assert(body.coverage.standalone_tests > 0);
  assert(typeof body.known_gaps.tests_with_stale_price_check === "number");
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

Deno.test("shared abbreviations resolve to the most widely offered biomarker", async () => {
  const { body } = await get("/compare/biomarker.json?biomarker=hdl");
  assertEquals(body.biomarker.name, "HDL Cholesterol");
  assert(body.summary.provider_count >= 5);
});

Deno.test("equivalent biomarker rows are folded together (HbA1c includes Clinilabs)", async () => {
  const { body } = await get("/compare/biomarker.json?biomarker=hba1c&include_addons=false");
  const ids = body.by_provider.map((p: { provider: { id: string } }) => p.provider.id);
  assert(ids.includes("clinilabs"), `providers: ${ids.join(", ")}`);
});

Deno.test("cheapest picks never use a stale price when a fresh one exists", async () => {
  for (const b of ["psa", "b12", "ferritin", "tsh"]) {
    const { body } = await get(`/compare/biomarker.json?biomarker=${b}&include_addons=false`);
    const offers = body.offers as { price_check_stale: boolean }[];
    if (offers.some((o) => !o.price_check_stale)) {
      assertEquals(body.summary.cheapest_standalone.price_check_stale, false, b);
    }
  }
});

Deno.test("clinic-only tests with a published collection fee include it in the total", async () => {
  const { body } = await get("/tests.json?provider=london-medical-laboratory&collection=clinic_visit&limit=100");
  const withFee = body.results.filter((r: { price: { total_includes_collection_fee: boolean } }) => r.price.total_includes_collection_fee);
  for (const r of withFee) assert(r.price.total_expected_cost_gbp >= r.price.price_gbp + r.price.collection_fee_gbp);
});

Deno.test("non-test rows are excluded", async () => {
  const { body } = await get("/tests.json?search=collection%20method");
  assertEquals(body.total, 0);
});

Deno.test("paging past the end returns an empty page, not an error", async () => {
  const { status, body } = await get("/tests.json?offset=5000&limit=5");
  assertEquals(status, 200);
  assertEquals(body.results.length, 0);
});

Deno.test("unusable filters are rejected with 400 and carry meta", async () => {
  for (const q of ["provider=*", "collection=nurse", "sort=cheapest", "search=%25"]) {
    const { status, body } = await get(`/tests.json?${q}`);
    assertEquals(status, 400, q);
    assert(body.meta?.disclaimer, q);
  }
});

Deno.test("malformed MCP messages get JSON-RPC errors", async () => {
  for (const bad of [null, [null], 5]) {
    const res = await rpc(bad);
    const reply = Array.isArray(res.body) ? res.body[0] : res.body;
    assertEquals(reply.error.code, -32600);
  }
  const missing = await rpc({ jsonrpc: "2.0", id: 9, method: "tools/call", params: { name: "get_test", arguments: {} } });
  assertEquals(missing.body.result.isError, true);
});

Deno.test("write methods are refused", async () => {
  const res = await fetch(`${BASE}/tests.json`, { method: "POST" });
  await res.body?.cancel();
  assertEquals(res.status, 405);
});
