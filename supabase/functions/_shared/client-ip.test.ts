import { assertEquals } from "jsr:@std/assert@1.0.19";
import { clientIp } from "./client-ip.ts";

Deno.test("caller-sent X-Forwarded-For is ignored", () => {
  assertEquals(
    clientIp(new Headers({ "x-forwarded-for": "203.0.113.77" })),
    null,
  );
});
Deno.test("cf-connecting-ip wins over gateway and forwarded headers", () => {
  assertEquals(
    clientIp(
      new Headers({
        "cf-connecting-ip": " 192.0.2.1 ",
        "x-real-ip": "192.0.2.2",
        "x-forwarded-for": "203.0.113.77",
      }),
    ),
    "192.0.2.1",
  );
});
Deno.test("x-real-ip is the validated fallback", () => {
  assertEquals(
    clientIp(new Headers({ "x-real-ip": " 2001:db8::1 " })),
    "2001:db8::1",
  );
  assertEquals(
    clientIp(
      new Headers({ "cf-connecting-ip": "invalid", "x-real-ip": "192.0.2.2" }),
    ),
    "192.0.2.2",
  );
});
for (const value of [
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
]) {
  Deno.test(`invalid IP literal is null: ${value}`, () => {
    assertEquals(
      clientIp(new Headers({ "cf-connecting-ip": value, "x-real-ip": value })),
      null,
    );
  });
}
for (const value of [
  "0.0.0.0",
  "255.255.255.255",
  "::",
  "::1",
  "2001:db8:0:1:2:3:4:5",
  "::ffff:192.0.2.1",
]) {
  Deno.test(`valid IP literal: ${value}`, () => {
    assertEquals(clientIp(new Headers({ "cf-connecting-ip": value })), value);
  });
}
