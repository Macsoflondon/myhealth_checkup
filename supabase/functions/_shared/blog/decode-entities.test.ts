import { assertEquals } from "jsr:@std/assert@1.0.19";
import { decodeEntities } from "./decode-entities.ts";

for (const [name, character] of Object.entries({
  apos: "'",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  nbsp: "\u00a0",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  pound: "£",
  euro: "€",
  copy: "©",
  reg: "®",
  trade: "™",
})) {
  Deno.test(`decodes named entity ${name}`, () =>
    assertEquals(decodeEntities(`&${name};`), character),
  );
}
Deno.test("decimal and hexadecimal numeric entities", () =>
  assertEquals(decodeEntities("&#8211; &#039; &#x2019; &#X1F600;"), "– ' ’ 😀"),
);
Deno.test("double encoding is decoded", () =>
  assertEquals(
    decodeEntities("Who It&amp;apos;s For &amp;#8211; overview"),
    "Who It's For – overview",
  ),
);
Deno.test("three-pass bound", () =>
  assertEquals(decodeEntities("&amp;amp;amp;apos;"), "&apos;"),
);
Deno.test("invalid and unknown entities do not crash or change", () =>
  assertEquals(
    decodeEntities("&unknown; &#x110000; &constructor;"),
    "&unknown; &#x110000; &constructor;",
  ),
);
