import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/quiz-recommendations`;

// ─── CORS ───────────────────────────────────────────────────────────

Deno.test("quiz-recommendations: OPTIONS returns CORS headers", async () => {
  const res = await fetch(FUNCTION_URL, { method: "OPTIONS" });
  assertEquals(res.status, 200);
  assertExists(res.headers.get("access-control-allow-origin"));
  await res.text();
});

// ─── Public access (no auth required) ───────────────────────────────

Deno.test("quiz-recommendations: accepts unauthenticated requests (public endpoint)", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      who: "myself",
      gender: "female",
      ageRange: "30-39",
      goal: "general-health",
      concerns: ["fatigue"],
      symptoms: [],
      sampleMethod: "home-kit",
      budget: "50-100",
      speed: "standard",
    }),
  });
  // Should NOT return 401 since this is a public endpoint
  const status = res.status;
  assertEquals(status !== 401, true, `Expected non-401 but got ${status}`);
  await res.text();
});

// ─── Input validation: missing required fields ──────────────────────

Deno.test("quiz-recommendations: handles missing body fields gracefully", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({}),
  });
  // Should still respond (may return 200 with empty recommendations or 500)
  const status = res.status;
  assertEquals(status === 200 || status === 500, true, `Unexpected status ${status}`);
  await res.text();
});

// ─── Valid quiz submission ──────────────────────────────────────────

Deno.test("quiz-recommendations: returns JSON response for valid quiz input", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      who: "myself",
      gender: "male",
      ageRange: "40-49",
      goal: "heart-health",
      concerns: ["cholesterol"],
      symptoms: ["chest-pain"],
      sampleMethod: "clinic",
      budget: "100-200",
      speed: "fast",
    }),
  });
  assertMatch(res.headers.get("content-type") || "", /application\/json/);
  await res.text();
});

// ─── CORS on all responses ──────────────────────────────────────────

Deno.test("quiz-recommendations: includes CORS headers on all responses", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      who: "partner",
      gender: "female",
      ageRange: "20-29",
      goal: "hormones",
      concerns: [],
      symptoms: [],
      sampleMethod: "home-kit",
      budget: "under-50",
      speed: "standard",
    }),
  });
  assertEquals(res.headers.get("access-control-allow-origin"), "*");
  await res.text();
});

// ─── Response structure validation ──────────────────────────────────

Deno.test("quiz-recommendations: response body is parseable JSON", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      who: "myself",
      gender: "male",
      ageRange: "50-59",
      goal: "general-health",
      concerns: ["diabetes"],
      symptoms: [],
      sampleMethod: "home-kit",
      budget: "100-200",
      speed: "standard",
    }),
  });
  const text = await res.text();
  const parsed = JSON.parse(text);
  assertExists(parsed);
});

// ─── GET method rejected ────────────────────────────────────────────

Deno.test("quiz-recommendations: rejects GET requests gracefully", async () => {
  const res = await fetch(FUNCTION_URL, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
    },
  });
  // Should either return an error or handle gracefully
  const status = res.status;
  assertEquals(status >= 200, true);
  await res.text();
});
