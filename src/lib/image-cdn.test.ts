import { describe, expect, it } from "vitest";
import { productImageSrcSet, productImageUrl } from "./shopify-image";

const source =
  "https://clvuioagsgfadynuvodj.supabase.co/storage/v1/object/public/provider-test-images/kit.png?v=17";
describe("public product image CDN", () => {
  it("uses the plain public object without losing versions", () => {
    const url = new URL(productImageUrl(source, 270));
    expect(url.pathname).toBe(
      "/storage/v1/object/public/provider-test-images/kit.png",
    );
    expect(Object.fromEntries(url.searchParams)).toEqual({
      v: "17",
    });
  });
  it.each(["object", "render/image"])(
    "removes all transform parameters from public %s URLs and supplies no variants",
    (path) => {
      const src =
        source.replace("/object/", `/${path}/`) +
        "&width=540&height=320&quality=75&resize=contain&format=webp&width=270";
      expect(productImageUrl(src, 270)).toBe(source);
      expect(productImageSrcSet(src, [270, 540])).toBeUndefined();
    },
  );
  it("normalises legacy render URLs even with invalid sizing arguments", () => {
    const src = source.replace("/object/", "/render/image/") + "&width=540";
    for (const [width, density] of [
      [0, 2],
      [270, 0],
      [NaN, 2],
      [270, Infinity],
    ]) {
      expect(productImageUrl(src, width ?? 0, density ?? 0)).toBe(source);
    }
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
  it("keeps Shopify resizing and public object URLs stable", () => {
    expect(productImageUrl("https://cdn.shopify.com/kit.png", 270)).toContain(
      "width=540&format=webp",
    );
    expect(productImageUrl(productImageUrl(source, 270), 160)).toBe(source);
    expect(
      productImageSrcSet("https://cdn.shopify.com/kit.png", [270, 540]),
    ).toBe(
      "https://cdn.shopify.com/kit.png?width=270&format=webp 270w, https://cdn.shopify.com/kit.png?width=540&format=webp 540w",
    );
  });
});
