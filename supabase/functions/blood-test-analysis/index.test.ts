import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/blood-test-analysis`;

// ─── CORS ───────────────────────────────────────────────────────────

Deno.test("blood-test-analysis: OPTIONS returns CORS headers", async () => {
  const res = await fetch(FUNCTION_URL, { method: "OPTIONS" });
  assertEquals(res.status, 200);
  assertExists(res.headers.get("access-control-allow-origin"));
  await res.text();
});

// ─── Auth guard ─────────────────────────────────────────────────────

Deno.test("blood-test-analysis: rejects unauthenticated requests", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      readings: [{ biomarkerName: "Cholesterol", value: 5.2, unit: "mmol/L" }],
    }),
  });
  assertEquals(res.status, 401);
  await res.text();
});

// ─── Auth with invalid bearer ───────────────────────────────────────

Deno.test("blood-test-analysis: rejects invalid bearer token", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: "Bearer invalid-token-here",
    },
    body: JSON.stringify({
      readings: [{ biomarkerName: "Cholesterol", value: 5.2, unit: "mmol/L" }],
    }),
  });
  // Manual JWT verification should reject invalid tokens
  assertEquals(res.status === 401 || res.status === 500, true);
  await res.text();
});

// ─── Input validation: missing readings ─────────────────────────────

Deno.test("blood-test-analysis: rejects missing readings (unauthed → 401)", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({}),
  });
  // Auth check comes first
  assertEquals(res.status, 401);
  await res.text();
});

// ─── Input validation: empty readings array ─────────────────────────

Deno.test("blood-test-analysis: rejects empty readings array (unauthed → 401)", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ readings: [] }),
  });
  assertEquals(res.status, 401);
  await res.text();
});

// ─── Content-Type on errors ─────────────────────────────────────────

Deno.test("blood-test-analysis: returns JSON content type on auth error", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      readings: [{ biomarkerName: "HbA1c", value: 42, unit: "mmol/mol" }],
    }),
  });
  assertMatch(res.headers.get("content-type") || "", /application\/json/);
  await res.text();
});

// ─── CORS on error responses ────────────────────────────────────────

Deno.test("blood-test-analysis: includes CORS headers on error responses", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      readings: [{ biomarkerName: "TSH", value: 2.5, unit: "mIU/L" }],
    }),
  });
  assertEquals(res.headers.get("access-control-allow-origin"), "*");
  await res.text();
});

// ─── Error response structure ───────────────────────────────────────

Deno.test("blood-test-analysis: error response is valid JSON", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      readings: [{ biomarkerName: "Vitamin D", value: 50, unit: "nmol/L" }],
    }),
  });
  assertEquals(res.status, 401);
  const text = await res.text();
  const parsed = JSON.parse(text);
  assertExists(parsed);
});
