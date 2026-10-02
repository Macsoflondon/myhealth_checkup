import { describe, expect, it, vi } from "vitest";
import {
  appendReferral,
  buildAffiliateUrl,
  handleAffiliateAnchorClick,
  type AffiliateClickPayload,
} from "../affiliate-tracking";
import { AFFILIATE_PROVIDERS } from "../affiliate-config";

const CID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

describe("Lola Health referral attribution", () => {
  it("is configured with subIdParam null", () => {
    const cfg = AFFILIATE_PROVIDERS["lola-health"];
    expect(cfg.subIdParam).toBeNull();
    expect(cfg.referral).toMatchObject({
      param: "snowball",
      value: "myhealthcheckup",
    });
  });
  it("keeps the product path and adds snowball", () => {
    const out = new URL(
      appendReferral("https://lolahealth.com/products/albumin", "lola-health"),
    );
    expect(out.pathname).toBe("/products/albumin");
    expect(out.searchParams.get("snowball")).toBe("myhealthcheckup");
  });
  it("preserves existing query params and does not duplicate", () => {
    const once = appendReferral(
      "https://lolahealth.com/products/a?utm_source=x",
      "lola-health",
    );
    const twice = appendReferral(once, "lola-health");
    const u = new URL(twice);
    expect(u.searchParams.get("utm_source")).toBe("x");
    expect(u.searchParams.getAll("snowball")).toEqual(["myhealthcheckup"]);
  });
  it("leaves other providers unchanged", () => {
    expect(
      buildAffiliateUrl("https://medichecks.com/a", "medichecks", CID),
    ).toBe("https://medichecks.com/a");
  });
  it("rewrites the clicked Lola link and still logs the click", () => {
    document.body.innerHTML = `<a href="https://lolahealth.com/products/albumin">Book</a>`;
    const a = document.querySelector("a")!;
    const send = vi.fn<(p: AffiliateClickPayload) => void>();
    const p = handleAffiliateAnchorClick(
      a,
      "/provider/lola-health/tests/x",
      send,
    );
    expect(p?.provider_id).toBe("lola-health");
    expect(send).toHaveBeenCalledOnce();
    expect(a.href).toBe(
      "https://lolahealth.com/products/albumin?snowball=myhealthcheckup",
    );
    handleAffiliateAnchorClick(a, "/", send);
    expect(a.href).toBe(
      "https://lolahealth.com/products/albumin?snowball=myhealthcheckup",
    );
  });
});

describe("openAffiliateUrl", () => {
  it("opens the attributed Lola URL", async () => {
    const { openAffiliateUrl } = await import("../affiliate-tracking");
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    vi.stubGlobal("navigator", { sendBeacon: () => true });
    openAffiliateUrl("https://lolahealth.com/products/albumin", {
      placement: "card",
    });
    expect(open).toHaveBeenCalledWith(
      "https://lolahealth.com/products/albumin?snowball=myhealthcheckup",
      "_blank",
      "noopener,noreferrer",
    );
    vi.unstubAllGlobals();
  });
});
