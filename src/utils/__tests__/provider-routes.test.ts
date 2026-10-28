import { describe, expect, it } from "vitest";
import { detailedProviders } from "@/data/compare/detailedProviders";
import { normalizeProviderId } from "@/constants/providers";
import { getProviderProfileRoute, getProviderRoute, getTestDetailUrl } from "../providerRoutes";

const providerIds = [
  "medichecks", "randox", "goodbody-clinic", "lola-health",
  "london-medical-laboratory", "london-health-company", "clinilabs", "medical-diagnosis",
];

describe("Provider navigation", () => {
  it.each(providerIds)("links %s to its registered profile and test route", (id) => {
    expect(getProviderProfileRoute(id)).toBe(`/provider/${id}`);
    expect(detailedProviders.find((provider) => provider.id === id)).toBeDefined();
    expect(getProviderRoute(id)).toBe(`/${id}`);
    expect(getTestDetailUrl(id, "test-id")).toBe(`/${id}/test-id`);
  });

  it("routes both Randox IDs to the working Randox profile", () => {
    expect(getProviderProfileRoute("randox")).toBe("/provider/randox");
    expect(getProviderProfileRoute("randox-health")).toBe("/provider/randox");
    expect(normalizeProviderId("randox-health")).toBe("randox");
  });

  it("retains Goodbody alias compatibility", () => {
    expect(getProviderProfileRoute("goodbody")).toBe("/provider/goodbody-clinic");
    expect(normalizeProviderId("goodbody")).toBe("goodbody-clinic");
  });

  it("normalises case and whitespace before building profile links", () => {
    expect(getProviderProfileRoute(" Randox Health ")).toBe("/provider/randox");
  });
});