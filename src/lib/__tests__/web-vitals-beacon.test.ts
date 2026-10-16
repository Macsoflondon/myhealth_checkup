import { describe, expect, it } from "vitest";
import { chunkBodies, classifyDevice } from "@/lib/webVitals";

describe("classifyDevice", () => {
  it("classes iPad, Android tablets and touch Macs as tablet", () => {
    expect(classifyDevice("Mozilla/5.0 (iPad; CPU OS 16_0)", 5)).toBe("tablet");
    expect(classifyDevice("Mozilla/5.0 (Linux; Android 13; SM-X700)", 5)).toBe(
      "tablet",
    );
    expect(classifyDevice("Mozilla/5.0 (Macintosh; Intel Mac OS X)", 5)).toBe(
      "tablet",
    );
  });

  it("classes phones as mobile and plain Macs as desktop", () => {
    expect(
      classifyDevice("Mozilla/5.0 (Linux; Android 13; Pixel 7) Mobile", 5),
    ).toBe("mobile");
    expect(classifyDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 17)", 5)).toBe(
      "mobile",
    );
    expect(classifyDevice("Mozilla/5.0 (Macintosh; Intel Mac OS X)", 0)).toBe(
      "desktop",
    );
  });
});

describe("chunkBodies", () => {
  it("keeps every body under 60 KB", () => {
    const samples = Array.from({ length: 2000 }, () => ({
      metric: "LCP" as const,
      value: 1234,
      route: "/a-fairly-long-route-name/for-testing",
      device_type: "mobile" as const,
    }));
    const bodies = chunkBodies(samples);
    expect(bodies.length).toBeGreaterThan(1);
    for (const b of bodies) expect(b.length).toBeLessThanOrEqual(60_000);
    const total = bodies.reduce(
      (n, b) => n + (JSON.parse(b) as { samples: unknown[] }).samples.length,
      0,
    );
    expect(total).toBe(2000);
  });
});
