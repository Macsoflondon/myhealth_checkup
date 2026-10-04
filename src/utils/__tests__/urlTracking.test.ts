import { describe, expect, it } from "vitest";

import { toHttpsUrl } from "../urlTracking";

describe("toHttpsUrl", () => {
  it("keeps a bare host unchanged apart from the protocol", () => {
    expect(toHttpsUrl("lolahealth.com")).toBe("https://lolahealth.com");
  });

  it("keeps a host with a path", () => {
    expect(toHttpsUrl("randoxhealth.com/en-GB")).toBe(
      "https://randoxhealth.com/en-GB",
    );
  });

  it("strips an existing https:// prefix", () => {
    expect(toHttpsUrl("https://lolahealth.com")).toBe("https://lolahealth.com");
  });

  it("strips an existing http:// prefix", () => {
    expect(toHttpsUrl("http://lolahealth.com")).toBe("https://lolahealth.com");
  });

  it("trims surrounding whitespace", () => {
    expect(toHttpsUrl("  lolahealth.com  ")).toBe("https://lolahealth.com");
  });

  it("never produces a doubled protocol", () => {
    const inputs = [
      "lolahealth.com",
      "randoxhealth.com/en-GB",
      "https://lolahealth.com",
      "http://lolahealth.com",
      "  https://lolahealth.com  ",
    ];
    for (const input of inputs) {
      expect(toHttpsUrl(input)).not.toContain("https://https");
    }
  });
});
