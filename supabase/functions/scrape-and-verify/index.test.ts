import { assertEquals } from "jsr:@std/assert@1.0.19";
import { productRedirectIssue } from "../_shared/scrape/product-url.ts";
import {
  CHECK_START_BUDGET_MS,
  finalRunDetails,
  oldestFirst,
  runBudgetedPool,
} from "./run-budget.ts";
import { captureHandler } from "../_shared/testing/capture-handler.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const handler = await captureHandler(() => import("./index.ts"));
const { runVerification } = await import("./index.ts");

Deno.test("product redirects to the homepage are broken", () => {
  assertEquals(
    productRedirectIssue(
      "https://lolahealth.com/products/auto-immunity-monitoring",
      "https://lolahealth.com/",
    ),
    "redirected to homepage",
  );
  assertEquals(
    productRedirectIssue(
      "https://lolahealth.com/products/auto-immunity-monitoring",
      "https://lolahealth.com",
    ),
    "redirected to homepage",
  );
});

Deno.test(
  "never-checked first, then oldest timestamp, with stable ID ties",
  () => {
    const rows = [
      { id: "new", url_verified_at: "2026-11-22T05:15:00Z" },
      { id: "b", url_verified_at: null },
      { id: "old", url_verified_at: "2026-11-21T05:15:00Z" },
      { id: "a", url_verified_at: null },
    ];
    assertEquals(
      oldestFirst(rows).map((r) => r.id),
      ["a", "b", "old", "new"],
    );
    assertEquals(rows[0]?.id, "new");
  },
);

Deno.test(
  "330-second budget stops new checks while allowing an in-flight check to finish",
  async () => {
    assertEquals(CHECK_START_BUDGET_MS, 330_000);
    let now = 1_000_000;
    const reached: number[] = [];
    await runBudgetedPool([1, 2, 3, 4], {
      concurrency: 1,
      staggerStartMs: 1500,
      staggerMaxMs: 4000,
      deadline: now + CHECK_START_BUDGET_MS,
      now: () => now,
      sleep: (ms) => {
        now += ms;
        return Promise.resolve();
      },
      process: (row) => {
        reached.push(row);
        now += 170_000;
        return Promise.resolve({ hit429: false });
      },
    });
    assertEquals(reached, [1, 2]);
    assertEquals(
      finalRunDetails(
        4,
        { checked: 2, ok: 2, broken: 0, rateLimited: 0 },
        false,
      ).not_reached,
      2,
    );
  },
);

Deno.test(
  "a provider stagger crossing the cutoff never starts another request",
  async () => {
    let now = 1000;
    const reached: number[] = [];
    await runBudgetedPool([1, 2], {
      concurrency: 1,
      staggerStartMs: 1500,
      staggerMaxMs: 4000,
      deadline: 2000,
      now: () => now,
      sleep: (ms) => {
        now += ms;
        return Promise.resolve();
      },
      process: (row) => {
        reached.push(row);
        return Promise.resolve({ hit429: true });
      },
    });
    assertEquals(reached, [1]);
  },
);

Deno.test(
  "completed and partial logs keep mutually exclusive checked outcomes and not-reached counts",
  () => {
    assertEquals(
      finalRunDetails(
        3,
        { checked: 3, ok: 2, broken: 1, rateLimited: 0 },
        false,
      ),
      {
        status: "completed",
        checked: 3,
        ok: 2,
        broken: 1,
        rate_limited: 0,
        not_reached: 0,
      },
    );
    assertEquals(
      finalRunDetails(
        5,
        { checked: 3, ok: 1, broken: 1, rateLimited: 1 },
        false,
      ),
      {
        status: "partial",
        checked: 3,
        ok: 1,
        broken: 1,
        rate_limited: 1,
        not_reached: 2,
      },
    );
    assertEquals(
      finalRunDetails(
        1,
        { checked: 1, ok: 0, broken: 0, rateLimited: 1 },
        false,
      ).status,
      "partial",
    );
    assertEquals(
      finalRunDetails(0, { checked: 0, ok: 0, broken: 0, rateLimited: 0 }, true)
        .status,
      "partial",
    );
  },
);

