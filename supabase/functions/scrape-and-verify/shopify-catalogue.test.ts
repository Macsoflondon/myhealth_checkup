import { assertEquals } from "jsr:@std/assert@1.0.19";
import {
  shopifyStore,
  readShopifyCatalogue,
  catalogueOutcome,
  type ShopifyCatalogue,
} from "./shopify-catalogue.ts";
import { captureHandler } from "../_shared/testing/capture-handler.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

await captureHandler(() => import("./index.ts"));
const { runVerification } = await import("./index.ts");

Deno.test(
  "method choice requires an allowlisted store and its exact product path",
  () => {
    for (const [id, domain] of [
      ["medichecks", "www.medichecks.com"],
      ["clinilabs", "www.clinilabs.co.uk"],
      ["lola-health", "lolahealth.com"],
      ["goodbody-clinic", "goodbodyclinic.com"],
      ["london-health-company", "londonhealthcompany.co.uk"],
    ]) {
      if (!id || !domain) throw new Error("Missing test identity");
      assertEquals(
        shopifyStore(id, `https://${domain}/products/iron/?variant=1`),
        `https://${domain}`,
      );
      assertEquals(
        shopifyStore(id, `https://${domain}/collections/tests`),
        null,
      );
      assertEquals(
        shopifyStore(id, "https://other-store.test/products/iron"),
        null,
      );
      assertEquals(
        shopifyStore(id, `https://${domain}/products/iron/other`),
        null,
      );
    }
    assertEquals(
      shopifyStore("randox", "https://randoxhealth.com/products/iron"),
      null,
    );
  },
);

Deno.test(
  "a handle is ok or broken only against a complete catalogue, never a partial one",
  () => {
    const store = "https://www.clinilabs.co.uk";
    const complete: ShopifyCatalogue = {
      handles: new Set(["iron"]),
      complete: true,
      rateLimited: false,
    };
    assertEquals(
      catalogueOutcome(store + "/products/iron", store, complete),
      "ok",
    );
    assertEquals(
      catalogueOutcome(store + "/products/removed", store, complete),
      "broken",
    );
    for (const url of ["iron", "removed"]) {
      assertEquals(
        catalogueOutcome(store + "/products/" + url, store, {
          ...complete,
          complete: false,
        }),
        "inconclusive",
      );
    }
  },
);

Deno.test(
  "catalogue pagination reads 250 then the final short page with the configured stagger",
  async () => {
    let now = 10000;
    const pages: string[] = [];
    const waits: number[] = [];
    const catalogue = await readShopifyCatalogue(
      "https://www.clinilabs.co.uk",
      {
        deadline: 100000,
        staggerStartMs: 1500,
        staggerMaxMs: 4000,
        now: () => now,
        sleep: (ms) => {
          waits.push(ms);
          now += ms;
          return Promise.resolve();
        },
        fetchPage: (url) => {
          pages.push(url);
          return Promise.resolve({
            response: Response.json({
              products:
                pages.length === 1
                  ? Array.from({ length: 250 }, (_, i) => ({
                      handle: "item-" + i,
                    }))
                  : [{ handle: "final-item" }],
            }),
            hit429: false,
          });
        },
      },
    );
    assertEquals(pages, [
      "https://www.clinilabs.co.uk/products.json?limit=250&page=1",
      "https://www.clinilabs.co.uk/products.json?limit=250&page=2",
    ]);
    assertEquals(waits, [1500]);
    assertEquals(catalogue.complete, true);
    assertEquals(catalogue.handles.size, 251);
  },
);

Deno.test(
  "provider Unicode handles match both literal and URL-encoded stored product paths",
  async () => {
    const store = "https://goodbodyclinic.com";
    const catalogue = await readShopifyCatalogue(store, {
      deadline: Date.now() + 1000,
      staggerStartMs: 0,
      staggerMaxMs: 4000,
      now: Date.now,
      sleep: () => Promise.resolve(),
      fetchPage: () =>
        Promise.resolve({
          response: Response.json({
            products: [{ handle: "guardant360®-liquid-by-infinity" }],
          }),
          hit429: false,
        }),
    });
    assertEquals(
      catalogueOutcome(
        store + "/products/guardant360®-liquid-by-infinity",
        store,
        catalogue,
      ),
      "ok",
    );
    assertEquals(
      catalogueOutcome(
        store + "/products/guardant360%C2%AE-liquid-by-infinity",
        store,
        catalogue,
      ),
      "ok",
    );
  },
);

