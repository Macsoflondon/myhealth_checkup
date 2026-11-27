/**
 * HTTP security headers applied to every response the app server produces.
 *
 * Lovable hosting does not read public/_headers or vercel.json, so these are
 * set by request middleware in src/start.ts. The CSP lists only origins the
 * site actually loads: Supabase (REST, auth, realtime, storage), Cookiebot
 * consent, the image hosts in IMAGE_SOURCES and local video. Fonts are
 * self-hosted through @fontsource, so no font CDN is allowed.
 *
 * Admin surfaces (/admin, /control) get a stricter policy with no
 * third-party origin at all, so a compromised third-party script (the
 * November 2026 Optimizely "OPTIMJACK" attack class) cannot run where an
 * admin session lives.
 */

/**
 * Same-origin endpoint that receives CSP violation reports on preview and
 * local hosts. It only logs, so preview traffic never reaches production
 * security telemetry.
 */
export const CSP_REPORT_PATH = "/api/public/csp-report";

/**
 * Production report sink: the csp-report edge function stores each report in
 * public.csp_reports, which SOC Watch, soc-cluster (CSP burst detection) and
 * siem-export read. Reports sent to CSP_REPORT_PATH only reached server logs.
 */
export const CSP_REPORT_URL =
  "https://clvuioagsgfadynuvodj.supabase.co/functions/v1/csp-report";

/** Hosts that always get the strict production policy, whatever headers say. */
const PRODUCTION_HOSTS = new Set([
  "myhealthcheckup.co.uk",
  "www.myhealthcheckup.co.uk",
  "myhealthcheckup.lovable.app",
]);

const bareHost = (host: string): string =>
  (host.toLowerCase().split(":")[0] ?? "").trim();

/**
 * Picks the host the security policy is built for. The request URL host is
 * set by the platform; x-forwarded-host is caller-controlled. The relaxed
 * preview policy is only used when every candidate host is a preview host,
 * so a spoofed header can never relax the policy on a production host.
 */
export const resolvePolicyHost = (
  urlHost: string,
  forwardedHost: string | null,
): string => {
  const candidates = [
    urlHost,
    ...(forwardedHost ? forwardedHost.split(",") : []),
  ]
    .map(bareHost)
    .filter(Boolean);
  const production = candidates.find((h) => PRODUCTION_HOSTS.has(h));
  if (production) return production;
  const nonPreview = candidates.find((h) => !isEditorPreviewHost(h));
  return nonPreview ?? candidates[0] ?? "myhealthcheckup.co.uk";
};

const SUPABASE = "https://clvuioagsgfadynuvodj.supabase.co";
const SUPABASE_WS = "wss://clvuioagsgfadynuvodj.supabase.co";
const COOKIEBOT = [
  "https://consent.cookiebot.com",
  "https://consentcdn.cookiebot.com",
];

/**
 * Admin surfaces: sign-in, break-glass recovery and Crux Control. They load
 * no third-party script and get the admin policy below.
 */
export const isAdminSurfacePath = (pathname: string): boolean =>
  /^\/(admin|control)(\/|$)/i.test(pathname);

/**
 * Every host the site displays images from, so img-src no longer allows any
 * https host. An injected script can otherwise send stolen data out as an
 * image request, the route skimmers use when connect-src is locked down.
 * Sources (checked 19 Nov 2026): Supabase Storage (re-hosted test images),
 * provider_tests.image_url, provider_blog_posts.image_url,
 * popular_test_enrichment_cache.image_url and hardcoded images in src/.
 * Shared hosts are narrowed to the path a provider uses. A new provider image
 * host shows up as an img-src report in SOC Watch; add it here.
 */
export const IMAGE_SOURCES = [
  SUPABASE,
  "https://cdn.shopify.com/s/",
  "https://www.medichecks.com",
  "https://www.medical-diagnosis.co.uk",
  "https://goodbodyclinic.com",
  "https://www.goodbodyclinic.com",
  "https://lolahealth.com",
  "https://londonhealthcompany.co.uk",
  "https://www.clinilabs.co.uk",
  "https://www.londonmedicallaboratory.co.uk",
  "https://media.londonmedicallaboratory.com",
  "https://s3.eu-west-2.amazonaws.com/images.londonmedicallaboratory.co.uk/",
  "https://www.randoxhealth.com",
  "https://rdxhealthfrontdoor-hncxg6h5atakbrfz.a03.azurefd.net",
  "https://www.sportsbloodtests.co.uk",
  "https://d8j0ntlcm91z4.cloudfront.net",
  "https://cdnimg.co/6a2b056c-f7d8-462b-b44b-f1538c8e93e9/",
  "https://images.unsplash.com",
];

/** Extra image hosts that only admin audit screens show (provider_image_audit). */
const ADMIN_IMAGE_SOURCES = [
  "https://37e227e1-0d67-4515-b064-99c243036534.lovableproject.com",
  "https://stesrhplatforma071.blob.core.windows.net",
];

/** Hosts that render the Lovable editor preview inside an iframe. */
const EDITOR_FRAME_ANCESTORS = [
  "https://lovable.dev",
  "https://*.lovable.dev",
  "https://*.lovable.app",
];

export const isEditorPreviewHost = (host: string): boolean => {
  const h = bareHost(host);
  if (PRODUCTION_HOSTS.has(h)) return false;
  return (
    h.endsWith(".lovableproject.com") ||
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.startsWith("id-preview--") ||
    (h.endsWith(".lovable.app") && h.includes("-dev.")) ||
    h.endsWith("-dev.lovable.app")
  );
};

