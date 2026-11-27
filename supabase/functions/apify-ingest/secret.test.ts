// deno test supabase/functions/apify-ingest/secret.test.ts
import { assert, assertEquals } from "jsr:@std/assert@1.0.19";
import { checkApifyIngestSecret } from "../_shared/apify-ingest-secret.ts";
import type { MhcRpcClient } from "../_shared/mhc-auth.ts";

const SECRET = "test-only-ingest-secret-abcdef";
const BASE = "https://x.supabase.co/functions/v1/apify-ingest";
const db = (data: unknown, error: { message: string } | null = null): MhcRpcClient => ({
  rpc: (fn: string) => {
    assertEquals(fn, "apify_ingest_secret");
    return Promise.resolve({ data, error });
  },
});
const hdr = (v: string, url = BASE) =>
  new Request(url, { headers: { "x-apify-ingest-secret": v } });

Deno.test("matching header is accepted", async () => {
  assertEquals(await checkApifyIngestSecret(hdr(SECRET), db(SECRET)), { ok: true });
});

Deno.test("wrong or missing header gives 401", async () => {
  assertEquals(await checkApifyIngestSecret(hdr(SECRET + "x"), db(SECRET)), { ok: false, status: 401 });
  assertEquals(await checkApifyIngestSecret(new Request(BASE), db(SECRET)), { ok: false, status: 401 });
});

Deno.test("?secret= and x-cron-secret are no longer accepted", async () => {
  assertEquals(await checkApifyIngestSecret(new Request(`${BASE}?secret=${SECRET}`), db(SECRET)), { ok: false, status: 401 });
  const cron = new Request(BASE, { headers: { "x-cron-secret": SECRET } });
  assertEquals(await checkApifyIngestSecret(cron, db(SECRET)), { ok: false, status: 401 });
});

Deno.test("no fallback to SCRAPER_CRON_SECRET or the service role key: empty Vault gives 503", async () => {
  for (const d of [db(null), db(""), db(null, { message: "denied" })]) {
    assertEquals(await checkApifyIngestSecret(hdr(SECRET), d), { ok: false, status: 503 });
  }
  const throwing: MhcRpcClient = { rpc: () => Promise.reject(new Error("net")) };
  assert(!(await checkApifyIngestSecret(hdr(SECRET), throwing)).ok);
});
