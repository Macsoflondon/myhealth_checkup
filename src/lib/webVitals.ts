// Web Vitals RUM reporter. Batches samples and beacons them to the ingest edge function.
// Only runs in the browser, only in production, and only once per page.

type MetricName = "LCP" | "CLS" | "INP" | "FCP" | "TTFB" | "FID";
type Rating = "good" | "needs-improvement" | "poor";

interface Sample {
  metric: MetricName;
  value: number;
  rating?: Rating;
  route: string;
  device_type: "mobile" | "tablet" | "desktop" | "unknown";
  connection_type?: string;
  session_hash?: string;
  navigation_type?: string;
}

const BATCH: Sample[] = [];
let flushTimer: number | null = null;
let installed = false;

/** Browsers cap keepalive request bodies at 64 KB; stay below with margin. */
const MAX_BODY_BYTES = 60_000;

export function classifyDevice(
  userAgent: string,
  maxTouchPoints: number,
): Sample["device_type"] {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (ua.includes("android") && !ua.includes("mobi")) return "tablet";
  // iPadOS 13+ reports a desktop Safari (Macintosh) user agent.
  if (ua.includes("macintosh") && maxTouchPoints > 1) return "tablet";
  if (/mobi|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}

function deviceType(): Sample["device_type"] {
  if (typeof navigator === "undefined") return "unknown";
  return classifyDevice(navigator.userAgent, navigator.maxTouchPoints ?? 0);
}

function connectionType(): string | undefined {
  const nav = navigator as unknown as {
    connection?: { effectiveType?: string };
  };
  return nav.connection?.effectiveType;
}

function sessionHash(): string {
  const key = "mhc.rum.session";
  try {
    const existing = sessionStorage.getItem(key);
    if (existing) return existing;
    const fresh = Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem(key, fresh);
    return fresh;
  } catch {
    return "anon";
  }
}

/** Splits samples into JSON bodies that each stay under MAX_BODY_BYTES. */
export function chunkBodies(samples: Sample[]): string[] {
  const bodies: string[] = [];
  let current: Sample[] = [];
  for (const s of samples) {
    const next = [...current, s];
    if (
      current.length > 0 &&
      JSON.stringify({ samples: next }).length > MAX_BODY_BYTES
    ) {
      bodies.push(JSON.stringify({ samples: current }));
      current = [s];
    } else {
      current = next;
    }
  }
  if (current.length > 0) bodies.push(JSON.stringify({ samples: current }));
  return bodies;
}

function flush(): void {
  if (BATCH.length === 0) return;
  const samples = BATCH.splice(0, BATCH.length);
  const baseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
    | string
    | undefined;
  if (!baseUrl || !key) return;
  for (const body of chunkBodies(samples)) {
    try {
      // keepalive lets the request outlive pagehide, where mobile LCP/CLS land.
      void fetch(`${baseUrl}/functions/v1/web-vitals-ingest`, {
        method: "POST",
        keepalive: true,
        headers: {
          "content-type": "application/json",
          apikey: key,
          authorization: `Bearer ${key}`,
        },
        body,
      }).catch(() => undefined);
    } catch {
      // Silent — RUM must not throw into user code paths.
    }
  }
}

function scheduleFlush(): void {
  if (flushTimer !== null) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flush();
  }, 3_000);
}

const MAX_METRIC_VALUE = 60_000;

function push(sample: Sample): void {
  if (!Number.isFinite(sample.value) || sample.value < 0) return;
  // Clamp pathological cold-load timings so the whole batch isn't rejected server-side.
  BATCH.push({ ...sample, value: Math.min(sample.value, MAX_METRIC_VALUE) });
  if (BATCH.length >= 10) {
    if (flushTimer !== null) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    void flush();
  } else {
    scheduleFlush();
  }
}

export async function installWebVitals(): Promise<void> {
  if (installed) return;
  if (typeof window === "undefined") return;
  if (import.meta.env.DEV) return;
  installed = true;

  let webVitals: typeof import("web-vitals");
  try {
    webVitals = await import("web-vitals");
  } catch {
    return;
  }

  const device = deviceType();
  const connection = connectionType();
  const hash = sessionHash();

  const report =
    (metric: MetricName) =>
    (m: {
      name: string;
      value: number;
      rating?: Rating;
      navigationType?: string;
    }) => {
      push({
        metric,
        value: m.value,
        rating: m.rating,
        // Read at report time so client-side navigations are attributed correctly.
        route: window.location.pathname,
        device_type: device,
        connection_type: connection,
        session_hash: hash,
        navigation_type: m.navigationType,
      });
    };

  webVitals.onLCP(report("LCP"));
  webVitals.onCLS(report("CLS"));
  webVitals.onINP(report("INP"));
  webVitals.onFCP(report("FCP"));
  webVitals.onTTFB(report("TTFB"));

  window.addEventListener("pagehide", () => {
    void flush();
  });
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") void flush();
  });
}