/** Where a host's CSP reports go: production telemetry, or local logs for previews. */
export const cspReportEndpoint = (host: string): string =>
  isEditorPreviewHost(host) ? CSP_REPORT_PATH : CSP_REPORT_URL;

/** 128-bit random value, base64, for one HTML response. */
export const createCspNonce = (): string => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};

const NONCE_RE = /^[A-Za-z0-9+/]{22}==$/;

export const buildContentSecurityPolicy = (
  host: string,
  pathname = "/",
  nonce?: string,
): string => {
  const preview = isEditorPreviewHost(host);
  const admin = isAdminSurfacePath(pathname);
  // Cookiebot is the only third-party script on the public site. Admin
  // surfaces do not load it (see RootShell), so their policy omits it.
  const thirdParty = admin ? [] : COOKIEBOT;
  const frameAncestors = preview
    ? ["'self'", ...EDITOR_FRAME_ANCESTORS]
    : ["'none'"];
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // No 'unsafe-inline'. HTML responses get a per-request nonce that the
    // router puts on every inline and module script it renders (ssr.nonce);
    // Source allowlists also permit hosting-injected same-origin scripts
    // that arrive after rendering without a nonce, plus Cookiebot and chunks.
    // Responses without a nonce allow no inline script at all.
    "script-src": [
      "'self'",
      ...(nonce && NONCE_RE.test(nonce) ? [`'nonce-${nonce}'`] : []),
      ...thirdParty,
      ...(preview ? ["https://cdn.gpteng.co"] : []),
    ],
    "style-src": ["'self'", "'unsafe-inline'", ...thirdParty],
    "font-src": ["'self'", "data:"],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      ...IMAGE_SOURCES,
      ...thirdParty,
      ...(admin ? ADMIN_IMAGE_SOURCES : []),
      ...(preview ? EDITOR_FRAME_ANCESTORS : []),
    ],
    "media-src": ["'self'", "blob:", SUPABASE],
    "connect-src": [
      "'self'",
      SUPABASE,
      SUPABASE_WS,
      ...thirdParty,
      "https://storage.googleapis.com",
      ...(preview ? ["ws:", "wss:"] : []),
    ],
    "frame-src": ["'self'", ...thirdParty],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "frame-ancestors": frameAncestors,
    "base-uri": ["'self'"],
    "form-action": ["'self'", SUPABASE],
    "object-src": ["'none'"],
    "report-uri": [cspReportEndpoint(host)],
    "report-to": ["csp-endpoint"],
  };
  const parts = Object.entries(directives).map(
    ([k, v]) => `${k} ${v.join(" ")}`,
  );
  if (!preview) parts.push("upgrade-insecure-requests");
  return parts.join("; ");
};

export const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "autoplay=(self)",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "geolocation=()",
  "gyroscope=()",
  "hid=()",
  "magnetometer=()",
  "microphone=()",
  "midi=()",
  "payment=()",
  "publickey-credentials-get=(self)",
  "serial=()",
  "usb=()",
  "xr-spatial-tracking=()",
  "browsing-topics=()",
].join(", ");

export const buildSecurityHeaders = (
  host: string,
  pathname = "/",
  nonce?: string,
): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Security-Policy": buildContentSecurityPolicy(
      host,
      pathname,
      nonce,
    ),
    "Permissions-Policy": PERMISSIONS_POLICY,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Reporting-Endpoints": `csp-endpoint="${cspReportEndpoint(host)}"`,
  };
  // The editor preview must stay frameable by lovable.dev; everywhere else
  // the site refuses framing outright.
  if (!isEditorPreviewHost(host)) headers["X-Frame-Options"] = "DENY";
  return headers;
};

/** Returns the response with security headers set, copying it if immutable. */
export const applySecurityHeaders = (
  response: Response,
  host: string,
  pathname = "/",
  nonce?: string,
): Response => {
  const headers = buildSecurityHeaders(host, pathname, nonce);
  const set = (target: Response): Response => {
    // A policy already carrying this response's nonce (set by the request
    // middleware) is kept when the outer server entry re-applies headers.
    const keepNonced =
      !nonce &&
      /'nonce-/.test(target.headers.get("Content-Security-Policy") ?? "");
    for (const [k, v] of Object.entries(headers)) {
      if (keepNonced && k === "Content-Security-Policy") continue;
      target.headers.set(k, v);
    }
    // A nonce is single-use per visitor: never let a shared cache reuse it.
    if (/'nonce-/.test(target.headers.get("Content-Security-Policy") ?? "")) {
      target.headers.set("Cache-Control", "private, no-cache, max-age=0");
    }
    // The policy depends on the host, so shared caches must key on it.
    const vary = target.headers.get("Vary") ?? "";
    if (!/x-forwarded-host/i.test(vary))
      target.headers.append("Vary", "Host, X-Forwarded-Host");
    return target;
  };
  try {
    return set(response);
  } catch {
    return set(new Response(response.body, response));
  }
};

/** Applies security headers using the trusted host resolution for a request. */
export const applySecurityHeadersForRequest = (
  response: Response,
  request: Request,
  nonce?: string,
): Response => {
  const url = new URL(request.url);
  const isHtml = (response.headers.get("content-type") ?? "").includes(
    "text/html",
  );
  return applySecurityHeaders(
    response,
    resolvePolicyHost(url.host, request.headers.get("x-forwarded-host")),
    url.pathname,
    isHtml ? nonce : undefined,
  );
};
