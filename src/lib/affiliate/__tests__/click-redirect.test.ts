import { describe, expect, it } from "vitest";
import {
  AFFILIATE_CLICKS_PER_WINDOW,
  hashVisitor,
  isCatalogueTestId,
  verifiedProviderUrl,
} from "../click-redirect";
import { handleAffiliateAnchorClick } from "../affiliate-tracking";

describe("booking click redirect rules", () => {
  it("limits each visitor to 20 clicks per window", () => {
    expect(AFFILIATE_CLICKS_PER_WINDOW).toBe(20);
  });
  it("hashes the address so the raw IP is never stored", async () => {
    const h = await hashVisitor("203.0.113.9", "secret", new Date("2026-11-06T12:00:00Z"));
    expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(h).not.toContain("203.0.113.9");
  });
  it("only accepts catalogue UUIDs as test ids", () => {
    expect(isCatalogueTestId("90261ac9-1111-4222-8333-444455556666")).toBe(true);
    expect(isCatalogueTestId("https://evil.example")).toBe(false);
  });
  it("rejects a catalogue URL on another provider's host", () => {
    expect(verifiedProviderUrl("https://www.randoxhealth.com/x", "medichecks")).toBeNull();
    expect(verifiedProviderUrl("javascript:alert(1)", "medichecks")).toBeNull();
    expect(verifiedProviderUrl("https://www.medichecks.com/t", "medichecks")?.hostname).toBe("www.medichecks.com");
  });
  it("routes catalogue test links through the server redirect, not the raw URL", () => {
    const a = document.createElement("a");
    a.href = "https://www.medichecks.com/products/x";
    a.dataset.affiliateTestId = "90261ac9-1111-4222-8333-444455556666";
    const sent: unknown[] = [];
    handleAffiliateAnchorClick(a, "/compare", (p) => sent.push(p));
    expect(new URL(a.href).pathname).toBe("/api/public/affiliate-click");
    expect(a.href).not.toContain("medichecks.com");
    expect(sent).toHaveLength(0);
  });
});
