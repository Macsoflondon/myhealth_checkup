import { describe, expect, it, vi } from "vitest";
import {
  appendReferral,
  buildAffiliateUrl,
  handleAffiliateAnchorClick,
  type AffiliateClickPayload,
} from "../affiliate-tracking";
import {
  AFFILIATE_PROVIDERS,
  type AffiliateProviderConfig,
} from "../affiliate-config";

const CID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

/** A fake provider used to exercise the generic referral mechanism. */
const TEST_PROVIDERS: Readonly<Record<string, AffiliateProviderConfig>> = {
  "test-provider": {
    hosts: ["example.test"],
    subIdParam: null,
    referral: {
      network: "test-network",
      link: "https://referrals.example.test/test",
      discountCode: "test",
      param: "ref",
      value: "test",
    },
  },
};

describe("referral attribution (generic mechanism)", () => {
  it("keeps the product path and adds the referral parameter", () => {
    const out = new URL(
      appendReferral(
        "https://example.test/products/albumin",
        "test-provider",
        TEST_PROVIDERS,
      ),
    );
    expect(out.pathname).toBe("/products/albumin");
    expect(out.searchParams.get("ref")).toBe("test");
  });
  it("preserves existing query params and does not duplicate", () => {
    const once = appendReferral(
      "https://example.test/products/a?utm_source=x",
      "test-provider",
      TEST_PROVIDERS,
    );
    const twice = appendReferral(once, "test-provider", TEST_PROVIDERS);
    const u = new URL(twice);
    expect(u.searchParams.get("utm_source")).toBe("x");
    expect(u.searchParams.getAll("ref")).toEqual(["test"]);
  });
  it("leaves providers without a referral unchanged", () => {
    expect(
      buildAffiliateUrl("https://medichecks.com/a", "medichecks", CID),
    ).toBe("https://medichecks.com/a");
  });
});

describe("Lola Health has no referral configured", () => {
  it("the lola-health entry carries no referral object", () => {
    const cfg = AFFILIATE_PROVIDERS["lola-health"];
    expect(cfg.subIdParam).toBeNull();
    expect(cfg.referral).toBeUndefined();
  });
  it("a real Lola link is left unchanged after a click", () => {
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
    expect(a.href).toBe("https://lolahealth.com/products/albumin");
    handleAffiliateAnchorClick(a, "/", send);
    expect(a.href).toBe("https://lolahealth.com/products/albumin");
  });
});

describe("openAffiliateUrl", () => {
  it("opens the Lola URL unchanged", async () => {
    const { openAffiliateUrl } = await import("../affiliate-tracking");
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    vi.stubGlobal("navigator", { sendBeacon: () => true });
    openAffiliateUrl("https://lolahealth.com/products/albumin", {
      placement: "card",
    });
    expect(open).toHaveBeenCalledWith(
      "https://lolahealth.com/products/albumin",
      "_blank",
      "noopener,noreferrer",
    );
    vi.unstubAllGlobals();
  });
});
