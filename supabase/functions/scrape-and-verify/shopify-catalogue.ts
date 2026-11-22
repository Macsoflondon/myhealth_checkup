import { shopifyProductHandle } from "../_shared/scrape/product-url.ts";

const SHOPIFY_STORES: Record<string, string> = {
  medichecks: "https://www.medichecks.com",
  clinilabs: "https://www.clinilabs.co.uk",
  "lola-health": "https://lolahealth.com",
  "goodbody-clinic": "https://goodbodyclinic.com",
  "london-health-company": "https://londonhealthcompany.co.uk",
};

export function shopifyStore(
  providerId: string,
  url: string | null,
): string | null {
  const store = SHOPIFY_STORES[providerId];
  if (!store || !url || !shopifyProductHandle(url, store)) return null;
  try {
    return /^\/products\/[^/]+\/?$/i.test(new URL(url).pathname) ? store : null;
  } catch {
    return null;
  }
}

export interface ShopifyCatalogue {
  handles: Set<string>;
  complete: boolean;
  rateLimited: boolean;
}

export function catalogueOutcome(
  url: string,
  store: string,
  catalogue: ShopifyCatalogue,
) {
  if (!catalogue.complete) return "inconclusive";
  const handle = shopifyProductHandle(url, store);
  return handle && catalogue.handles.has(handle) ? "ok" : "broken";
}

export async function readShopifyCatalogue(
  store: string,
  options: {
    deadline: number;
    staggerStartMs: number;
    staggerMaxMs: number;
    now: () => number;
    sleep: (ms: number) => Promise<unknown>;
    fetchPage: (
      url: string,
    ) => Promise<{ response: Response; hit429: boolean }>;
  },
): Promise<ShopifyCatalogue> {
  const handles = new Set<string>();
  let lastStart = 0;
  let stagger = options.staggerStartMs;
  const incomplete = (rateLimited = false): ShopifyCatalogue => ({
    handles,
    complete: false,
    rateLimited,
  });
  for (let page = 1; ; page++) {
    if (options.now() >= options.deadline) return incomplete();
    const wait = stagger - (options.now() - lastStart);
    if (wait > 0) await options.sleep(wait);
    if (options.now() >= options.deadline) return incomplete();
    lastStart = options.now();
    try {
      const { response, hit429 } = await options.fetchPage(
        `${store}/products.json?limit=250&page=${page}`,
      );
      if (hit429) stagger = Math.min(stagger * 2, options.staggerMaxMs);
      if (!response.ok) return incomplete(response.status === 429);
      const value: unknown = await response.json();
      if (
        !value ||
        typeof value !== "object" ||
        !("products" in value) ||
        !Array.isArray(value.products)
      )
        return incomplete();
      for (const product of value.products) {
        if (
          !product ||
          typeof product !== "object" ||
          !("handle" in product) ||
          typeof product.handle !== "string" ||
          !product.handle.trim()
        )
          return incomplete();
        const handle = shopifyProductHandle(
          `${store}/products/${product.handle}`,
          store,
        );
        if (!handle) return incomplete();
        handles.add(handle);
      }
      if (value.products.length < 250)
        return { handles, complete: true, rateLimited: false };
    } catch {
      return incomplete();
    }
  }
}
