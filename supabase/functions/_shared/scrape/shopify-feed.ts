// Reads one page of a Shopify store's /products.json for the mhc-* syncs.
//
// Shopify started answering 429 to requests from the edge functions on
// 14/10/2026 while answering the same request from the database with 200.
// Migration 20261014120000 has the database fetch each feed page two minutes
// before the sync jobs run. This helper tries Shopify first and falls back
// to that copy, read through public.mhc_feed_page(), only when the direct
// request fails. The URL must match the one the migration fetches exactly:
// `${origin}/products.json?limit=250&page=${page}`.
//
// Imports nothing from Deno, npm or esm.sh, so Vitest can load it too.

/** The part of a supabase-js client this helper uses. Pass a service-role client. */
export type FeedRpcClient = {
  rpc(
    fn: string,
    args: Record<string, unknown>,
  ): PromiseLike<{ data: unknown; error: { message: string } | null }>;
};

export type ShopifyFeedPage = {
  products: any[];
  source: "direct" | "database";
  /** Status of the direct request (0 when it threw). */
  directStatus: number;
};

export class ShopifyFeedUnavailable extends Error {
  constructor(
    readonly url: string,
    readonly directStatus: number,
    readonly fallbackReason: string,
  ) {
    super(
      `products.json HTTP ${directStatus || "fetch failed"}; database copy: ${fallbackReason}`,
    );
    this.name = "ShopifyFeedUnavailable";
  }
}

export function shopifyFeedUrl(
  origin: string,
  page: number,
  limit = 250,
): string {
  return `${origin.replace(/\/+$/, "")}/products.json?limit=${limit}&page=${page}`;
}

export async function fetchShopifyFeedPage(
  url: string,
  db: FeedRpcClient,
  init: RequestInit = {},
  fetchFn: typeof fetch = fetch,
): Promise<ShopifyFeedPage> {
  let directStatus = 0;
  try {
    const res = await fetchFn(url, init);
    directStatus = res.status;
    if (res.ok) {
      const body = await res.json();
      return {
        products: Array.isArray(body?.products) ? body.products : [],
        source: "direct",
        directStatus,
      };
    }
    // Free the connection; the body is not needed.
    await res.body?.cancel();
  } catch (_e) {
    // Network failure or a non-JSON body: try the database copy.
  }

  let reason: string;
  try {
    const { data, error } = await db.rpc("mhc_feed_page", { p_url: url });
    if (error) {
      reason = `rpc failed: ${error.message}`.slice(0, 200);
    } else if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as any).products)
    ) {
      return {
        products: (data as any).products,
        source: "database",
        directStatus,
      };
    } else {
      reason = "no successful fetch in the last two hours";
    }
  } catch (e) {
    reason = `rpc threw: ${e instanceof Error ? e.message : String(e)}`.slice(
      0,
      200,
    );
  }
  throw new ShopifyFeedUnavailable(url, directStatus, reason);
}
