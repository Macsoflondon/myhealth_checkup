import { describe, expect, it } from "vitest";
import { PROVIDER_WEBSITES, getProviderWebsite } from "@/constants/providers";
import { detailedProviders } from "@/data/compare/detailedProviders";
import { PROVIDERS } from "@/components/sections/FeaturedProvidersGlass";
import { buildProviderWebsiteUrl, toHttpsUrl } from "@/utils/urlTracking";

describe("provider website single source of truth", () => {
  it.each(Object.entries(PROVIDER_WEBSITES))(
    "%s has a non-empty https URL",
    (_id, url) => {
      expect(url.trim()).not.toBe("");
      expect(new URL(url).protocol).toBe("https:");
    },
  );

  it("every detailedProviders entry has a PROVIDER_WEBSITES URL and matches it", () => {
    const missing = detailedProviders
      .filter((p) => !(p.id in PROVIDER_WEBSITES))
      .map((p) => p.id);
    expect(missing).toEqual([]);
    for (const p of detailedProviders) {
      expect(p.website, p.id).toBe(PROVIDER_WEBSITES[p.id]);
    }
  });

  it.each(PROVIDERS.map((p) => p.id))(
    "Glass Visit Site href for %s is valid",
    (id) => {
      const website = getProviderWebsite(id);
      expect(website).not.toBe("");
      const href = buildProviderWebsiteUrl(toHttpsUrl(website), id);
      expect(href).not.toContain("https://https");
      expect(new URL(href).protocol).toBe("https:");
    },
  );
});
