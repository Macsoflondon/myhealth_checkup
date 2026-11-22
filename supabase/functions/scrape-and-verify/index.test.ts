import { assertEquals } from "jsr:@std/assert@1.0.19";
import { productRedirectIssue } from "../_shared/scrape/product-url.ts";

Deno.test("product redirects to the homepage are broken", () => {
  assertEquals(
    productRedirectIssue(
      "https://lolahealth.com/products/auto-immunity-monitoring",
      "https://lolahealth.com/",
    ),
    "redirected to homepage",
  );
  assertEquals(
    productRedirectIssue(
      "https://lolahealth.com/products/auto-immunity-monitoring",
      "https://lolahealth.com",
    ),
    "redirected to homepage",
  );
});
Deno.test("product redirects to another non-product path are broken", () => {
  assertEquals(
    productRedirectIssue(
      "https://lolahealth.com/products/esr",
      "https://lolahealth.com/collections/tests",
    ),
    "redirected away from product",
  );
});
Deno.test("valid product redirects and homepage requests remain valid", () => {
  assertEquals(
    productRedirectIssue(
      "https://lolahealth.com/products/esr",
      "https://lolahealth.com/products/new-esr?variant=1",
    ),
    null,
  );
  assertEquals(
    productRedirectIssue("https://lolahealth.com/", "https://lolahealth.com/"),
    null,
  );
  assertEquals(
    productRedirectIssue(
      "https://example.com/exam/profiles/one",
      "https://example.com/exam/profiles/two",
    ),
    null,
  );
});
