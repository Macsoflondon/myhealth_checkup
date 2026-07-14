import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals, assertExists, assertMatch } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/ai-human-context`;

// ─── CORS ───────────────────────────────────────────────────────────

Deno.test("ai-human-context: OPTIONS returns CORS headers", async () => {
  const res = await fetch(FUNCTION_URL, { method: "OPTIONS" });
  assertEquals(res.status, 200);
  assertExists(res.headers.get("access-control-allow-origin"));
  await res.text();
});
