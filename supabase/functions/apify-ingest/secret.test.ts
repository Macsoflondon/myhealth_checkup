import { assertEquals } from "jsr:@std/assert@1.0.19";
import { presentedIngestSecret } from "./index.ts";

const URL_BASE = "https://x.supabase.co/functions/v1/apify-ingest";

Deno.test("reads x-apify-ingest-secret first", () => {
  const req = new Request(`${URL_BASE}?secret=q`, { headers: { "x-apify-ingest-secret": "h" } });
  assertEquals(presentedIngestSecret(req), "h");
});

Deno.test("transition: falls back to ?secret= without a header", () => {
  assertEquals(presentedIngestSecret(new Request(`${URL_BASE}?secret=q`)), "q");
});

Deno.test("missing secret gives an empty value", () => {
  assertEquals(presentedIngestSecret(new Request(URL_BASE)), "");
});
