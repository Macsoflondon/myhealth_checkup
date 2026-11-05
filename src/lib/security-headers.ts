/**
 * HTTP security headers applied to every response the app server produces.
 *
 * Lovable hosting does not read public/_headers or vercel.json, so these are
 * set by request middleware in src/start.ts. The CSP lists only origins the
 * site actually loads: Supabase (REST, auth, realtime, storage), Cookiebot
 * consent, Google Fonts, provider product images (any https host) and local
 * video.
 */

const SUPABASE = "https://clvuioagsgfadynuvodj.supabase.co";
const SUPABASE_WS = "wss://clvuioagsgfadynuvodj.supabase.co";
const COOKIEBOT = ["https://consent.cookiebot.com", "https://consentcdn.cookiebot.com"];

/** Hosts that render the Lovable editor preview inside an iframe. */
const EDITOR_FRAME_ANCESTORS = ["https://lovable.dev", "https://*.lovable.dev", "https://*.lovable.app"];

export const isEditorPreviewHost = (host: string): boolean => {
  const h = host.toLowerCase().split(":")[0] ?? "";
  return (
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
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", ...COOKIEBOT],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
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
  };
  // The editor preview must stay frameable by lovable.dev; everywhere else
  // the site refuses framing outright.
  if (!isEditorPreviewHost(host)) headers["X-Frame-Options"] = "DENY";
  return headers;
};

/** Returns the response with security headers set, copying it if immutable. */
export const applySecurityHeaders = (response: Response, host: string): Response => {
  const headers = buildSecurityHeaders(host);
  try {
    for (const [k, v] of Object.entries(headers)) response.headers.set(k, v);
    return response;
  } catch {
    const copy = new Response(response.body, response);
    for (const [k, v] of Object.entries(headers)) copy.headers.set(k, v);
    return copy;
  }
};
