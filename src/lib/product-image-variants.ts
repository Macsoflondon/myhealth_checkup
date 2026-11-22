import manifest from "@/assets/card-variants/manifest.json";

const pointers = import.meta.glob<{ url: string }>(
  "../assets/card-variants/*.asset.json",
  { eager: true, import: "default" },
);
const variantsByUrl = new Map<string, { small: string; large: string }>();
for (const entry of manifest) {
  const small =
    pointers[`../assets/card-variants/${entry.variants["320"].file}`]?.url;
  const large =
    pointers[`../assets/card-variants/${entry.variants["640"].file}`]?.url;
  if (!small || !large) continue;
  const variants = { small, large };
  for (const url of [...entry.urls, small, large])
    variantsByUrl.set(url, variants);
}

/** Card-only candidates; source maps retain originals for large detail views. */
export function bundledProductImageUrl(
  src: string,
  width: number,
): string | undefined {
  const variants = variantsByUrl.get(src);
  return variants
    ? width <= 320
      ? variants.small
      : variants.large
    : undefined;
}

export function bundledProductImageSrcSet(src: string): string | undefined {
  const variants = variantsByUrl.get(src);
  return variants
    ? `${variants.small} 320w, ${variants.large} 640w`
    : undefined;
}
