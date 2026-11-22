import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { decodeEntities as web } from "./decode-entities";
import { decodeEntities as edge } from "../../../supabase/functions/_shared/blog/decode-entities";

describe("article decoder parity", () => {
  it("keeps the app and Edge helper byte-identical", () => {
    expect(
      readFileSync(
        "supabase/functions/_shared/blog/decode-entities.ts",
        "utf8",
      ),
    ).toBe(readFileSync("src/lib/blog/decode-entities.ts", "utf8"));
  });
  it.each([
    "&apos; &rsquo; &#8211; &#039;",
    "&amp;apos; &amp;#x2014;",
    "&nbsp; &pound; &euro; &trade;",
    "&#X1F600; &#0; &#x110000;",
    "&amp;amp;amp;apos;",
  ])("agrees on %s", (input) => {
    expect(edge(input)).toBe(web(input));
  });
});
