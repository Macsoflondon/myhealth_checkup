import { assertEquals } from "jsr:@std/assert@1.0.19";
import { captureHandler } from "../_shared/testing/capture-handler.ts";

const handler = await captureHandler(() => import("./index.ts"));
Deno.test(
  "URL identity wins over renamed titles and name matches cannot claim a handle twice",
  async () => {
    const originalFetch = globalThis.fetch;
    const originalUrl = Deno.env.get("SUPABASE_URL");
    const originalKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    Deno.env.set("SUPABASE_URL", "https://database.test");
    Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-only-key");
    const rows = [
      {
        id: "name-only",
        test_name: "New Vitamin D",
        biomarker_count: 1,
        url: null,
      },
      {
        id: "renamed",
        test_name: "Old Vitamin Profile",
        biomarker_count: 1,
        url: "https://londonhealthcompany.co.uk/products/unchanged-handle/?v=1",
      },
      {
        id: "duplicate",
        test_name: "Old Vitamin Profile",
        biomarker_count: 1,
        url: "https://londonhealthcompany.co.uk/products/unchanged-handle",
      },
      {
        id: "fallback",
        test_name: "Ferritin",
        biomarker_count: 1,
        url: "https://londonhealthcompany.co.uk/products/missing-handle",
      },
    ];
    globalThis.fetch = async (input) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      const data = url.pathname.endsWith("mhc_sync_secret")
        ? "test-sync-secret"
        : url.pathname.endsWith("provider_tests")
          ? rows
          : url.pathname.endsWith("products.json")
            ? {
                products: [
                  {
                    title: "New Vitamin D",
                    handle: "unchanged-handle",
                    variants: [{ price: "29.99" }],
                  },
                  {
                    title: "Ferritin",
                    handle: "ferritin",
                    variants: [{ price: "35" }],
                  },
                ],
              }
            : null;
      return new Response(JSON.stringify(data), {
        headers: { "content-type": "application/json" },
      });
    };
    try {
      const response = await handler(
        new Request("https://test.local?provider=london-health-company&dry=1", {
          headers: { "x-mhc-sync-secret": "test-sync-secret" },
        }),
      );
      assertEquals(response.status, 200);
      const body = (await response.json()) as {
        written: number;
        decisions: Array<{
          db_id: string;
          method: string;
          confident: boolean;
          base_price: number;
        }>;
      };
      assertEquals(body.written, 0);
      const renamed = body.decisions.find((d) => d.db_id === "renamed");
      assertEquals(renamed?.method, "url");
      assertEquals(renamed?.base_price, 29.99);
      assertEquals(body.decisions.filter((d) => d.confident).length, 2);
      assertEquals(
        body.decisions.find((d) => d.db_id === "fallback")?.method,
        "exact",
      );
      assertEquals(
        body.decisions.find((d) => d.db_id === "duplicate")?.confident,
        false,
      );
      assertEquals(
        body.decisions.find((d) => d.db_id === "name-only")?.confident,
        false,
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
