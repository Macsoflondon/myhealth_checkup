import { describe, expect, it } from "vitest";
import { shopifyImageUrl } from "@/lib/shopify-image";

describe("shopifyImageUrl", () => {
  it("requests a 2x WebP variant for the displayed width", () => {
    expect(
      shopifyImageUrl("https://cdn.shopify.com/s/files/1/kit.png", 325),
    ).toBe("https://cdn.shopify.com/s/files/1/kit.png?width=650&format=webp");
  });

  it("keeps an existing query string and replaces an old width", () => {
    const out = shopifyImageUrl(
      "https://cdn.shopify.com/s/files/1/kit.png?v=123&width=3750",
      325,
    );
    const u = new URL(out);
    expect(u.searchParams.get("v")).toBe("123");
    expect(u.searchParams.get("width")).toBe("650");
  });

  it("leaves non-Shopify and invalid URLs unchanged", () => {
    expect(shopifyImageUrl("https://example.com/a.png", 325)).toBe(
      "https://example.com/a.png",
    );
    expect(shopifyImageUrl("/local/a.png", 325)).toBe("/local/a.png");
  });
});
