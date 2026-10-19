import { strict as assert } from "node:assert";
import { DAILY_LIMIT, DAILY_WINDOW_MS, clientIpFrom, decideDailyCap } from "./rate-limit.ts";

const now = Date.parse("2026-10-19T12:00:00Z");
const at = (msAgo: number) => new Date(now - msAgo).toISOString();

Deno.test("first request from an IP starts a daily window", () => {
  assert.deepEqual(decideDailyCap(null, now), { allowed: true, action: "start" });
});

Deno.test("requests under 30 in 24 hours are allowed and counted", () => {
  assert.deepEqual(decideDailyCap({ request_count: 29, window_start: at(1000) }, now), {
    allowed: true,
    action: "increment",
    nextCount: 30,
  });
});

Deno.test("the 31st request within 24 hours is refused", () => {
  assert.equal(DAILY_LIMIT, 30);
  assert.deepEqual(decideDailyCap({ request_count: 30, window_start: at(1000) }, now), { allowed: false });
});

Deno.test("an expired window resets the daily count", () => {
  assert.deepEqual(
    decideDailyCap({ request_count: 30, window_start: at(DAILY_WINDOW_MS) }, now),
    { allowed: true, action: "start" },
  );
});

Deno.test("prefers the Cloudflare client IP header", () => {
  const h = new Headers({ "cf-connecting-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2, 3.3.3.3" });
  assert.equal(clientIpFrom(h), "1.1.1.1");
  assert.equal(clientIpFrom(new Headers({ "x-forwarded-for": "2.2.2.2, 3.3.3.3" })), "2.2.2.2");
});
