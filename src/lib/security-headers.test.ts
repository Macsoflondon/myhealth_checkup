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

describe("security header hardening", () => {
  it("never relaxes the policy for a production host behind a spoofed preview header", async () => {
    const { resolvePolicyHost } = await import("./security-headers");
    expect(resolvePolicyHost("myhealthcheckup.co.uk", "id-preview--x.lovable.app")).toBe("myhealthcheckup.co.uk");
    expect(resolvePolicyHost("id-preview--x.lovable.app", "myhealthcheckup.co.uk")).toBe("myhealthcheckup.co.uk");
    expect(resolvePolicyHost("abc.lovableproject.com", null)).toBe("abc.lovableproject.com");
  });

  it("treats the editor preview on lovableproject.com as a preview host", () => {
    expect(isEditorPreviewHost("abc.lovableproject.com")).toBe(true);
  });

  it("reports violations and allows no font CDN", () => {
    const csp = buildSecurityHeaders("myhealthcheckup.co.uk")["Content-Security-Policy"];
    expect(csp).toContain("report-uri /api/public/csp-report");
    expect(csp).toContain("report-to csp-endpoint");
    expect(csp).not.toContain("fonts.googleapis.com");
    expect(csp).not.toContain("fonts.gstatic.com");
  });

  it("adds headers to fallback error responses", async () => {
    const { applySecurityHeadersForRequest } = await import("./security-headers");
    const res = applySecurityHeadersForRequest(new Response(null, { status: 500 }), new Request("https://myhealthcheckup.co.uk/x"));
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("Vary")).toContain("X-Forwarded-Host");
  });
});