Deno.test(
  "202 is returned before link checking ends; background writes completed counts in oldest-first order",
  async () => {
    const originalFetch = globalThis.fetch;
    const originalUrl = Deno.env.get("SUPABASE_URL");
    const originalKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const runtimeDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "EdgeRuntime",
    );
    Deno.env.set("SUPABASE_URL", "https://database.test");
    Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-only-key");
    const tasks: Promise<unknown>[] = [];
    Object.defineProperty(globalThis, "EdgeRuntime", {
      configurable: true,
      value: { waitUntil: (task: Promise<unknown>) => tasks.push(task) },
    });
    let release: (() => void) | undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const checked: string[] = [];
    const logs: Array<Record<string, unknown>> = [];
    globalThis.fetch = async (input, init) => {
      const req = input instanceof Request ? input : new Request(input, init);
      const url = new URL(req.url);
      if (url.pathname.endsWith("scrape_run_log")) {
        if (req.method === "POST") return Response.json({ id: "run-test" });
        logs.push((await req.json()) as Record<string, unknown>);
        return Response.json([]);
      }
      if (url.pathname.endsWith("provider_tests")) {
        if (req.method === "PATCH") return Response.json([]);
        assertEquals(
          url.searchParams.get("order"),
          "url_verified_at.asc.nullsfirst,id.asc",
        );
        await gate;
        return Response.json([
          {
            id: "new",
            provider_id: "lola-health",
            url: "https://lolahealth.com/tests/new",
            url_verified_at: "2026-11-22T05:15:00Z",
          },
          {
            id: "never",
            provider_id: "lola-health",
            url: "https://lolahealth.com/tests/never",
            url_verified_at: null,
          },
          {
            id: "old",
            provider_id: "lola-health",
            url: "https://lolahealth.com/tests/old",
            url_verified_at: "2026-11-21T05:15:00Z",
          },
        ]);
      }
      checked.push(url.pathname);
      return new Response("", { status: 200 });
    };
    try {
      const response = await handler(
        new Request("https://test.local", {
          method: "POST",
          headers: { Authorization: "Bearer test-only-key" },
        }),
      );
      assertEquals(response.status, 202);
      assertEquals(await response.json(), {
        run_id: "run-test",
        status: "accepted",
      });
      assertEquals(tasks.length, 1);
      assertEquals(checked.length, 0);
      release?.();
      await Promise.all(tasks);
      assertEquals(checked, ["/tests/never", "/tests/old", "/tests/new"]);
      assertEquals(logs[0]?.["status"], "completed");
      const details = logs[0]?.["details"] as Record<string, unknown>;
      assertEquals(details["checked"], 3);
      assertEquals(details["ok"], 3);
      assertEquals(details["broken"], 0);
      assertEquals(details["rate_limited"], 0);
      assertEquals(details["not_reached"], 0);
    } finally {
      release?.();
      await Promise.all(tasks);
      globalThis.fetch = originalFetch;
      if (runtimeDescriptor)
        Object.defineProperty(globalThis, "EdgeRuntime", runtimeDescriptor);
      else Reflect.deleteProperty(globalThis, "EdgeRuntime");
      if (originalUrl === undefined) Deno.env.delete("SUPABASE_URL");
      else Deno.env.set("SUPABASE_URL", originalUrl);
      if (originalKey === undefined)
        Deno.env.delete("SUPABASE_SERVICE_ROLE_KEY");
      else Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", originalKey);
    }
  },
);

