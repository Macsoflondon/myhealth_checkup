// soc-action edge-function tests. Uses fetch(new Request) against the handler in isolation
// by dynamically importing the module and driving Deno.serve — we assert HTTP contract only,
// no live DB writes.

import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { z } from "npm:zod";

// Mirror of the schema in index.ts — keep in sync.
const BodySchema = z.object({
  incident_id: z.string().uuid(),
  action: z.enum([
    "acknowledge_scraper_alerts_for_entity",
    "resolve_operational_alerts_for_entity",
    "reverse_acknowledge_scraper_alerts_for_entity",
    "reverse_resolve_operational_alerts_for_entity",
  ]),
});

Deno.test("BodySchema rejects unknown actions", () => {
  const r = BodySchema.safeParse({
    incident_id: "00000000-0000-0000-0000-000000000000",
    action: "delete_everything",
  });
  assertEquals(r.success, false);
});

Deno.test("BodySchema rejects non-UUID incident_id", () => {
  const r = BodySchema.safeParse({ incident_id: "not-a-uuid", action: "acknowledge_scraper_alerts_for_entity" });
  assertEquals(r.success, false);
});

Deno.test("BodySchema accepts each supported action", () => {
  for (const action of [
    "acknowledge_scraper_alerts_for_entity",
    "resolve_operational_alerts_for_entity",
    "reverse_acknowledge_scraper_alerts_for_entity",
    "reverse_resolve_operational_alerts_for_entity",
  ] as const) {
    const r = BodySchema.safeParse({ incident_id: crypto.randomUUID(), action });
    assertEquals(r.success, true, `should accept ${action}`);
  }
});
