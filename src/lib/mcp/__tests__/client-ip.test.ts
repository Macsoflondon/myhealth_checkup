import { describe, expect, it } from "vitest";
import { clientIp } from "../rate-limit";

describe("trusted client address", () => {
  it("ignores a caller-sent X-Forwarded-For", () => {
    expect(
      clientIp(new Headers({ "x-forwarded-for": "203.0.113.77" })),
    ).toBeNull();
  });
  it("prefers trimmed cf-connecting-ip", () => {
    expect(
      clientIp(
        new Headers({
          "cf-connecting-ip": " 192.0.2.1 ",
          "x-real-ip": "192.0.2.2",
          "x-forwarded-for": "203.0.113.77",
        }),
      ),
    ).toBe("192.0.2.1");
  });
  it("falls back to x-real-ip", () => {
    expect(clientIp(new Headers({ "x-real-ip": " 2001:db8::1 " }))).toBe(
      "2001:db8::1",
    );
  });
  it.each([
    "",
    "unknown",
    "256.0.0.1",
    "01.2.3.4",
    "127.1",
    "192.0.2.1:80",
    "192.0.2.1, 192.0.2.2",
    "[::1]",
    "::gg",
    "1:2:3",
    "1:2:3:4:5:6:7:8:9",
    "fe80::1%eth0",
    "https://example.com",
  ])('rejects invalid address "%s"', (value) => {
    expect(
      clientIp(new Headers({ "cf-connecting-ip": value, "x-real-ip": value })),
    ).toBeNull();
  });
  it.each([
    "0.0.0.0",
    "255.255.255.255",
    "::",
    "::1",
    "2001:db8:0:1:2:3:4:5",
    "::ffff:192.0.2.1",
  ])('accepts IP literal "%s"', (value) => {
    expect(clientIp(new Headers({ "cf-connecting-ip": value }))).toBe(value);
  });
  it("uses a valid gateway fallback when the Cloudflare value is invalid", () => {
    expect(
      clientIp(
        new Headers({
          "cf-connecting-ip": "invalid",
          "x-real-ip": "192.0.2.2",
        }),
      ),
    ).toBe("192.0.2.2");
  });
});
