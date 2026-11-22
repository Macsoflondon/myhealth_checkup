import { describe, expect, it } from "vitest";
import { productImageSrcSet, productImageUrl } from "./shopify-image";

const source =
  "https://clvuioagsgfadynuvodj.supabase.co/storage/v1/object/public/provider-test-images/kit.png?v=17";
describe("public product image CDN", () => {
  it("requests a contain transform at quality 75 and 2x width without losing versions", () => {
    const url = new URL(productImageUrl(source, 270));
    expect(url.pathname).toBe(
      "/storage/v1/render/image/public/provider-test-images/kit.png",
    );
    expect(Object.fromEntries(url.searchParams)).toEqual({
      v: "17",
      width: "540",
      quality: "75",
      resize: "contain",
    });
  });
  it("supplies width descriptors at one and two times the displayed width", () => {
    const candidates = productImageSrcSet(source, [270, 540])?.split(", ");
    expect(candidates).toHaveLength(2);
    expect(candidates?.[0]).toContain(
      "width=270&quality=75&resize=contain 270w",
    );
    expect(candidates?.[1]).toContain(
      "width=540&quality=75&resize=contain 540w",
    );
  });
  it("does not transform signed/private objects or other origins", () => {
    for (const src of [
      "https://other.supabase.co/storage/v1/object/public/kits/a.png",
      "https://clvuioagsgfadynuvodj.supabase.co/storage/v1/object/sign/kits/a.png",
      "/assets/a.webp",
    ]) {
      expect(productImageUrl(src, 270)).toBe(src);
      expect(productImageSrcSet(src, [270, 540])).toBeUndefined();
    }
  });
  it("keeps Shopify resizing and avoids repeated render prefixes", () => {
    expect(productImageUrl("https://cdn.shopify.com/kit.png", 270)).toContain(
      "width=540&format=webp",
    );
    expect(productImageUrl(productImageUrl(source, 270), 160)).toContain(
      "render/image/public/provider-test-images/kit.png?v=17&width=320",
    );
  });
});
