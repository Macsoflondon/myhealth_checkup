import { describe, expect, it } from "vitest";
import {
  createProviderRatingLookup,
  formatCheckedDate,
  formatReviewCount,
} from "@/lib/provider-rating-lookup";
import { toLiveRatings } from "@/services/provider-ratings-service";

const rows = toLiveRatings([
  { provider_id: "medichecks", source: "trustpilot", source_url: "https://uk.trustpilot.com/review/www.medichecks.com", rating: 4.5, review_count: 2759, checked_at: "2026-11-09T18:00:00Z" },
  { provider_id: "goodbody-clinic", source: "trustpilot", source_url: null, rating: 4.8, review_count: 3600, checked_at: null },
  { provider_id: "randox", source: "trustpilot", source_url: null, rating: 4.7, review_count: 100, checked_at: null },
  { provider_id: "clinilabs", source: "trustpilot", source_url: null, rating: null, review_count: null, checked_at: null },
]);

describe("provider rating lookup", () => {
  const get = createProviderRatingLookup(rows);
  it("drops rows without a verified rating", () => {
    expect(get("clinilabs")).toBeNull();
  });
  it("resolves IDs, aliases and display names", () => {
    expect(get("medichecks")?.rating).toBe(4.5);
    expect(get("goodbody")?.providerId).toBe("goodbody-clinic");
    expect(get("randox-health")?.providerId).toBe("randox");
    expect(get("Lola Health")).toBeNull();
    expect(get("Randox Health")?.providerId).toBe("randox");
  });
  it("returns null for providers with no row (no hardcoded fallbacks)", () => {
    expect(get("onedaytests")).toBeNull();
    expect(get("the-doctors-laboratory")).toBeNull();
    expect(createProviderRatingLookup([])("medichecks")).toBeNull();
  });
  it("formats count and checked date", () => {
    expect(formatReviewCount(2759)).toBe("2,759");
    expect(formatCheckedDate("2026-11-09T18:00:00Z")).toBe("09 Nov 2026");
    expect(formatCheckedDate(null)).toBeNull();
  });
});
