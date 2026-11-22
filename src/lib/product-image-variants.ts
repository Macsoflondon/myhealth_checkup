import edgeKit from "@/assets/providers/edge-test-kit-326.webp.asset.json";
import edgeKit2x from "@/assets/providers/edge-test-kit-652.webp.asset.json";

export function bundledProductImageSrcSet(src: string): string | undefined {
  return src === edgeKit.url || src === edgeKit2x.url
    ? `${edgeKit.url} 326w, ${edgeKit2x.url} 652w`
    : undefined;
}
