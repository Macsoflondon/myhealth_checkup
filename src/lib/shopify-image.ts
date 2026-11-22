import { bundledProductImageSrcSet } from "./product-image-variants";

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

/** Only public objects on this project's storage origin support this transform. */
function parseStorageImage(src: string): URL | null {
  try {
    const url = new URL(src);
    return url.protocol === "https:" &&
      url.hostname === "clvuioagsgfadynuvodj.supabase.co" &&
      /^\/storage\/v1\/(?:object|render\/image)\/public\//.test(url.pathname)
      ? url
      : null;
  } catch {
    return null;
  }
}

export function productImageUrl(
  src: string,
  displayWidth: number,
  density = 2,
): string {
  if (
    !Number.isFinite(displayWidth) ||
    displayWidth <= 0 ||
    !Number.isFinite(density) ||
    density <= 0
  )
    return src;
  const storage = parseStorageImage(src);
  if (!storage) return shopifyImageUrl(src, displayWidth, density);
  storage.pathname = storage.pathname.replace(
    "/storage/v1/object/public/",
    "/storage/v1/render/image/public/",
  );
  storage.searchParams.set("width", String(Math.round(displayWidth * density)));
  storage.searchParams.set("quality", "75");
  storage.searchParams.set("resize", "contain");
  return storage.toString();
}

export function productImageSrcSet(
  src: string,
  widths: readonly number[],
): string | undefined {
  const bundled = bundledProductImageSrcSet(src);
  if (bundled) return bundled;
  if (!parseStorageImage(src) && !parseShopifyImage(src)) return undefined;
  const validWidths = [
    ...new Set(
      widths
        .filter((width) => Number.isFinite(width) && width > 0)
        .map(Math.round),
    ),
  ];
  return validWidths.length
    ? validWidths
        .map((width) => `${productImageUrl(src, width, 1)} ${width}w`)
        .join(", ")
    : undefined;
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
