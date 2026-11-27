import { assertEquals } from "jsr:@std/assert@1.0.19";
import { captureHandler } from "../_shared/testing/capture-handler.ts";

const handler = await captureHandler(() => import("./index.ts"));
const {
  medicalDiagnosisPrice,
  medicalDiagnosisProductPage,
  medicalDiagnosisCandidates,
  automaticRelistIds,
} = await import("./index.ts");
Deno.test(
  "stored URL matches renamed profiles and reports the scheduled batch position",
  async () => {
    const originalFetch = globalThis.fetch;
    const originalUrl = Deno.env.get("SUPABASE_URL");
    const originalKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    Deno.env.set("SUPABASE_URL", "https://database.test");
    Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-only-key");
    const urls = [
      "https://www.medical-diagnosis.co.uk/exam/profiles/a-stable",
      "https://www.medical-diagnosis.co.uk/exam/profiles/b-stable",
      "https://www.medical-diagnosis.co.uk/exam/profiles/ferritin",
    ];
    const rows = urls.map((url, i) => ({
      id: String(i),
      url: i === 2 ? null : url.toUpperCase() + "/?v=1",
      test_name: i === 2 ? "Ferritin" : `Renamed profile ${i}`,
      biomarkers_list: [],
      clinic_phlebotomy_cost: 0,
      image_url: null,
      biomarker_count: 1,
      is_active: true,
    }));
    const fetched: string[] = [];
    globalThis.fetch = async (input) => {
      const url = new URL(input instanceof Request ? input.url : String(input));
      if (url.pathname.endsWith("mhc_sync_secret"))
        return Response.json("test-sync-secret");
      if (url.pathname.endsWith("provider_tests")) return Response.json(rows);
      if (url.pathname.includes("sitemap"))
        return new Response(
          `<urlset>${urls.map((u) => `<url><loc>${u}</loc></url>`).join("")}</urlset>`,
        );
      if (url.pathname.includes("/exam/")) {
        fetched.push(url.pathname);
        return new Response(
          '<body class="single-product"><h1>New provider title</h1>Price: <span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&pound;</span>156.00</bdi></span><p>Turnaround Time: 2 days</p></body>',
        );
      }
      return Response.json([]);
    };
    try {
      const response = await handler(
        new Request(
          "https://test.local?provider=medical-diagnosis&dry=1&offset=1&limit=1",
          { headers: { "x-mhc-sync-secret": "test-sync-secret" } },
        ),
      );
      const body = (await response.json()) as {
        matched_urls: number;
        processed: number;
        matched: number;
        written: number;
        batch_index: number;
        batch_count: number;
        slice_size: number;
        sample: Array<{ db_name: string; price: number }>;
      };
      assertEquals(body.matched_urls, 3);
      assertEquals(body.processed, 1);
      assertEquals(body.matched, 1);
      assertEquals(body.written, 0);
      assertEquals(body.batch_index, 1);
      assertEquals(body.batch_count, 5);
      assertEquals(body.slice_size, 1);
      assertEquals(body.sample[0]?.db_name, "Renamed profile 1");
      assertEquals(body.sample[0]?.price, 156);
      assertEquals(fetched, ["/exam/profiles/b-stable"]);
      const urlsResponse = await handler(
        new Request(
          "https://test.local?provider=medical-diagnosis&urls_only=1&offset=30&limit=30",
          { headers: { "x-mhc-sync-secret": "test-sync-secret" } },
        ),
      );
      const urlsBody = (await urlsResponse.json()) as {
        matched_urls: number;
        batch_index: number;
        batch_count: number;
        slice_size: number;
        sample_urls: string[];
      };
      assertEquals(urlsBody.matched_urls, 3);
      assertEquals(urlsBody.batch_index, 1);
      assertEquals(urlsBody.batch_count, 5);
      assertEquals(urlsBody.slice_size, 1);
      assertEquals(urlsBody.sample_urls, urls);
      assertEquals(fetched.length, 1);
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

// Copied verbatim from Women's Hormones on 22/11/2026; source:
// https://www.medical-diagnosis.co.uk/exam/profiles/hormones-profiles/womens-hormones/
const womensPriceFixture = `<div class="col-sm-5 qntm_product_page_price_heading">Price:</div>
				<div class="col-sm-3 qntm_product_page_price_txt">
				<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&pound;</span>156.00</bdi></span>`;

Deno.test(
  "live Women's Hormones WooCommerce amount decodes all four pound representations to 156",
  () => {
    for (const symbol of ["£", "&pound;", "&#163;", "&#xA3;"]) {
      assertEquals(
        medicalDiagnosisPrice(womensPriceFixture.replace("&pound;", symbol)),
        156,
      );
    }
  },
);

Deno.test(
  "prices must be positive product amounts after Price, not related products or plain text",
  () => {
    assertEquals(
      medicalDiagnosisPrice(womensPriceFixture.replace("156.00", "0.00")),
      null,
    );
    assertEquals(
      medicalDiagnosisPrice(
        "Price: Not stated. Sample Requirements " +
          womensPriceFixture.replace("Price:", "Related product:"),
      ),
      null,
    );
    assertEquals(medicalDiagnosisPrice("Price: £156"), null);
    assertEquals(
      medicalDiagnosisProductPage(
        '<body class="single-product">',
        "https://www.medical-diagnosis.co.uk/",
      ),
      false,
    );
    assertEquals(
      medicalDiagnosisProductPage(
        '<body class="archive">',
        "https://www.medical-diagnosis.co.uk/exam/profiles/iron/",
      ),
      false,
    );
  },
);

Deno.test(
  "stored active and automatic delist paths supplement sitemap matches and deduplicate",
  () => {
    const prefix = "https://www.medical-diagnosis.co.uk/exam/profiles/";
    const urls = medicalDiagnosisCandidates(
      [prefix + "iron/"],
      [prefix + "IRON/?v=1", prefix + "alex3/", null],
    );
    assertEquals(urls.length, 2);
    assertEquals(
      urls.map((u) => new URL(u).pathname.toLowerCase()),
      ["/exam/profiles/iron/", "/exam/profiles/alex3/"],
    );
  },
);

Deno.test(
  "only automatic delists within 14 days can re-list; manual exclusions always win",
  () => {
    const now = Date.parse("2026-11-22T06:55:00Z");
    const change = (id: string, change_type: string, age: number) => ({
      provider_test_id: id,
      change_type,
      created_at: new Date(now - age * 86400000).toISOString(),
    });
    assertEquals(
      [
        ...automaticRelistIds(
          [
            change("alex3", "delisted_auto", 0),
            change("boundary", "delisted_auto", 14),
            change("expired", "delisted_auto", 15),
            change("manual", "delisted_auto", 1),
            change("manual", "delisted_manual", 20),
            change("manual-only", "delisted_manual", 1),
          ],
          now,
        ),
      ],
      ["alex3", "boundary"],
    );
  },
);

Deno.test(
  "unreadable or non-product pages leave every stored field untouched and log URL errors; ALEX3 re-lists with audited price",
  async () => {
    const originalFetch = globalThis.fetch;
    const originalUrl = Deno.env.get("SUPABASE_URL");
    const originalKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    Deno.env.set("SUPABASE_URL", "https://database.test");
    Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-only-key");
    const prefix = "https://www.medical-diagnosis.co.uk/exam/profiles/";
    const row = (id: string, active: boolean) => ({
      id,
      test_name: id,
      url: prefix + id + "/",
      price: 149,
      is_active: active,
      biomarker_count: 1,
      biomarkers_list: [],
      clinic_phlebotomy_cost: 0,
      image_url: null,
    });
    const active = [
      row("a-priced", true),
      row("b-no-price", true),
      row("c-archive", true),
      row("d-redirect", true),
    ];
    const hidden = [
      row("e-alex3", false),
      row("f-sputum", false),
      row("g-manual", false),
    ];
    const now = new Date().toISOString();
    const changes = hidden.map((r) => ({
      provider_test_id: r.id,
      change_type: "delisted_auto",
      created_at: now,
    }));
    const updates: Array<{ id: string; body: Record<string, unknown> }> = [];
    const logs: Array<Record<string, unknown>> = [];
    const runs: Array<{ errors: Array<{ url: string; message: string }> }> = [];
    const fetched: string[] = [];
    globalThis.fetch = async (input, init) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      const url = new URL(request.url);
      if (url.pathname.endsWith("mhc_sync_secret"))
        return Response.json("test-sync-secret");
      if (url.pathname.endsWith("provider_tests")) {
        if (request.method === "PATCH") {
          const id = (url.searchParams.get("id") ?? "").replace("eq.", "");
          updates.push({
            id,
            body: (await request.json()) as Record<string, unknown>,
          });
          return Response.json([{ id }]);
        }
        return Response.json(
          url.searchParams.get("is_active") === "eq.false" ? hidden : active,
        );
      }
      if (url.pathname.endsWith("product_change_log")) {
        if (request.method === "POST") {
          logs.push((await request.json()) as Record<string, unknown>);
          return Response.json([]);
        }
        if (url.searchParams.get("change_type") === "eq.delisted_manual") {
          return Response.json(
            url.searchParams.has("provider_test_id") &&
              url.searchParams.get("provider_test_id")?.startsWith("eq.")
              ? []
              : [
                  {
                    provider_test_id: "g-manual",
                    change_type: "delisted_manual",
                    created_at: now,
                  },
                ],
          );
        }
        return Response.json(changes);
      }
      if (url.pathname.endsWith("scrape_runs")) {
        runs.push(await request.json());
        return Response.json([]);
      }
      if (url.pathname.includes("sitemap"))
        return new Response(
          `<urlset><url><loc>${prefix}a-priced/</loc></url></urlset>`,
        );
      if (url.pathname.includes("/exam/")) {
        const id = url.pathname.split("/").filter(Boolean).pop() ?? "";
        fetched.push(id);
        const html = `<body class="${id === "c-archive" ? "archive" : "single-product"}"><h1>${id}</h1>${["b-no-price", "f-sputum"].includes(id) ? "Price: unavailable" : womensPriceFixture.replace("156.00", id === "e-alex3" ? "331.00" : "156.00")}</body>`;
        const response = new Response(html);
        if (id === "d-redirect")
          Object.defineProperty(response, "url", {
            value: "https://www.medical-diagnosis.co.uk/",
          });
        return response;
      }
      throw new Error("Unexpected request path: " + url.pathname);
    };
    try {
      for (const offset of [0, 30, 60, 90, 120]) {
        const response = await handler(
          new Request(
            `https://test.local?provider=medical-diagnosis&offset=${offset}&limit=30`,
            { headers: { "x-mhc-sync-secret": "test-sync-secret" } },
          ),
        );
        assertEquals(response.status, 200);
      }
      assertEquals(
        updates.map((u) => u.id),
        ["a-priced", "e-alex3"],
      );
      assertEquals(updates[0]?.body["price"], 156);
      assertEquals(updates[0]?.body["url_verified"], true);
      assertEquals(typeof updates[0]?.body["last_validated_at"], "string");
      assertEquals(updates[1]?.body["is_active"], true);
      assertEquals(updates[1]?.body["price"], 331);
      assertEquals(logs.length, 1);
      assertEquals(logs[0]?.["change_type"], "relisted_auto");
      assertEquals(logs[0]?.["new_value"], {
        is_active: true,
        price: 331,
        url: prefix + "e-alex3/",
      });
      assertEquals(fetched.includes("g-manual"), false);
      const errors = runs.flatMap((r) => r.errors);
      for (const id of ["b-no-price", "c-archive", "d-redirect", "f-sputum"]) {
        assertEquals(
          errors.some(
            (e) =>
              e.url === prefix + id + "/" && e.message === "price not readable",
          ),
          true,
        );
      }
      assertEquals(new Set(fetched).size, 6);
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
