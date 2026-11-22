import { assertEquals } from "jsr:@std/assert@1.0.19";
import {
  edgeArticleLinks,
  edgeArticlePublicationDate,
} from "./edge-articles.ts";

Deno.test("EDGE index accepts only unique provider biomarker articles", () => {
  assertEquals(
    edgeArticleLinks(
      '<a href="/biomarkers/ferritin/">Iron</a><a href="/biomarkers/ferritin/">Duplicate</a><a href="https://other.test/biomarkers/iron/">Other host</a><a href="/blood-tests/men/health/">Product</a>',
    ),
    ["https://www.sportsbloodtests.co.uk/biomarkers/ferritin/"],
  );
});
Deno.test("EDGE article uses the provider publication date", () => {
  assertEquals(
    edgeArticlePublicationDate(
      '<script type="application/ld+json">{"@graph":[{"datePublished":"2026-11-01"}]}</script>',
    ),
    "2026-11-01",
  );
});
Deno.test("EDGE missing or invalid date stays unavailable", () => {
  assertEquals(
    edgeArticlePublicationDate(
      '<script type="application/ld+json">{"datePublished":"invalid"}</script>',
    ),
    null,
  );
  assertEquals(edgeArticlePublicationDate("<h1>Ferritin</h1>"), null);
});
