/** Parses `src` and reports whether it is a resizable Shopify CDN image. */
function parseShopifyImage(src: string): URL | null {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  const isShopify =
    url.hostname === "cdn.shopify.com" || url.pathname.startsWith("/cdn/shop/");
  return isShopify ? url : null;
}

/**
 * Returns a Shopify CDN URL resized to `displayWidth` at the given density
 * (2x by default), served as WebP. Non-Shopify URLs are returned unchanged.
 * Existing query parameters (e.g. `v=`) are kept; width/format are replaced.
 */
export function shopifyImageUrl(
  src: string,
  displayWidth: number,
  density = 2,
): string {
  const url = parseShopifyImage(src);
  if (!url) return src;
  url.searchParams.set("width", String(Math.round(displayWidth * density)));
  url.searchParams.set("format", "webp");
  return url.toString();
}

/**
 * Width-descriptor srcSet for a Shopify CDN image, one candidate per width.
 * Returns undefined for non-Shopify URLs, which cannot be resized.
 */
export function shopifyImageSrcSet(
  src: string,
  widths: readonly number[],
): string | undefined {
  if (!parseShopifyImage(src)) return undefined;
  return widths
    .map((w) => `${shopifyImageUrl(src, w, 1)} ${Math.round(w)}w`)
    .join(", ");
}
