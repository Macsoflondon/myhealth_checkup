import { describe, expect, it } from "vitest";
import { buildSecurityHeaders, isEditorPreviewHost } from "./security-headers";

describe("security headers", () => {
  const live = buildSecurityHeaders("myhealthcheckup.co.uk");

  it("refuses framing on the live domain", () => {
    expect(live["X-Frame-Options"]).toBe("DENY");
    expect(live["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
  });

  it("denies camera, microphone and geolocation", () => {
    for (const f of ["camera=()", "microphone=()", "geolocation=()"]) {
      expect(live["Permissions-Policy"]).toContain(f);
    }
  });

  it("keeps HSTS, nosniff and referrer policy", () => {
    expect(live["Strict-Transport-Security"]).toContain("max-age=31536000");
    expect(live["X-Content-Type-Options"]).toBe("nosniff");
    expect(live["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
  });

  it("forbids eval and plugins on the live domain", () => {
    const csp = live["Content-Security-Policy"];
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).toContain("object-src 'none'");
  });

  it("lets only the editor preview be framed by lovable.dev", () => {
    expect(isEditorPreviewHost("id-preview--abc.lovable.app")).toBe(true);
    expect(isEditorPreviewHost("www.myhealthcheckup.co.uk")).toBe(false);
    expect(buildSecurityHeaders("id-preview--abc.lovable.app")["X-Frame-Options"]).toBeUndefined();
  });
});
