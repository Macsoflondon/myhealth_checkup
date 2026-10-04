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

  it("detailedProviders entries match PROVIDER_WEBSITES", () => {
    const canonical = detailedProviders.filter((p) => p.id in PROVIDER_WEBSITES);
    expect(canonical.length).toBeGreaterThan(0);
    for (const p of canonical) {
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
