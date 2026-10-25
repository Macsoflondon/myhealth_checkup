import { describe, expect, it } from "vitest";
import { galleryImageAlt, resolveGalleryImages } from "@/lib/test-gallery";

describe("resolveGalleryImages", () => {
  it("returns up to two gallery images in order", () => {
    expect(
      resolveGalleryImages({
        image_url: "https://cdn.example.com/box.webp",
        gallery_image_urls: [
          "https://cdn.example.com/box.webp",
          "https://cdn.example.com/biomarkers.webp",
        ],
      }),
    ).toEqual([
      "https://cdn.example.com/box.webp",
      "https://cdn.example.com/biomarkers.webp",
    ]);
  });

  it("falls back to image_url when the gallery array is empty", () => {
    expect(
      resolveGalleryImages({
        image_url: "https://cdn.example.com/box.webp",
        gallery_image_urls: [],
      }),
    ).toEqual(["https://cdn.example.com/box.webp"]);
  });

  it("falls back to image_url when gallery_image_urls is missing", () => {
    expect(
      resolveGalleryImages({ image_url: "https://cdn.example.com/box.webp" }),
    ).toEqual(["https://cdn.example.com/box.webp"]);
  });

  it("returns no images when neither field has a usable URL", () => {
    expect(
      resolveGalleryImages({ image_url: null, gallery_image_urls: null }),
    ).toEqual([]);
    expect(resolveGalleryImages({ image_url: "  ", gallery_image_urls: [] })).toEqual(
      [],
    );
  });

  it("drops blank entries and de-duplicates", () => {
    expect(
      resolveGalleryImages({
        gallery_image_urls: [
          "",
          "https://cdn.example.com/box.webp",
          "https://cdn.example.com/box.webp",
        ],
      }),
    ).toEqual(["https://cdn.example.com/box.webp"]);
  });

  it("caps the gallery at two images", () => {
    expect(
      resolveGalleryImages({
        gallery_image_urls: [
          "https://cdn.example.com/a.webp",
          "https://cdn.example.com/b.webp",
          "https://cdn.example.com/c.webp",
        ],
      }),
    ).toHaveLength(2);
  });
});

describe("galleryImageAlt", () => {
  it("describes the box shot and the biomarker graphic", () => {
    expect(galleryImageAlt(0, "Full Blood Count", "Medichecks")).toBe(
      "Full Blood Count by Medichecks, product box",
    );
    expect(galleryImageAlt(1, "Full Blood Count", "Medichecks")).toBe(
      "Full Blood Count by Medichecks, biomarker groups included",
    );
  });
});
