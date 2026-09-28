import { describe, expect, it } from "vitest";
import { canBookDirect, getBookingLinkState } from "./booking-link-state";

const url = "https://provider.example/test";

describe("getBookingLinkState", () => {
  it("treats never-checked URLs as bookable", () => {
    expect(getBookingLinkState(url, null)).toBe("unchecked");
    expect(getBookingLinkState(url, undefined)).toBe("unchecked");
    expect(canBookDirect(url, null)).toBe(true);
  });
  it("allows booking for verified URLs", () => {
    expect(getBookingLinkState(url, true)).toBe("verified");
    expect(canBookDirect(url, true)).toBe(true);
  });
  it("blocks booking only after an explicit failed check", () => {
    expect(getBookingLinkState(url, false)).toBe("failed");
    expect(canBookDirect(url, false)).toBe(false);
  });
  it("blocks booking when there is no URL", () => {
    expect(getBookingLinkState(null, true)).toBe("no_url");
    expect(getBookingLinkState("#", null)).toBe("no_url");
    expect(canBookDirect("", true)).toBe(false);
  });
});
