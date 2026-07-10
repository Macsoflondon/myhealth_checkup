// web-vitals-ingest schema tests. Contract-level only.

import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { z } from "npm:zod";

const SampleSchema = z.object({
  metric: z.enum(["LCP", "CLS", "INP", "FCP", "TTFB", "FID"]),
  value: z.number().finite().min(0).max(60_000),
  rating: z.enum(["good", "needs-improvement", "poor"]).optional(),
  route: z.string().max(300).optional(),
  device_type: z.enum(["mobile", "tablet", "desktop", "unknown"]).optional(),
  connection_type: z.string().max(30).optional(),
  session_hash: z.string().max(64).optional(),
  navigation_type: z.string().max(30).optional(),
});
const BodySchema = z.object({ samples: z.array(SampleSchema).min(1).max(20) });

Deno.test("accepts a valid LCP sample", () => {
  const r = BodySchema.safeParse({ samples: [{ metric: "LCP", value: 2300, rating: "good", route: "/" }] });
  assert(r.success);
});

Deno.test("rejects unknown metric", () => {
  const r = BodySchema.safeParse({ samples: [{ metric: "MPR", value: 1 }] });
  assertEquals(r.success, false);
});

Deno.test("rejects negative or infinite values", () => {
  assertEquals(BodySchema.safeParse({ samples: [{ metric: "CLS", value: -1 }] }).success, false);
  assertEquals(BodySchema.safeParse({ samples: [{ metric: "CLS", value: Number.POSITIVE_INFINITY }] }).success, false);
});

Deno.test("rejects value beyond upper bound", () => {
  assertEquals(BodySchema.safeParse({ samples: [{ metric: "LCP", value: 60_001 }] }).success, false);
});

Deno.test("rejects empty samples array", () => {
  assertEquals(BodySchema.safeParse({ samples: [] }).success, false);
});

Deno.test("rejects overly large batch (>20 samples)", () => {
  const samples = Array.from({ length: 21 }, () => ({ metric: "LCP", value: 1000 }));
  assertEquals(BodySchema.safeParse({ samples }).success, false);
});

Deno.test("caps route length", () => {
  const long = "a".repeat(301);
  assertEquals(BodySchema.safeParse({ samples: [{ metric: "LCP", value: 100, route: long }] }).success, false);
});
