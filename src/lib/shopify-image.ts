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
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  const isShopify =
    url.hostname === "cdn.shopify.com" || url.pathname.startsWith("/cdn/shop/");
  if (!isShopify) return src;
  url.searchParams.set("width", String(Math.round(displayWidth * density)));
  url.searchParams.set("format", "webp");
  return url.toString();
}
