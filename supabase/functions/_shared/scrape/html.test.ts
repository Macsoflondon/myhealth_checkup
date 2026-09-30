/**
 * Unit tests for the shared scraper HTML-to-text helpers.
 *
 * Run with:
 *   deno test supabase/functions/_shared/scrape/html.test.ts
 */
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { decodeEntities, htmlToText, stripTags } from "./html.ts";

Deno.test("decodeEntities decodes named, decimal and hex references", () => {
  assertEquals(
    decodeEntities("Tom &amp; Jerry &pound;49 &#8211; &#x2019;s&nbsp;"),
    "Tom & Jerry £49 – ’s ",
  );
});

Deno.test("decodeEntities decodes only once (no double unescaping)", () => {
  assertEquals(decodeEntities("&amp;lt;script&amp;gt;"), "&lt;script&gt;");
  assertEquals(decodeEntities("&amp;amp;"), "&amp;");
});

Deno.test("decodeEntities leaves unknown or invalid references alone", () => {
  assertEquals(
    decodeEntities("&madeup; &#0; &#x110000; AT&T"),
    "&madeup; &#0; &#x110000; AT&T",
  );
});

Deno.test(
  "stripTags removes script and style content, including odd end tags",
  () => {
    assertEquals(htmlToText("a<script>alert(1)</script >b"), "a b");
    assertEquals(htmlToText("a<SCRIPT type='x'>x</script foo>b"), "a b");
    assertEquals(
      htmlToText("a<style>p{}</style>b<noscript>n</noscript>c"),
      "a b c",
    );
  },
);

Deno.test("stripTags handles nested and malformed tags", () => {
  // The leftover is inert text with no "<", so it can never re-form a tag.
  assertEquals(
    htmlToText("<scr<script>ipt>alert(1)</script>ok"),
    "ipt>alert(1) ok",
  );
  assertEquals(htmlToText('<a title="1 > 0">link</a>'), "link");
  assertEquals(htmlToText("x<!-- c -->y<!-- d --!>z"), "x y z");
});

Deno.test("stripTags keeps a bare < that does not start a tag", () => {
  assertEquals(htmlToText("HbA1c <48 mmol/mol"), "HbA1c <48 mmol/mol");
});

Deno.test("decoded entities never become markup", () => {
  assertEquals(htmlToText("&lt;b&gt;bold&lt;/b&gt;"), "<b>bold</b>");
});

Deno.test("preserveNewlines turns block elements into line breaks", () => {
  assertEquals(
    htmlToText("<p>One</p><p>Two<br>Three</p><ul><li>A</li><li>B</li></ul>", {
      preserveNewlines: true,
    }),
    "One\nTwo\nThree\nA\nB",
  );
});

Deno.test("stripTags without decoding keeps entities for the caller", () => {
  assertEquals(stripTags("<b>&amp;</b>").trim(), "&amp;");
});