Deno.test(
  "second-page errors, malformed JSON and a budget cutoff keep catalogues incomplete",
  async () => {
    for (const failure of ["http", "malformed", "budget"]) {
      let now = 10000;
      let pages = 0;
      const result = await readShopifyCatalogue("https://lolahealth.com", {
        deadline: 11000,
        staggerStartMs: failure === "budget" ? 1500 : 0,
        staggerMaxMs: 4000,
        now: () => now,
        sleep: (ms) => {
          now += ms;
          return Promise.resolve();
        },
        fetchPage: () => {
          pages++;
          return Promise.resolve({
            response:
              pages === 1
                ? Response.json({
                    products: Array.from({ length: 250 }, (_, i) => ({
                      handle: "item-" + i,
                    })),
                  })
                : failure === "http"
                  ? new Response("", { status: 429 })
                  : Response.json({ unexpected: [] }),
            hit429: false,
          });
        },
      });
      assertEquals(result.complete, false);
      assertEquals(result.rateLimited, failure === "http");
      assertEquals(pages, failure === "budget" ? 1 : 2);
    }
  },
);

Deno.test(
  "live-run method dispatch uses one catalogue per store and preserves both fields on incomplete feeds",
  async () => {
    const originalFetch = globalThis.fetch;
    const updates: Array<{ id: string; value: Record<string, unknown> }> = [];
    const logs: Array<Record<string, unknown>> = [];
    const alerts: Array<Record<string, unknown>> = [];
    const catalogRequests: Record<string, number> = {};
    const row = (id: string, provider_id: string, url: string) => ({
      id,
      provider_id,
      url,
      test_name: id,
      url_verified_at: null,
    });
    globalThis.fetch = async (input, init) => {
      const req = input instanceof Request ? input : new Request(input, init);
      const url = new URL(req.url);
      if (url.pathname.endsWith("provider_tests")) {
        if (req.method === "PATCH") {
          updates.push({
            id: url.searchParams.get("id") ?? "",
            value: (await req.json()) as Record<string, unknown>,
          });
          return Response.json([]);
        }
        return Response.json([
          row(
            "present",
            "clinilabs",
            "https://www.clinilabs.co.uk/products/present",
          ),
          row(
            "absent",
            "clinilabs",
            "https://www.clinilabs.co.uk/products/absent",
          ),
          row(
            "partial",
            "lola-health",
            "https://lolahealth.com/products/present",
          ),
          row(
            "unavailable",
            "goodbody-clinic",
            "https://goodbodyclinic.com/products/present",
          ),
          row("http", "randox", "https://randoxhealth.com/test/iron"),
        ]);
      }
      if (url.pathname.endsWith("scrape_run_log")) {
        logs.push((await req.json()) as Record<string, unknown>);
        return Response.json([]);
      }
      if (url.pathname.endsWith("scraper_alerts")) {
        alerts.push((await req.json()) as Record<string, unknown>);
        return Response.json([]);
      }
      if (url.pathname === "/products.json") {
        catalogRequests[url.hostname] =
          (catalogRequests[url.hostname] ?? 0) + 1;
        if (url.hostname === "www.clinilabs.co.uk")
          return Response.json({ products: [{ handle: "present" }] });
        if (url.hostname === "goodbodyclinic.com")
          return new Response("", { status: 500 });
        if (url.searchParams.get("page") === "1")
          return Response.json({
            products: Array.from({ length: 250 }, (_, i) => ({
              handle: i === 0 ? "present" : "item-" + i,
            })),
          });
        return new Response("", {
          status: 429,
          headers: { "Retry-After": "0" },
        });
      }
      assertEquals(url.hostname, "randoxhealth.com");
      return new Response("", { status: 200 });
    };
    try {
      await runVerification(
        createClient("https://database.test", "test-only-key", {
          auth: { persistSession: false },
        }),
        "shopify-run",
        null,
        Date.now() + 15000,
      );
      assertEquals(updates.map((u) => u.id).sort(), [
        "eq.absent",
        "eq.http",
        "eq.present",
      ]);
      assertEquals(
        updates.find((u) => u.id === "eq.absent")?.value["url_verified"],
        false,
      );
      assertEquals(
        updates.find((u) => u.id === "eq.present")?.value["url_verified"],
        true,
      );
      assertEquals(alerts.length, 1);
      assertEquals(catalogRequests["www.clinilabs.co.uk"], 1);
      assertEquals(catalogRequests["lolahealth.com"], 3);
      assertEquals(logs[0]?.["status"], "partial");
      const details = logs[0]?.["details"] as {
        checked: number;
        ok: number;
        broken: number;
        rate_limited: number;
        inconclusive: number;
        summary: Record<string, { method: string }>;
      };
      assertEquals(
        [
          details.checked,
          details.ok,
          details.broken,
          details.rate_limited,
          details.inconclusive,
        ],
        [5, 2, 1, 1, 1],
      );
      assertEquals(details.summary["clinilabs"]?.method, "shopify_catalogue");
      assertEquals(details.summary["randox"]?.method, "http");
    } finally {
      globalThis.fetch = originalFetch;
    }
  },
);
