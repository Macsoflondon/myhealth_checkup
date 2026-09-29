import { describe, expect, it } from "vitest";
import lolaAddonKitAsset from "@/assets/providers/lola-health-addon-kit.png.asset.json";
import { resolveTestCardImage } from "@/lib/resolve-test-card-image";
import { fromCategoryTestItem } from "@/lib/universalTestAdapter";

describe("resolveTestCardImage", () => {
  it("uses the supplied kit image for Lola Health add-ons", () => {
    expect(
      resolveTestCardImage({
        providerId: "lola-health",
        isAddon: true,
        imageUrl: "https://provider.example/unwanted.jpg",
      }),
    ).toBe(lolaAddonKitAsset.url);
  });

  it("keeps a Lola Health standalone test image", () => {
    const imageUrl = "https://provider.example/standalone.jpg";
    expect(
      resolveTestCardImage({
        providerId: "lola-health",
        isAddon: false,
        imageUrl,
      }),
    ).toBe(imageUrl);
  });

  it("does not replace another provider's add-on image", () => {
    const imageUrl = "https://provider.example/add-on.jpg";
    expect(
      resolveTestCardImage({
        providerId: "london-health-company",
        isAddon: true,
        imageUrl,
      }),
    ).toBe(imageUrl);
  });

  it("returns null for a test with no image so the card shows the brand tile", () => {
    expect(
      resolveTestCardImage({
        providerId: "clinilabs",
        isAddon: false,
        imageUrl: null,
      }),
    ).toBeNull();
    expect(resolveTestCardImage({ providerId: "clinilabs" })).toBeNull();
  });

  it("carries a missing category-page image through as null, not a broken URL", () => {
    const adapted = fromCategoryTestItem({
      id: "no-image",
      provider: "Clinilabs",
      providerId: "clinilabs",
      priceNum: 99,
      price: "£99",
      turnaround: "2 days",
      turnaroundDays: 2,
      biomarkerCount: 5,
      title: "PCOS Blood Test",
      desc: "Provider description",
      biomarkers: [],
      tag: "Women's Health",
      badgeColor: "#7C3AED",
    });
    expect(adapted.image_url).toBeNull();
  });
});
