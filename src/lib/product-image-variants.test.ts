import { describe, expect, it } from "vitest";
import manifest from "@/assets/card-variants/manifest.json";
import {
  bundledProductImageSrcSet,
  bundledProductImageUrl,
} from "./product-image-variants";

describe("hosted provider kit candidates", () => {
  it("every mapped original has 320 and 640 pixel candidates", () => {
    expect(manifest.length).toBe(182);
    for (const entry of manifest) {
      for (const url of entry.urls) {
        const srcSet = bundledProductImageSrcSet(url);
        expect(srcSet, entry.original).toContain("320w");
        expect(srcSet, entry.original).toContain("640w");
        expect(bundledProductImageUrl(url, 320), entry.original).not.toBe(url);
        expect(bundledProductImageUrl(url, 640), entry.original).not.toBe(url);
      }
    }
  });
  it("does not resize unrelated hosted media", () => {
    expect(
      bundledProductImageSrcSet("/__l5e/assets-v1/unrelated/video.mp4"),
    ).toBeUndefined();
    expect(
      bundledProductImageUrl("https://example.com/photo.png", 320),
    ).toBeUndefined();
  });
});
