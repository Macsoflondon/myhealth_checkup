import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/price-alert-checker`;

// ─── CORS ───────────────────────────────────────────────────────────

Deno.test("price-alert-checker: OPTIONS returns CORS headers", async () => {
  const res = await fetch(FUNCTION_URL, { method: "OPTIONS" });
  assertEquals(res.status, 200);
  assertExists(res.headers.get("access-control-allow-origin"));
  await res.text();
});

// ─── Auth guard (verify_jwt = true) ─────────────────────────────────

Deno.test("price-alert-checker: rejects unauthenticated requests", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({}),
  });
  // verify_jwt = true means gateway rejects with 401
  assertEquals(res.status, 401);
  await res.text();
});

// ─── Auth with invalid bearer ───────────────────────────────────────

Deno.test("price-alert-checker: rejects invalid bearer token", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: "Bearer invalid-token",
    },
    body: JSON.stringify({}),
  });
  assertEquals(res.status, 401);
  await res.text();
});

// ─── Content-Type on errors ─────────────────────────────────────────

Deno.test("price-alert-checker: returns JSON content type on auth error", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({}),
  });
  assertMatch(res.headers.get("content-type") || "", /application\/json/);
  await res.text();
});

// ─── CORS on error responses ────────────────────────────────────────

Deno.test("price-alert-checker: includes CORS headers on error responses", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({}),
  });
  assertEquals(res.headers.get("access-control-allow-origin"), "*");
  await res.text();
});

// ─── Error response is valid JSON ───────────────────────────────────

Deno.test("price-alert-checker: error response is valid JSON", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({}),
  });
  assertEquals(res.status, 401);
  const text = await res.text();
  const parsed = JSON.parse(text);
  assertExists(parsed);
});
