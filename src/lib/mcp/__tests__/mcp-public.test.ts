import { describe, expect, it, vi } from "vitest";
import publicMcp, { PUBLIC_TOOLS } from "../public";
import {
  clientIp,
  createRateLimiter,
  installDenoServeRateLimit,
  withRateLimit,
} from "../rate-limit";

const EXPECTED = [
  "search_tests",
  "get_test",
  "list_providers",
  "list_categories",
  "get_provider",
  "compare_tests",
  "find_tests_by_biomarker",
];

describe("public MCP server", () => {
  it("registers exactly the seven catalogue tools", () => {
    const names = PUBLIC_TOOLS.map((t) => t.name);
    expect(names).toHaveLength(7);
    expect([...names].sort()).toEqual([...EXPECTED].sort());
  });

  it("has no favourites or admin tools", () => {
    const names = PUBLIC_TOOLS.map((t) => t.name).join(" ");
    expect(names).not.toMatch(/favourite/);
    for (const admin of [
      "get_platform_health",
      "list_scraper_alerts",
      "get_catalogue_coverage",
      "list_stale_tests",
      "get_data_quality",
      "get_price_movements",
      "get_security_posture",
      "get_performance_summary",
      "get_business_summary",
      "get_admin_audit_trail",
    ])
      expect(names).not.toContain(admin);
  });

  it("has no authentication configured and all tools are read-only", () => {
    const def = publicMcp as unknown as { auth?: unknown };
    expect(def.auth).toBeUndefined();
    for (const t of PUBLIC_TOOLS) expect(t.annotations?.readOnlyHint).toBe(true);
  });
});

describe("rate limiter", () => {
  it("allows 60 requests per window then blocks", () => {
    const rl = createRateLimiter(60, 60_000);
    for (let i = 0; i < 60; i++) expect(rl.check("1.2.3.4", 1000).allowed).toBe(true);
    const blocked = rl.check("1.2.3.4", 1000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(60);
    expect(rl.check("5.6.7.8", 1000).allowed).toBe(true);
  });

  it("resets after the window", () => {
    const rl = createRateLimiter(2, 60_000);
    rl.check("a", 0);
    rl.check("a", 0);
    expect(rl.check("a", 0).allowed).toBe(false);
    expect(rl.check("a", 60_000).allowed).toBe(true);
  });

  it("reads the client IP from proxy headers", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" }))).toBe("9.9.9.9");
    expect(clientIp(new Headers({ "cf-connecting-ip": "8.8.8.8" }))).toBe("8.8.8.8");
    expect(clientIp(new Headers())).toBe("unknown");
  });

  it("returns HTTP 429 after the limit and skips preflights", async () => {
    const inner = vi.fn(async () => new Response("ok"));
    const handler = withRateLimit(inner, createRateLimiter(1, 60_000));
    const req = () =>
      new Request("https://x/mcp", { method: "POST", headers: { "x-forwarded-for": "1.1.1.1" } });
    expect((await handler(req())).status).toBe(200);
    const res = await handler(req());
    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).not.toBeNull();
    const pre = new Request("https://x/mcp", {
      method: "OPTIONS",
      headers: { "x-forwarded-for": "1.1.1.1" },
    });
    expect((await handler(pre)).status).toBe(200);
    expect(inner).toHaveBeenCalledTimes(2);
  });

  it("wraps Deno.serve only when Deno exists", () => {
    expect(installDenoServeRateLimit({})).toBe(false);
    const serve = vi.fn();
    const fake = { Deno: { serve } };
    expect(installDenoServeRateLimit(fake)).toBe(true);
    fake.Deno.serve(() => new Response("ok"));
    expect(serve).toHaveBeenCalledTimes(1);
  });
});
