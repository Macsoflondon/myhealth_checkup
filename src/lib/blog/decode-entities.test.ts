import { describe, expect, it } from "vitest";
import { decodeEntities } from "./decode-entities";

const named = {
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
};

describe("provider article entity decoding", () => {
  it.each(Object.entries(named))("decodes &%s;", (name, character) => {
    expect(decodeEntities(`&${name};`)).toBe(character);
  });
  it("decodes decimal and hexadecimal numeric entities", () => {
    expect(decodeEntities("&#8211; &#039; &#x2019; &#X1F600;")).toBe(
      "– ' ’ 😀",
    );
  });
  it("repeats to decode double-encoded text", () => {
    expect(decodeEntities("Who It&amp;apos;s For &amp;#8211; overview")).toBe(
      "Who It's For – overview",
    );
  });
  it("stops after at most three passes", () => {
    expect(decodeEntities("&amp;amp;amp;apos;")).toBe("&apos;");
  });
  it("preserves unrecognised and invalid entities without throwing", () => {
    expect(decodeEntities("&unrecognised; &#x110000; &constructor;")).toBe(
      "&unrecognised; &#x110000; &constructor;",
    );
    expect(decodeEntities("&#0; &#xD800;")).toBe("� �");
  });
});
