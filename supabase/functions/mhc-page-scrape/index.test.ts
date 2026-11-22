import { assertEquals } from "jsr:@std/assert@1.0.19";
import { captureHandler } from "../_shared/testing/capture-handler.ts";

const handler = await captureHandler(() => import("./index.ts"));
Deno.test(
  "stored URL matches renamed Medical Diagnosis profiles and preserves offset/limit batching",
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
          "<h1>New provider title</h1><p>Price: £156</p><p>Turnaround Time: 2 days</p>",
        );
      }
      return Response.json(null);
    };
    try {
      const response = await handler(
        new Request(
          "https://test.local?provider=medical-diagnosis&secret=test-sync-secret&dry=1&offset=1&limit=1",
        ),
      );
      const body = (await response.json()) as {
        matched_urls: number;
        processed: number;
        matched: number;
        written: number;
        sample: Array<{ db_name: string; price: number }>;
      };
      assertEquals(body.matched_urls, 3);
      assertEquals(body.processed, 1);
      assertEquals(body.matched, 1);
      assertEquals(body.written, 0);
      assertEquals(body.sample[0]?.db_name, "Renamed profile 1");
      assertEquals(body.sample[0]?.price, 156);
      assertEquals(fetched, ["/exam/profiles/b-stable"]);
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
