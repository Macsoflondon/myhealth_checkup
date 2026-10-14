import { describe, expect, it, vi } from "vitest";
import {
  fetchShopifyFeedPage,
  shopifyFeedUrl,
  ShopifyFeedUnavailable,
  type FeedRpcClient,
} from "../../../supabase/functions/_shared/scrape/shopify-feed";

const URL1 = "https://lolahealth.com/products.json?limit=250&page=1";

function db(result: { data: unknown; error: { message: string } | null }) {
  const rpc = vi.fn(async () => result);
  return { client: { rpc } as unknown as FeedRpcClient, rpc };
}

function respond(status: number, body: unknown) {
  return vi.fn(
    async () =>
      new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      }),
  ) as unknown as typeof fetch;
}

describe("shopifyFeedUrl", () => {
  it("builds the URL the prefetch migration stores", () => {
    expect(shopifyFeedUrl("https://lolahealth.com", 1)).toBe(URL1);
    expect(shopifyFeedUrl("https://www.medichecks.com/", 3)).toBe(
      "https://www.medichecks.com/products.json?limit=250&page=3",
    );
  });
});

describe("fetchShopifyFeedPage", () => {
  it("uses the direct response when Shopify answers 200", async () => {
    const { client, rpc } = db({ data: null, error: null });
    const page = await fetchShopifyFeedPage(
      URL1,
      client,
      {},
      respond(200, { products: [{ id: 1 }] }),
    );
    expect(page).toEqual({
      products: [{ id: 1 }],
      source: "direct",
      directStatus: 200,
    });
    expect(rpc).not.toHaveBeenCalled();
  });

  it("reads the database copy when Shopify answers 429", async () => {
    const { client, rpc } = db({
      data: { products: [{ id: 2 }] },
      error: null,
    });
    const page = await fetchShopifyFeedPage(
      URL1,
      client,
      {},
      respond(429, "Too Many Requests"),
    );
    expect(page).toEqual({
      products: [{ id: 2 }],
      source: "database",
      directStatus: 429,
    });
    expect(rpc).toHaveBeenCalledWith("mhc_feed_page", { p_url: URL1 });
  });

  it("reads the database copy when the request throws", async () => {
    const { client } = db({ data: { products: [] }, error: null });
    const failing = vi.fn(async () => {
      throw new TypeError("network");
    }) as unknown as typeof fetch;
    const page = await fetchShopifyFeedPage(URL1, client, {}, failing);
    expect(page.source).toBe("database");
    expect(page.directStatus).toBe(0);
  });

  it("throws when there is no recent database copy", async () => {
    const { client } = db({ data: null, error: null });
    await expect(
      fetchShopifyFeedPage(URL1, client, {}, respond(429, "")),
    ).rejects.toThrow(
      "products.json HTTP 429; database copy: no successful fetch in the last two hours",
    );
  });

  it("throws when the database read fails", async () => {
    const { client } = db({ data: null, error: { message: "denied" } });
    const err = await fetchShopifyFeedPage(
      URL1,
      client,
      {},
      respond(503, ""),
    ).catch((e) => e);
    expect(err).toBeInstanceOf(ShopifyFeedUnavailable);
    expect(err.directStatus).toBe(503);
    expect(err.fallbackReason).toBe("rpc failed: denied");
  });

  it("ignores a database copy that is not a product feed", async () => {
    const { client } = db({ data: { errors: "Not Found" }, error: null });
    await expect(
      fetchShopifyFeedPage(URL1, client, {}, respond(429, "")),
    ).rejects.toBeInstanceOf(ShopifyFeedUnavailable);
  });
});
