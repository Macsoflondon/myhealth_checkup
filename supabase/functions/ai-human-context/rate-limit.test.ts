import { strict as assert } from "node:assert";
import {
  AI_DAILY_GLOBAL_LIMIT,
  DAILY_LIMIT,
  DAILY_WINDOW_MS,
  GLOBAL_DAILY_CLIENT_KEY,
  GLOBAL_DAILY_ENDPOINT,
  clientIpFrom,
  decideDailyCap,
  decideGlobalDailyCap,
  recommendationMode,
} from "./rate-limit.ts";

const now = Date.parse("2026-10-19T12:00:00Z");
const at = (msAgo: number) => new Date(now - msAgo).toISOString();

Deno.test("first request from an IP starts a daily window", () => {
  assert.deepEqual(decideDailyCap(null, now), {
    allowed: true,
    action: "start",
  });
});

Deno.test("requests under 30 in 24 hours are allowed and counted", () => {
  assert.deepEqual(
    decideDailyCap({ request_count: 29, window_start: at(1000) }, now),
    {
      allowed: true,
      action: "increment",
      nextCount: 30,
    },
  );
});

Deno.test("the 31st request within 24 hours is refused", () => {
  assert.equal(DAILY_LIMIT, 30);
  assert.deepEqual(
    decideDailyCap({ request_count: 30, window_start: at(1000) }, now),
    { allowed: false },
  );
});

Deno.test("an expired window resets the daily count", () => {
  assert.deepEqual(
    decideDailyCap(
      { request_count: 30, window_start: at(DAILY_WINDOW_MS) },
      now,
    ),
    { allowed: true, action: "start" },
  );
});

Deno.test(
  "the 1,000th paid call is counted and logs the ceiling transition",
  () => {
    assert.equal(AI_DAILY_GLOBAL_LIMIT, 1000);
    assert.equal(GLOBAL_DAILY_ENDPOINT, "ai-human-context-paid-global-daily");
    assert.equal(GLOBAL_DAILY_CLIENT_KEY, "all-visitors");
    assert.deepEqual(
      decideGlobalDailyCap({ request_count: 999, window_start: at(1000) }, now),
      {
        allowed: true,
        action: "increment",
        nextCount: 1000,
        justReached: true,
      },
    );
  },
);

Deno.test("past the global ceiling the finder uses keyword scoring", () => {
  const decision = decideGlobalDailyCap(
    { request_count: 1000, window_start: at(1000) },
    now,
  );
  assert.deepEqual(decision, { allowed: false, justReached: false });
  assert.equal(recommendationMode(true, decision.allowed), "keyword-scoring");
  assert.equal(recommendationMode(false, true), "keyword-scoring");
  assert.equal(recommendationMode(true, true), "paid-ai");
});

Deno.test("the global ceiling uses a fresh rolling 24-hour window", () => {
  assert.deepEqual(
    decideGlobalDailyCap(
      { request_count: 1000, window_start: at(DAILY_WINDOW_MS) },
      now,
    ),
    { allowed: true, action: "start", justReached: false },
  );
});

Deno.test("prefers the Cloudflare client IP header", () => {
  const h = new Headers({
    "cf-connecting-ip": "1.1.1.1",
    "x-forwarded-for": "2.2.2.2, 3.3.3.3",
  });
  assert.equal(clientIpFrom(h), "1.1.1.1");
  assert.equal(
    clientIpFrom(new Headers({ "x-forwarded-for": "2.2.2.2, 3.3.3.3" })),
    "unknown",
  );
});
