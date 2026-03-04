import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/encrypt-sensitive-data`;

// ─── CORS ───────────────────────────────────────────────────────────

Deno.test("encrypt-sensitive-data: OPTIONS returns CORS headers", async () => {
  const res = await fetch(FUNCTION_URL, { method: "OPTIONS" });
  assertEquals(res.status, 200);
  assertExists(res.headers.get("access-control-allow-origin"));
  await res.text(); // consume body
});

// ─── Auth guard ─────────────────────────────────────────────────────

Deno.test("encrypt-sensitive-data: rejects unauthenticated requests", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ action: "encrypt", data: "test" }),
  });
  assertEquals(res.status, 401);
  const body = await res.json();
  assertExists(body.error);
});

// ─── Input validation ───────────────────────────────────────────────

Deno.test("encrypt-sensitive-data: rejects invalid action", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`, // will fail auth but tests action validation order
    },
    body: JSON.stringify({ action: "invalid_action", data: "test" }),
  });
  // Should return 401 (auth check comes before action validation) or 400
  const status = res.status;
  assertEquals(status === 401 || status === 400, true);
  await res.text(); // consume body
});

// ─── Data type validation ───────────────────────────────────────────

Deno.test("encrypt-sensitive-data: rejects non-string data for encrypt action (unauthed)", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ action: "encrypt", data: 12345 }),
  });
  // Auth check first → 401
  assertEquals(res.status, 401);
  await res.text();
});

// ─── Content-Type ───────────────────────────────────────────────────

Deno.test("encrypt-sensitive-data: returns JSON content type on error", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ action: "encrypt", data: "test" }),
  });
  assertMatch(res.headers.get("content-type") || "", /application\/json/);
  await res.text();
});

// ─── CORS on error responses ────────────────────────────────────────

Deno.test("encrypt-sensitive-data: includes CORS headers on error responses", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ action: "encrypt", data: "test" }),
  });
  assertEquals(res.headers.get("access-control-allow-origin"), "*");
  await res.text();
});
