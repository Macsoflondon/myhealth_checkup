import { assertEquals } from "jsr:@std/assert@1.0.19";
import { captureHandler } from "./testing/capture-handler.ts";

const callers = [
  {
    name: "newsletter-subscribe",
    handler: await captureHandler(
      () => import("../newsletter-subscribe/index.ts"),
    ),
    body: { email: "test@example.com", consent: true },
  },
  {
    name: "submit-complaint",
    handler: await captureHandler(() => import("../submit-complaint/index.ts")),
    body: {
      name: "Test",
      email: "test@example.com",
      category: "feedback",
      message: "A sufficiently long test message.",
      consent: true,
    },
  },
  {
    name: "csp-report",
    handler: await captureHandler(() => import("../csp-report/index.ts")),
    body: {
      "csp-report": {
        "document-uri": "https://example.com",
        "violated-directive": "img-src",
      },
    },
  },
];

for (const caller of callers) {
  Deno.test(
    `${caller.name}: rate bucket trusts infrastructure, not caller forwarding`,
    async () => {
      const originalFetch = globalThis.fetch;
      const originalUrl = Deno.env.get("SUPABASE_URL");
      const originalKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      Deno.env.set("SUPABASE_URL", "https://database.test");
      Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-only-key");
      const keys: string[] = [];
      globalThis.fetch = async (input, init) => {
        const url = new URL(
          input instanceof Request ? input.url : String(input),
        );
        assertEquals(
          init?.method === "POST",
          false,
          "exhausted rate limit must not write",
        );
        keys.push(url.searchParams.get("client_key") ?? "");
        return new Response(null, {
          status: 200,
          headers: { "content-range": "0-0/10000" },
        });
      };
      try {
        for (const headers of [
          {
            "cf-connecting-ip": "192.0.2.1",
            "x-forwarded-for": "203.0.113.77",
          },
          { "x-real-ip": "192.0.2.2", "x-forwarded-for": "203.0.113.78" },
          { "x-forwarded-for": "203.0.113.79" },
        ]) {
          const response = await caller.handler(
            new Request(`https://test.local/${caller.name}`, {
              method: "POST",
              headers: { "content-type": "application/json", ...headers },
              body: JSON.stringify(caller.body),
            }),
          );
          assertEquals(response.status, 429);
          await response.text();
        }
        const prefix = caller.name === "csp-report" ? "csp:" : "";
        assertEquals(
          keys,
          ["192.0.2.1", "192.0.2.2", "unknown"].map(
            (ip) => `eq.${prefix}${ip}`,
          ),
        );
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
}
