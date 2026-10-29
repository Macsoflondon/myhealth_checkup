import { describe, expect, it } from "vitest";
import { buildTestSchema } from "@/lib/seo/structured-data";
import { serializeJsonLd } from "@/lib/seo/json-ld";

const input = {
  testName: "Vitamin D Test",
  providerName: "Medichecks",
  providerId: "medichecks",
  url: "https://myhealthcheckup.co.uk/provider/medichecks/tests/vitamin-d",
  description: "Compare the provider's test.",
};

describe("provider offer evidence", () => {
  it("keeps the seller independent from the comparison platform", () => {
    const product = buildTestSchema({ ...input, priceGbp: 39 })[1];
    expect(product?.offers).toEqual({
      "@type": "Offer",
      price: "39.00",
      priceCurrency: "GBP",
      url: input.url,
      seller: { "@type": "Organization", name: "Medichecks" },
    });
  });

  it.each([null, undefined, 0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "omits unsupported offer price %s",
    (priceGbp) => {
      expect(buildTestSchema({ ...input, priceGbp })[1]?.offers).toBeUndefined();
    },
  );

  it("prevents source text breaking out of a JSON-LD script", () => {
    const serialised = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(serialised).not.toContain("<");
    expect(JSON.parse(serialised)).toEqual({ name: "</script><script>alert(1)</script>" });
  });
});