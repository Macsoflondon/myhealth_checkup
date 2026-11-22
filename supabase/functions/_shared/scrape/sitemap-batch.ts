import { normalisedProductPath } from "./product-url.ts";

/** Existing offset/limit pairs identify a scheduled batch, not a fixed capacity. */
export function sitemapBatch(
  urls: string[],
  offset: number,
  limit: number,
  batchCount: number,
) {
  const batchIndex = Math.floor(offset / limit);
  const orderedUrls = [...urls].sort((a, b) => {
    const aPath = normalisedProductPath(a) ?? a;
    const bPath = normalisedProductPath(b) ?? b;
    return aPath < bPath ? -1 : aPath > bPath ? 1 : a < b ? -1 : a > b ? 1 : 0;
  });
  const sliceSize = Math.ceil(orderedUrls.length / batchCount);
  const slice = orderedUrls.slice(
    batchIndex * sliceSize,
    (batchIndex + 1) * sliceSize,
  );
  return { orderedUrls, slice, batchIndex, batchCount, sliceSize };
}
