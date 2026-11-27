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
    expect(
      buildSecurityHeaders("id-preview--abc.lovable.app")["X-Frame-Options"],
    ).toBeUndefined();
  });
});

describe("security header hardening", () => {
  it("never relaxes the policy for a production host behind a spoofed preview header", async () => {
    const { resolvePolicyHost } = await import("./security-headers");
    expect(
      resolvePolicyHost("myhealthcheckup.co.uk", "id-preview--x.lovable.app"),
    ).toBe("myhealthcheckup.co.uk");
    expect(
      resolvePolicyHost("id-preview--x.lovable.app", "myhealthcheckup.co.uk"),
    ).toBe("myhealthcheckup.co.uk");
    expect(resolvePolicyHost("abc.lovableproject.com", null)).toBe(
      "abc.lovableproject.com",
    );
  });

  it("treats the editor preview on lovableproject.com as a preview host", () => {
    expect(isEditorPreviewHost("abc.lovableproject.com")).toBe(true);
  });

  it("reports violations and allows no font CDN", () => {
    const csp = buildSecurityHeaders("myhealthcheckup.co.uk")[
      "Content-Security-Policy"
    ];
    expect(csp).toContain(
      "report-uri https://clvuioagsgfadynuvodj.supabase.co/functions/v1/csp-report",
    );
    expect(csp).toContain("report-to csp-endpoint");
    expect(csp).not.toContain("fonts.googleapis.com");
    expect(csp).not.toContain("fonts.gstatic.com");
  });

  it("adds headers to fallback error responses", async () => {
    const { applySecurityHeadersForRequest } =
      await import("./security-headers");
    const res = applySecurityHeadersForRequest(
      new Response(null, { status: 500 }),
      new Request("https://myhealthcheckup.co.uk/x"),
    );
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
    expect(res.headers.get("Vary")).toContain("X-Forwarded-Host");
  });
});

describe("third-party script isolation and image allowlist", () => {
  it("serves admin surfaces a policy with no third-party origin", async () => {
    const { buildContentSecurityPolicy, isAdminSurfacePath } =
      await import("./security-headers");
    for (const path of [
      "/admin/login",
      "/admin/recovery",
      "/control",
      "/control/plugins",
    ]) {
      expect(isAdminSurfacePath(path)).toBe(true);
      const csp = buildContentSecurityPolicy("myhealthcheckup.co.uk", path);
      expect(csp).not.toContain("cookiebot");
      expect(csp).toContain("script-src 'self';");
    }
    expect(isAdminSurfacePath("/administration-guide")).toBe(false);
    expect(isAdminSurfacePath("/controls")).toBe(false);
  });

  it("keeps the consent banner origins on public pages", async () => {
    const { buildContentSecurityPolicy } = await import("./security-headers");
    const csp = buildContentSecurityPolicy("myhealthcheckup.co.uk", "/compare");
    expect(csp).toContain(
      "script-src 'self' https://consent.cookiebot.com https://consentcdn.cookiebot.com",
    );
  });

  it("no longer lets images load from any https host", async () => {
    const { buildContentSecurityPolicy } = await import("./security-headers");
    const imgSrc = buildContentSecurityPolicy("myhealthcheckup.co.uk", "/")
      .split("; ")
      .find((d) => d.startsWith("img-src "));
    expect(imgSrc).toBeDefined();
    expect(imgSrc!.split(" ")).not.toContain("https:");
    expect(imgSrc).toContain("https://clvuioagsgfadynuvodj.supabase.co");
    // Shared hosts are limited to the provider's own path.
    expect(imgSrc).toContain(
      "https://s3.eu-west-2.amazonaws.com/images.londonmedicallaboratory.co.uk/",
    );
  });

  it("sends production reports to the stored sink and preview reports to local logs", async () => {
    const { buildSecurityHeaders } = await import("./security-headers");
    expect(
      buildSecurityHeaders("myhealthcheckup.co.uk")["Reporting-Endpoints"],
    ).toContain("/functions/v1/csp-report");
    expect(
      buildSecurityHeaders("id-preview--abc.lovable.app")[
        "Reporting-Endpoints"
      ],
    ).toContain("/api/public/csp-report");
  });

  it("applies the admin policy from the request path", async () => {
    const { applySecurityHeadersForRequest } =
      await import("./security-headers");
    const res = applySecurityHeadersForRequest(
      new Response("ok"),
      new Request("https://myhealthcheckup.co.uk/control/soc-watch"),
    );
    expect(res.headers.get("Content-Security-Policy")).not.toContain(
      "cookiebot",
    );
  });
});

describe("per-request script nonce", () => {
  it("creates 128-bit base64 nonces that differ per call", async () => {
    const { createCspNonce } = await import("./security-headers");
    const a = createCspNonce();
    const b = createCspNonce();
    expect(a).toMatch(/^[A-Za-z0-9+/]{22}==$/);
    expect(atob(a)).toHaveLength(16);
    expect(a).not.toBe(b);
  });

  it("puts the nonce and strict-dynamic in script-src, never unsafe-inline", async () => {
    const { buildContentSecurityPolicy } = await import("./security-headers");
    const nonce = "AAAAAAAAAAAAAAAAAAAAAA==";
    const scriptSrc = buildContentSecurityPolicy(
      "myhealthcheckup.co.uk",
      "/",
      nonce,
    )
      .split("; ")
      .find((d) => d.startsWith("script-src "));
    expect(scriptSrc).toBe(
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://consent.cookiebot.com https://consentcdn.cookiebot.com`,
    );
    for (const host of ["myhealthcheckup.co.uk", "localhost:8080"]) {
      for (const path of ["/", "/control"]) {
        const csp = buildContentSecurityPolicy(host, path, nonce);
        expect(
          csp.split("; ").find((d) => d.startsWith("script-src ")),
        ).not.toContain("unsafe-inline");
        expect(csp).toContain("report-uri ");
        expect(csp).toContain("report-to csp-endpoint");
      }
    }
  });

  it("ignores a malformed nonce rather than injecting it", async () => {
    const { buildContentSecurityPolicy } = await import("./security-headers");
    const csp = buildContentSecurityPolicy(
      "myhealthcheckup.co.uk",
      "/",
      "x' 'unsafe-inline",
    );
    expect(csp).not.toContain("nonce-");
    expect(csp.split("; ").find((d) => d.startsWith("script-src "))).toBe(
      "script-src 'self' https://consent.cookiebot.com https://consentcdn.cookiebot.com",
    );
  });

  it("nonces HTML only, marks it uncacheable by shared caches, and survives re-application", async () => {
    const { applySecurityHeadersForRequest } =
      await import("./security-headers");
    const req = new Request("https://myhealthcheckup.co.uk/compare");
    const nonce = "BBBBBBBBBBBBBBBBBBBBBB==";
    const html = applySecurityHeadersForRequest(
      new Response("<html></html>", {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=600",
        },
      }),
      req,
      nonce,
    );
    expect(html.headers.get("Content-Security-Policy")).toContain(
      `'nonce-${nonce}'`,
    );
    expect(html.headers.get("Cache-Control")).toBe(
      "private, no-cache, max-age=0",
    );
    // src/server.ts re-applies headers without a nonce; the nonced policy stays.
    const again = applySecurityHeadersForRequest(html, req);
    expect(again.headers.get("Content-Security-Policy")).toContain(
      `'nonce-${nonce}'`,
    );

    const json = applySecurityHeadersForRequest(
      new Response("{}", { headers: { "content-type": "application/json" } }),
      req,
      nonce,
    );
    expect(json.headers.get("Content-Security-Policy")).not.toContain("nonce-");
  });
});
