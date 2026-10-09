import { describe, expect, it } from "vitest";
import { classifyTraffic } from "@/lib/affiliate/traffic-quality";

const SAFARI_IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const CHROME_DESKTOP =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36";

describe("classifyTraffic", () => {
  it("leaves ordinary browsers unflagged", () => {
    expect(classifyTraffic(SAFARI_IPHONE, false)).toBeNull();
    expect(classifyTraffic(CHROME_DESKTOP, false)).toBeNull();
  });

  it("does not mistake a CUBOT handset for a bot", () => {
    expect(
      classifyTraffic(
        "Mozilla/5.0 (Linux; Android 13; CUBOT X30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36",
        false,
      ),
    ).toBeNull();
  });

  it("flags automation browsers as headless", () => {
    expect(
      classifyTraffic(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/129.0.0.0 Safari/537.36",
        false,
      ),
    ).toBe("headless");
    expect(classifyTraffic("Mozilla/5.0 Playwright/1.48", false)).toBe(
      "headless",
    );
  });

  it("flags crawlers, scripts and empty user agents as bots", () => {
    expect(
      classifyTraffic(
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        false,
      ),
    ).toBe("bot");
    expect(
      classifyTraffic(
        "Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)",
        false,
      ),
    ).toBe("bot");
    expect(classifyTraffic("facebookexternalhit/1.1", false)).toBe("bot");
    expect(classifyTraffic("curl/8.5.0", false)).toBe("bot");
    expect(classifyTraffic("", false)).toBe("bot");
    expect(classifyTraffic(null, false)).toBe("bot");
  });

  it("labels a real browser over the burst threshold as a burst", () => {
    expect(classifyTraffic(CHROME_DESKTOP, true)).toBe("burst");
  });

  it("prefers the user agent label over the burst label", () => {
    expect(classifyTraffic("curl/8.5.0", true)).toBe("bot");
  });
});
