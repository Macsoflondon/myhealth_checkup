import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/send-test-notification`;

// ─── CORS ───────────────────────────────────────────────────────────

Deno.test("send-test-notification: OPTIONS returns CORS headers", async () => {
  const res = await fetch(FUNCTION_URL, { method: "OPTIONS" });
  assertEquals(res.status, 200);
  assertExists(res.headers.get("access-control-allow-origin"));
  await res.text();
});

// ─── Auth guard ─────────────────────────────────────────────────────

Deno.test("send-test-notification: rejects unauthenticated requests", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ type: "email", notificationType: "test_results" }),
  });
  assertEquals(res.status, 401);
  await res.text();
});

// ─── Auth with invalid bearer ───────────────────────────────────────

Deno.test("send-test-notification: rejects invalid bearer token", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: "Bearer invalid-token",
    },
    body: JSON.stringify({ type: "email", notificationType: "test_results" }),
  });
  // Manual auth check should reject
  const status = res.status;
  assertEquals(status === 401 || status === 500, true, `Expected 401 or 500 but got ${status}`);
  await res.text();
});

// ─── Missing auth header ────────────────────────────────────────────

Deno.test("send-test-notification: rejects missing Authorization header", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ type: "sms", notificationType: "price_drop" }),
  });
  assertEquals(res.status, 401);
  await res.text();
});

// ─── Content-Type on errors ─────────────────────────────────────────

Deno.test("send-test-notification: returns JSON content type on auth error", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ type: "email", notificationType: "test_results" }),
  });
  assertMatch(res.headers.get("content-type") || "", /application\/json/);
  await res.text();
});

// ─── CORS on error responses ────────────────────────────────────────

Deno.test("send-test-notification: includes CORS headers on error responses", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ type: "email", notificationType: "test_results" }),
  });
  assertEquals(res.headers.get("access-control-allow-origin"), "*");
  await res.text();
});

// ─── Error response is valid JSON ───────────────────────────────────

Deno.test("send-test-notification: error response is valid JSON", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ type: "email", notificationType: "test_results" }),
  });
  const text = await res.text();
  const parsed = JSON.parse(text);
  assertExists(parsed);
});
