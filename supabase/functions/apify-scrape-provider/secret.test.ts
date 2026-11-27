// deno test supabase/functions/apify-scrape-provider/secret.test.ts
import { assertEquals } from "jsr:@std/assert@1.0.19";
import {
  apifyWebhookHeadersTemplate,
  readApifyIngestSecret,
} from "../_shared/apify-ingest-secret.ts";
import type { MhcRpcClient } from "../_shared/mhc-auth.ts";

const db = (data: unknown, error: { message: string } | null = null): MhcRpcClient => ({
  rpc: (fn: string) => {
    assertEquals(fn, "apify_ingest_secret");
    return Promise.resolve({ data, error });
  },
});

Deno.test("reads the dedicated secret through rpc('apify_ingest_secret')", async () => {
  assertEquals(await readApifyIngestSecret(db("vault-value")), "vault-value");
});

Deno.test("returns null (caller answers 503, no run) when Vault has nothing", async () => {
  assertEquals(await readApifyIngestSecret(db(null)), null);
  assertEquals(await readApifyIngestSecret(db("  ")), null);
  assertEquals(await readApifyIngestSecret(db(null, { message: "denied" })), null);
});

Deno.test("headersTemplate carries only x-apify-ingest-secret", () => {
  assertEquals(JSON.parse(apifyWebhookHeadersTemplate("v")), { "x-apify-ingest-secret": "v" });
});

Deno.test("the function source never sends the service role key or SCRAPER_CRON_SECRET to Apify", async () => {
  const src = await Deno.readTextFile(new URL("./index.ts", import.meta.url));
  assertEquals(/SCRAPER_CRON_SECRET\"\) \?\? serviceKey/.test(src), false);
  assertEquals(/x-apify-ingest-secret["']?\s*:\s*serviceKey/.test(src), false);
  assertEquals(src.includes("apifyWebhookHeadersTemplate(ingestSecret)"), true);
});
