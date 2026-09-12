import { describe, expect, it } from "vitest";
import lolaAddonKitAsset from "@/assets/providers/lola-health-addon-kit.png.asset.json";
import { resolveTestCardImage } from "@/lib/resolve-test-card-image";

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
});