import { assertEquals } from "jsr:@std/assert@1.0.19";
import { readThrottleInput } from "./request.ts";
import { captureHandler } from "../_shared/testing/capture-handler.ts";

const handler = await captureHandler(() => import("./index.ts"));
const request = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("https://test.local/auth-throttle", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

Deno.test("accepts only check or failure with a valid email", async () => {
  for (const outcome of ["check", "failure"])
    assertEquals(
      (
        await readThrottleInput(
          request({ email: "reader@example.com", outcome }),
        )
      ).status,
      200,
    );
  assertEquals(
    (
      await readThrottleInput(
        request({ email: "reader@example.com", outcome: "success" }),
      )
    ).status,
    400,
  );
  assertEquals(
    (await readThrottleInput(request({ email: "invalid", outcome: "check" })))
      .status,
    400,
  );
});
Deno.test("rejects password and unknown fields", async () => {
  assertEquals(
    (
      await readThrottleInput(
        request({
          email: "reader@example.com",
          outcome: "failure",
          password: "not-accepted",
        }),
      )
    ).status,
    400,
  );
  assertEquals(
    (
      await readThrottleInput(
        request({ email: "reader@example.com", outcome: "check", extra: true }),
      )
    ).status,
    400,
  );
});
Deno.test("email is bounded at 254 characters", async () => {
  const email = `${"a".repeat(64)}@${"b".repeat(63)}.${"c".repeat(63)}.${"d".repeat(61)}`;
  assertEquals(email.length, 254);
  assertEquals(
    (await readThrottleInput(request({ email, outcome: "check" }))).status,
    200,
  );
  assertEquals(
    (await readThrottleInput(request({ email: email + "e", outcome: "check" })))
      .status,
    400,
  );
});
Deno.test("rejects more than 2KB with and without Content-Length", async () => {
  const body = {
    email: "reader@example.com",
    outcome: "check",
    extra: "x".repeat(2048),
  };
  assertEquals((await readThrottleInput(request(body))).status, 413);
  assertEquals(
    (await readThrottleInput(request(body, { "content-length": "2100" })))
      .status,
    413,
  );
});
Deno.test(
  "check is read-only, failure records once, buckets preserve address logic and never call Auth",
  async () => {
    const originalFetch = globalThis.fetch;
    const originalUrl = Deno.env.get("SUPABASE_URL");
    const originalKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    Deno.env.set("SUPABASE_URL", "https://database.test");
    Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-only-key");
    const counts = new Map<string, number>();
    let inserts = 0;
    let authCalls = 0;
    globalThis.fetch = async (input, init) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      if (url.pathname.includes("/auth/")) authCalls++;
      if (init?.method === "POST") {
        const row = JSON.parse(String(init.body)) as { client_key: string };
        counts.set(row.client_key, (counts.get(row.client_key) ?? 0) + 1);
        inserts++;
        return new Response(null, { status: 201 });
      }
      const key = (url.searchParams.get("client_key") ?? "").replace(
        /^eq\./,
        "",
      );
      return new Response(null, {
        status: 200,
        headers: { "content-range": `0-0/${counts.get(key) ?? 0}` },
      });
    };
    try {
      const ip = { "cf-connecting-ip": "192.0.2.1" };
      const check = await handler(
        request({ email: "Reader@example.com", outcome: "check" }, ip),
      );
      assertEquals(await check.json(), {
        allowed: true,
        remaining: 10,
        retryAfter: 0,
      });
      assertEquals(inserts, 0);
      for (let i = 0; i < 10; i++)
        await handler(
          request({ email: "Reader@example.com", outcome: "failure" }, ip),
        );
      assertEquals(inserts, 10);
      const blocked = await handler(
        request({ email: "reader@example.com", outcome: "check" }, ip),
      );
      assertEquals(blocked.status, 429);
      assertEquals(await blocked.json(), {
        allowed: false,
        remaining: 0,
        retryAfter: 900,
      });
      const other = await handler(
        request(
          { email: "reader@example.com", outcome: "check" },
          { "cf-connecting-ip": "192.0.2.2" },
        ),
      );
      assertEquals(await other.json(), {
        allowed: true,
        remaining: 10,
        retryAfter: 0,
      });
      assertEquals(authCalls, 0);
    } finally {
      globalThis.fetch = originalFetch;
      if (originalUrl === undefined) Deno.env.delete("SUPABASE_URL");
      else Deno.env.set("SUPABASE_URL", originalUrl);
      if (originalKey === undefined)
        Deno.env.delete("SUPABASE_SERVICE_ROLE_KEY");
      else Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", originalKey);
    }
  },
);
