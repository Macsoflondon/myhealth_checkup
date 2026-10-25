/**
 * Resolves the images for the provider test detail gallery.
 *
 * `gallery_image_urls` holds up to two provider-hosted images: index 0 is the
 * product box shot (always the same as `image_url`) and index 1, when present,
 * is the provider's biomarker breakdown graphic. When the array is empty the
 * gallery falls back to `image_url` alone, and when neither exists the detail
 * page keeps its previous behaviour of showing no product image.
 */

export interface GallerySource {
  image_url?: string | null;
  gallery_image_urls?: string[] | null;
}

const isUsableUrl = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export function resolveGalleryImages(test: GallerySource): string[] {
  const fromGallery = Array.isArray(test.gallery_image_urls)
    ? test.gallery_image_urls.filter(isUsableUrl)
    : [];

  const images = fromGallery.length > 0 ? fromGallery : [];
  if (images.length === 0 && isUsableUrl(test.image_url)) {
    images.push(test.image_url);
  }

  // De-duplicate while preserving order, and cap at the two slots the column
  // is designed for.
  return [...new Set(images)].slice(0, 2);
}

export function galleryImageAlt(
  index: number,
  testName: string,
  providerName: string,
): string {
  return index === 0
    ? `${testName} by ${providerName}, product box`
    : `${testName} by ${providerName}, biomarker groups included`;
}
