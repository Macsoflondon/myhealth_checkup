import { describe, it, expect } from "vitest";
import {
  normalisedProductPath,
  shopifyProductHandle,
  productRedirectIssue,
} from "../../supabase/functions/_shared/scrape/product-url";

describe("stable product identity", () => {
  it("matches a renamed Shopify product by its stored provider handle", () => {
    expect(
      shopifyProductHandle(
        "https://www.londonhealthcompany.co.uk/products/existing-handle/?variant=1",
        "https://londonhealthcompany.co.uk",
      ),
    ).toBe("existing-handle");
    expect(
      shopifyProductHandle(
        "https://untrusted.test/products/existing-handle",
        "https://londonhealthcompany.co.uk",
      ),
    ).toBeNull();
  });
  it("normalises Medical Diagnosis paths without name, query or trailing slash", () => {
    expect(
      normalisedProductPath(
        "https://www.medical-diagnosis.co.uk/EXAM/Profiles/Old-Slug/?v=2",
      ),
    ).toBe("/exam/profiles/old-slug");
    expect(normalisedProductPath(null)).toBeNull();
  });
  it("rejects the reported Lola homepage redirect", () => {
    expect(
      productRedirectIssue(
        "https://lolahealth.com/products/auto-immunity-monitoring",
        "https://lolahealth.com/",
      ),
    ).toBe("redirected to homepage");
  });
});
