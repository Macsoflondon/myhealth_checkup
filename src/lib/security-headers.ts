/**
 * HTTP security headers applied to every response the app server produces.
 *
 * Lovable hosting does not read public/_headers or vercel.json, so these are
 * set by request middleware in src/start.ts. The CSP lists only origins the
 * site actually loads: Supabase (REST, auth, realtime, storage), Cookiebot
 * consent, provider product images (any https host) and local video. Fonts
 * are self-hosted through @fontsource, so no font CDN is allowed.
 */

/** Same-origin endpoint that receives CSP violation reports. */
export const CSP_REPORT_PATH = "/api/public/csp-report";

/** Hosts that always get the strict production policy, whatever headers say. */
const PRODUCTION_HOSTS = new Set([
  "myhealthcheckup.co.uk",
  "www.myhealthcheckup.co.uk",
  "myhealthcheckup.lovable.app",
]);

const bareHost = (host: string): string => (host.toLowerCase().split(":")[0] ?? "").trim();

/**
 * Picks the host the security policy is built for. The request URL host is
 * set by the platform; x-forwarded-host is caller-controlled. The relaxed
 * preview policy is only used when every candidate host is a preview host,
 * so a spoofed header can never relax the policy on a production host.
 */
export const resolvePolicyHost = (urlHost: string, forwardedHost: string | null): string => {
  const candidates = [urlHost, ...(forwardedHost ? forwardedHost.split(",") : [])].map(bareHost).filter(Boolean);
  const production = candidates.find((h) => PRODUCTION_HOSTS.has(h));
  if (production) return production;
  const nonPreview = candidates.find((h) => !isEditorPreviewHost(h));
  return nonPreview ?? candidates[0] ?? "myhealthcheckup.co.uk";
};

const SUPABASE = "https://clvuioagsgfadynuvodj.supabase.co";
const SUPABASE_WS = "wss://clvuioagsgfadynuvodj.supabase.co";
const COOKIEBOT = ["https://consent.cookiebot.com", "https://consentcdn.cookiebot.com"];

/** Hosts that render the Lovable editor preview inside an iframe. */
const EDITOR_FRAME_ANCESTORS = ["https://lovable.dev", "https://*.lovable.dev", "https://*.lovable.app"];

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

export const buildContentSecurityPolicy = (host: string): string => {
  const preview = isEditorPreviewHost(host);
  const frameAncestors = preview ? ["'self'", ...EDITOR_FRAME_ANCESTORS] : ["'none'"];
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // TanStack Start streams inline hydration scripts and JSON-LD; no nonce
    // support is available on this hosting, so inline scripts stay allowed.
    "script-src": ["'self'", "'unsafe-inline'", ...COOKIEBOT, ...(preview ? ["https://cdn.gpteng.co"] : [])],
    "style-src": ["'self'", "'unsafe-inline'", ...COOKIEBOT],
    "font-src": ["'self'", "data:"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "media-src": ["'self'", "blob:", SUPABASE],
    "connect-src": [
      "'self'",
      SUPABASE,
      SUPABASE_WS,
      ...COOKIEBOT,
      "https://storage.googleapis.com",
      ...(preview ? ["ws:", "wss:"] : []),
    ],
    "frame-src": ["'self'", ...COOKIEBOT],
    "worker-src": ["'self'", "blob:"],
    "manifest-src": ["'self'"],
    "frame-ancestors": frameAncestors,
    "base-uri": ["'self'"],
    "form-action": ["'self'", SUPABASE],
    "object-src": ["'none'"],
    "report-uri": [CSP_REPORT_PATH],
    "report-to": ["csp-endpoint"],
  };
  const parts = Object.entries(directives).map(([k, v]) => `${k} ${v.join(" ")}`);
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

export const buildSecurityHeaders = (host: string): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Security-Policy": buildContentSecurityPolicy(host),
    "Permissions-Policy": PERMISSIONS_POLICY,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "Reporting-Endpoints": `csp-endpoint="${CSP_REPORT_PATH}"`,
  };
  // The editor preview must stay frameable by lovable.dev; everywhere else
  // the site refuses framing outright.
  if (!isEditorPreviewHost(host)) headers["X-Frame-Options"] = "DENY";
  return headers;
};

/** Returns the response with security headers set, copying it if immutable. */
export const applySecurityHeaders = (response: Response, host: string): Response => {
  const headers = buildSecurityHeaders(host);
  const set = (target: Response): Response => {
    for (const [k, v] of Object.entries(headers)) target.headers.set(k, v);
    // The policy depends on the host, so shared caches must key on it.
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
export const applySecurityHeadersForRequest = (response: Response, request: Request): Response =>
  applySecurityHeaders(
    response,
    resolvePolicyHost(new URL(request.url).host, request.headers.get("x-forwarded-host")),
  );
