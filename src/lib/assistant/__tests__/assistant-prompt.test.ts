import { describe, it, expect } from "vitest";
import { createRateLimiter, sanitiseUserText } from "../assistant-prompt";

describe("site assistant guards", () => {
  it("caps input at 1,000 characters and strips control characters", () => {
    expect(sanitiseUserText("a\u0000b")).toBe("ab");
    expect(sanitiseUserText("x".repeat(1500))).toHaveLength(1000);
  });

  it("allows 10 messages per minute per visitor, then blocks until the window resets", () => {
    const allow = createRateLimiter(10, 60_000);
    for (let i = 0; i < 10; i++) expect(allow("ip", 0)).toBe(true);
    expect(allow("ip", 1000)).toBe(false);
    expect(allow("other", 1000)).toBe(true);
    expect(allow("ip", 60_000)).toBe(true);
  });
});