Deno.test(
  "discovery failure and exhausted budget still finalise partial run logs",
  async () => {
    const originalFetch = globalThis.fetch;
    const logs: Array<Record<string, unknown>> = [];
    globalThis.fetch = async (input, init) => {
      const req = input instanceof Request ? input : new Request(input, init);
      if (new URL(req.url).pathname.endsWith("scrape_run_log")) {
        logs.push((await req.json()) as Record<string, unknown>);
        return Response.json([]);
      }
      return Response.json({ message: "test failure" }, { status: 500 });
    };
    try {
      const client = createClient("https://database.test", "test-only-key", {
        auth: { persistSession: false },
      });
      await runVerification(client, "run-error", null, Date.now() + 1000);
      await runVerification(client, "run-timeout", null, Date.now() - 1);
      assertEquals(logs.length, 2);
      assertEquals(
        logs.map((log) => log["status"]),
        ["partial", "partial"],
      );
      assertEquals(
        logs.every((log) => typeof log["completed_at"] === "string"),
        true,
      );
    } finally {
      globalThis.fetch = originalFetch;
    }
  },
);
Deno.test(
  "429 retries remain inconclusive without alerts or field changes, with accurate partial counts",
  async () => {
    const originalFetch = globalThis.fetch;
    const updates: string[] = [];
    const alerts: Array<Record<string, unknown>> = [];
    const logs: Array<Record<string, unknown>> = [];
    let rateRequests = 0;
    globalThis.fetch = async (input, init) => {
      const req = input instanceof Request ? input : new Request(input, init);
      const url = new URL(req.url);
      if (url.pathname.endsWith("provider_tests")) {
        if (req.method === "PATCH") {
          updates.push(url.searchParams.get("id") ?? "");
          return Response.json([]);
        }
        return Response.json(
          ["ok", "rate", "broken"].map((id) => ({
            id,
            provider_id: id,
            url: `https://${id}.test/products/test`,
            url_verified_at: null,
          })),
        );
      }
      if (url.pathname.endsWith("scraper_alerts")) {
        alerts.push((await req.json()) as Record<string, unknown>);
        return Response.json([]);
      }
      if (url.pathname.endsWith("scrape_run_log")) {
        logs.push((await req.json()) as Record<string, unknown>);
        return Response.json([]);
      }
      if (url.hostname === "rate.test") {
        rateRequests++;
        return new Response("", {
          status: 429,
          headers: { "Retry-After": "0" },
        });
      }
      if (url.hostname === "broken.test") {
        const response = new Response("", { status: 200 });
        Object.defineProperty(response, "url", {
          value: "https://broken.test/",
        });
        return response;
      }
      return new Response("", { status: 200 });
    };
    try {
      await runVerification(
        createClient("https://database.test", "test-only-key", {
          auth: { persistSession: false },
        }),
        "rate-run",
        null,
        Date.now() + 10_000,
      );
      assertEquals(rateRequests, 3);
      assertEquals(updates.sort(), ["eq.broken", "eq.ok"]);
      assertEquals(alerts.length, 1);
      assertEquals(alerts[0]?.["provider_id"], "broken");
      assertEquals(logs[0]?.["status"], "partial");
      const details = logs[0]?.["details"] as Record<string, unknown>;
      assertEquals(details["checked"], 3);
      assertEquals(details["ok"], 1);
      assertEquals(details["broken"], 1);
      assertEquals(details["rate_limited"], 1);
      assertEquals(details["not_reached"], 0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  },
);

Deno.test("product redirects to another non-product path are broken", () => {
  assertEquals(
    productRedirectIssue(
      "https://lolahealth.com/products/esr",
      "https://lolahealth.com/collections/tests",
    ),
    "redirected away from product",
  );
});
Deno.test("valid product redirects and homepage requests remain valid", () => {
  assertEquals(
    productRedirectIssue(
      "https://lolahealth.com/products/esr",
      "https://lolahealth.com/products/new-esr?variant=1",
    ),
    null,
  );
  assertEquals(
    productRedirectIssue("https://lolahealth.com/", "https://lolahealth.com/"),
    null,
  );
  assertEquals(
    productRedirectIssue(
      "https://example.com/exam/profiles/one",
      "https://example.com/exam/profiles/two",
    ),
    null,
  );
});
