import { describe, expect, it } from "vitest";
import {
  getAllProviders,
  getProviderDetails,
  getProviderLogo,
  getProviderName,
  providers,
} from "./providers";
import { HOMEPAGE_PROVIDER_IDS } from "@/lib/homepage-provider-selection";

describe("nine-provider roster", () => {
  it("includes exactly nine distinct providers in the directory and homepage roster", () => {
    expect(providers).toHaveLength(9);
    expect(new Set(providers.map((provider) => provider.id)).size).toBe(9);
    expect(
      getAllProviders()
        .map((provider) => provider.id)
        .sort(),
    ).toEqual([...HOMEPAGE_PROVIDER_IDS].sort());
  });

  it("resolves EDGE aliases to its configured identity without inventing accreditation", () => {
    expect(getProviderName("edge")).toBe("EDGE");
    expect(getProviderDetails("edge")?.id).toBe("sports-blood-tests");
    expect(getProviderDetails("edge")?.website).toBe(
      "https://www.sportsbloodtests.co.uk",
    );
    expect(getProviderLogo("edge")).not.toBe("/placeholder.svg");
    expect(getProviderDetails("edge")?.accreditations).toBeUndefined();
  });
});
